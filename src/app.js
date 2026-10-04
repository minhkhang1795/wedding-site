// EDIT THIS CONFIG BLOCK to change the wedding details or any text shown on the site.
// Keep the API URL as-is unless the Apps Script deployment URL changes.
window.WEDDING = {
  apiUrl:
    "https://script.google.com/macros/s/AKfycbxiy6zhKInn70xzM6M52AmYpQTrusa5lkmekYNRXVZiiMkWH3vZ8o8x7EJg3uUCIhsd/exec",
  names: ["Khang", "Thuy"],
  dateLine: "Saturday, April 3, 2027",
  dateISO: "2027-04-03T16:00:00+07:00",
  place: "Dalat, Vietnam",
  headline: "We're getting married",
  intro: "From the energy of New York to the quiet charm of Da Lat.",
  events: [
    ["Ceremony", "4:00 PM", "Garden ceremony at the villas"],
    ["Reception", "6:00 PM", "Dinner, toasts and dancing"],
  ],
  timeline: [
    ["3:30 PM", "Guests arrive"],
    ["4:00 PM", "Ceremony"],
    ["5:00 PM", "Cocktails in the gardens"],
    ["6:00 PM", "Dinner and reception"],
    ["9:00 PM", "Dancing under the stars"],
  ],
  venue: "Ana Mandara Villas Dalat Resort & Spa",
  venueText:
    "A sanctuary of restored 1920s French colonial villas, preserving the charm, craftsmanship, and historic elegance of old-world Indochina.",
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=Ana+Mandara+Villas+Dalat+Resort+%26+Spa",
  travel: [
    [
      "Getting there",
      "By Air: Fly into Lien Khuong Airport (DLI) (~40 mins to the resort).<br>By Road: Accessible via scenic drive or sleeper bus from Ho Chi Minh City.",
    ],
  ],
  contact: "Questions? Don’t be shy - reach out to us.",
  // Wedding photos are stored as static files in assets/.
  // PHOTO SLOTS: replace these URLs or replace the matching assets files.
  // heroDesktop = wide smiling portrait; heroMobile = full-length vertical portrait.
  photos: {
    heroDesktop: "assets/optimized/03.webp",
    heroMobile: "assets/optimized/04.webp",
    heroDesktopLarge: "assets/optimized/03-1600.webp",
    heroMobileLarge: "assets/optimized/04-1200.webp",
    venue: "assets/optimized/villa-960.webp",
    venueLarge: "assets/optimized/villa-1440.webp",
    gallery: [
      {
        src: "assets/optimized/01.webp",
        srcset: "assets/optimized/01.webp 1000w, assets/optimized/01-1680.webp 1680w",
        alt: "Khang and Thuy embracing beside a garden pond",
        width: 1000,
        height: 667,
      },
      {
        src: "assets/optimized/02.webp",
        srcset: "assets/optimized/02.webp 900w, assets/optimized/02-1399.webp 1399w",
        alt: "Khang and Thuy holding hands outside the NYC subway",
        width: 900,
        height: 1351,
      },
      {
        src: "assets/optimized/03.webp",
        srcset: "assets/optimized/03.webp 1100w, assets/optimized/03-1600.webp 1600w",
        alt: "Khang and Thuy smiling beside a teal NYC doorway",
        width: 1100,
        height: 733,
      },
      {
        src: "assets/optimized/04.webp",
        srcset: "assets/optimized/04.webp 1000w, assets/optimized/04-1200.webp 1200w",
        alt: "Khang and Thuy in wedding attire, bouquet raised",
        width: 1000,
        height: 1501,
      },
    ],
  },
  text: {
    galleryEyebrow: "Together, everywhere",
    galleryTitle: "A little of us",
    galleryText:
      "From the streets of New York to the pines of Dalat. We can't wait to celebrate with you.",
    navStory: "Us",
    navDetails: "Details",
    navVenue: "Venue",
    navRsvp: "RSVP",
    heroButton: "RSVP",
    storyEyebrow: "Save the date",
    detailsEyebrow: "The celebration",
    detailsTitle: "Details",
    venueEyebrow: "Where",
    mapLink: "View on Google Maps",
    rsvpEyebrow: "Kindly reply",
    rsvpTitle: "RSVP",
    searchLabel: "Search your name",
    searchPlaceholder: "Type your first or last name",
    minSearchLength: "Please enter at least 3 characters to search.",
    noMatch: "No match. Try just your first or last name, or contact us below.",
    serverError: "Could not reach the server. Please try again.",
    welcomePrefix: "Welcome,",
    already: "You already replied. Submitting again will update your answer.",
    acceptText: "Joyfully accepts",
    declineText: "Regretfully declines",
    countLabel: "How many in your party? (Including you)",
    emailLabel: "Email address",
    emailPlaceholder: "Your email address",
    notesLabel: "Dietary needs (optional)",
    coupleNoteLabel: "Note to the couple (optional)",
    send: "Send RSVP",
    back: "Not you? Search again",
    thanksTitle: "Thank you",
    thanksText: "Your RSVP is in. We'll email you the details soon.",
    genericError: "Something went wrong: ",
    countUnits: ["Days", "Hours", "Minutes", "Seconds"],
  },
};
const C = window.WEDDING,
  $ = (id) => document.getElementById(id);
