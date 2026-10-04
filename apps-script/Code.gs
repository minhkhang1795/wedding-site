/**
 * Wedding RSVP API for khangthuy.com.
 * Guests columns: A Name | B Max guests | C Attending | D Party size | E Email |
 * F Dietary needs | G Note to couple | H Updated | I Tea invited | J Tea attending.
 * Public guest search requires 3 characters. Tea eligibility is returned in public search results.
 */
var SHEET = 'Guests';

function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET) || ss.insertSheet(SHEET);
  if (sh.getLastRow() === 0) {
    sh.appendRow(['Name', 'Max guests', 'Attending', 'Party size', 'Email', 'Dietary needs', 'Note to couple', 'Updated', 'Tea invited', 'Tea attending']);
    sh.getRange(1, 1, 1, 10).setFontWeight('bold');
    sh.setFrozenRows(1);
    sh.setColumnWidths(1, 10, 150);
    return;
  }

  // Preserve existing guest/response values; only insert the missing notes column before Updated.
  if (sh.getRange(1, 4).getValue() === 'Guests coming') sh.getRange(1, 4).setValue('Party size');
  if (sh.getRange(1, 6).getValue() === 'Dietary / notes') sh.getRange(1, 6).setValue('Dietary needs');
  if (sh.getRange(1, 7).getValue() === 'Updated') {
    sh.insertColumnBefore(7);
    sh.getRange(1, 7).setValue('Note to couple');
    sh.getRange(1, 8).setValue('Updated');
  }
  if (!sh.getRange(1, 4).getValue()) sh.getRange(1, 4).setValue('Party size');
  if (!sh.getRange(1, 6).getValue()) sh.getRange(1, 6).setValue('Dietary needs');
  if (!sh.getRange(1, 7).getValue()) sh.getRange(1, 7).setValue('Note to couple');
  if (!sh.getRange(1, 8).getValue()) sh.getRange(1, 8).setValue('Updated');
  if (!sh.getRange(1, 9).getValue()) sh.getRange(1, 9).setValue('Tea invited');
  if (!sh.getRange(1, 10).getValue()) sh.getRange(1, 10).setValue('Tea attending');
  sh.getRange(1, 1, 1, 10).setFontWeight('bold');
  sh.setFrozenRows(1);
}

function norm_(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var p = (e && e.parameter) || {};
  if (p.action === 'ping') return json_({ok: true, service: 'wedding-rsvp'});
  if (p.action === 'search') return json_(searchGuests(p.q));
  if (p.action === 'hint') return json_(hintFor_(p.id, p.name));
  return json_({ok: true, service: 'wedding-rsvp'});
}

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    if (d.action === 'unlock') return json_(unlockRsvp(d));
    return json_(submitRsvp(d));
  } catch (err) {
    return json_({ok: false, error: String(err)});
  }
}

// Guest list cache: names + flags only (same fields search already returns), never emails.
// Short TTL; also cleared on every RSVP submit so responded/tea flags stay current.
var GUEST_CACHE_KEY = 'guests_v1';
var GUEST_CACHE_SEC = 300;

function guestList_() {
  var cache = CacheService.getScriptCache();
  var hit = cache.get(GUEST_CACHE_KEY);
  if (hit) {
    try { return JSON.parse(hit); } catch (err) {}
  }
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET);
  var rows = sh.getDataRange().getValues();
  var list = [];
  for (var i = 1; i < rows.length; i++) {
    var name = String(rows[i][0] || '');
    if (!name) continue;
    list.push({
      id: i + 1,
      name: name,
      n: norm_(name),
      max: Number(rows[i][1]) || 1,
      responded: rows[i][2] !== '' || rows[i][9] !== '',
      teaInvited: String(rows[i][8] || '').trim().toLowerCase() === 'yes'
    });
  }
  try { cache.put(GUEST_CACHE_KEY, JSON.stringify(list), GUEST_CACHE_SEC); } catch (err) {}
  return list;
}

function searchGuests(qs) {
  var q = norm_(qs);
  if (q.length < 3) return {results: []};
  var list = guestList_();
  var words = q.split(' ');
  var out = [];
  for (var i = 0; i < list.length; i++) {
    var g = list[i];
    if (words.every(function (w) { return g.n.indexOf(w) !== -1; })) {
      out.push({id: g.id, name: g.name, max: g.max, responded: g.responded, teaInvited: g.teaInvited});
    }
    if (out.length >= 8) break;
  }
  return {results: out};
}

// ---- Edit flow for guests who already replied ----
var MAX_UNLOCK_FAILS = 8;      // wrong-email attempts allowed per guest row...
var UNLOCK_WINDOW_SEC = 900;   // ...within this window (15 minutes)

