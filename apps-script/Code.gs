/**
 * Wedding RSVP API (JSON) for the static wedding site. Replace ALL code in Extensions > Apps Script with this file.
 * Deploy > Manage deployments > pencil > Version: New version > Deploy (or New deployment > Web app, Execute as Me, Anyone).
 * Guests tab columns: A Name | B Max guests | C Attending | D Guests coming | E Email | F Dietary needs | G Note to couple | H Updated. Search requires at least 3 characters.
 */
var SHEET = 'Guests';

function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET) || ss.insertSheet(SHEET);
  if (sh.getLastRow() === 0) {
    sh.appendRow(['Name', 'Max guests', 'Attending', 'Guests coming', 'Email', 'Dietary needs', 'Note to couple', 'Updated']);
    sh.appendRow(['Sample Guest One', 2, '', '', '', '', '', '']);
    sh.appendRow(['Sample Guest Two', 1, '', '', '', '', '', '']);
    sh.appendRow(['Sample Guest Three', 4, '', '', '', '', '', '']);
    sh.getRange(1, 1, 1, 8).setFontWeight('bold');
    sh.setFrozenRows(1);
    sh.setColumnWidths(1, 8, 150);
  } else {
    if (sh.getRange(1, 6).getValue() === 'Dietary / notes') sh.getRange(1, 6).setValue('Dietary needs');
  }
  if (sh.getLastRow() > 0 && sh.getRange(1, 7).getValue() === 'Updated') {
    // Migrate the existing timestamp column without overwriting any RSVP data.
    sh.insertColumnBefore(7);
    sh.getRange(1, 7).setValue('Note to couple');
  }
}

function norm_(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

// API for the static site: GET ?action=search&q=name -> JSON (names and party size only, never emails)
function doGet(e) {
  var p = (e && e.parameter) || {};
  if (p.action === 'search') return json_(searchGuests(p.q));
  return json_({ok: true, service: 'wedding-rsvp'});
}

// POST (text/plain JSON body) -> writes the RSVP to the Guests tab
function doPost(e) {
  try {
    return json_(submitRsvp(JSON.parse(e.postData.contents)));
  } catch (err) {
    return json_({ok: false, error: String(err)});
  }
}

// Called from the page via google.script.run. Returns names and party size only, never emails.
function searchGuests(qs) {
  var q = norm_(qs);
  if (q.length < 3) return {results: []};
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET);
  var rows = sh.getDataRange().getValues();
  var words = q.split(' ');
  var out = [];
  for (var i = 1; i < rows.length; i++) {
    var name = String(rows[i][0] || '');
    if (!name) continue;
    var n = norm_(name);
    if (words.every(function (w) { return n.indexOf(w) !== -1; }))
      out.push({id: i + 1, name: name, max: Number(rows[i][1]) || 1, responded: rows[i][2] !== ''});
    if (out.length >= 8) break;
  }
  return {results: out};
}

function submitRsvp(d) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET);
    var row = Number(d.id);
    if (!row || row < 2 || row > sh.getLastRow()) return {ok: false, error: 'Guest not found'};
    if (sh.getRange(row, 1).getValue() !== d.name) return {ok: false, error: 'Guest mismatch'};
    var attending = d.attending === 'yes' ? 'Yes' : 'No';
    var email = String(d.email || '').trim();
    if (attending === 'Yes' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return {ok: false, error: 'Invalid email'};
    var max = Number(sh.getRange(row, 2).getValue()) || 1;
    var count = attending === 'Yes' ? Math.min(Math.max(Number(d.count) || 1, 1), max) : 0;
    var dietary = attending === 'Yes' ? String(d.notes || '').slice(0, 500) : '';
    var coupleNote = String(d.coupleNote || '').slice(0, 500);
    // Search deliberately continues to return only public guest details, never saved RSVP fields.
    sh.getRange(row, 3, 1, 6).setValues([[attending, count, email, dietary, coupleNote, new Date()]]);
    return {ok: true};
  } finally {
    lock.releaseLock();
  }
}