let sel = null,
  timer;
const T = C.text;
for (const id of [
  "navStory",
  "navDetails",
  "navVenue",
  "navRsvp",
  "heroButton",
  "storyEyebrow",
  "detailsEyebrow",
  "detailsTitle",
  "venueEyebrow",
  "rsvpEyebrow",
  "rsvpTitle",
  "searchLabel",
  "welcomePrefix",
  "acceptText",
  "declineText",
  "countLabel",
  "emailLabel",
  "notesLabel",
  "coupleNoteLabel",
  "send",
  "back",
  "thanksTitle",
  "thanksText",
]) {
  $(id).textContent = T[id];
}
$("already").textContent = T.already;
$("coupleNoteAcceptedLabel").textContent = T.coupleNoteLabel;
$("map").textContent = T.mapLink;
$("q").placeholder = T.searchPlaceholder;
$("email").placeholder = T.emailPlaceholder;
document.title = C.names.join(" & ") + " - Wedding";
$("names").innerHTML =
  "<span>" + C.names[0] + "</span><i>&amp;</i><span>" + C.names[1] + "</span>";
$("fnames").textContent = C.names.join(" & ");
$("date").textContent = C.dateLine;
$("place").textContent = C.venue + " · " + C.place;
$("headline").textContent = C.headline;
$("intro").textContent = C.intro;
$("vname").textContent = C.venue;
$("vtext").textContent = C.venueText;
$("map").href = C.mapUrl;
$("contact").textContent = C.contact;
$("cards").innerHTML = C.events
  .map(
    (e) =>
      '<div class="card"><span class="eyebrow">' +
      e[1] +
      "</span><h3>" +
      e[0] +
      "</h3><p>" +
      e[2] +
      "</p></div>",
  )
  .join("");
$("timeline").innerHTML = C.timeline
  .map((t) => "<div><b>" + t[0] + "</b>" + t[1] + "</div>")
  .join("");
$("travel").innerHTML = C.travel
  .map(
    (e) => '<div class="card"><h3>' + e[0] + "</h3><p>" + e[1] + "</p></div>",
  )
  .join("");
$("heroPhoto").src = C.photos.heroDesktop;
$("heroPhoto").srcset =
  C.photos.heroDesktop + " 1100w, " + C.photos.heroDesktopLarge + " 1600w";
$("heroPhoto").sizes = "100vw";
$("heroPhoto").alt = C.photos.gallery[2].alt;
$("heroMobile").srcset =
  C.photos.heroMobile + " 1000w, " + C.photos.heroMobileLarge + " 1200w";
$("venuePhoto").src = C.photos.venue;
$("venuePhoto").srcset =
  C.photos.venue + " 960w, " + C.photos.venueLarge + " 1440w";
$("venuePhoto").sizes = "(max-width: 700px) 100vw, 48vw";
$("venuePhoto").alt = "Ana Mandara Villas Dalat Resort beneath the pine hills";
$("photoGrid").innerHTML = C.photos.gallery
  .map(
    (p) =>
      '<figure><img src="' +
      p.src +
      '" srcset="' +
      p.srcset +
      '" sizes="(max-width: 700px) 48vw, 25vw" alt="' +
      p.alt +
      '" width="' +
      p.width +
      '" height="' +
      p.height +
      '" loading="lazy" decoding="async"></figure>',
  )
  .join("");