function guestRow_(sh, id, name) {
  var row = Number(id);
  if (!row || row < 2 || row > sh.getLastRow()) return 0;
  if (sh.getRange(row, 1).getValue() !== name) return 0;
  return row;
}

function emailKey_(s) {
  return String(s || '').trim().toLowerCase();
}

// "vu***@x***.com": first 2 chars of the local part, first char of the domain name, and the TLD.
function maskEmail_(email) {
  var m = String(email || '').trim().match(/^([^@\s]+)@([^@\s]+)$/);
  if (!m) return '';
  var dom = m[2], dot = dom.lastIndexOf('.');
  var tld = dot > 0 ? dom.slice(dot) : '';
  var base = dot > 0 ? dom.slice(0, dot) : dom;
  return m[1].slice(0, 2) + '***@' + base.slice(0, 1) + '***' + tld;
}

function hintFor_(id, name) {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET);
  var row = guestRow_(sh, id, name);
  if (!row) return {ok: false, error: 'Guest not found'};
  var email = String(sh.getRange(row, 5).getValue() || '').trim();
  // No email on file (e.g. a decline): nothing to unlock, and nothing is revealed.
  if (!email) return {ok: true, hasEmail: false};
  return {ok: true, hasEmail: true, hint: maskEmail_(email)};
}

function failKey_(row) { return 'unlockfail_' + row; }

function unlockRsvp(d) {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET);
  var row = guestRow_(sh, d.id, d.name);
  if (!row) return {ok: false, error: 'Guest not found'};
  var vals = sh.getRange(row, 1, 1, 10).getValues()[0];
  var stored = String(vals[4] || '').trim();
  // Nothing on file: no prefill is ever returned, the guest just gets a blank form.
  if (!stored) return {ok: true, noEmail: true};

  var cache = CacheService.getScriptCache();
  var fails = Number(cache.get(failKey_(row)) || 0);
  if (fails >= MAX_UNLOCK_FAILS) return {ok: false, error: 'Too many attempts. Please try again in a few minutes or contact us.'};
  if (emailKey_(d.email) !== emailKey_(stored)) {
    cache.put(failKey_(row), String(fails + 1), UNLOCK_WINDOW_SEC);
    return {ok: false, error: 'That email does not match our records.'};
  }
  cache.remove(failKey_(row));
  var tea = String(vals[9] || '').trim().toLowerCase();
  return {
    ok: true,
    values: {
      attending: String(vals[2]).toLowerCase() === 'no' ? 'no' : 'yes',
      teaAttending: tea === 'yes' ? 'yes' : (tea === 'no' ? 'no' : ''),
      count: Number(vals[3]) || 1,
      email: stored,
      notes: String(vals[5] || ''),
      coupleNote: String(vals[6] || '')
    }
  };
}

function submitRsvp(d) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET);
    var row = Number(d.id);
    if (!row || row < 2 || row > sh.getLastRow()) return {ok: false, error: 'Guest not found'};
    if (sh.getRange(row, 1).getValue() !== d.name) return {ok: false, error: 'Guest mismatch'};

    // A row with an email on file can only be overwritten by someone who proves that email.
    var onFile = String(sh.getRange(row, 5).getValue() || '').trim();
    if (onFile && emailKey_(d.verifyEmail) !== emailKey_(onFile)) return {ok: false, error: 'Please unlock your reply with the email on file first.'};

    var attending = d.mainAttending === 'no' || d.attending === 'no' ? 'No' : 'Yes';
    var email = String(d.email || '').trim();
    var invitedToTea = String(sh.getRange(row, 9).getValue() || '').trim().toLowerCase() === 'yes';
    var teaAttending = '';
    if (invitedToTea) teaAttending = d.teaAttending === 'yes' ? 'Yes' : 'No';
    var anyAttending = attending === 'Yes' || teaAttending === 'Yes';
    if (anyAttending && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return {ok: false, error: 'Invalid email'};

    var max = Number(sh.getRange(row, 2).getValue()) || 1;
    var requestedCount = d.count || d.mainCount;
    var count = anyAttending ? Math.min(Math.max(Number(requestedCount) || 1, 1), max) : 0;
    var dietary = anyAttending ? String(d.notes || '').slice(0, 500) : '';
    var coupleNote = String(d.coupleNote || '').slice(0, 500);

    // C:H are the main RSVP fields and shared party size/details; J is tea attendance.
    sh.getRange(row, 3, 1, 6).setValues([[attending, count, email, dietary, coupleNote, new Date()]]);
    sh.getRange(row, 10).setValue(teaAttending);
    CacheService.getScriptCache().remove(GUEST_CACHE_KEY);
    return {ok: true};
  } finally {
    lock.releaseLock();
  }
}