["galleryEyebrow", "galleryTitle", "galleryText"].forEach(
  (id) => ($(id).textContent = T[id]),
);
function tick() {
  const d = new Date(C.dateISO) - new Date();
  if (d < 0) {
    $("count").innerHTML = "";
    return;
  }
  const v = [
    Math.floor(d / 864e5),
    Math.floor(d / 36e5) % 24,
    Math.floor(d / 6e4) % 60,
    Math.floor(d / 1e3) % 60,
  ];
  if (!$("count").children.length)
    $("count").innerHTML = v
      .map((x, i) => "<div><b></b><span>" + T.countUnits[i] + "</span></div>")
      .join("");
  [...$("count").children].forEach((el, i) => {
    const b = el.firstChild,
      t = String(v[i]);
    if (b.textContent !== t) {
      b.textContent = t;
      b.classList.remove("flip");
      void b.offsetWidth;
      b.classList.add("flip");
    }
  });
}
tick();
setInterval(tick, 1000);
document
  .querySelectorAll("[data-to]")
  .forEach(
    (a) =>
      (a.onclick = () =>
        $(a.dataset.to).scrollIntoView({ behavior: "smooth" })),
  );
const nav = $("nav");
addEventListener(
  "scroll",
  () =>
    nav.classList.toggle(
      "show",
      scrollY >
        document.getElementById("hero").offsetHeight - window.innerHeight * 0.6,
    ),
  { passive: true },
);
const io = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    }),
  { threshold: 0.12 },
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
$("q").addEventListener("input", () => {
  clearTimeout(timer);
  const query = $("q").value.trim();
  if (query.length < 3) {
    $("results").innerHTML = "";
    $("none").textContent = query.length ? T.minSearchLength : "";
    $("none").hidden = query.length === 0;
    return;
  }
  $("none").hidden = true;
  timer = setTimeout(search, 300);
});
const API = window.WEDDING.apiUrl;
function search() {
  const q = $("q").value.trim();
  $("none").hidden = true;
  $("results").innerHTML = "";
  if (q.length < 3) {
    $("none").textContent = q.length ? T.minSearchLength : "";
    $("none").hidden = q.length === 0;
    return;
  }
  fetch(API + "?action=search&q=" + encodeURIComponent(q))
    .then((r) => r.json())
    .then((r) => {
      $("results").innerHTML = "";
      r.results.forEach((g) => {
        const li = document.createElement("li");
        li.textContent = g.name;
        li.onclick = () => pick(g);
        $("results").appendChild(li);
      });
      $("none").textContent = T.noMatch;
      $("none").hidden = r.results.length > 0;
    })
    .catch(() => {
      $("none").textContent = T.serverError;
      $("none").hidden = false;
    });
}
function show(id) {
  ["step1", "step2", "done"].forEach((s) => ($(s).hidden = s !== id));
}
function pick(g) {
  sel = g;
  show("step2");
  $("who").textContent = g.name;
  $("already").hidden = !g.responded;
  document.querySelector('[name=att][value="yes"]').checked = true;
  $("cnt").innerHTML = Array.from(
    { length: g.max },
    (_, i) => "<option>" + (i + 1) + "</option>",
  ).join("");
  $("cnt").value = g.max;
  $("acceptFields").hidden = false;
  $("declineFields").hidden = true;
  $("email").required = true;
  $("cntwrap").hidden = false;
  $("email").value = "";
  $("notes").value = "";
  $("coupleNote").value = "";
  $("coupleNoteAccepted").value = "";
}
document.querySelectorAll("[name=att]").forEach((r) => {
  r.onchange = () => {
    const declined = r.value === "no" && r.checked;
    $("acceptFields").hidden = declined;
    $("declineFields").hidden = !declined;
    $("email").required = !declined;
  };
});
$("back").onclick = () => show("step1");
$("step2").addEventListener("submit", (e) => {
  e.preventDefault();
  $("err").hidden = true;
  $("send").disabled = true;
  const fail = (m) => {
    $("err").textContent = T.genericError + m;
    $("err").hidden = false;
    $("send").disabled = false;
  };
  fetch(API, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      id: sel.id,
      name: sel.name,
      attending: document.querySelector("[name=att]:checked").value,
      count: $("cnt").value,
      email: $("email").value,
      notes: $("notes").value,
      coupleNote: document.querySelector("[name=att]:checked").value === "no"
        ? $("coupleNote").value
        : $("coupleNoteAccepted").value,
    }),
  })
    .then((r) => r.json())
    .then((r) => {
      if (!r.ok) return fail(r.error);
      show("done");
    })
    .catch((x) => fail(x.message || x));
});

// Restrained pinefall particles and timeline progression. No opening overlay sequence.
(function () {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduced) {
    const layer = $("pinefall");
    const needle =
      '<svg viewBox="0 0 24 30" aria-hidden="true"><path d="M12 28 4 18l7 3-6-8 7 3-4-8 4 4 1-9 2 9 5-5-3 9 5-3-6 8 6-2-8 9Z" fill="currentColor"/><path d="M12 28V5" stroke="#f7f4ed" stroke-opacity=".7" stroke-width=".8"/></svg>';
    const cone =
      '<svg viewBox="0 0 20 28" aria-hidden="true"><defs><linearGradient id="coneShade" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#9a8050"/><stop offset=".48" stop-color="#735b37"/><stop offset="1" stop-color="#51432e"/></linearGradient></defs><path d="M10 1C7 3 5 5 4 8 2 11 2 15 3 19c1 4 3 7 7 9 4-2 6-5 7-9 1-4 1-8-1-11-1-3-3-5-6-7Z" fill="url(#coneShade)" stroke="#51432e" stroke-width=".65"/><g fill="none" stroke="#d3bf92" stroke-opacity=".82" stroke-width=".7" stroke-linecap="round"><path d="M7 5c1.4 1.1 2.3 2.4 3 4 .8-1.6 1.7-2.9 3-4M4.5 9c2.2.5 4 1.8 5.5 3.8 1.5-2 3.3-3.3 5.5-3.8M3.2 14c2.7.2 5 1.5 6.8 3.7 1.8-2.2 4.1-3.5 6.8-3.7M3.8 19c2.5-.1 4.6 1.1 6.2 3.2 1.6-2.1 3.7-3.3 6.2-3.2M6.5 23c1.3-.2 2.5.2 3.5 1.2 1-1 2.2-1.4 3.5-1.2"/></g><path d="M10 1 8.7 4.8" fill="none" stroke="#51432e" stroke-width=".9"/></svg>';
    for (let i = 0; i < 8; i++) {
      const item = document.createElement("span");
      const isCone = i % 3 === 0;
      item.className = "pinefall-item " + (isCone ? "cone" : "needle");
      item.innerHTML = isCone ? cone : needle;
      item.style.left = 6 + Math.random() * 88 + "%";
      item.style.animationDuration = 20 + Math.random() * 14 + "s";
      item.style.animationDelay = -Math.random() * 30 + "s";
      item.style.transform = "rotate(" + Math.random() * 360 + "deg)";
      layer.appendChild(item);
    }
  }
  const clamp = (v) => Math.max(0, Math.min(1, v));
  let queued = false;
  function timelineFrame() {
    queued = false;
    const h = document.documentElement.scrollHeight - innerHeight;
    if ($("prog"))
      $("prog").style.transform =
        "scaleX(" + (h > 0 ? clamp(scrollY / h) : 0) + ")";
    const el = $("timeline");
    if (!el) return;
    const box = el.getBoundingClientRect();
    el.style.setProperty(
      "--tl",
      clamp((innerHeight * 0.72 - box.top) / Math.max(1, box.height)),
    );
    document
      .querySelectorAll("#timeline>div")
      .forEach((node) =>
        node.classList.toggle(
          "on",
          node.getBoundingClientRect().top < innerHeight * 0.78,
        ),
      );
  }
  addEventListener(
    "scroll",
    () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(timelineFrame);
      }
    },
    { passive: true },
  );
  addEventListener("resize", timelineFrame);
  timelineFrame();
})();
