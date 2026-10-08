(function(){
// ── Build stamp — check what's actually deployed ──────────────
// In the browser console on /store you'll see this line. If the number
// doesn't match the ?v= in the Squarespace footer, you're on a stale file.
window.TS_BUILD = "246 (5 new Icelantic skis: Tempest 88/94, Torrent 88/96, Nomad 94)";
console.log("%c[TuneSkis] storefront build " + window.TS_BUILD, "background:#4db8ff;color:#000;padding:2px 6px;border-radius:3px;font-weight:bold");
// Prints what the deal engine actually sees. Run tsDealDebug() in the console
// any time to find out why a deal is or isn't showing.
window.tsDealDebug = function(){
  try {
    var now = dealNowNY();
    var info = {
      nyDate: dealDateStr(now),
      nyTime: now.toTimeString().slice(0,8),
      weekday: DEAL_DAYS[now.getDay()],
      resolvedKey: dealKeyFor(now),
      dealFound: !!dealFor(now),
      dealName: dealFor(now) ? dealFor(now).name : "(none)",
      revealAt: DEAL_OF_DAY.revealHour + ":" + ("0"+DEAL_OF_DAY.revealMinute).slice(-2),
      state: dealState().state
    };
    console.table(info);
    return info;
  } catch(e){ console.error("tsDealDebug failed:", e); }
};
// Only auto-print the debug table when you ask for it (?dealdebug=1).
// You can also just type tsDealDebug() in the console at any time.
if (/[?&]dealdebug=1/.test(location.search)) {
  setTimeout(function(){ try { window.tsDealDebug(); } catch(e){} }, 1200);
}
// ═══════════════════════════════════════════════════════════════════
//  🔥 DEAL OF THE DAY — EDIT THIS BLOCK AT THE START OF EACH WEEK
// ═══════════════════════════════════════════════════════════════════
//  • Every deal unlocks at the same time each day (revealHour/revealMinute,
//    Eastern time, 24-hour clock — 9 = 9am, 15 = 3pm).
//  • One deal per day of the week. Set active:false to skip a day.
//  • hlId = the Heartland item ID for the deal. IMPORTANT: for anything
//    where the customer picks a size (skis, boots), use a dedicated
//    Heartland item created JUST for this deal — not one of the regular
//    catalog sizes — set its qty to exactly how many you want to sell
//    (1 or 3). Since it's a single item regardless of size chosen, the
//    cap is enforced across ALL sizes combined, not per-size. The chosen
//    size is just recorded on the order for you to pull the right one
//    from stock. When that Heartland item's qty hits 0, the site shows
//    SOLD OUT automatically.
//  • sizes = optional list of sizes to offer as a dropdown on the deal
//    page (e.g. ["150cm","156cm","162cm"]). Leave out entirely (or [])
//    for single-size items like bindings — no dropdown will show.
//  • limit = the number you want shown as "Only X available".
//  • price = the deal price; msrp = the regular price shown crossed out.
//  • teaser = what shows before the reveal (product stays hidden until then).
// ═══════════════════════════════════════════════════════════════════
const DEAL_OF_DAY = {
  // First day deals ever ran. Nothing before this is treated as a past deal,
  // which stops an upcoming product from being revealed early.
  startDate: "2026-10-09",
  revealHour: 12,
  revealMinute: 0,

  // Deals pinned to an exact calendar date. These win over the weekday list
  // below, so a launch can't be missed because of a day-of-week mixup.
  // Give them the same capKey and they share ONE limit across all the dates
  // listed — so "1 available" means one total, not one per day.
  byDate: {
    "2026-10-09": "RX9_LAUNCH",   // Friday — postponed from Oct 7/8
  },

  deals: {
    mon: { active:false, name:"", teaser:"", price:0, msrp:0, limit:3, hlId:0, sizes:[], image:"", desc:"", specs:{} },
    tue: { active:false, name:"", teaser:"", price:0, msrp:0, limit:3, hlId:0, sizes:[], image:"", desc:"", specs:{} },
    wed: { active:false, name:"", teaser:"", price:0, msrp:0, limit:3, hlId:0, sizes:[], image:"", desc:"", specs:{} },
    // 🔥 FIRST REAL DEAL — Kästle RX9, $299.99, drops Friday Oct 9 at 12pm ET.
    // No Heartland item needed: hlId stays 0 and the server's own sales
    // counter enforces limit:1. To move the launch, just change the date in
    // byDate above. capKey keeps it to ONE sale total across every date listed.
    RX9_LAUNCH: { active:true, capKey:"rx9-launch-2026", name:"Kästle RX9", teaser:"A World Cup-inspired carver at a price you won't believe…",
           price:299.99, msrp:950.00, limit:1, hlId:0,
           sizes:["150cm","156cm","162cm","168cm","174cm"], bindings:true,
           image:"https://kaestle.com/cdn/shop/files/rx9_01.jpg?v=1752671657",
           images:["https://kaestle.com/cdn/shop/files/rx9_01.jpg?v=1752671657",
                    "https://skicatalogue.com/cdn/shop/files/SR923P_KASTLE_RX9_2.jpg?v=1747795545&width=1000",
                    "https://skicatalogue.com/cdn/shop/files/SR923P_KASTLE_RX9_3.jpg?v=1747795545&width=1000",
                    "https://skicatalogue.com/cdn/shop/files/SR923P_KASTLE_RX9_4.jpg?v=1747795545&width=1000",
                    "https://skicatalogue.com/cdn/shop/files/SR923P_KASTLE_RX9_5.jpg?v=1747795514&width=1000",
                    "https://skicatalogue.com/cdn/shop/files/SR923P_KASTLE_RX9_6.jpg?v=1747795514&width=1000",
                    "https://skicatalogue.com/cdn/shop/files/SR923P_KASTLE_RX9_7.jpg?v=1747795514&width=1000"],
           desc:"World Cup-inspired all-mountain carver. Symbio Core with Titanal keeps it light, damp, and precise. Choose your length below.",
           specs:{"Waist Width":"76mm","Dimensions":"118 / 76 / 106 mm","Profile":"Camber","Core":"Symbio Core — Titanal + Poplar Wood","Technology":"Hollowtech Race","Available Lengths":"150 · 156 · 162 · 168 · 174 cm","Bindings":"Included","Skill Level":"Intermediate – Advanced","Terrain":"On-Piste / Frontside","Country":"Austria"} },
    fri: { active:false, name:"", teaser:"", price:0, msrp:0, limit:3, hlId:0, sizes:[], image:"", desc:"", specs:{} },
    sat: { active:false, name:"", teaser:"", price:0, msrp:0, limit:3, hlId:0, sizes:[], image:"", desc:"", specs:{} },
    sun: { active:false, name:"", teaser:"", price:0, msrp:0, limit:3, hlId:0, sizes:[], image:"", desc:"", specs:{} },
  }
};
// Example of a filled-in day (no size picker — single-SKU item like a binding):
// mon: { active:true, name:"Rossignol Rookie Binding", teaser:"A great beginner binding at a deal price…",
//        price:89.99, msrp:119.99, limit:3, hlId:100234,
//        image:"https://.../rookie.jpg", desc:"Soft flex, simple strap entry." },
// ═══════════════════════════════════════════════════════════════════

// ---- Page switching ----
function tshShowShop() {
  document.body.classList.add('ts-shop-view');
  document.body.classList.remove('ts-home-view');
  window.scrollTo({top:0, behavior:'smooth'});
}
function tshShowHome() {
  document.body.classList.remove('ts-shop-view');
  // ── Only run storefront on /store ──────────────────
  var _tsPath = window.location.pathname.replace(/\/+$/, '');
  if (_tsPath !== '/store') return;
  
  // Load fonts dynamically only on store page
  var _tsFont1 = document.createElement('link');
  _tsFont1.rel = 'stylesheet';
  _tsFont1.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Lato:wght@300;400;700&display=swap';
  document.head.appendChild(_tsFont1);
  
  var _tsFont2 = document.createElement('link');
  _tsFont2.rel = 'stylesheet';
  _tsFont2.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;700&display=swap';
  document.head.appendChild(_tsFont2);

  var _tsFA = document.createElement('link');
  _tsFA.rel = 'stylesheet';
  _tsFA.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css';
  document.head.appendChild(_tsFA);

  document.body.classList.add('ts-active');
  document.body.classList.add('ts-home-view');

  // ── Preload Heartland SecureSubmit JS ──────────────────────
  (function() {
    var s = document.createElement('script');
    s.src = 'https://api2.heartlandportico.com/SecureSubmit.v1/token/2.4.1/securesubmit.js';
    document.head.appendChild(s);
  })();

  // ── Hide Squarespace footer + transparent header on /store ──
  function tsFixLayout() {
    // Transparent header
    var nav = document.querySelector('.persistent-navigation');
    if (nav) {
      nav.style.setProperty('background', 'transparent', 'important');
      nav.style.setProperty('background-color', 'transparent', 'important');
      nav.style.setProperty('box-shadow', 'none', 'important');
    }
    // Hide footer
    var footer = document.querySelector('.App-footer');
    if (footer) footer.style.setProperty('display', 'none', 'important');
    // Remove gap
    var page = document.getElementById('page');
    if (page) page.style.setProperty('padding-bottom', '0', 'important');
  }
  // Run now and after a short delay (Squarespace may render late)
  tsFixLayout();
  setTimeout(tsFixLayout, 500);
  setTimeout(tsFixLayout, 1500);
  window.scrollTo({top:0});
}

// ---- Homepage navigation helpers ----
function tshScrollToShop() {
  tshShowShop();
}

function tshGoTo(cat) {
  tshShowShop();
  setTimeout(()=>{
    // Activate the right tab in the store
    const btns = document.querySelectorAll('#ts-store .ts-catbtn');
    let targetBtn = null;
    btns.forEach(b => {
      const label = b.textContent.trim().toLowerCase();
      if (cat === 'boots' && label === 'boots')                              { targetBtn = b; }
      else if (cat === 'snowboard-boots' && label === 'snowboard boots') { targetBtn = b; }
      else if (cat === 'accessories' && label === 'accessories') { targetBtn = b; }
      else if (cat === 'skis' && label === 'skis')             { targetBtn = b; }
      else if (cat === 'snowboards' && label === 'snowboards') { targetBtn = b; }
      else if (cat === 'bindings' && label === 'bindings')     { targetBtn = b; }
      else if (cat === 'xc' && label === 'xc')                 { targetBtn = b; }
      else if (cat === 'all' && label === 'all')               { targetBtn = b; }
    });
    if (targetBtn && typeof tsCat === 'function') {
      tsCat(cat, targetBtn);
    }
    // Clear any brand search
    const searchBox = document.querySelector('#ts-store .ts-search');
    if (searchBox && searchBox.value) { searchBox.value=''; if(typeof tsSearch==='function') tsSearch(''); }
  }, 60);
}

function tshGoToBrand(brand) {
  const brandCatMap = {
    'Rossignol':'skis','Salomon':'skis','Kästle':'skis','Icelantic':'skis',
    'Jones':'snowboards','Nidecker':'snowboards','Rome':'snowboards',
    'Roxa':'ski-boots'
  };
  const cat = brandCatMap[brand] || 'all';
  tshShowShop();
  setTimeout(()=>{
    // Activate category
    const btns = document.querySelectorAll('#ts-store .ts-catbtn');
    btns.forEach(b => {
      const label = b.textContent.trim().toLowerCase();
      const match = (cat === 'ski-boots' && label==='ski boots') ||
                    (cat === 'skis' && label==='skis') ||
                    (cat === 'snowboards' && label==='snowboards') ||
                    (cat === 'accessories' && label==='accessories') ||
                    (cat === 'all' && label==='all');
      if (match && typeof tsCat === 'function') tsCat(cat, b);
    });
    // Apply brand filter
    const searchBox = document.querySelector('#ts-store .ts-search');
    if (searchBox) { searchBox.value = brand; if(typeof tsSearch==='function') tsSearch(brand); }
  }, 60);
}

// ---- Brand carousel scroll ----
function tshBrandScroll(dir) {
  const track = document.getElementById('tsh-brands-track');
  if (track) track.scrollBy({left: dir * 460, behavior:'smooth'});
}

// Brand image fallbacks — if a CDN image fails, swap to a dark gradient
document.querySelectorAll('.tsh-brand-img').forEach(img => {
  img.addEventListener('error', function() {
    this.style.display = 'none';
    this.parentElement.style.background = 'linear-gradient(135deg, #0d1b2a 0%, #1a2e44 100%)';
  });
});



// Spacer — pushes content below Squarespace fixed header
(function() {
  function setSpacerHeight() {
    const header = document.querySelector('.header')
                || document.querySelector('header')
                || document.querySelector('.Header');
    const spacer = document.getElementById('ts-header-spacer');
    const backBtn = document.getElementById('ts-back-btn');
    if (header && spacer) {
      const h = header.getBoundingClientRect().height || header.offsetHeight;
      if (h > 0) {
        spacer.style.height = h + 'px';
        if (backBtn) backBtn.style.top = (h + 10) + 'px';
      }
    }
  }
  // Run immediately, on load, and on resize
  setSpacerHeight();
  window.addEventListener('load', setSpacerHeight);
  window.addEventListener('resize', setSpacerHeight);
  // Also poll briefly in case Squarespace renders header late
  setTimeout(setSpacerHeight, 500);
  setTimeout(setSpacerHeight, 1500);
})();

// ── Only run storefront on /store ──────────────────
  var _tsPath = window.location.pathname.replace(/\/+$/, '');
  if (_tsPath !== '/store') return;

  // Load fonts dynamically only on store page
  var _tsFont1 = document.createElement('link');
  _tsFont1.rel = 'stylesheet';
  _tsFont1.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Lato:wght@300;400;700&display=swap';
  document.head.appendChild(_tsFont1);

  var _tsFont2 = document.createElement('link');
  _tsFont2.rel = 'stylesheet';
  _tsFont2.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;700&display=swap';
  document.head.appendChild(_tsFont2);

  var _tsFA = document.createElement('link');
  _tsFA.rel = 'stylesheet';
  _tsFA.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css';
  document.head.appendChild(_tsFA);

  document.body.classList.add('ts-active');
  document.body.classList.add('ts-home-view');

  // ── Preload Heartland SecureSubmit JS ──────────────────────
  (function() {
    var s = document.createElement('script');
    s.src = 'https://api2.heartlandportico.com/SecureSubmit.v1/token/2.4.1/securesubmit.js';
    document.head.appendChild(s);
  })();

  // ── Hide Squarespace footer + transparent header on /store ──
  function tsFixLayout() {
    var nav = document.querySelector('.persistent-navigation');
    if (nav) {
      nav.style.setProperty('background', 'transparent', 'important');
      nav.style.setProperty('background-color', 'transparent', 'important');
      nav.style.setProperty('box-shadow', 'none', 'important');
    }
    var footer = document.querySelector('.App-footer');
    if (footer) footer.style.setProperty('display', 'none', 'important');
    var page = document.getElementById('page');
    if (page) page.style.setProperty('padding-bottom', '0', 'important');
  }
  tsFixLayout();
  setTimeout(tsFixLayout, 500);
  setTimeout(tsFixLayout, 1500);

// ══ SUBCATEGORY MAP ══════════════════════════════════════
const SUBCATS = {
  all:              [],
  skis:             [{v:"all",l:"All Skis"},{v:"icelantic",l:"Icelantic"},{v:"kastle",l:"Kästle"},{v:"rossignol",l:"Rossignol"},{v:"salomon",l:"Salomon"}],
  snowboards:       [{v:"all",l:"All Boards"},{v:"jones",l:"Jones"},{v:"rossignol",l:"Rossignol"},{v:"salomon",l:"Salomon"},{v:"nidecker",l:"Nidecker"},{v:"rome",l:"Rome"},{v:"neversummer",l:"Never Summer"}],
  bindings:         [{v:"all",l:"All Bindings"},{v:"ski-binding",l:"Ski Bindings"},{v:"snowboard-binding",l:"Snowboard Bindings"}],
  "boots":          [{v:"all",l:"All Boots"},{v:"ski",l:"Ski Boots"},{v:"snowboard",l:"Snowboard Boots"},{v:"winter",l:"Winter Boots"},{v:"---",l:"---"},{v:"roxa",l:"Roxa"},{v:"salomon",l:"Salomon"},{v:"nidecker",l:"Nidecker"},{v:"baffin",l:"Baffin"}],
  "ski-boots":      [{v:"all",l:"All Ski Boots"},{v:"alpineboots",l:"Alpine Boots"},{v:"xcboots",l:"XC Boots"},{v:"roxa",l:"Roxa"}],
  "snowboard-boots":[{v:"all",l:"All Snowboard Boots"}],
  accessories:      [{v:"all",l:"All Accessories"},{v:"helmets",l:"Helmets"},{v:"goggles",l:"Goggles"},{v:"footwear",l:"Footwear"}],
  xc:               [{v:"all",l:"All XC"},{v:"skis",l:"XC Skis"},{v:"boots",l:"XC Boots"},{v:"poles",l:"Poles"},{v:"bindings",l:"XC Bindings"}],
};

// ══ PRODUCTS ═════════════════════════════════════════════
// sizes: array of { label, qty }  — qty 0 = grayed out/unavailable
// Products without sizes will skip the size selector

// ── Price display — 30% off everything ───────────────────────────
function tsDiscountedPrice(price) {
  return Math.round(price * 0.70 * 100) / 100;
}

function tsPriceDisplay(price, msrp) {
  const salePrice = parseFloat(price);
  if (isNaN(salePrice) || salePrice === 0) return '<span class="ts-card-price-reg">Call Us</span>';
  const fmt = n => '$' + n.toFixed(2);
  const origPrice = msrp ? parseFloat(msrp) : null;
  if (origPrice && origPrice > salePrice) {
    // On sale — show strikethrough + red price
    return `<div class="ts-card-price-wrap">
    <span class="ts-card-price-orig">${fmt(origPrice)}</span>
    <span class="ts-card-price-sale">${fmt(salePrice)}</span>
  </div>`;
  }
  // Full price — show in black
  return `<div class="ts-card-price-wrap"><span class="ts-card-price-full">${fmt(salePrice)}</span></div>`;
}

// Discount percent for a product — 0 if not on sale or msrp missing
function tsDiscountPct(p) {
  const msrp = parseFloat(p.msrp);
  const price = parseFloat(p.price);
  if (!msrp || !price || msrp <= price) return 0;
  return (msrp - price) / msrp;
}


const PRODUCTS = [
  // ── ICELANTIC ────────────────────────────────────────
  {
    name:"Icelantic Pioneer 96", brand:"Icelantic", price:599.00, badge:"New", badgeType:"new", icon:"🎿",
    cat:"skis", sub:"icelantic", gender:"men", age:"adult", cond:"new", bindings:false, flatmount:true, popular:199,
    desc:"The ultimate one-ski quiver. 96mm waist, Poplar core, made in the USA.",
    action:"Add to Cart", link:null,
    sizes:[{label:"174cm",qty:0,hlId:101075},{label:"182cm",qty:0,hlId:101772}],
    images:["https://www.icelanticskis.com/cdn/shop/files/2425_Pioneer96_wAwards_723f40cb-2382-40f1-a12d-97a6d3e3e6c7_300x900.png?v=1722518297","https://www.icelanticskis.com/cdn/shop/files/2425_Camber_Pioneer96_WEB_300x900.png?v=1721930722","https://www.icelanticskis.com/cdn/shop/files/2425_Base_Pioneer96_WEB_300x900.png?v=1721931036","https://www.icelanticskis.com/cdn/shop/files/2024_SpecChart_Pioneer96_1800x.png?v=1721963026","https://www.icelanticskis.com/cdn/shop/files/2024_ConstructionDiagram_PioneerRiveter_1800x.jpg?v=1721963531"],
    longDesc:"The Pioneer 96 is Icelantic's true one-ski quiver, built to handle every condition the mountain throws at you. A tapered shape and 5mm of camber underfoot deliver powerful edge hold and snappy rebound, while the Poplar Power Core provides the backbone for high-speed carving and playful off-piste lines. From tracked powder to spring groomers, the Pioneer 96 adapts to it all — whether you're charging or cruising, this ski always has your back. Versatile, stable, and handmade in Denver, CO. Backed by Icelantic's 3-Year Bombproof Warranty.",
    specs:{"Waist Width":"96mm","Dimensions":"131 / 96 / 118 mm","Profile":"Rocker / Camber / Rocker","Core":"Poplar Power Core","Available Lengths":"174 · 182 cm (in stock)","Skill Level":"Intermediate – Advanced","Terrain":"All-Mountain","Made In":"USA 🇺🇸","Warranty":"3-Year Bombproof"},
    breakdown:[{label:"Skis (Icelantic Pioneer 96)",amount:599},,{label:"Total",amount:599}]
  },
  {
    name:"Icelantic Pioneer 86", brand:"Icelantic", price:549.00, badge:"New", badgeType:"new", icon:"🎿",
    cat:"skis", sub:"icelantic", gender:"men", age:"adult", cond:"new", bindings:false, flatmount:true, popular:198,
    desc:"The frontside ripper of the Pioneer line. 86mm waist for fast edge-to-edge and clean carves.",
    action:"Add to Cart", link:null,
    sizes:[{label:"166cm",qty:0,hlId:101084},{label:"174cm",qty:0,hlId:101085},{label:"182cm",qty:0,hlId:101086}],
    images:["https://www.icelanticskis.com/cdn/shop/files/2425_Pioneer86_wAwards_0aeba6ed-f720-4ba4-8e0d-26d45a586727_300x900.png?v=1722518294","https://www.icelanticskis.com/cdn/shop/files/2425_Camber_Pioneer86_WEB_300x900.png?v=1721930718","https://www.icelanticskis.com/cdn/shop/files/2425_Base_Pioneer86_WEB_300x900.png?v=1721931031","https://www.icelanticskis.com/cdn/shop/files/2024_SpecChart_Pioneer86_1800x.png?v=1721963017","https://www.icelanticskis.com/cdn/shop/files/2024_ConstructionDiagram_PioneerRiveter_1800x.jpg?v=1721963531"],
    longDesc:"The Pioneer 86 is the narrowest ski in the Pioneer All-Mountain Collection, ideal for skiers who thrive on groomed trails, love carving, or enjoy charging bump lines. Its directional shape and flat tail enhance acceleration out of turns, while 5mm of camber and a Poplar Power Core provide energy and grip on firm snow. Quick, agile, and easy to maneuver, the 86 is your everyday groomer slayer with just enough versatility to dip off-piste when the opportunity strikes. Handmade in Denver, CO. Backed by Icelantic's 3-Year Bombproof Warranty.",
    specs:{"Waist Width":"86mm","Dimensions":"121 / 86 / 108 mm","Profile":"Rocker / Camber / Rocker","Core":"Poplar Power Core","Available Lengths":"166 · 174 · 182 cm","Skill Level":"Intermediate – Advanced","Terrain":"Frontside / All-Mountain","Made In":"USA 🇺🇸","Warranty":"3-Year Bombproof"},
    breakdown:[{label:"Skis (Icelantic Pioneer 86)",amount:549},,{label:"Total",amount:549}]
  },
  {
    name:"Icelantic Riveter 85", brand:"Icelantic", price:499.00, badge:"Women's", badgeType:"new", icon:"🎿",
    cat:"skis", sub:"icelantic", gender:"women", age:"adult", cond:"new", bindings:false, flatmount:true, popular:197,
    desc:"Icelantic's all-mountain ski for women. 85mm waist, tapered tip, 5mm camber — handles any terrain.",
    action:"Add to Cart", link:null,
    sizes:[{label:"150cm",qty:0,hlId:101088},{label:"155cm",qty:0,hlId:101089},{label:"162cm",qty:0,hlId:101090}],
    images:["https://www.icelanticskis.com/cdn/shop/files/2425_Riveter85_wAwards_c2ea67e8-0ae1-475d-944e-531231ae590f_300x900.png?v=1723144695","https://www.icelanticskis.com/cdn/shop/files/2425_Camber_Riveter85_WEB_300x900.png?v=1721930734","https://www.icelanticskis.com/cdn/shop/files/2425_Base_Riveter85_WEB_300x900.png?v=1721931056","https://www.icelanticskis.com/cdn/shop/files/2024_SpecChart_Riveter85_1800x.png?v=1721963056","https://www.icelanticskis.com/cdn/shop/files/2024_ConstructionDiagram_PioneerRiveter_1800x.jpg?v=1721963531"],
    longDesc:"The Riveter 85 is built for frontside-focused skiers who want a ski that's nimble, reliable, and fun across the whole mountain. With a tapered shape and 5mm of camber underfoot, it delivers strong edge hold and lively rebound, while its narrower waist makes it lightning-fast edge to edge. From groomers to bumps, it's easy to drive and hard not to love. Balanced and intuitive, it gives you the confidence to explore every corner of the resort. Handmade in Denver, CO. Backed by Icelantic's 3-Year Bombproof Warranty.",
    specs:{"Waist Width":"85mm","Dimensions":"120 / 85 / 107 mm","Profile":"Rocker / Camber / Rocker","Core":"Poplar Power Core","Available Lengths":"150 · 155 cm (in stock)","Skill Level":"Beginner – Advanced","Terrain":"All-Mountain / Frontside","Made In":"USA 🇺🇸","Warranty":"3-Year Bombproof"},
    breakdown:[{label:"Skis (Icelantic Riveter 85)",amount:499},,{label:"Total",amount:499}]
  },


  // ── ICELANTIC (additional) ──────────────────────────────────
  {
    name:"Icelantic Shaman 99", brand:"Icelantic", price:849.99, badge:"New", badgeType:"new", icon:"🎿",
    cat:"skis", sub:"icelantic", gender:"men", age:"adult", cond:"new", bindings:false, flatmount:true, popular:191,
    desc:"A powerful all-mountain charger with a 99mm waist. Built for skiers who want serious edge hold and stability without sacrificing versatility in variable conditions.",
    action:"Add to Cart", link:null,
    sizes:[{label:"169cm",qty:0,hlId:101073},{label:"176cm",qty:0,hlId:101074}],
    images:["https://ridgeandriver.com/cdn/shop/files/2425_Shaman99_wAwards_300x900_46ce9f41-cf9e-47d2-8b9c-e5bae5542b60_300x.webp?v=1758307597"],
    longDesc:"The Shaman 99 is a modern evolution of one of Icelantic\'s most iconic shapes. Its tight turning radius, wide shovel, and powerful edge hold make it a carver\'s dream — built for skiers who want to lay deep trenches and drive through every turn. Icelantic updated the original Shaman with new materials, a tapered shape, and 8mm of camber underfoot for lively rebound. The rockered tip and tail keep the shovel from diving in deep snow, giving you a frontside-focused ride with genuine off-piste capability. Whether you\'re snapping turns on hardpack or floating through soft snow, this ski stays powerful, responsive, and ridiculously fun. Handmade in Denver, CO. Backed by Icelantic\'s 3-Year Bombproof Warranty."
  },
  {
    name:"Icelantic Tempest 88", brand:"Icelantic", price:799.99, customMsrp:799.99, customPrice:799.99, badge:"New", badgeType:"new", icon:"🎿",
    cat:"skis", sub:"icelantic", gender:"women", age:"adult", cond:"new", bindings:false, flatmount:true, popular:197,
    desc:"Built for intermediate to advanced women skiers seeking a precise, agile, and confidence-inspiring ride. Strong edge engagement and energetic rebound deliver quick edge-to-edge performance with a playful feel.",
    action:"Add to Cart", link:null,
    sizes:[{label:"150cm",qty:0,hlId:101978},{label:"155cm",qty:0,hlId:101979}],
    images:["https://www.icelanticskis.com/cdn/shop/files/1_TEMPEST_88_Topsheet_900x900.webp?v=1788328539","https://www.icelanticskis.com/cdn/shop/files/2_TEMPEST_88_Base_900x900.webp?v=1788328539","https://www.icelanticskis.com/cdn/shop/files/3_TEMPEST_88_Side_Profile_900x900.webp?v=1788328539","https://www.icelanticskis.com/cdn/shop/files/4_TEMPEST_88_Detail_2_900x900.webp?v=1788328539","https://www.icelanticskis.com/cdn/shop/files/5_TEMPEST_88_Detail_3_900x900.webp?v=1788328539","https://www.icelanticskis.com/cdn/shop/files/Artboard1_f7ece66f-a4c1-4355-910e-8d999e31b009_900x900.jpg?v=1789012882","https://www.icelanticskis.com/cdn/shop/files/Artboard2_f44f4452-9cb3-4821-b5a2-094613c092cf_900x900.jpg?v=1789012882"],
    longDesc:"The all-new Tempest 88 is built for intermediate to advanced women skiers seeking a precise, agile, and confidence-inspiring ride. Its narrow platform, strong edge engagement, and energetic rebound deliver quick edge-to-edge performance with a playful feel. Whether you\'re carving high-angle turns on corduroy, weaving through bumps, or exploring tight trees, the Tempest 88 provides the control, stability, and responsiveness to make every turn feel effortless. Poplar & Beech Wood Core for a smooth, balanced flex and dependable stability; Custom V12 Carbon Matrix and 8 Carbon Stringers boost strength, power, precision, and rebound. Directional Rocker Profile for effortless turn initiation. Original artwork by Travis Parr. Handmade in Golden, Colorado. Backed by Icelantic\'s 3-Year Bombproof Warranty.",
    specs:{"Brand":"Icelantic","Waist Width":"88mm","Dimensions (162cm)":"132 / 88 / 116 mm","Profile":"Directional Rocker","Core":"Poplar & Beech Wood + V12 Carbon Matrix","Turn Radius":"11-14m (by length)","Skill Level":"Intermediate – Advanced – Expert","Terrain":"All-Mountain, Carve","Gender":"Women\'s","Country":"USA (Golden, CO)"}
  },
  {
    name:"Icelantic Tempest 94", brand:"Icelantic", price:849.99, customMsrp:849.99, customPrice:849.99, badge:"New", badgeType:"new", icon:"🎿",
    cat:"skis", sub:"icelantic", gender:"women", age:"adult", cond:"new", bindings:false, flatmount:true, popular:198,
    desc:"Our most versatile, stable, and energetic women\'s all-mountain ski yet. A balanced 94mm platform delivers confident carving, smooth soft-snow performance, and versatility across the whole resort.",
    action:"Add to Cart", link:null,
    sizes:[{label:"155cm",qty:0,hlId:101977}],
    images:["https://www.icelanticskis.com/cdn/shop/files/1_TEMPEST_94_Topsheet_900x900.webp?v=1788329095","https://www.icelanticskis.com/cdn/shop/files/2_TEMPEST_94_Base_900x900.webp?v=1788329094","https://www.icelanticskis.com/cdn/shop/files/3_TEMPEST_94_Side_Profile_900x900.webp?v=1788329095","https://www.icelanticskis.com/cdn/shop/files/4_TEMPEST_94_Detail_2_900x900.webp?v=1788329094","https://www.icelanticskis.com/cdn/shop/files/5_TEMPEST_94_Detail_3_900x900.webp?v=1788329094","https://www.icelanticskis.com/cdn/shop/files/Artboard5_5af33f39-72e0-4067-b946-541f3364380d_900x900.jpg?v=1789012928","https://www.icelanticskis.com/cdn/shop/files/Artboard7_27a70675-c27b-462c-8446-c3d55e74fca1_900x900.jpg?v=1789012928"],
    longDesc:"The all-new, award-winning Tempest 94 is our most versatile, stable, and energetic women\'s all-mountain ski yet. With a V-12 Carbon-reinforced construction and balanced 94mm platform, it delivers confident carving, smooth soft-snow performance, and the versatility to handle everything from first-chair groomers to bumps and afternoon chop. Poplar & Beech Wood Core, Custom V12 Carbon Matrix, 8 Carbon Stringers, Directional Rocker Profile. Original artwork by Travis Parr. Handmade in Golden, Colorado. Backed by Icelantic\'s 3-Year Bombproof Warranty.",
    specs:{"Brand":"Icelantic","Waist Width":"94mm","Dimensions (162cm)":"135 / 94 / 119 mm","Profile":"Directional Rocker","Core":"Poplar & Beech Wood + V12 Carbon Matrix","Turn Radius":"12-15.5m (by length)","Skill Level":"Intermediate – Advanced – Expert","Terrain":"All-Mountain, Carve","Gender":"Women\'s","Country":"USA (Golden, CO)"}
  },
  {
    name:"Icelantic Torrent 88", brand:"Icelantic", price:799.99, customMsrp:799.99, customPrice:799.99, badge:"New", badgeType:"new", icon:"🎿",
    cat:"skis", sub:"icelantic", gender:"men", age:"adult", cond:"new", bindings:false, flatmount:true, popular:195,
    desc:"Built for intermediate to advanced skiers looking for a precise, snappy, and agile ride that rewards good technique without punishing mistakes. All-mountain performance in a narrower package with a tight turn radius.",
    action:"Add to Cart", link:null,
    sizes:[{label:"166cm",qty:0,hlId:101975},{label:"171cm",qty:0,hlId:101976}],
    images:["https://www.icelanticskis.com/cdn/shop/files/26-27_TORRENT_88_Topsheet_900x900.webp?v=1788327371","https://www.icelanticskis.com/cdn/shop/files/26-27_TORRENT_88_Base_900x900.webp?v=1788327371","https://www.icelanticskis.com/cdn/shop/files/26-27_TORRENT_88_Side_Profile_900x900.webp?v=1788327371","https://www.icelanticskis.com/cdn/shop/files/26-27_TORRENT_88_Detail_1_900x900.jpg?v=1789008139","https://www.icelanticskis.com/cdn/shop/files/26-27_TORRENT_88_Detail_2_900x900.webp?v=1788327371","https://www.icelanticskis.com/cdn/shop/files/26-27_TORRENT_88_Detail_3_900x900.webp?v=1788327372","https://www.icelanticskis.com/cdn/shop/files/Artboard2_e9d192ea-ca61-489a-9789-be075000db92_900x900.jpg?v=1789008065","https://www.icelanticskis.com/cdn/shop/files/Artboard4_7a279fbf-5d3f-456a-b44c-264427065661_900x900.jpg?v=1789008065"],
    longDesc:"The all-new Torrent 88 is built for intermediate to advanced skiers looking for a precise, snappy, and agile ride that rewards good technique without punishing mistakes. It blends strong edge engagement and excellent rebound to deliver all mountain performance in a narrower package with a tight turn radius. Whether you\'re carving high-angle turns on corduroy, weaving through bumps, or ducking into the tight trees, the Torrent 88 ensures each turn is packed with energy and precision. Poplar & Beech Wood Core, Custom V12 Carbon Matrix, 8 Carbon Stringers, Directional Rocker Profile. Original artwork by Travis Parr. Handmade in Golden, Colorado. Backed by Icelantic\'s 3-Year Bombproof Warranty.",
    specs:{"Brand":"Icelantic","Waist Width":"88mm","Dimensions (171cm)":"132 / 88 / 116 mm","Profile":"Directional Rocker","Core":"Poplar & Beech Wood + V12 Carbon Matrix","Turn Radius":"14-18m (by length)","Skill Level":"Beginner – Intermediate – Advanced – Expert","Terrain":"All-Mountain, Carve","Gender":"Men\'s","Country":"USA (Golden, CO)"}
  },
  {
    name:"Icelantic Torrent 96", brand:"Icelantic", price:849.99, customMsrp:849.99, customPrice:849.99, badge:"New", badgeType:"new", icon:"🎿",
    cat:"skis", sub:"icelantic", gender:"men", age:"adult", cond:"new", bindings:false, flatmount:true, popular:196,
    desc:"The most versatile, stable, and energetic all-mountain ski we\'ve ever built. A 96mm platform delivers confident carving, smooth soft-snow performance, and versatility from first-chair groomers to bumps to chop.",
    action:"Add to Cart", link:null,
    sizes:[{label:"166cm",qty:0,hlId:101973},{label:"171cm",qty:0,hlId:101974}],
    images:["https://www.icelanticskis.com/cdn/shop/files/1_TORRENT_96_Topsheet_900x900.webp?v=1788327519","https://www.icelanticskis.com/cdn/shop/files/2_TORRENT_96_Base_900x900.webp?v=1788327519","https://www.icelanticskis.com/cdn/shop/files/3_TORRENT_96_Side_Profile_900x900.webp?v=1788327519","https://www.icelanticskis.com/cdn/shop/files/4_TORRENT_96_Detail_2_900x900.webp?v=1788327519","https://www.icelanticskis.com/cdn/shop/files/5_TORRENT_96_Detail_3_900x900.webp?v=1788327519","https://www.icelanticskis.com/cdn/shop/files/26-27_TORRENT_96_Detail_1_900x900.jpg?v=1789008187","https://www.icelanticskis.com/cdn/shop/files/Artboard4_4f664d72-d913-4265-b57b-f6008b781b28_900x900.jpg?v=1789008537","https://www.icelanticskis.com/cdn/shop/files/Artboard2_b9f3f474-e4ab-4294-9214-4b4e3231d72f_900x900.jpg?v=1789008537"],
    longDesc:"The all-new, award-winning Torrent 96 is the most versatile, stable, and energetic all-mountain ski we have ever built. With a V-12 Carbon-reinforced construction and 96mm platform, it delivers confident carving, smooth soft-snow performance, and versatility from first-chair groomers to bumps to chop. Poplar & Beech Wood Core, Custom V12 Carbon Matrix, 8 Carbon Stringers, Directional Rocker Profile. Original artwork by Travis Parr. Handmade in Golden, Colorado. Backed by Icelantic\'s 3-Year Bombproof Warranty.",
    specs:{"Brand":"Icelantic","Waist Width":"96mm","Dimensions (166cm)":"137 / 96 / 121 mm","Profile":"Directional Rocker","Core":"Poplar & Beech Wood + V12 Carbon Matrix","Turn Radius":"15-19m (by length)","Skill Level":"Intermediate – Advanced – Expert","Terrain":"All-Mountain, Carve","Gender":"Men\'s","Country":"USA (Golden, CO)"}
  },
  {
    name:"Icelantic Nomad 94", brand:"Icelantic", price:799.99, customMsrp:799.99, customPrice:799.99, badge:"New", badgeType:"new", icon:"🎿",
    cat:"skis", sub:"icelantic", gender:"men", age:"adult", cond:"new", bindings:false, flatmount:true, popular:194,
    desc:"A poppy, playful, and nimble freeride ski built to jib and butter features all over the mountain. Delivers freestyle performance for park skiers and all-mountain freeriders alike.",
    action:"Add to Cart", link:null,
    sizes:[{label:"166cm",qty:0,hlId:101971},{label:"182cm",qty:0,hlId:101972}],
    images:["https://www.bobssportschalet.com/prodimages/121758-MULTI-l.jpg"],
    longDesc:"The Award-Winning Nomad 94 is built for the intermediate to expert level skier who wants a poppy, playful, and nimble tool to jib and butter features all over the mountain. It delivers freestyle performance ideal for park skiers and all-mountain freeriders alike. If you enjoy popping side hits, stomping switch landings, and slashing bumps, all while making sure you have enough edge for the groomer, then this is the ski for you. Poplar Wood Core for lightweight responsiveness and a smooth, playful flex. Free Rocker Profile for surfy float, easy pivoting, and freeride fun. 8 Carbon Stringers add extra pop, energy, and rebound. Fly-Cap Construction reduces swing weight and enhances maneuverability. Original artwork by Travis Parr. Handmade in Golden, Colorado. Backed by Icelantic\'s 3-Year Bombproof Warranty.",
    specs:{"Brand":"Icelantic","Waist Width":"94mm","Dimensions (166cm)":"129 / 94 / 121 mm","Profile":"Free Rocker","Core":"Poplar Wood + Fly-Cap Construction","Turn Radius":"15-20m (by length)","Skill Level":"Beginner – Intermediate – Advanced – Expert","Terrain":"Freeride, Park/Jib, All-Mountain","Gender":"Men\'s","Country":"USA (Golden, CO)"}
  },

  // ── JONES SNOWBOARDS ────────────────────────────────────────

  {
    name:"Salomon Dancehaul", brand:"Salomon", price:549.99, badge:"New", badgeType:"new", icon:"🏂",
    cat:"snowboards", sub:"salomon", gender:"unisex", age:"adult", cond:"new", flatmount:true, popular:189,
    desc:"Jones' all-mountain freestyle board. A directional twin shape with hybrid camber gives you the float of freeride and the playfulness of park — slash, spin, and charge everything.",
    action:"Add to Cart", link:null,
    sizes:[{label:"147cm",qty:0,hlId:101463},{label:"152cm",qty:0,hlId:101464},{label:"154cm",qty:0,hlId:101465},{label:"157cm",qty:0,hlId:101466}],
    images:["https://images.evo.com/imgp/700/268872/1190391/salomon-dancehaul-snowboard-2026-.jpg","https://images.evo.com/imgp/700/268872/1190390/salomon-dancehaul-snowboard-2026-.jpg","https://images.evo.com/imgp/700/268872/1190394/salomon-dancehaul-snowboard-2026-.jpg"],
    longDesc:"Turn up for the Dancehaul. This unisex all-mountain board has a mountain of personality for every riding style. Extra width and a tapered directional shape transform ordinary to extraordinary with maximum agility in any snow scenario. Rock Out Camber — flat between your bindings for stability, camber near your feet for response, and a rocker on the tip and tail for pressability — combined with a Popster Core and Ghost Basalt Stringers serve as a reminder that freestyle can happen anywhere on the mountain. A medium flex balances playfulness and response, fitting a variety of terrain and ability levels. Whether you\'re charging groomers, hunting side hits, or floating through powder, the Dancehaul brings the good times."
  },
  // ── KÄSTLE ADULTS ─────────────────────────────────────
  {
    name:"Kästle EX74", hlName:"Kastle EX74", brand:"Kästle", price:529.99, badge:"New", badgeType:"new", icon:"🎿",
    cat:"skis", sub:"kastle", gender:"unisex", age:"adult", cond:"new", bindings:true, flatmount:false, popular:191,
    desc:"Expert-level frontside carver from Kästle. 74mm waist delivers surgical precision on groomed runs.",
    action:"Add to Cart", link:null,
    sizes:[{label:"140cm",qty:0,hlId:100878},{label:"148cm",qty:0,hlId:100879},{label:"156cm",qty:0,hlId:100880},{label:"164cm",qty:0,hlId:100881},{label:"172cm",qty:0,hlId:100882}],
    images:["https://cdn.shoplightspeed.com/shops/648464/files/50592375/1652x2313x2/kastle-kastle-ex-74-skis-w-k10-slr-gw-bindings.jpg"],
    longDesc:"The EX74 is Kästle\'s expert-level frontside carver, purpose-built for skiers who crave surgical precision on groomed runs. At 74mm underfoot, it\'s one of the narrowest skis in the Kästle lineup, engineered for explosive short turns and confident long-radius carving at high speed. The Semi-Cap Sandwich Sidewall and Hollowtech Race technology ensure maximum edge grip and power transmission, while the Symbio Core keeps the ski lively and maneuverable. For committed piste skiers who want that World Cup feeling every run. Engineered and handcrafted in Austria.",
    longDesc:"The Shaman 99 is a modern evolution of one of Icelantic\'s most iconic shapes. Its tight turning radius, wide shovel, and powerful edge hold make it a carver\'s dream — built for skiers who want to lay deep trenches and drive through every turn. Icelantic updated the original Shaman with new materials, a tapered shape, and 8mm of camber underfoot for lively rebound. The rockered tip and tail keep the shovel from diving in deep snow, giving you a frontside-focused ride with genuine off-piste capability. Handmade in Denver, CO. Backed by Icelantic\'s 3-Year Bombproof Warranty.",
    specs:{"Waist Width":"74mm","Profile":"Camber","Core":"Poplar Beech + Titanal","Construction":"Sandwich Sidewall","Technology":"Hollowtech","Terrain":"On-Piste / Frontside","Skill Level":"Expert","Country":"Austria"},
    breakdown:[{label:"Skis (Kästle EX74)",amount:799},,{label:"Total",amount:799}]
  },
  {
    name:"Kästle RX9", hlName:"RX9", brand:"Kästle", price:499.99, customMsrp:950.0, customPrice:499.99, msrp:950.0, badge:"Race Feel", badgeType:"new", icon:"🎿",
    cat:"skis", sub:"kastle", gender:"unisex", age:"adult", cond:"new", bindings:true, flatmount:false, popular:190,
    desc:"World Cup-inspired all-mountain carver. Symbio Core with Titanal keeps it light, damp, and precise.",
    action:"Add to Cart", link:null,
    sizes:[{label:"150cm",qty:0,hlId:101042},{label:"156cm",qty:0,hlId:101041},{label:"162cm",qty:0,hlId:100012},{label:"168cm",qty:0,hlId:100013},{label:"174cm",qty:0,hlId:100014}],
    images:["https://kaestle.com/cdn/shop/files/rx9_01.jpg?v=1752671657","https://kaestle.com/cdn/shop/files/rx9_02.jpg?v=1752671656","https://kaestle.com/cdn/shop/files/rx9_03.jpg?v=1752671658","https://kaestle.com/cdn/shop/files/rx9_04.jpg?v=1752671657","https://kaestle.com/cdn/shop/files/rx9_05.jpg?v=1752671658"],
    longDesc:"The RX9 rounds out Kästle\'s legendary RX race-carving line, delivering World Cup-inspired performance in a more accessible package. Built with Kästle\'s Symbio Core — combining poplar wood, titanal, and a synthetic absorber — the RX9 is lightweight yet impressively stable, with Hollowtech Race technology reducing tip vibration by up to 30% for a smoother, more precise ride at speed. The Semi-Cap Sandwich Sidewall ensures excellent edge grip and direct power transmission across any groomed pitch. For piste lovers who want that unmistakable Kästle feel without the unforgiving nature of the RX11 or RX12, this is the one.",
    specs:{"Waist Width":"76mm","Dimensions":"118 / 76 / 106 mm","Profile":"Camber","Core":"Symbio Core — Titanal + Poplar Wood","Technology":"Hollowtech Race","Available Lengths":"150 · 156 · 162 · 168 · 174 cm","Skill Level":"Intermediate – Advanced","Terrain":"On-Piste / Frontside","Country":"Austria"},
    breakdown:[{label:"Skis (Kästle RX9)",amount:899},,{label:"Total",amount:899}]
  },
  {
    name:"Kästle M9 76", hlName:"M9 76", brand:"Kästle", price:829.99, badge:"", badgeType:"default", icon:"🎿",
    cat:"skis", sub:"kastle", gender:"unisex", age:"adult", cond:"new", bindings:true, flatmount:false, popular:185,
    desc:"Sporty and agile frontside ski. 76mm waist delivers quick edge transitions and confident grip on groomers.",
    action:"Add to Cart", link:null,
    sizes:[{label:"163cm",qty:0,hlId:101563}],
    images:["https://kaestle.com/cdn/shop/files/m976_01.jpg?v=1753783514&width=1000","https://kaestle.com/cdn/shop/files/m976_02.jpg?v=1753783514&width=1000","https://kaestle.com/cdn/shop/files/m976_03.jpg?v=1752663365"],
    longDesc:"The M9 76 is Kästle\'s narrowest all-mountain ski in the M9 line, built for skiers who love the frontside and want a quick, precise, carving-focused ride. Its tighter waist makes it lightning-fast edge to edge, with the same Power Zone Sidewall and Hollowtech 2.0 technology delivering the stability and dampening that Kästle is known for. A pure piste performer with the craftsmanship and engineering to back up every turn. Engineered and handcrafted in Austria.",
    specs:{"Waist Width":"76mm","Profile":"Rocker Tip / Camber","Core":"Poplar Beech Wood + Titanal","Technology":"Hollowtech 2.0","Terrain":"Frontside / Piste","Skill Level":"Intermediate – Expert","Country":"Austria"},
    breakdown:[{label:"Skis (Kästle M9 76)",amount:749},,{label:"Total",amount:749}]
  },
  {
    name:"Kästle M9 82", hlName:"M9 82", brand:"Kästle", price:829.99, badge:"", badgeType:"default", icon:"🎿",
    cat:"skis", sub:"kastle", gender:"unisex", age:"adult", cond:"new", bindings:true, flatmount:false, popular:186,
    desc:"Versatile all-mountain frontside ski. 82mm waist bridges piste precision and off-piste capability.",
    action:"Add to Cart", link:null,
    sizes:[{label:"161cm",qty:0,hlId:101561},{label:"168cm",qty:0,hlId:101562}],
    images:["https://skis.com/files/store/items/f/w/fw26-kastle-m9-skis-topsheet.jpg","https://kaestle.com/cdn/shop/files/m982_01.jpg?v=1753783511","https://kaestle.com/cdn/shop/files/m982_02.jpg?v=1753783511"],
    longDesc:"The M9 82 is engineered for sporty skiers who demand control and versatility across the entire front country. With an 82mm waist, Kästle\'s Power Zone Sidewall, and Hollowtech 2.0 technology, it delivers enhanced stability, reduced vibration, and precise power transmission in a ski equally capable on-piste and just off it. The Poplar Beech woodcore with double titanal layers gives a dynamic yet damp ride, providing the confidence to push hard at speed. Durable enough for daily use, refined enough for demanding conditions. Engineered and handcrafted in Austria.",
    specs:{"Waist Width":"82mm","Dimensions":"120 / 82 / 108 mm","Profile":"Rocker Tip / Camber","Core":"Poplar Beech Wood + Double Titanal","Technology":"Hollowtech 2.0","Terrain":"All-Mountain / Frontside","Skill Level":"Intermediate – Expert","Country":"Austria"},
    breakdown:[{label:"Skis (Kästle M9 82)",amount:799},,{label:"Total",amount:799}]
  },
  {
    name:"Kästle Quartz", hlName:"Quartz", brand:"Kästle", price:629.99, badge:"Women's", badgeType:"new", icon:"🎿",
    cat:"skis", sub:"kastle", gender:"women", age:"adult", cond:"new", bindings:true, flatmount:false, popular:183,
    desc:"Kästle's all-mountain ski built for women. Lightweight construction with Titanal for smooth, confident riding.",
    action:"Add to Cart", link:null,
    sizes:[{label:"144cm",qty:0,hlId:101543},{label:"156cm",qty:0,hlId:101544}],
    images:["https://cdn11.bigcommerce.com/s-gvjzgt2kex/images/stencil/1280x1280/products/5700/95368/132192_LG__75931.1741044664.jpg?c=1","https://kaestle.com/cdn/shop/files/quartz72_2_8c2e5258-eddf-4455-84dd-66c16dd0e473.jpg?v=1753783665"],
    longDesc:"The Kästle Quartz is a women\'s all-mountain ski built for riders who want a ski that performs across every condition the resort has to offer. Lightweight yet powerful, it delivers Kästle\'s signature edge grip and smooth ride in a shape tuned for women\'s skiing dynamics. A confident, versatile companion from groomed runs to light powder. Engineered and handcrafted in Austria.",
    specs:{"Profile":"Rocker / Camber","Core":"Poplar Wood + Titanal","Technology":"Hollowtech 2.0","Terrain":"All-Mountain","Skill Level":"Intermediate – Advanced","Country":"Austria"},
    breakdown:[{label:"Skis (Kästle Quartz)",amount:699},,{label:"Total",amount:699}]
  },
  {
    name:"Kästle Obsidian", hlName:"Obsidian", brand:"Kästle", price:629.99, badge:"All-Mountain", badgeType:"new", icon:"🎿",
    cat:"skis", sub:"kastle", gender:"unisex", age:"adult", cond:"new", bindings:false, flatmount:true, popular:182,
    desc:"Kästle's accessible all-mountain ski. Wood and titanal core offers the Kästle feel at a more accessible price point.",
    action:"Add to Cart", link:null,
    sizes:[{label:"148cm",qty:0,hlId:101540},{label:"155cm",qty:0,hlId:101541},{label:"162cm",qty:0,hlId:101542}],
    images:["https://d2j6dbq0eux0bg.cloudfront.net/images/115412582/products/741327117/4896357476.webp","https://d2j6dbq0eux0bg.cloudfront.net/images/115412582/products/741327117/4896355227.webp","https://kaestle.com/cdn/shop/files/obsidian92_2_08aa5258-43f0-4b67-9a37-16252d1a9f1e.jpg?v=1753783661"],
    longDesc:"The Kästle Obsidian 92 is designed for women who want to venture beyond the groomed runs without giving up the reliability and performance of a premium ski. Its robust semi-cap sandwich construction, Poplar Beech woodcore, Hollowtech 2.0, and Double Rocker profile deliver effortless float in powder and confident grip on firmer snow. A versatile all-mountain freeride ski that encourages exploration without demanding sacrifice. Engineered and handcrafted in Austria.",
    specs:{"Profile":"Double Rocker / Camber","Core":"Poplar Beech + Titanal","Technology":"Hollowtech 2.0","Terrain":"All-Mountain / Freeride","Skill Level":"Intermediate – Expert","Country":"Austria"},
    breakdown:[{label:"Skis (Kästle Obsidian)",amount:629.99},,{label:"Total",amount:629.99}]
  },
  {
    name:"Kästle Paragon 93", hlName:"Paragon 93", brand:"Kästle", price:849.99, customMsrp:849.99, customPrice:849.99, badge:"Expert", badgeType:"pop", icon:"🎿",
    cat:"skis", sub:"kastle", gender:"unisex", age:"adult", cond:"new", bindings:false, flatmount:true, popular:188,
    desc:"A true all-mountain ripper. Triple wood core with double Titanal — stability, dampness, and effortless float.",
    action:"Add to Cart", link:null,
    sizes:[{label:"170cm",qty:0,hlId:100005},{label:"177cm",qty:0,hlId:101535}],
    images:["https://kaestle.com/cdn/shop/files/paragon93_01.jpg?v=1717681083","https://kaestle.com/cdn/shop/files/paragon93_02.jpg?v=1717681083","https://kaestle.com/cdn/shop/files/paragon93_03.jpg?v=1717681083","https://kaestle.com/cdn/shop/files/paragon93_04.jpg?v=1717681083"],
    longDesc:"The Paragon 93 is Kästle\'s ultimate all-rounder — a titanal-reinforced freeride ski that blends effortless float with powerful carving performance. The Infini Core FREE with triple wood core and double titanal inlays delivers stability, dampening, and float in equal measure. Combined with Hollowtech 2.0, the Paragon yields maximum power transmission with a playful, surfy character thanks to its Double Rocker profile. Equally trusted on groomed blues and steep backcountry lines. Engineered and handcrafted in Austria.",
    specs:{"Waist Width":"93mm","Dimensions":"128 / 93 / 115 mm","Profile":"Double Rocker / Camber","Core":"Infini Core FREE — Triple Wood + Double Titanal","Technology":"Hollowtech 2.0","Available Lengths":"170 · 177 cm (in stock)","Skill Level":"Advanced – Expert","Terrain":"All-Mountain / Freeride","Country":"Austria"},
    breakdown:[{label:"Skis (Kästle Paragon 93)",amount:1099},,{label:"Total",amount:1099}]
  },
  {
    name:"Kästle MX 88", hlName:"MX 88", brand:"Kästle", price:1299.99, customMsrp:1299.99, customPrice:1299.99, badge:"Legendary", badgeType:"pop", icon:"🎿",
    cat:"skis", sub:"kastle", gender:"unisex", age:"adult", cond:"new", bindings:true, flatmount:false, popular:192,
    desc:"The most iconic Kästle. Double Titanal, long camber, Early Rise tip — the definitive all-mountain carver.",
    action:"Add to Cart", link:null,
    sizes:[{label:"167cm",qty:0,hlId:101188},{label:"174cm",qty:0,hlId:101189},{label:"181cm",qty:0,hlId:101190}],
    images:["https://kaestle.com/cdn/shop/files/mx88_01.jpg?v=1752664698","https://kaestle.com/cdn/shop/files/mx88_02.jpg?v=1752664698","https://kaestle.com/cdn/shop/files/mx88_06.jpg?v=1752664698","https://kaestle.com/cdn/shop/files/mx88_07.jpg?v=1752664698","https://kaestle.com/cdn/shop/files/mx88_08.jpg?v=1752664698"],
    longDesc:"The MX88 is Kästle\'s most legendary all-mountain ski — a true do-everything weapon for skiers who refuse to choose between piste and powder. Featuring an innovative sidecut, the redesigned Hollowtech EVO, Early Rise Technology, and a classic race-inspired sandwich construction, the MX88 delivers performance and stability across every type of terrain. From firm-snow groomers to choppy backcountry conditions, this ski is a commanding all-rounder built for skiers who demand the best. Engineered and handcrafted in Austria.",
    specs:{"Waist Width":"88mm","Profile":"Early Rise Tip / Camber","Core":"Infini Core AMTN — Poplar Beech + Double Titanal","Technology":"Hollowtech 3.0 Carbon","Available Lengths":"167 · 174 cm (in stock)","Skill Level":"Advanced – Expert","Terrain":"All-Mountain","Country":"Austria"},
    breakdown:[{label:"Skis (Kästle MX 88)",amount:1099},,{label:"Total",amount:1099}]
  },


  // ── KÄSTLE KIDS ───────────────────────────────────────
  {
    name:"Kästle RX12 Junior", brand:"Kästle", price:249.99, customMsrp:249.99, customPrice:249.99, badge:"Junior", badgeType:"new", icon:"🎿",
    cat:"skis", sub:"kastle", gender:"unisex", age:"kid", cond:"new", bindings:true, flatmount:false, popular:180,
    desc:"Race-inspired junior ski with Hollowtech 2.0 and premium wood core. Perfect for confident young carvers. Bindings included.",
    action:"Add to Cart", link:null,
    sizes:[{label:"100cm",qty:0,hlId:101569},{label:"110cm",qty:0,hlId:101570},{label:"120cm",qty:0,hlId:101571},{label:"130cm",qty:0,hlId:101572}],
    images:["https://kaestle.com/cdn/shop/files/rx12jr_1_442115a5-b4ae-4ead-ad70-fc454956ce86.jpg?v=1696327655","https://kaestle.com/cdn/shop/files/rx12jr_2_a7fd3f1b-4006-4760-b51b-9d899dc1b9a1.jpg?v=1696327655","https://kaestle.com/cdn/shop/files/rx12jr_3_a6ac39f5-be5e-4192-ad3a-d3b7fdf5fa52.jpg?v=1696333336","https://kaestle.com/cdn/shop/files/rx12jr_4_f06b4450-4f66-4ee2-bd42-e85c3d6e0df3.jpg?v=1696333335"],
    longDesc:"The RX12 Junior brings Kästle\'s legendary race-carving DNA to younger skiers. Built with Hollowtech technology and a race-inspired construction, it delivers real edge grip, direct power transmission, and the performance characteristics of the adult RX line in a junior-appropriate package. Perfect for ambitious young skiers who are ready to take the next step. Comes with bindings included. Engineered and handcrafted in Austria.",
    specs:{"Waist Width":"66mm","Dimensions":"98 / 66 / 86 mm","Profile":"Camber","Core":"Poplar Beech + PU","Technology":"Hollowtech Race 2.0","Available Lengths":"100 · 110 · 120 · 130 cm (in stock)","Bindings":"Included","Skill Level":"Intermediate – Advanced Junior","Country":"Austria"},
    breakdown:[{label:"Skis + Bindings (RX12 Jr)",amount:349},{label:"Tune & Wax",amount:0,note:"Free"},{label:"Total",amount:349}]
  },
  {
    name:"Kästle KX Holly", brand:"Kästle", price:239.99, customMsrp:239.99, customPrice:239.99, badge:"Kids", badgeType:"new", icon:"🎿",
    cat:"skis", sub:"kastle", gender:"unisex", age:"kid", cond:"new", bindings:true, flatmount:false, popular:179,
    desc:"First turns made easy! Holly's iconic ear tips help little ones ski parallel naturally.",
    action:"Add to Cart", link:null,
    sizes:[{label:"80cm",qty:0,hlId:101573},{label:"90cm",qty:0,hlId:101574}],
    images:["https://kaestle.com/cdn/shop/files/kx66_1_8d77c243-6969-4895-9a38-ffba384fa128.jpg?v=1696327471","https://kaestle.com/cdn/shop/files/kx66_2_4a9daf5e-e1c8-4d55-8684-cc6d497da97f.jpg?v=1696327471"],
    longDesc:"The KX Holly is Kästle\'s dedicated kids\' ski — built to give young riders a fun, confidence-inspiring platform as they develop their skills on the mountain. Lightweight and easy to maneuver, with a forgiving flex that encourages progression without frustration. A perfect first or second ski for junior skiers ready to explore. Engineered and handcrafted in Austria.",
    specs:{"Profile":"Hook-Free Shovel & Tail","Core":"Poplar Beech + Synthetic Absorber","Technology":"Hollowtech 2.0","Available Lengths":"80 · 90 cm","Skill Level":"Beginner","Country":"Austria"},
    breakdown:[{label:"Skis (KX Holly)",amount:199},{label:"Total",amount:199}]
  },
  {
    name:"Kästle ZX Alpha", brand:"Kästle", price:319.99, customMsrp:319.99, customPrice:319.99, badge:"Junior", badgeType:"default", icon:"🎿",
    cat:"skis", sub:"kastle", gender:"unisex", age:"kid", cond:"new", bindings:true, flatmount:false, popular:178,
    desc:"All-mountain junior freeride ski. Hook-free tips and Hollowtech 2.0 for playful, confident riding anywhere.",
    action:"Add to Cart", link:null,
    sizes:[{label:"139cm",qty:0,hlId:101585},{label:"149cm",qty:0,hlId:101586}],
    images:["https://kaestle.com/cdn/shop/files/zxalpha_1_441df320-6d5c-4137-9c55-83534177493c.jpg?v=1696327810","https://kaestle.com/cdn/shop/files/zxalpha_2_ef2d384a-5eaf-4588-ba9e-077bc6c503db.jpg?v=1696327810"],
    longDesc:"The ZX Alpha is Kästle\'s freeride benchmark — a wide, powerful ski built for riders who charge the mountain on their own terms. Designed with advanced freeride construction and a rocker profile that eats through untracked snow and variable off-piste terrain, the ZX Alpha delivers the float, stability, and control that serious freeride skiers demand. A flagship from one of Austria\'s most respected ski builders. Engineered and handcrafted in Austria.",
    specs:{"Profile":"Rocker / Camber","Core":"Poplar Beech + Synthetic Absorber","Technology":"Hollowtech 2.0","Terrain":"All-Mountain / Freeride","Available Lengths":"139 · 149 cm","Skill Level":"Intermediate – Advanced Junior","Country":"Austria"},
    breakdown:[{label:"Skis (Kästle ZX Alpha)",amount:299},,{label:"Total",amount:299}]
  }
];

const BINDINGS = [
  // ── XC BOOTS ─────────────────────────────────────────

  // ── SKI BOOTS ────────────────────────────────────────
  {
    name:"Roxa R/Fit 80", brand:"Roxa", price:349.99, badge:"", badgeType:"default", icon:"👟",
    cat:"ski-boots", sub:"alpineboots", gender:"men", age:"adult", cond:"new", popular:111,
    desc:"Men's versatile all-mountain boot. Balanced flex and comfortable fit for intermediate skiers.",
    action:"Add to Cart", link:null,
    sizes:[{label:"25.5",qty:0,hlId:100238},{label:"26.5",qty:0,hlId:100239},{label:"27.5",qty:0,hlId:100240},{label:"28.5",qty:0,hlId:100241},{label:"29.5",qty:0,hlId:100242}],
    images:["https://www.utahskigear.com/cdn/shop/files/RFIT80.jpg?v=1693330629&width=1800"],
    longDesc:"",
    specs:{"Brand":"Roxa","Model":"R/Fit 80","Flex":"80","Last Width":"Standard","Gender":"Men's","Skill Level":"Intermediate"},
    breakdown:[{label:"Boots",amount:349.99},{label:"Total",amount:349.99}]
  },
  {
    name:"Roxa R/Fit Hike 85W", brand:"Roxa", price:449.99, badge:"", badgeType:"default", icon:"👟",
    cat:"ski-boots", sub:"alpineboots", gender:"women", age:"adult", cond:"new", popular:112,
    desc:"Women's hiking-inspired alpine boot with walk mode. Great for skiers who want comfort on and off the hill.",
    action:"Add to Cart", link:null,
    sizes:[{label:"23.5",qty:0,hlId:100243},{label:"24.5",qty:0,hlId:100244},{label:"25.5",qty:0,hlId:100245},{label:"26.5",qty:0,hlId:100246}],
    images:["https://cdn11.bigcommerce.com/s-gvjzgt2kex/images/stencil/original/attribute_rule_images/26680_source_1745273743.jpg"],
    longDesc:"",
    specs:{"Brand":"Roxa","Model":"R/Fit Hike 85W","Flex":"85","Walk Mode":"Yes","Gender":"Women's","Skill Level":"Intermediate–Advanced"},
    breakdown:[{label:"Boots",amount:449.99},{label:"Total",amount:449.99}]
  },
  {
    name:"Roxa R/Fit Hike 90", brand:"Roxa", price:449.99, badge:"", badgeType:"default", icon:"👟",
    cat:"ski-boots", sub:"alpineboots", gender:"men", age:"adult", cond:"new", popular:113,
    desc:"Men's performance hiking boot with walk mode. Versatile for resort and backcountry approach.",
    action:"Add to Cart", link:null,
    sizes:[{label:"25.5",qty:0,hlId:100247},{label:"26.5",qty:0,hlId:100248},{label:"27.5",qty:0,hlId:100249},{label:"28.5",qty:0,hlId:100250},{label:"29.5",qty:0,hlId:100251}],
    images:["https://cdn11.bigcommerce.com/s-gvjzgt2kex/images/stencil/1280x1280/products/7183/96910/132601_BLACK-ORANGE_LG__71385.1730751067.jpg?c=1"],
    longDesc:"",
    specs:{"Brand":"Roxa","Model":"R/Fit Hike 90","Flex":"90","Walk Mode":"Yes","Gender":"Men's","Skill Level":"Intermediate–Advanced"},
    breakdown:[{label:"Boots",amount:449.99},{label:"Total",amount:449.99}]
  },
  {
    name:"Salomon Select HV 80W", brand:"Salomon", price:399.99, badge:"", badgeType:"default", icon:"👟",
    cat:"ski-boots", sub:"alpineboots", gender:"women", age:"adult", cond:"new", popular:114,
    desc:"Women's wide-fit performance boot. High volume last accommodates wider feet without sacrificing performance.",
    action:"Add to Cart", link:null,
    sizes:[{label:"24.5",qty:0,hlId:100724},{label:"25.5",qty:0,hlId:100725},{label:"26.5",qty:0,hlId:100726}],
    images:["https://images.evo.com/imgp/700/254080/1107008/salomon-s-pro-hv-90-w-ski-boots-women-s-2025-.jpg"],
    longDesc:"",
    specs:{"Brand":"Salomon","Model":"Select HV 80W","Flex":"80","Last Width":"High Volume","Gender":"Women's"},
    breakdown:[{label:"Boots",amount:399.99},{label:"Total",amount:399.99}]
  },
  {
    name:"Roxa R/Fit 100", brand:"Roxa", price:449.99, badge:"", badgeType:"new", icon:"👟",
    cat:"ski-boots", sub:"alpineboots", gender:"men", age:"adult", cond:"new", popular:148,
    desc:"High-performance all-mountain boot with a comfort-focused fit. 100 flex for advanced and expert skiers.",
    action:"Add to Cart", link:null,
    sizes:[{label:"25.5",qty:0,hlId:101045},{label:"26.5",qty:0,hlId:101046},{label:"27.5",qty:0,hlId:101047},{label:"28.5",qty:0,hlId:101048}],
    images:["https://www.roxa.com/wp-content/uploads/2025/06/RFIT-HV-100-1.webp"],
    longDesc:"",
    specs:{"Brand":"Roxa","Flex Index":"100","Last Width":"102mm (High Volume)","Architecture":"2-Piece Overlap","Walk Mode":"Yes","Gender":"Men's","Skill Level":"Intermediate–Advanced","Country":"Italy"},
    breakdown:[{label:"Boots",amount:449.99},{label:"Total",amount:449.99}]
  },
  {
    name:"Roxa R/Fit MV 110", brand:"Roxa", price:649.99, badge:"New", badgeType:"new", icon:"👟",
    cat:"ski-boots", sub:"alpineboots", gender:"men", age:"adult", cond:"new", popular:152,
    desc:"High-performance men's boot with a medium volume fit. 110 flex delivers maximum power transmission for advanced and expert skiers.",
    action:"Add to Cart", link:null,
    sizes:[
      {label:"26.5", qty:0, hlId:100252},
      {label:"27.5", qty:0, hlId:100253},
      {label:"28.5", qty:0, hlId:100254},
      {label:"29.5", qty:0, hlId:100255},
    ],
    images:[
      "https://cdn11.bigcommerce.com/s-8p220y2h7i/images/stencil/608x608/products/72621/95945/3__05143.1727116205.JPG?c=2",
      "https://cdn11.bigcommerce.com/s-8p220y2h7i/images/stencil/608x608/products/72621/95946/4__05844.1727116197.jpg?c=2",
      "https://cdn11.bigcommerce.com/s-8p220y2h7i/images/stencil/608x608/products/72621/95947/5__30050.1727116189.JPG?c=2"
    ],
    longDesc:"",
    specs:{"Brand":"Roxa","Model":"R/Fit MV 110","Flex Index":"110","Last Width":"Medium Volume","Gender":"Men's","Skill Level":"Advanced–Expert"},
    breakdown:[{label:"Boots",amount:649.99},{label:"Total",amount:649.99}]
  },
  {
    name:"Roxa Trinity 95", brand:"Roxa", price:299.99, customMsrp:299.99, customPrice:299.99, badge:"New", badgeType:"new", icon:"👟",
    cat:"ski-boots", sub:"alpineboots", gender:"women", age:"adult", cond:"new", popular:153,
    desc:"Women's high-energy all-mountain boot built on Roxa's 3-piece Next Gen Cabrio architecture. Lightweight, versatile, and built for aggressive all-mountain skiing.",
    action:"Add to Cart", link:null,
    sizes:[
      {label:"23.5", qty:0, hlId:101175},
      {label:"24.5", qty:0, hlId:101176},
      {label:"25.5", qty:0, hlId:101177},
      {label:"26.5", qty:0, hlId:101178},
      {label:"27.5", qty:0, hlId:101179},
    ],
    images:[
      "https://www.christysports.com/dw/image/v2/BGBB_PRD/on/demandware.static/-/Sites-master-winter/default/dwf9f6680e/8101098_050_1.jpg?sw=1600&sh=1600"
    ],
    longDesc:"",
    specs:{"Brand":"Roxa","Model":"Trinity 95","Flex Index":"95","Architecture":"3-Piece Next Gen Cabrio","Gender":"Women's","Skill Level":"Advanced"},
    breakdown:[{label:"Boots",amount:299.99},{label:"Total",amount:299.99}]
  },
  {
    name:"Roxa R/Fit HV 75", brand:"Roxa", price:349.99, badge:"New", badgeType:"new", icon:"👟",
    cat:"ski-boots", sub:"alpineboots", gender:"women", age:"adult", cond:"new", popular:154,
    desc:"Women's high-volume boot with a soft, approachable 75 flex. Comfortable fit built for intermediate skiers with wider feet.",
    action:"Add to Cart", link:null,
    sizes:[
      {label:"22.5", qty:0, hlId:101327},
      {label:"23.5", qty:0, hlId:101328},
      {label:"24.5", qty:0, hlId:101329},
      {label:"25.5", qty:0, hlId:101330},
      {label:"26.5", qty:0, hlId:101331},
      {label:"27.5", qty:0, hlId:102071},
    ],
    images:[
      "https://cdn11.bigcommerce.com/s-gvjzgt2kex/images/stencil/1280x1280/products/9347/179574/145223_BLACK-AQUA_LG__20758.1752095426.jpg?c=1"
    ],
    longDesc:"",
    specs:{"Brand":"Roxa","Model":"R/Fit HV 75","Flex Index":"75","Last Width":"High Volume","Gender":"Women's","Skill Level":"Intermediate"},
    breakdown:[{label:"Boots",amount:349.99},{label:"Total",amount:349.99}]
  },
  {
    name:"Roxa R/Fit HV 80", brand:"Roxa", price:349.99, badge:"New", badgeType:"new", icon:"👟",
    cat:"ski-boots", sub:"alpineboots", gender:"men", age:"adult", cond:"new", popular:155,
    desc:"Men's high-volume boot with easy-entry design and a balanced 80 flex. Comfortable all-mountain fit for intermediate skiers with wider feet.",
    action:"Add to Cart", link:null,
    sizes:[
      {label:"25.5", qty:0, hlId:101335},
      {label:"26.5", qty:0, hlId:101336},
      {label:"27.5", qty:0, hlId:101337},
      {label:"28.5", qty:0, hlId:101852},
      {label:"29.5", qty:0, hlId:101853},
      {label:"30.5", qty:0, hlId:102072},
    ],
    images:[
      "https://www.roxa.com/wp-content/uploads/2025/06/RFIT-HV-80-763x1024.webp",
      "https://www.roxa.com/wp-content/uploads/2025/06/RFIT-HV-80_Easy-entry-240x300.webp"
    ],
    longDesc:"",
    specs:{"Brand":"Roxa","Model":"R/Fit HV 80","Flex Index":"80","Last Width":"High Volume","Entry":"Easy Entry","Gender":"Men's","Skill Level":"Intermediate"},
    breakdown:[{label:"Boots",amount:349.99},{label:"Total",amount:349.99}]
  },
  {
    name:"Roxa Element 120", brand:"Roxa", price:724.99, badge:"New", badgeType:"new", icon:"👟",
    cat:"ski-boots", sub:"alpineboots", gender:"men", age:"adult", cond:"new", popular:156,
    desc:"High-performance race-inspired men's boot. 120 flex delivers maximum precision and power for expert skiers.",
    action:"Add to Cart", link:null,
    sizes:[
      {label:"26.5", qty:0, hlId:101863},
      {label:"27.5", qty:0, hlId:101864},
      {label:"28.5", qty:0, hlId:101865},
      {label:"29.5", qty:0, hlId:101866},
    ],
    images:[
      "https://bootfitters.com/files/styles/mug/public/images/boots/element_120_u75.png"
    ],
    longDesc:"",
    specs:{"Brand":"Roxa","Model":"Element 120","Flex Index":"120","Gender":"Men's","Skill Level":"Expert"},
    breakdown:[{label:"Boots",amount:724.99},{label:"Total",amount:724.99}]
  },
  {
    name:"Roxa R/Fit Pro 110", brand:"Roxa", price:649.99, badge:"New", badgeType:"new", icon:"👟",
    cat:"ski-boots", sub:"alpineboots", gender:"men", age:"adult", cond:"new", popular:157,
    desc:"High-performance men's boot with a 110 flex. Precise, race-inspired fit for advanced and expert skiers who want maximum power.",
    action:"Add to Cart", link:null,
    sizes:[
      {label:"25.5", qty:0, hlId:101855},
      {label:"26.5", qty:0, hlId:101856},
      {label:"27.5", qty:0, hlId:101857},
      {label:"28.5", qty:0, hlId:101858},
    ],
    images:[
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUwTtCr-goC9TfuDsWQnyQDos9zq2dmPSGpKd0DALDhgPcNsjvRG5VgmI&s=10"
    ],
    longDesc:"",
    specs:{"Brand":"Roxa","Model":"R/Fit Pro 110","Flex Index":"110","Gender":"Men's","Skill Level":"Advanced–Expert"},
    breakdown:[{label:"Boots",amount:649.99},{label:"Total",amount:649.99}]
  },
  {
    name:"Roxa R/Fit Pro 120", brand:"Roxa", price:699.99, badge:"New", badgeType:"new", icon:"👟",
    cat:"ski-boots", sub:"alpineboots", gender:"men", age:"adult", cond:"new", popular:158,
    desc:"Race-level men's boot with a 120 flex. Built for expert skiers who demand maximum precision and power transmission.",
    action:"Add to Cart", link:null,
    sizes:[
      {label:"26.5", qty:0, hlId:101362},
      {label:"30.5", qty:0, hlId:101361},
    ],
    images:[
      "https://content.backcountry.com/images/items/900/RXA/RXAC04A/DKGREORA.jpg",
      "https://content.backcountry.com/images/items/1200/RXA/RXAC04A/DKGREORA_D2.jpg",
      "https://content.backcountry.com/images/items/1200/RXA/RXAC04A/DKGREORA_D1.jpg"
    ],
    longDesc:"",
    specs:{"Brand":"Roxa","Model":"R/Fit Pro 120","Flex Index":"120","Gender":"Men's","Skill Level":"Expert"},
    breakdown:[{label:"Boots",amount:699.99},{label:"Total",amount:699.99}]
  },
  {
    name:"Roxa R/Fit Pro 85 W", brand:"Roxa", price:449.99, badge:"New", badgeType:"new", icon:"👟",
    cat:"ski-boots", sub:"alpineboots", gender:"women", age:"adult", cond:"new", popular:159,
    desc:"Women's performance boot with an 85 flex. Precise, race-inspired fit for intermediate to advanced skiers.",
    action:"Add to Cart", link:null,
    sizes:[
      {label:"24.5", qty:0, hlId:101854},
    ],
    images:[
      "https://cdn11.bigcommerce.com/s-eoq23gh9op/images/stencil/1280x1280/products/241/662/RFIT-PRO-85-W__63210.1698828184.jpg?c=1?imbypass=on"
    ],
    longDesc:"",
    specs:{"Brand":"Roxa","Model":"R/Fit Pro 85 W","Flex Index":"85","Gender":"Women's","Skill Level":"Intermediate–Advanced"},
    breakdown:[{label:"Boots",amount:449.99},{label:"Total",amount:449.99}]
  },

  // ── XC CROSS-COUNTRY ──────────────────────────────────
  {
    name:"Rossignol X-5 OT", brand:"Rossignol", price:199.99, customMsrp:199.99, customPrice:199.99, badge:"New", badgeType:"new", icon:"🥾",
    cat:"xc", sub:"boots", gender:"men", age:"adult", cond:"new", popular:200,
    desc:"Men's Rossignol X-5 OT (Off Track) cross-country boot. Bridges the gap between on-trail and backcountry touring with comfort and warmth for recreational XC skiers.",
    longDesc:"The Rossignol X-5 OT bridges the gap between on-trail cruising and off-track adventure. Built for recreational XC skiers who want to explore beyond groomed trails, it delivers reliable warmth and comfort mile after mile, whatever the terrain throws at you.",
    action:"Add to Cart", link:null,
    sizes:[
      {label:"40", qty:0, hlId:101730},
      {label:"41", qty:0, hlId:101731},
      {label:"47", qty:0, hlId:101732},
      {label:"48", qty:0, hlId:101733},
    ],
    images:[
      "https://www.rei.com/media/c006763d-a8f0-4c32-98b8-ff75b3fc74fe?size=2000",
      "https://www.rei.com/media/65b92ad3-713e-444c-9ee0-4314af282543?size=2000",
      "https://www.rei.com/media/50e79415-c17b-40c9-867d-e622ca05bbf9?size=2000",
      "https://www.rei.com/media/c7875418-0a98-4546-9ccc-fb801b67aa37?size=2000",
      "https://www.rei.com/media/c29ea9e6-b166-4c0f-8802-1fc5e38c4265?size=2000",
      "https://www.rei.com/media/7f7b49ec-6411-4cb7-a583-2e2a73421b1d?size=2000"
    ],
    specs:{"Brand":"Rossignol","Model":"X-5 OT","Compatibility":"NNN / TURNAMIC / Prolink","Terrain":"On-Trail / Off-Track","Gender":"Men's"}
  },
  {
    name:"Rossignol BC X10", brand:"Rossignol", price:249.99, customMsrp:249.99, customPrice:249.99, badge:"New", badgeType:"new", icon:"🥾",
    cat:"xc", sub:"boots", gender:"unisex", age:"adult", cond:"new", popular:202,
    desc:"Backcountry cross-country boot built for off-track touring and downhill control. Insulated, thermo-moldable construction with a hinged external cuff for stability in untracked snow.",
    longDesc:"Set your own tracks in the Rossignol BC X10 backcountry ski boot. The lightweight design blends touring mobility with downhill control in an insulated, thermo-moldable build. A pre-molded, hinged external cuff provides stability and control in untracked snow, while a wide Rottefella Nordic BC sole delivers reliable grip across varied snow conditions. A tall gaiter and lace cover keep snow out and feet dry, and 3M Thinsulate insulation locks in warmth for cold, damp days on the trail.",
    action:"Add to Cart", link:null,
    sizes:[
      {label:"37.0", qty:0, hlId:101739},
      {label:"38.0", qty:0, hlId:100140},
      {label:"39.0", qty:0, hlId:100141},
      {label:"41.0", qty:0, hlId:100142},
      {label:"42.0", qty:0, hlId:100143},
      {label:"43.0", qty:0, hlId:100144},
      {label:"44.0", qty:0, hlId:100145},
      {label:"46.0", qty:0, hlId:101740},
      {label:"47.0", qty:0, hlId:101741},
      {label:"48.0", qty:0, hlId:100146},
    ],
    images:[
      "https://bouldernordic.com/cdn/shop/products/pkm8j2rc6chqjbhmbwsm.jpg?v=1697661775&width=580",
      "https://bouldernordic.com/cdn/shop/products/qadwcttzrmerng0xhcha.jpg?v=1697661775&width=580",
      "https://bouldernordic.com/cdn/shop/products/m9y7bn3adviwgnwss9ul.jpg?v=1697661775&width=580",
      "https://bouldernordic.com/cdn/shop/products/tnuouts9ketuvauptuvt.jpg?v=1697661775&width=580"
    ],
    specs:{"Brand":"Rossignol","Model":"BC X10","Compatibility":"NNN BC","Insulation":"3M Thinsulate","Terrain":"Off-Track Touring","Gender":"Unisex"}
  },
  {
    name:"Rossignol BC X6", brand:"Rossignol", price:224.99, customMsrp:224.99, customPrice:224.99, badge:"New", badgeType:"new", icon:"🥾",
    cat:"xc", sub:"boots", gender:"unisex", age:"adult", cond:"new", popular:203,
    desc:"Lightweight backcountry touring boot blending off-track mobility with downhill control. Insulated, thermo-moldable build with a hinged external cuff for stability in untracked snow.",
    longDesc:"Set your own tracks in the Rossignol BC X6 backcountry ski boot. The lightweight design blends touring mobility with downhill control in an insulated, thermo-moldable build. The pre-molded and hinged external cuff provides stability and control in untracked snow, while a wide Rottefella Nordic BC sole delivers the stability needed for wider skis and varied snow conditions. A tall external gaiter and lace cover seal out snow for dry feet, with a Thinsulate lining to keep you warm.",
    action:"Add to Cart", link:null,
    sizes:[
      {label:"38.0", qty:0, hlId:101724},
      {label:"41.0", qty:0, hlId:100147},
      {label:"42.0", qty:0, hlId:101706},
      {label:"43.0", qty:0, hlId:100148},
      {label:"44.0", qty:0, hlId:100149},
      {label:"45.0", qty:0, hlId:100150},
      {label:"46.0", qty:0, hlId:100151},
      {label:"47.0", qty:0, hlId:100152},
    ],
    images:[
      "https://cdn.shoplightspeed.com/shops/634612/files/28296120/bc-x-6.jpg",
      "https://cdn.shoplightspeed.com/shops/634612/files/28296119/bc-x-6.jpg",
      "https://cdn.shoplightspeed.com/shops/634612/files/28296115/bc-x-6.jpg",
      "https://cdn.shoplightspeed.com/shops/634612/files/28296114/bc-x-6.jpg"
    ],
    specs:{"Brand":"Rossignol","Model":"BC X6","Compatibility":"NNN BC","Insulation":"3M Thinsulate","Terrain":"Off-Track Touring","Gender":"Unisex"}
  },
  {
    name:"Rossignol Evo OT 65", brand:"Rossignol", price:399.99, customMsrp:399.99, customPrice:399.99, badge:"New", badgeType:"new", icon:"🎿",
    cat:"xc", sub:"skis", gender:"unisex", age:"adult", cond:"new", popular:204,
    desc:"Positrack cross-country ski with TURNAMIC bindings. A shorter, wider build for enhanced stability and maneuverability on groomed and ungroomed trails alike.",
    longDesc:"The Rossignol Evo OT 65 Positrack cross-country ski makes kick-and-glide easy, with a shorter length and wider dimensions that boost stability and maneuverability on and off the beaten trail. A wood air core keeps things light and durable, and the waxless Positrack base delivers a reliable blend of grip and glide in any condition — no kick wax required. Includes TURNAMIC bindings, compatible with NNN and Prolink boot soles.",
    action:"Add to Cart", link:null,
    sizes:[
      {label:"165cm", qty:0, hlId:100330},
      {label:"185cm", qty:0, hlId:100331},
      {label:"195cm", qty:0, hlId:100332},
    ],
    images:[
      "https://cdn.shopify.com/s/files/1/0670/5135/6456/files/2025-rossignol-evo-ot-65-skis-w-control-step-in-b-rtmzd03-rtmzd03.jpg?v=1769186339&width=1200&height=1200&crop=center",
      "https://cdn.mos.cms.futurecdn.net/esmjuPuwNLzqjYBPdZXDQ3.jpeg"
    ],
    specs:{"Brand":"Rossignol","Model":"Evo OT 65","Base":"Positrack (Waxless)","Core":"Wood Air Core","Bindings":"TURNAMIC (Included)","Compatibility":"NNN / TURNAMIC / Prolink","Terrain":"XC Groomed and Ungroomed"}
  },
  {
    name:"Rossignol Evo Action XC55", brand:"Rossignol", price:299.99, customMsrp:299.99, customPrice:299.99, badge:"New", badgeType:"new", icon:"🎿",
    cat:"xc", sub:"skis", gender:"unisex", age:"adult", cond:"new", popular:205,
    desc:"R-Skin cross-country ski with Control Step-In bindings. Built-in mohair skins mean reliable kick and glide with no waxing required.",
    longDesc:"The Rossignol Evo Action XC55 R-Skin pairs an easy, reliable kick with smooth glide thanks to built-in mohair skin inserts — no kick wax prep needed before you hit the trail. The Control Step-In binding system makes getting in and out of your skis fast and simple, so you can spend less time fiddling and more time on snow.",
    action:"Add to Cart", link:null,
    sizes:[
      {label:"165cm", qty:0, hlId:101709},
    ],
    images:[
      "https://cdn.shopify.com/s/files/1/0510/1705/6454/files/ROSSIGNOL-EVO-XC-55-R-SKIN-CONTROL-STEP-IN-CROSS-COUNTRY-SKI-2023-1-min.jpg?v=1749738729"
    ],
    specs:{"Brand":"Rossignol","Model":"Evo Action XC55","Base":"R-Skin (Mohair)","Bindings":"Control Step-In (Included)","Terrain":"XC Groomed and Ungroomed"}
  },
  {
    name:"Rossignol Evo XT 65", brand:"Rossignol", price:289.99, customMsrp:289.99, customPrice:289.99, badge:"New", badgeType:"new", icon:"🎿",
    cat:"xc", sub:"skis", gender:"unisex", age:"adult", cond:"new", popular:206,
    desc:"Positrack cross-country ski with Control Step-In bindings. Shorter length and wide dimensions enhance stability and maneuverability for beginners exploring off-piste trails.",
    longDesc:"Kick and glide is made easy with the Rossignol Evo XT 65 Positrack cross-country ski. A shorter length and wide dimensions boost stability and maneuverability, making it a great choice for riders looking to cruise snow-covered trails with confidence. Includes Control Step-In bindings for fast, easy step-in convenience.",
    action:"Add to Cart", link:null,
    sizes:[
      {label:"175cm", qty:0, hlId:101707},
      {label:"185cm", qty:0, hlId:101708},
    ],
    images:[
      "https://cdn.shopify.com/s/files/1/0670/5135/6456/files/2026-rossignol-evo-xt-65-skis-w-control-step-in-bindings-rtozd01-1-rtozd01.jpg?v=1772551314"
    ],
    specs:{"Brand":"Rossignol","Model":"Evo XT 65","Base":"Positrack (Waxless)","Bindings":"Control Step-In (Included)","Terrain":"XC Groomed and Ungroomed"}
  },

  // ── SNOWBOARD BINDINGS ───────────────────────────────
  {
    name:"Rossignol Myth Binding", brand:"Rossignol", price:179.99, badge:"", badgeType:"default", icon:"🏂",
    cat:"bindings", sub:"snowboard-binding", gender:"unisex", age:"adult", cond:"new", popular:72,
    desc:"Lightweight puffy all-mountain binding from Rossignol. Easy-entry buckle system with a soft flex for comfort-focused riders.",
    action:"Add to Cart", link:null,
    sizes:[{label:"S/M",qty:0,hlId:100348}],
    images:["https://i5.walmartimages.com/seo/Rossignol-Women-s-Myth-Durable-Lightweight-Puffy-Snowboard-Bindings-with-Buckles-One-Size-Small-Medium_da476f2c-68da-46f6-817a-b51ace5e1193.8d8a8591620c891d3cc77cc9a1e75b94.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF","https://i5.walmartimages.com/asr/748fffdd-57d1-419b-94f8-5ccc8de8674d.0f8a9e6b16b385f9a5492e95d7b97950.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF","https://i5.walmartimages.com/asr/904d6f36-bab2-49a8-8581-e3f2f32b06c3.1c83bfdc8ee9e1958285fd57c283fd64.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF"],
    longDesc:"",
    specs:{"Brand":"Nidecker","Model":"Myth","Flex":"Medium","Sizes":"S/M"},
    breakdown:[{label:"Binding",amount:179.99},{label:"Professional Mount",amount:0,note:"Free"},{label:"Total",amount:179.99}]
  },
  {
    name:"Nidecker Fuse Binding", brand:"Nidecker", price:299.99, customMsrp:299.99, customPrice:299.99, badge:"", badgeType:"default", icon:"🏂",
    cat:"bindings", sub:"snowboard-binding", gender:"unisex", age:"adult", cond:"new", popular:73,
    desc:"High-performance all-mountain binding from Nidecker. Stiff, responsive chassis built for powerful, aggressive riding in any condition.",
    action:"Add to Cart", link:null,
    sizes:[{label:"M",qty:0,hlId:100547},{label:"L",qty:0,hlId:100548},{label:"XL",qty:0,hlId:100549}],
    images:["https://images.evo.com/imgp/700/253910/1102369/nidecker-fuse-fusion-snowboard-bindings-.jpg","https://images.evo.com/imgp/700/253910/1102373/nidecker-fuse-fusion-snowboard-bindings-.jpg","https://images.evo.com/imgp/700/253910/1102365/nidecker-fuse-fusion-snowboard-bindings-.jpg","https://images.evo.com/imgp/700/253910/1102366/nidecker-fuse-fusion-snowboard-bindings-.jpg"],
    longDesc:"",
    specs:{"Brand":"Nidecker","Model":"Fuse","Flex":"Stiff"},
    breakdown:[{label:"Binding",amount:299.99},{label:"Professional Mount",amount:0,note:"Free"},{label:"Total",amount:299.99}]
  },
  {
    name:"Salomon Rhythm Binding", brand:"Salomon", price:179.99, customMsrp:179.99, customPrice:179.99, badge:"", badgeType:"default", icon:"🏂",
    cat:"bindings", sub:"snowboard-binding", gender:"unisex", age:"adult", cond:"new", popular:71,
    desc:"Medium-flex all-mountain binding from Salomon. Smooth, forgiving feel with easy strap entry — great for park and groomer laps. Available in Lichen Green, Black, White, and Huckleberry.",
    action:"Add to Cart", link:null,
    colorways:[
      {label:"Lichen Green", image:"https://images.evo.com/imgp/700/221536/1112417/salomon-rhythm-snowboard-bindings-.jpg"},
      {label:"Black",        image:"https://cdn.dam.salomon.com/8f67d080-59ec-40f3-9162-b2f4013b6431/L41777400/PNG-2000px-max-72dpi.png?width=1200&fit=cover&optimize=medium&bg-color=f5f5f5&format=pjpg&auto=avif&canvas=116p%2C144p"},
      {label:"White",        image:"https://cdn.dam.salomon.com/7ac8de2f-62ee-4944-92cb-b2f4013ba772/L41777500/PNG-2000px-max-72dpi.png?width=1200&fit=cover&optimize=medium&bg-color=f5f5f5&format=pjpg&auto=avif&canvas=116p%2C144p"},
      {label:"Huckleberry",  image:"https://cdn.dam.salomon.com/73992a23-2fba-428c-a6bd-b36001082e70/L45450400/PNG-2000px-max-72dpi.png?width=1200&fit=cover&optimize=medium&bg-color=f5f5f5&format=pjpg&auto=avif&canvas=116p%2C144p"},
    ],
    sizes:[{label:"S",qty:0,hlId:100712},{label:"M",qty:0,hlId:100710},{label:"L",qty:0,hlId:100711}],
    images:["https://images.evo.com/imgp/700/221536/1112417/salomon-rhythm-snowboard-bindings-.jpg","https://images.evo.com/imgp/700/221536/1112418/salomon-rhythm-snowboard-bindings-.jpg","https://cdn.dam.salomon.com/8f67d080-59ec-40f3-9162-b2f4013b6431/L41777400/PNG-2000px-max-72dpi.png?width=1200&fit=cover&optimize=medium&bg-color=f5f5f5&format=pjpg&auto=avif&canvas=116p%2C144p","https://cdn.dam.salomon.com/abce3b2b-a6c9-4a96-927d-b2f4013b8ce7/L41777400/PNG-2000px-max-72dpi.png?width=2000&fit=cover&optimize=low&bg-color=transparent&format=pjpg&canvas=116p%2C144p","https://cdn.dam.salomon.com/cc7c3358-0b21-4f4d-a926-b2f800ae0781/L41777400/PNG-2000px-max-72dpi.png?width=2000&fit=cover&optimize=low&bg-color=transparent&format=pjpg&canvas=116p%2C144p","https://cdn.dam.salomon.com/7ac8de2f-62ee-4944-92cb-b2f4013ba772/L41777500/PNG-2000px-max-72dpi.png?width=1200&fit=cover&optimize=medium&bg-color=f5f5f5&format=pjpg&auto=avif&canvas=116p%2C144p","https://cdn.dam.salomon.com/76af561d-1e6b-41e0-93e6-b2f4013bc8e3/L41777500/PNG-2000px-max-72dpi.png?width=640&fit=cover&optimize=medium&bg-color=f5f5f5&format=pjpg&auto=avif&canvas=116p%2C144p","https://cdn.dam.salomon.com/e61c6cca-bab2-43d8-bac4-b2f800adacff/L41777500/PNG-2000px-max-72dpi.png?width=640&fit=cover&optimize=medium&bg-color=f5f5f5&format=pjpg&auto=avif&canvas=116p%2C144p","https://cdn.dam.salomon.com/73992a23-2fba-428c-a6bd-b36001082e70/L45450400/PNG-2000px-max-72dpi.png?width=1200&fit=cover&optimize=medium&bg-color=f5f5f5&format=pjpg&auto=avif&canvas=116p%2C144p","https://cdn.dam.salomon.com/162e84d5-e47d-4138-8274-b40300dca272/L45450400/PNG-2000px-max-72dpi.png?width=640&fit=cover&optimize=medium&bg-color=f5f5f5&format=pjpg&auto=avif&canvas=116p%2C144p","https://cdn.dam.salomon.com/d05b6e5e-6492-4250-9820-b40300dca7a2/L45450400/PNG-2000px-max-72dpi.png?width=640&fit=cover&optimize=medium&bg-color=f5f5f5&format=pjpg&auto=avif&canvas=116p%2C144p"],
    longDesc:"",
    specs:{"Brand":"Salomon","Model":"Rhythm","Flex":"Medium","Colors":"Lichen Green, Black, White, Huckleberry"},
    breakdown:[{label:"Binding",amount:179.99},{label:"Professional Mount",amount:0,note:"Free"},{label:"Total",amount:179.99}]
  },

  // ── GORDINI GLOVES ───────────────────────────────────

  // ── ROSSIGNOL SNOWBOARD BINDINGS (additional) ────────────

  {
    name:"Rossignol Works Binding", brand:"Rossignol", price:179.99, customMsrp:179.99, customPrice:179.99, badge:"", badgeType:"default", icon:"🔩",
    cat:"bindings", sub:"snowboard-binding", gender:"unisex", age:"adult", cond:"new", popular:162,
    desc:"Rossignol Works all-mountain snowboard binding. Medium-stiff flex, reliable performance, and comfortable all-day fit.",
    action:"Add to Cart", link:null,
    sizes:[{label:"M",qty:0,hlId:101778}],
    images:["https://www.rossignol.com/dw/image/v2/BJJZ_PRD/on/demandware.static/-/Sites-rossignol-catalog/default/dwb2c92e3d/images/large/RGPC210000_72DPI_01_v00.jpg?sw=1200&sh=1200","https://www.rossignol.com/dw/image/v2/BJJZ_PRD/on/demandware.static/-/Sites-rossignol-catalog/default/dwe95b1443/images/large/RGPC210000_72DPI_02_v00.jpg?sw=1200&sh=1200"],
    specs:{"Brand":"Rossignol","Flex":"Medium-Stiff","Color":"Black and Grey"}
  },
  {
    name:"Rossignol Ultraviolet Binding", brand:"Rossignol", price:179.99, customMsrp:179.99, customPrice:179.99, badge:"", badgeType:"default", icon:"🔩",
    cat:"bindings", sub:"snowboard-binding", gender:"unisex", age:"adult", cond:"new", popular:161,
    desc:"Rossignol Ultraviolet all-mountain snowboard binding. Medium flex, lightweight, easy all-day ride.",
    action:"Add to Cart", link:null,
    sizes:[{label:"S/M",qty:0,hlId:101775}],
    images:["https://www.philbricks.com/cdn/shop/files/jpwzk6eacykcfzrvimjq_535x.jpg?v=1776807735","https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/BCJK_STG/on/demandware.static/-/Sites-global-master-catalog/default/dwcbd37baa/images/large/1149370_2.jpg?sw=800&sh=800"],
    specs:{"Brand":"Rossignol","Flex":"Medium","Color":"Black"}
  },
  {
    name:"Rossignol Myth Binding", brand:"Rossignol", price:179.99, customMsrp:179.99, customPrice:179.99, badge:"", badgeType:"default", icon:"🔩",
    cat:"bindings", sub:"snowboard-binding", gender:"unisex", age:"adult", cond:"new", popular:160,
    desc:"Rossignol Myth all-mountain snowboard binding. Soft-medium flex, beginner-friendly.",
    action:"Add to Cart", link:null,
    sizes:[{label:"S/M",qty:0,hlId:100138}],
    images:["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsNn_RTeBU6Fq2IduH14g-UDZ139V4NTZbNAemY404RZfOs75rtrOXpco&s=10","https://www.rossignol.com/dw/image/v2/BJJZ_PRD/on/demandware.static/-/Sites-rossignol-catalog/default/dw806b621e/images/large/RGMC104_MYTH_RGB72DPI_03.jpg?sw=1200&sh=1200"],
    specs:{"Brand":"Rossignol","Flex":"Soft-Medium","Color":"Black"}
  },
  {
    name:"Rossignol Rookie Binding", brand:"Rossignol", price:119.99, customMsrp:119.99, customPrice:119.99, badge:"Entry", badgeType:"new", icon:"🏂",
    cat:"bindings", sub:"snowboard-binding", gender:"unisex", age:"adult", cond:"new", popular:75,
    desc:"Rossignol's entry-level binding. Soft flex, simple strap entry, and a lightweight chassis — perfect for beginners just getting started.",
    action:"Add to Cart", link:null,
    sizes:[{label:"S",qty:0,hlId:101777}],
    images:["https://cdn.media.amplience.net/i/scheelspoc/40600024760?w=500&h=500&fmt=auto&v=1"],
    longDesc:"The Rossignol Rookie is the perfect entry-level binding for new snowboarders just getting started. A soft, forgiving flex makes it easy to control and learn on, while a simple strap entry system means less time fiddling and more time riding. Lightweight and comfortable all day, the Rookie is built to take the struggle out of learning so you can focus on having fun on the mountain.",
    specs:{"Brand":"Rossignol","Flex":"Soft","Terrain":"All-Mountain","Skill Level":"Beginner"}
  },
  {
    name:"Rossignol Soulside Binding", brand:"Rossignol", price:179.99, badge:"", badgeType:"default", icon:"🏂",
    cat:"bindings", sub:"snowboard-binding", gender:"unisex", age:"adult", cond:"new", popular:77,
    desc:"Rossignol Soulside all-mountain binding. Comfortable medium flex with a streamlined chassis. Available in black and blue.",
    action:"Add to Cart", link:null,
    sizes:[{label:"S/M",qty:0,hlId:100138}],
    images:["https://buckmans.com/files/store/items/rgl0020_soulside_cmykdpi_01.jpg","https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSC230wZWuzBhD9GBesqVzP6sHaQ9pLje8ptSEiwql4gDIeedPBDp4hQUT2XITvQBdcGzOzOvTB5W0HLWnd7cIgipH25wr-LEUZacXj1GR3OWDEkr4s4h_-v316Qyj2&usqp=CAc"],
    longDesc:"The Rossignol Soulside is a versatile all-mountain binding designed for up-and-coming riders who want to explore the whole resort. Easy entry, secure comfort, and a medium flex that handles everything from groomed runs to off-piste terrain with ease. 3D-molded ladders let you dial in the right tension, while padded toe and heel pads deliver all-day comfort. A confidence-building binding that grows with your riding.",
    specs:{"Brand":"Rossignol","Flex":"Medium","Terrain":"All-Mountain","Skill Level":"Beginner–Intermediate"}
  },
  // ── ROME SNOWBOARD BINDINGS (additional) ─────────────────
  {
    name:"Rome 390 Boss Binding", brand:"Rome", price:329.99, badge:"All-Mountain", badgeType:"pop", icon:"🏂",
    cat:"bindings", sub:"snowboard-binding", gender:"unisex", age:"adult", cond:"new", popular:84,
    desc:"Rome's flagship all-mountain binding. The 390 Boss delivers powerful response, long-travel heel elasticity, and a bombproof build for aggressive riding in any condition.",
    action:"Add to Cart", link:null,
    sizes:[{label:"M/L",qty:0,hlId:101393},{label:"L/XL",qty:0,hlId:101394}],
    images:["https://media.rainpos.com/11022/20240229_2425_Rome_Website_BN_Boss_Acid_Hero_85782cdf_b23a_43dd_92ca_81dca02635fc.webp","https://www.melbournesnowboard.com.au/cdn/shop/files/0002_rome-390-boss-acid.jpg?v=1734381541&width=1800","https://i.ebayimg.com/images/g/jNoAAOSwRYNnTZgX/s-l400.jpg"],
    longDesc:"The Rome 390 Boss is Rome\'s flagship all-mountain binding — a hardcharging, bombproof platform built for aggressive riders who demand the best. A stiff, responsive chassis delivers powerful edge control and direct board feel, while long-travel heel elasticity absorbs the impacts of big landings and variable terrain without sacrificing response. One of the most trusted all-mountain bindings in snowboarding, built by Vermont riders who\'ve been making boards and bindings since 1996.",
    specs:{"Brand":"Rome","Flex":"Stiff","Terrain":"All-Mountain / Freeride","Skill Level":"Intermediate–Expert"}
  },
  {
    name:"Rome Katana AW Pro Binding", brand:"Rome", price:469.99, badge:"Pro", badgeType:"pop", icon:"🏂",
    cat:"bindings", sub:"snowboard-binding", gender:"unisex", age:"adult", cond:"new", popular:83,
    desc:"Rome's top-of-the-line all-weather binding. Carbon chassis, aluminum highback, and maximum power transfer for expert riders who demand the best.",
    action:"Add to Cart", link:null,
    sizes:[{label:"M/L",qty:0,hlId:101396}],
    images:["https://romesnowboards.com/cdn/shop/files/2526_Rome-Web_BN_Katana-AW-Pro_C1-Hero.jpg?v=1757347186&width=3840","https://romesnowboards.com/cdn/shop/files/2526_Rome-Web_BN_Katana-AW-Pro_C1-Front.jpg?v=1757347186&width=3840","https://romesnowboards.com/cdn/shop/files/2526_Rome-Web_BN_Katana-AW-Pro_C1-Back.jpg?v=1757347186&width=3840","https://romesnowboards.com/cdn/shop/files/2526_Rome-Web_BN_Katana-AW-Pro_C1-Side.jpg?v=1757347186&width=3840"],
    longDesc:"The Rome Katana AW Pro is Rome\'s top-of-the-line performance binding — a carbon-chassis, aluminum highback powerhouse built for expert riders who demand maximum response and precision. Every input transfers directly to the board with zero lag, making it the choice of riders who charge hard and expect their gear to keep up. Lightweight, stiff, and built to last — the ultimate all-mountain and freeride binding.",
    specs:{"Brand":"Rome","Flex":"Stiff","Chassis":"Carbon","Terrain":"All-Mountain / Expert","Skill Level":"Expert"}
  },
  {
    name:"Rome Katana AW Binding — Orange/Black", brand:"Rome", price:399.99, badge:"", badgeType:"default", icon:"🏂",
    cat:"bindings", sub:"snowboard-binding", gender:"unisex", age:"adult", cond:"new", popular:81,
    desc:"Rome Katana AW all-weather binding in orange/black colorway. High-performance stiff chassis with proven all-mountain versatility.",
    action:"Add to Cart", link:null,
    sizes:[{label:"M/L",qty:0,hlId:101401}],
    images:["https://i.ebayimg.com/images/g/D5gAAeSwNh9o0WG4/s-l1600.webp","https://i.ebayimg.com/images/g/PNsAAeSwfI9o0WG4/s-l1600.webp"],
    longDesc:"The Rome Katana AW in Orange/Black is a high-performance all-weather binding built for riders who want serious all-mountain versatility in a bold colorway. A stiff chassis delivers powerful, direct edge control, while proven all-mountain construction handles everything from groomed runs to variable backcountry terrain with confidence. Built by Vermont riders who\'ve been shaping snowboard culture since 1996.",
    specs:{"Brand":"Rome","Flex":"Stiff","Color":"Orange / Black","Terrain":"All-Mountain","Skill Level":"Intermediate–Expert"}
  },
  {
    name:"Rome Trace AW Binding", brand:"Rome", price:319.99, customMsrp:319.99, customPrice:319.99, badge:"", badgeType:"default", icon:"🏂",
    cat:"bindings", sub:"snowboard-binding", gender:"unisex", age:"adult", cond:"new", popular:79,
    desc:"Rome Trace all-weather binding. Medium-stiff flex with a lightweight chassis and solid strap system — a versatile all-mountain option for advancing riders.",
    action:"Add to Cart", link:null,
    sizes:[{label:"M/L",qty:0,hlId:101397},{label:"L/XL",qty:0,hlId:101398},{label:"S",qty:0,hlId:101780},{label:"M/L",qty:0,hlId:101808},{label:"L/XL",qty:0,hlId:101809}],
    images:["https://easternboarder.com/cdn/shop/files/2526_Rome-Web_BN_Trace-AW_C1-Front.jpg?v=1764168263&width=720","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmqdpxq-2ER0pmGqfoZcxN64NRMT5f02P89g&s","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxsJLFdZ7D4Hnv71UIu4ANXwRP_gYZFjQZxw&s"],
    longDesc:"The Rome Trace AW is a medium-stiff all-weather binding built for advancing all-mountain riders who want versatility and reliability in any condition. A lightweight chassis, solid strap system, and proven AW construction deliver confident performance from early season hardpack through late season slush. A dependable everyday binding that grows with your riding.",
    specs:{"Brand":"Rome","Flex":"Medium-Stiff","Terrain":"All-Mountain","Skill Level":"Intermediate–Advanced"}
  },

  {
    name:"Bataleon Blaster FASE Binding", brand:"Bataleon", price:379.99, badge:"FASE", badgeType:"new", icon:"🏂",
    cat:"bindings", sub:"snowboard-binding", gender:"unisex", age:"adult", cond:"new", popular:80,
    desc:"Rome Blaster with FASE (Forward Angled Strap Entry) technology. Forward-angled strap makes stepping in faster and more intuitive without sacrificing performance.",
    action:"Add to Cart", link:null,
    sizes:[{label:"M/L",qty:0,hlId:101805},{label:"L/XL",qty:0,hlId:101806}],
    images:["https://bataleon.com/cdn/shop/files/FASE_Blaster_C1_Side_71f7bd22-4d7f-486c-9d54-f575f5949c07.jpg?v=1766573604&width=1946","https://bataleon.com/cdn/shop/files/bataleon-2526-blaster-fase-black-4-unisex-snowboard-bindings_a1d974b5-96b3-451a-acc8-658d667f4a83.jpg?v=1757349134&width=1946","https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQa15qzh3VEMU3N_tnxdXX2BZ7kz0phPqxoBeGAbQyaVH53lJdsg6CabvfryFhGhHZe-hErh-hyzPd2WK30PE0el_WI7CAYJbrudnA6gXykpt-xVCtvJqwZ_eMRB_Ge2JeZAKcqHg&usqp=CAc"],
    longDesc:"The Bataleon Blaster FASE is a high-performance binding featuring Bataleon\'s FASE (Forward Angled Strap Entry) technology — a forward-angled top strap that makes stepping in faster and more intuitive than traditional entry systems without sacrificing performance or security. A medium-stiff flex and all-mountain construction deliver confident response across the whole resort. Smart, fast, and built for riders who want to spend less time strapping in and more time riding.",
    specs:{"Brand":"Rome","Technology":"FASE Forward Angled Strap Entry","Flex":"Medium-Stiff","Terrain":"All-Mountain / Freestyle","Skill Level":"Intermediate–Advanced"}
  },

  // ── NIDECKER SNOWBOARD BINDINGS (additional) ─────────────
  {
    name:"Jones Mercury Binding", brand:"Jones", price:359.99, badge:"", badgeType:"default", icon:"🏂",
    cat:"bindings", sub:"snowboard-binding", gender:"unisex", age:"adult", cond:"new", popular:80,
    desc:"Nidecker Mercury all-mountain binding. Stiff and responsive with a streamlined chassis — built for riders who want direct power transfer and precise edge control.",
    action:"Add to Cart", link:null,
    sizes:[{label:"M",qty:0,hlId:101783},{label:"L",qty:0,hlId:101784}],
    images:["https://www.jonessnowboards.com/cdn/shop/files/J.26.BNM.MER.BK-gallery-1.webp?v=1768450607&width=1946","https://www.jonessnowboards.com/cdn/shop/files/J.26.BNM.MER.BK-gallery-2.webp?v=1768450607&width=1946","https://www.jonessnowboards.com/cdn/shop/files/J.26.BNM.MER.BK-gallery-3.webp?v=1768450607&width=1946"],
    longDesc:"The Jones Mercury is a high-performance all-mountain binding engineered alongside the Jones Flagship snowboard to deliver the ideal pairing of board feel and binding response. The SKATETECH pivot system directs power to your edges in perfect alignment with Jones Traction Tech edge bump patterns, dramatically improving response and edge grip. A stiff, precise chassis built for freeriders who want every input to translate directly into board performance. Factory WEND waxed and ready to ride.",
    specs:{"Brand":"Nidecker","Flex":"Stiff","Terrain":"All-Mountain","Skill Level":"Intermediate–Expert"}
  },
  {
    name:"Jones Mercury FASE Binding", brand:"Jones", price:359.99, badge:"FASE", badgeType:"new", icon:"🏂",
    cat:"bindings", sub:"snowboard-binding", gender:"unisex", age:"adult", cond:"new", popular:79,
    desc:"Nidecker Mercury with FASE forward-angled strap entry. All the performance of the Mercury with faster, more intuitive entry.",
    action:"Add to Cart", link:null,
    sizes:[{label:"M",qty:0,hlId:101399}],
    images:["https://www.jonessnowboards.com/cdn/shop/files/J.27.BNU.MEF.BK-gallery-1_txlcim.webp?v=1776481535&width=1946","https://www.jonessnowboards.com/cdn/shop/files/J.27.BNU.MEF.BK-gallery-1.webp?v=1776481535&width=1946"],
    longDesc:"The Jones Mercury FASE brings all the performance of the Mercury binding together with Jones\' FASE (Forward Angled Strap Entry) fast-entry system — step in quickly using a refined rear-entry design that works in any condition. SKATETECH pivot system, stiff chassis, and Jones\' signature all-mountain performance make this the ultimate combination of convenience and precision for freeriders. Compatible with all snowboard boots and all major board mounting patterns.",
    specs:{"Brand":"Nidecker","Technology":"FASE Forward Angled Strap Entry","Flex":"Stiff","Terrain":"All-Mountain","Skill Level":"Intermediate–Expert"}
  },
  {
    name:"Nidecker Supermatic Binding — Black", brand:"Nidecker", price:429.99, customMsrp:429.99, customPrice:429.99, badge:"Step-In", badgeType:"pop", icon:"🏂",
    cat:"bindings", sub:"snowboard-binding", gender:"unisex", age:"adult", cond:"new", popular:83,
    desc:"Nidecker Supermatic step-in binding in black. Automatic entry — just step in and go. No straps, no fuss. Requires Supermatic-compatible boots.",
    action:"Add to Cart", link:null,
    sizes:[{label:"S",qty:0,hlId:101800},{label:"M",qty:0,hlId:101791},{label:"L",qty:0,hlId:101801},{label:"XL",qty:0,hlId:101802}],
    images:["https://images.evo.com/imgp/700/266438/1201833/nidecker-og-supermatic-snowboard-bindings-.jpg","https://images.evo.com/imgp/700/266438/1201828/nidecker-og-supermatic-snowboard-bindings-.jpg","https://images.evo.com/imgp/700/266438/1201830/nidecker-og-supermatic-snowboard-bindings-.jpg","https://images.evo.com/imgp/700/266438/1201829/nidecker-og-supermatic-snowboard-bindings-.jpg"],
    longDesc:"The Nidecker Supermatic in black is a premium automatic step-in binding — just step on and go, no straps required. Designed for riders who want the fastest possible entry and exit without compromising performance, the Supermatic delivers a stiff, responsive ride with locked-in heel retention and powerful edge control. Requires Supermatic-compatible boots. Swiss-designed, snowboard-obsessed since 1984. Backed by a 2-year warranty extendable to 3.",
    specs:{"Brand":"Nidecker","Entry System":"Automatic Step-In","Color":"Black","Compatibility":"Supermatic-compatible boots required","Flex":"Stiff","Terrain":"All-Mountain / Expert"}
  },
  {
    name:"Nidecker Supermatic Binding — White", brand:"Nidecker", price:429.99, customMsrp:429.99, customPrice:429.99, badge:"Step-In", badgeType:"pop", icon:"🏂",
    cat:"bindings", sub:"snowboard-binding", gender:"unisex", age:"adult", cond:"new", popular:82,
    desc:"Nidecker Supermatic step-in binding in white. Automatic entry — just step in and go. No straps, no fuss. Requires Supermatic-compatible boots.",
    action:"Add to Cart", link:null,
    sizes:[{label:"M",qty:0,hlId:101790}],
    images:["https://images.evo.com/imgp/700/266438/1201842/nidecker-og-supermatic-snowboard-bindings-.jpg","https://images.evo.com/imgp/700/266438/1201837/nidecker-og-supermatic-snowboard-bindings-.jpg","https://images.evo.com/imgp/700/266438/1201835/nidecker-og-supermatic-snowboard-bindings-.jpg"],
    longDesc:"The Nidecker Supermatic in white delivers the same premium automatic step-in performance as the black version — just step on and go, no straps needed. A stiff, powerful chassis locks your heel in precisely and transfers energy directly to the board for confident, responsive riding. Requires Supermatic-compatible boots. Swiss-designed, snowboard-obsessed since 1984. Backed by a 2-year warranty extendable to 3.",
    specs:{"Brand":"Nidecker","Entry System":"Automatic Step-In","Color":"White","Compatibility":"Supermatic-compatible boots required","Flex":"Stiff","Terrain":"All-Mountain / Expert"}
  },
  {
    name:"Nidecker Nexus Binding", brand:"Nidecker", price:199.99, badge:"", badgeType:"default", icon:"🏂",
    cat:"bindings", sub:"snowboard-binding", gender:"unisex", age:"adult", cond:"new", popular:74,
    desc:"Nidecker's entry-level all-mountain binding. Forgiving soft flex, easy strap entry, and a lightweight chassis — a great first binding for new riders.",
    action:"Add to Cart", link:null,
    sizes:[{label:"S",qty:0,hlId:101803},{label:"L",qty:0,hlId:101804}],
    images:["https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcR3Ve9azQ1JqPaxZuhe-y70LqlBcYtgligyefUYeYWUFlMVBicl3EqETXXXwjs0sDjbHjYH8s2Qfq_2DQRjXJ_4gFzLOhrnQV_Gw-zSnKbCCB6DQU0q9LkLLS3O7mZPkiqRAJXSaA&usqp=CAc","https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRVb4XGuXjFA3Be9SPsKeAr1k8xca9SD1pudn9QIkPSRjCBVf4KuwNWP-Sw0ZkY-VhnnC7ozOvPZIB0OFeqx_49eOgaBkJxlpy6CO0ecsBjuogk8eGwUavmE-Dqui3qz8djZ4xl0EE&usqp=CAc"],
    longDesc:"The Nidecker Nexus is an entry-level all-mountain binding built for riders who are just getting started or looking for a budget-friendly, reliable setup. A soft, forgiving flex makes it easy to control and comfortable all day, while simple strap entry keeps things straightforward on the mountain. A solid first binding that gets out of the way and lets you focus on riding. Swiss-designed, snowboard-obsessed since 1984.",
    specs:{"Brand":"Nidecker","Flex":"Soft","Terrain":"All-Mountain","Skill Level":"Beginner–Intermediate"}
  },
  // ── SALOMON SNOWBOARD BINDINGS (additional) ──────────────
  {
    name:"Salomon Nesta Binding", brand:"Salomon", price:239.99, badge:"", badgeType:"default", icon:"🏂",
    cat:"bindings", sub:"snowboard-binding", gender:"unisex", age:"adult", cond:"new", popular:73,
    desc:"Salomon Nesta all-mountain binding. Medium flex with Salomon's smooth strap system and a lightweight chassis — a solid all-rounder.",
    action:"Add to Cart", link:null,
    sizes:[{label:"M",qty:0,hlId:101787}],
    images:["https://www.christysports.com/dw/image/v2/BGBB_PRD/on/demandware.static/-/Sites-master-winter/default/dw314a2fbd/8106430_320_2.jpg?sw=1600&sh=1600","https://www.christysports.com/dw/image/v2/BGBB_PRD/on/demandware.static/-/Sites-master-winter/default/dwcf106b04/8106430_320_1.jpg?sw=1600&sh=1600"],
    longDesc:"The Salomon Nesta is a mid-range all-mountain binding built for intermediate riders who want a smooth, versatile ride across the whole resort. A medium flex and Salomon\'s comfortable QuickWire strap system deliver confident, responsive performance on groomed runs and beyond, while a lightweight chassis keeps fatigue at bay on long days. A reliable, well-rounded binding for riders ready to explore more of the mountain.",
    specs:{"Brand":"Salomon","Flex":"Medium","Terrain":"All-Mountain","Skill Level":"Beginner–Intermediate"}
  },
  {
    name:"Salomon District Binding", brand:"Salomon", price:289.99, customMsrp:289.99, customPrice:289.99, badge:"", badgeType:"default", icon:"🏂",
    cat:"bindings", sub:"snowboard-binding", gender:"unisex", age:"adult", cond:"new", popular:74,
    desc:"Salomon District all-mountain freestyle binding. Medium-stiff flex, lightweight chassis, and a clean look suited for riders who spend time in the park and on groomers.",
    action:"Add to Cart", link:null,
    sizes:[{label:"M",qty:0,hlId:101789}],
    images:["https://images.evo.com/imgp/700/253966/1112395/salomon-district-snowboard-bindings-.jpg","https://images.evo.com/imgp/700/253966/1112390/salomon-district-snowboard-bindings-.jpg"],
    longDesc:"The Salomon District is a medium-stiff all-mountain freestyle binding built for riders who split their time between groomed runs, side hits, and the terrain park. A clean, modern look complements its versatile performance, while Salomon\'s strap system delivers secure, comfortable lockdown without pressure points. A polished everyday binding for riders who want their setup to look as good as it performs.",
    specs:{"Brand":"Salomon","Flex":"Medium-Stiff","Terrain":"All-Mountain / Park","Skill Level":"Intermediate"}
  },

  // ── KÄSTLE M8 84 (new in Heartland) ─────────────────
  {
    name:"Kästle M8 84", hlName:"M8 84", brand:"Kästle", price:629.99, badge:"New", badgeType:"new", icon:"🎿",
    cat:"skis", sub:"kastle", gender:"unisex", age:"adult", cond:"new", bindings:true, flatmount:false, popular:184,
    desc:"Versatile all-mountain ski. 84mm waist delivers a great balance of on-piste precision and off-piste capability.",
    action:"Add to Cart", link:null,
    sizes:[{label:"148cm",qty:0,hlId:101565},{label:"160cm",qty:0,hlId:101566},{label:"166cm",qty:0,hlId:101567}],
    images:["https://www.powder7.com/skis/202505/2025_05_21_9999_88_ma_05212514_main.jpg"],
    longDesc:"The M8 84 is Kästle\'s all-mountain workhorse — a ski built to handle everything the mountain throws at it. Its 84mm waist sits in the sweet spot between frontside precision and off-piste capability, powered by Kästle\'s Infini Core AMTN with poplar, beech, and double titanal for a powerful, damp, and energetic ride. Hollowtech EVO keeps the tip light and responsive while the sandwich construction delivers race-inspired edge grip. For intermediate to advanced skiers who want an all-day, all-terrain companion with real Austrian performance. Engineered and handcrafted in Austria.",
    specs:{"Waist Width":"84mm","Profile":"Rocker Tip / Camber","Core":"Poplar Beech Wood + Titanal","Terrain":"All-Mountain","Skill Level":"Intermediate–Expert","Country":"Austria"},
    breakdown:[{label:"Skis (Kästle M8 84)",amount:899},,{label:"Total",amount:899}]
  },

  // ── KÄSTLE LEGEND ────────────────────────────────────
  // ── NEW PRODUCTS ─────────────────────────────────────

  // ROSSIGNOL SKIS
  {
    name:"Rossignol Savage", hlName:"Savage", brand:"Rossignol", price:577.49, customMsrp:1049.99, customPrice:499.99, msrp:1049.99, badge:"Freeride", badgeType:"pop", icon:"🎿",
    cat:"skis", sub:"rossignol", gender:"unisex", age:"adult", cond:"new", bindings:true, flatmount:false, popular:140,
    desc:"High-performance freeride ski built for aggressive off-piste skiing. Powerful, damp, and ready for deep days.",
    action:"Add to Cart", link:null,
    sizes:[{label:"176cm",qty:0,hlId:101510},{label:"184cm",qty:0,hlId:101511}],
    images:["https://www.aspenskiandboard.com/cdn/shop/files/RROFV07-ONECOLOR.webp?v=1770754080&width=1214"],
    longDesc:"The Rossignol Savage All Mountain is built for advanced and expert skiers who thrive on variety and adaptability. Inspired by Federica Brignone, it pairs race-inspired technology with freeride construction to create a true quiver-of-one experience. An extended sidecut improves high-speed grip while simultaneously enhancing low-speed handling, and the Titanal Beam underfoot delivers increased edge grip, rebound, and energy through the length of the ski. Rossignol\'s V-A-S vibration absorption system ensures ultra-smooth snow contact in all conditions, while the Rectangular Sidewall construction delivers optimized edge grip, precision, and power. Bold animal-inspired graphics — your savage side, revealed.",
    specs:{"Brand":"Rossignol","Waist Width":"108mm","Profile":"Camber / Rocker Tip & Tail","Core":"Poplar / Paulownia + Carbon Alloy Matrix","Fiberglass":"Full Fiberglass Sandwich","Base":"ABS Electra","Turn Radius":"~18m (176cm)","Terrain":"Freeride / Off-Piste","Skill Level":"Expert","Country":"France"},
    breakdown:[{label:"Skis (Rossignol Savage)",amount:949.99},{label:"Binding Mount",amount:0,note:"Free"},{label:"Tune & Wax",amount:0,note:"Free"},{label:"Total",amount:949.99}]
  },
  {
    name:"Rossignol Sprayer", hlName:"Sprayer", brand:"Rossignol", price:335.99, customMsrp:479.99, customPrice:335.99, msrp:479.99, badge:"Park", badgeType:"pop", icon:"🎿",
    cat:"skis", sub:"rossignol", gender:"unisex", age:"adult", cond:"new", bindings:true, flatmount:false, popular:143,
    desc:"Playful twin-tip ski built for the park and all-mountain fun. Light and maneuverable for freestyle progression. Comes with bindings.",
    action:"Add to Cart", link:null,
    sizes:[{label:"158cm",qty:0,hlId:101063},{label:"168cm",qty:0,hlId:101064}],
    images:["https://skis.com/files/store/items/r/r/rrmsp01_ramsp02_fcmdx02_sprayer_xpress2_xpress_10_gw_b83_black_rgb72dpi_01.jpg"],
    longDesc:"The Rossignol Sprayer is an all-mountain freestyle twin tip built for advancing junior freeskiers who want to charge the whole mountain. A poplar wood core and cap construction deliver a durable yet light and agile feel perfect for both freestyle progression and all-mountain exploration. Traditional camber and an extended sidecut maintain powerful edge grip and boost for all-conditions skiing, while the twin-tip build opens the door to park and freestyle progression. A reliable, versatile package for young riders ready to take their skiing to the next level. Comes with bindings included.",
    specs:{"Brand":"Rossignol","Profile":"Twin Tip / Flat Camber with Rocker","Core":"Poplar / Paulownia Wood","Fiberglass":"Biaxial Fiberglass","Base":"ABS Electra","Terrain":"Park, Pipe & All-Mountain Freestyle","Skill Level":"Intermediate","Shape":"True Twin","Country":"France"},
    breakdown:[{label:"Skis (Rossignol Sprayer)",amount:479.99},{label:"Binding Mount",amount:0,note:"Free"},{label:"Tune & Wax",amount:0,note:"Free"},{label:"Total",amount:479.99}]
  },
  {
    name:"Rossignol Arcade 78", hlName:"Arcade 78", brand:"Rossignol", price:549.99, customMsrp:499.99, customPrice:499.99, badge:"Piste", badgeType:"new", icon:"🎿",
    cat:"skis", sub:"rossignol", gender:"unisex", age:"adult", cond:"new", bindings:true, flatmount:false, popular:144,
    desc:"Carving-oriented all-mountain ski with a 78mm waist. Precise and energetic on groomed runs. Comes with bindings.",
    action:"Add to Cart", link:null,
    sizes:[{label:"156cm",qty:0,hlId:101545}],
    images:["https://i.ebayimg.com/images/g/4v0AAeSw9qppIdrE/s-l1600.webp"],
    longDesc:"The Rossignol Arcade 78 is built to handle whatever snow the resort throws at you with effortless carving and all-conditions adaptability. Air Tip technology reduces weight for increased maneuverability, and V-A-S construction absorbs shock for a smooth, connected feel through variable terrain. The Arcade 78 balances the playful feel of rocker with reliable edge control, making it a confident companion from first chair to final lap — perfect for intermediate skiers looking for a dependable, fun all-mountain ride. Comes with bindings included.",
    specs:{"Brand":"Rossignol","Waist Width":"78mm","Profile":"Progressive Camber","Core":"Poplar / Paulownia Wood","Fiberglass":"Full Fiberglass","Base":"ABS Electra","Turn Radius":"~14m (156cm)","Terrain":"Groomed Piste / All-Mountain","Skill Level":"Intermediate","Country":"France"},
    breakdown:[{label:"Skis (Rossignol Arcade 78)",amount:549.99},{label:"Binding Mount",amount:0,note:"Free"},{label:"Tune & Wax",amount:0,note:"Free"},{label:"Total",amount:549.99}]
  },
  {name:"Rossignol Sender Free 100", hlName:"Sender Free 100", brand:"Rossignol", price:699.99, badge:"Freeride", badgeType:"pop", icon:"🎿",
    cat:"skis", sub:"rossignol", gender:"unisex", age:"adult", cond:"new", bindings:false, flatmount:true, popular:145,
    desc:"Wide-waisted freeride ski for deep snow and open terrain. Effortless float with a lively feel.",
    action:"Add to Cart", link:null,
    sizes:[{label:"170cm",qty:0,hlId:101595},{label:"178cm",qty:0,hlId:100994}],
    images:["https://images.evo.com/imgp/700/266042/1162902/rossignol-sender-free-100-skis-2026-.jpg", "https://images.evo.com/imgp/700/266042/1162899/rossignol-sender-free-100-skis-2026-.jpg", "https://images.evo.com/imgp/zoom/266042/1162900/rossignol-sender-free-100-skis-2026-.jpg", "https://images.evo.com/imgp/700/266042/1162901/rossignol-sender-free-100-skis-2026-.jpg", "https://images.evo.com/imgp/700/266042/1162898/rossignol-sender-free-100-skis-2026-.jpg",],
    longDesc:"The Rossignol Sender Free 100 combines all-mountain power with playful finesse — a 100mm-waisted charger that lets you transition from high-speed carves to laid-back smears without missing a beat. A twin rocker profile, progressive sidecut, and lively wood core offer quick response and endless pop, making it the perfect ski for freeriders who want to get creative with the entire mountain. Air Tip technology keeps the tips light for effortless maneuverability in soft snow.",
    breakdown:[{label:"Skis (Rossignol Sender Free Pro)",amount:699.99},{label:"Binding Mount",amount:0,note:"Free"},{label:"Tune & Wax",amount:0,note:"Free"},{label:"Total",amount:699.99}]},
  {name:"Rossignol Sender Free Pro", hlName:"Sender Free Pro", brand:"Rossignol", price:449.99, badge:"Freeride", badgeType:"pop", icon:"🎿",
    cat:"skis", sub:"rossignol", gender:"unisex", age:"adult", cond:"new", bindings:false, flatmount:true, popular:145,
    desc:"High-performance freeride ski with advanced construction. Built for aggressive riders who want power and precision.",
    action:"Add to Cart", link:null,
    sizes:[{label:"156cm",qty:0,hlId:101816},{label:"176cm",qty:0,hlId:101817}],
    images:["https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/BCJK_STG/on/demandware.static/-/Sites-global-master-catalog/default/dwe712be75/images/large/1150032_1.jpg?sw=800&sh=800", "https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/BCJK_STG/on/demandware.static/-/Sites-global-master-catalog/default/dw03a67327/images/large/1150032_2.jpg?sw=800&sh=800",],
    longDesc:"The Rossignol Sender Free Pro is the high-performance flagship of the Sender freeride lineup — built for expert riders who want to push boundaries inbounds and out. Titanal reinforcement underfoot delivers increased edge grip, rebound, and power, while Air Tip technology reduces swing weight for natural float. Rossignol\'s Line Control Technology harnesses race-proven power for fluid stability in all conditions.",
    breakdown:[{label:"Skis (Rossignol Sender Free 100)",amount:699.99},{label:"Binding Mount",amount:0,note:"Free"},{label:"Tune & Wax",amount:0,note:"Free"},{label:"Total",amount:699.99}]},

  // SALOMON SKIS
  {
    name:"Salomon QST 100", brand:"Salomon", price:699.95, badge:"All-Mountain", badgeType:"new", icon:"🎿",
    cat:"skis", sub:"salomon", gender:"unisex", age:"adult", cond:"new", bindings:false, flatmount:true, popular:146,
    desc:"Iconic all-mountain ski. The QST 100 handles everything from groomed runs to powder with ease.",
    action:"Add to Cart", link:null,
    sizes:[{label:"164cm",qty:0,hlId:101549},{label:"172cm",qty:0,hlId:101010},{label:"180cm",qty:0,hlId:101011}],
    images:["https://www.freshskis.com/cdn/shop/files/salomon-qst-100-skis-iceberg-green-2025-2026.jpg?v=1760439904&width=320"],
    longDesc:"The Rossignol Sender Free 100 combines all-mountain power with playful finesse — a 100mm-waisted charger that lets you transition from high-speed carves to laid-back smears without missing a beat. A twin rocker profile, progressive sidecut, and lively wood core offer quick response and endless pop, making it the perfect ski for freeriders who want to get creative with the entire mountain. Air Tip technology keeps the tips light for effortless maneuverability in soft snow.",
    specs:{"Brand":"Salomon","Waist Width":"100mm","Profile":"Tip/Tail Rocker + Camber Underfoot","Core":"Poplar / Beech Woodcore","Technology":"Cork Damper, Edge Amplifier","Base":"Electraskin 4400","Turn Radius":"~17m (172cm)","Terrain":"All-Mountain / Off-Piste","Skill Level":"Intermediate–Expert","Country":"France"},
    breakdown:[{label:"Skis (Salomon QST 100)",amount:699.99},{label:"Binding Mount",amount:0,note:"Free"},{label:"Tune & Wax",amount:0,note:"Free"},{label:"Total",amount:699.99}]
  },
  {
    name:"Salomon QST Jr — Blue/Purple", brand:"Salomon", price:269.99, customMsrp:269.99, customPrice:269.99, badge:"Junior", badgeType:"new", icon:"🎿",
    cat:"skis", sub:"salomon", gender:"unisex", age:"kid", cond:"new", bindings:true, flatmount:false, popular:147,
    desc:"Junior ski designed to help kids progress confidently. Light, forgiving, and available in multiple sizes. Blue/purple colorway. Comes with bindings.",
    action:"Add to Cart", link:null,
    sizes:[{label:"100cm",qty:0,hlId:101575},{label:"110cm",qty:0,hlId:101577},{label:"120cm",qty:0,hlId:101579},{label:"140cm",qty:0,hlId:101582},{label:"150cm",qty:0,hlId:101583}],
    images:["https://images.evo.com/imgp/700/254041/1098890/salomon-qst-jr-s-skis-c5-gw-bindings-kids-2026-.jpg","https://images.evo.com/imgp/700/254041/1098886/salomon-qst-jr-s-skis-c5-gw-bindings-kids-2026-.jpg","https://images.evo.com/imgp/700/254041/1098888/salomon-qst-jr-s-skis-c5-gw-bindings-kids-2026-.jpg"],
    longDesc:"The Salomon QST Blank Team Junior is built for the next generation of freeriders — a junior all-mountain freeride ski with a 92mm waist (88mm in shorter lengths) that delivers float on powder days and serious style in the park. Rockered tip and tail make landings smooth and turns snappy wherever the mountain takes you. A poplar woodcore offers stability, liveliness, and forgiveness with great ski-to-snow contact, while the lightweight cap construction keeps it maneuverable for growing riders. The younger sibling to the QST Blank, built to charge. Comes with bindings included.",
    specs:{"Brand":"Salomon","Profile":"Tip Rocker + Camber","Core":"Poplar Woodcore","Technology":"Cork Damper","Base":"Cap Construction","Terrain":"All-Mountain","Skill Level":"Beginner–Intermediate","Age Group":"Junior (100–150cm)","Color":"Blue / Purple","Country":"France"},
    breakdown:[{label:"Skis (Salomon QST Jr)",amount:269.99},{label:"Binding Mount",amount:0,note:"Free"},{label:"Tune & Wax",amount:0,note:"Free"},{label:"Total",amount:269.99}]
  },
  {
    name:"Salomon QST Jr — Pink/Orange", brand:"Salomon", price:269.99, customMsrp:269.99, customPrice:269.99, badge:"Junior", badgeType:"new", icon:"🎿",
    cat:"skis", sub:"salomon", gender:"unisex", age:"kid", cond:"new", bindings:true, flatmount:false, popular:146,
    desc:"Junior ski designed to help kids progress confidently. Light, forgiving, and available in multiple sizes. Pink/orange colorway. Comes with bindings.",
    action:"Add to Cart", link:null,
    sizes:[{label:"100cm",qty:0,hlId:101575},{label:"110cm",qty:0,hlId:101577},{label:"120cm",qty:0,hlId:101579},{label:"140cm",qty:0,hlId:101582},{label:"150cm",qty:0,hlId:101583}],
    images:["https://images.evo.com/imgp/700/254044/1098910/salomon-lux-jr-s-skis-c5-gw-bindings-kids-2026-.jpg","https://images.evo.com/imgp/700/254044/1098905/salomon-lux-jr-s-skis-c5-gw-bindings-kids-2026-.jpg","https://images.evo.com/imgp/700/254044/1098906/salomon-lux-jr-s-skis-c5-gw-bindings-kids-2026-.jpg"],
    longDesc:"The Salomon QST Blank Team Junior in Pink/Orange colorway — a junior all-mountain freeride ski with a 92mm waist (88mm in shorter lengths) that delivers float on powder days and serious style in the park. Rockered tip and tail make landings smooth and turns snappy wherever the mountain takes you. A poplar woodcore offers stability, liveliness, and forgiveness with great ski-to-snow contact, while the lightweight cap construction keeps it maneuverable for growing riders. The younger sibling to the QST Blank, built to charge. Comes with bindings included.",
    specs:{"Brand":"Salomon","Profile":"Tip Rocker + Camber","Core":"Poplar Woodcore","Technology":"Cork Damper","Base":"Cap Construction","Terrain":"All-Mountain","Skill Level":"Beginner–Intermediate","Age Group":"Junior (100–150cm)","Color":"Pink / Orange","Country":"France"},
    breakdown:[{label:"Skis (Salomon QST Jr)",amount:269.99},{label:"Binding Mount",amount:0,note:"Free"},{label:"Tune & Wax",amount:0,note:"Free"},{label:"Total",amount:269.99}]
  },


  // ── HELMETS (Pret) ──────────────────────────────────────





  // ── GOGGLES (Dragon) ────────────────────────────────────
















  {
    name:"Pret Moxie X Helmet", brand:"Pret", price:114.99, badge:"", badgeType:"default", icon:"🪖",
    cat:"accessories", sub:"helmets", gender:"unisex", age:"kid", cond:"new", popular:160,
    desc:"Pret Moxie X youth ski helmet with MIPS protection, ABS shell, and adjustable fit system. Available in 4 colorways.",
    action:"Add to Cart", link:null,
    colorways:[
      {label:"Trippin",     image:"https://cdn.shoplightspeed.com/shops/640059/files/67016980/650x650x2/moxie-x-youth.jpg"},
      {label:"Dazed Black", image:"https://cdn.shoplightspeed.com/shops/640059/files/67016981/650x650x2/moxie-x-youth.jpg"},
      {label:"Dazed Blue",  image:"https://cdn.shoplightspeed.com/shops/640059/files/67016977/650x650x2/moxie-x-youth.jpg"},
      {label:"Groovy Rose", image:"https://cdn.shoplightspeed.com/shops/640059/files/67016979/650x650x2/moxie-x-youth.jpg"},
    ],
    sizes:[
      {label:"Trippin — XS",     qty:0, hlId:100205},
      {label:"Trippin — SM",     qty:0, hlId:100209},
      {label:"Dazed Black — XS", qty:0, hlId:100206},
      {label:"Dazed Black — SM", qty:0, hlId:100210},
      {label:"Dazed Blue — XS",  qty:0, hlId:100207},
      {label:"Dazed Blue — SM",  qty:0, hlId:100211},
      {label:"Dazed Blue — M",   qty:0, hlId:101641},
      {label:"Groovy Rose — XS", qty:0, hlId:100208},
      {label:"Groovy Rose — SM", qty:0, hlId:100212},
      {label:"Groovy Rose — M",  qty:0, hlId:101810},
    ],
    images:[
      "https://cdn.shoplightspeed.com/shops/640059/files/67016980/650x650x2/moxie-x-youth.jpg",
      "https://cdn.shoplightspeed.com/shops/640059/files/67016981/650x650x2/moxie-x-youth.jpg",
      "https://cdn.shoplightspeed.com/shops/640059/files/67016977/650x650x2/moxie-x-youth.jpg",
      "https://cdn.shoplightspeed.com/shops/640059/files/67016979/650x650x2/moxie-x-youth.jpg"
    ],
    specs:{"Brand":"Pret","Protection":"MIPS","Shell":"ABS","Fit":"Youth / Junior","Sizes":"XS, SM, M"}
  },
  {
    name:"Dragon D2 Goggle", brand:"Dragon", price:39.99, badge:"", badgeType:"default", icon:"🥽",
    cat:"accessories", sub:"goggles", gender:"unisex", age:"adult", cond:"new", popular:155,
    customMsrp:39.99, customPrice:39.99,
    desc:"Dragon D2 cylindrical goggle — clean optics, lightweight frame, and reliable anti-fog at an accessible price. Available in 2 colorways.",
    action:"Add to Cart", link:null,
    colorways:[
      {label:"Black / Amber", hlId:100550, image:"https://cdn11.bigcommerce.com/s-nb5it5hcrj/images/stencil/264w/products/57736/325838/m38f46_004_d2unisexsnowgoggles20230920113608_1__78343.1758550509.jpg"},
      {label:"White / Amber", hlId:100551, image:"https://cdn11.bigcommerce.com/s-nb5it5hcrj/images/stencil/264w/products/57736/325811/m38f46_001_d2unisexsnowgoggles20240702025112_1__73607.1758550509.jpg"},
    ],
    sizes:[
      {label:"Black / Amber", qty:0, hlId:100550},
      {label:"White / Amber", qty:0, hlId:100551},
    ],
    images:[
      "https://cdn11.bigcommerce.com/s-nb5it5hcrj/images/stencil/264w/products/57736/325838/m38f46_004_d2unisexsnowgoggles20230920113608_1__78343.1758550509.jpg",
      "https://cdn11.bigcommerce.com/s-nb5it5hcrj/images/stencil/264w/products/57736/325811/m38f46_001_d2unisexsnowgoggles20240702025112_1__73607.1758550509.jpg"
    ],
    specs:{"Brand":"Dragon","Lens":"Cylindrical","Anti-Fog":"Dual-Layer","UV":"100%"}
  },
  {
    name:"Dragon D1 OTG Goggle", brand:"Dragon", price:109.99, badge:"OTG", badgeType:"new", icon:"🥽",
    cat:"accessories", sub:"goggles", gender:"unisex", age:"adult", cond:"new", popular:162,
    desc:"Dragon D1 OTG goggle with Lumalens optics. Over-glasses compatible. Available in 4 colorways.",
    action:"Add to Cart", link:null,
    colorways:[
      {label:"Mikkel 25 B&W",     hlId:101249, image:"https://dragonalliance.ca/cdn/shop/files/D1-OTG-MIKKEL25-1_1024x.jpg?v=1758562288"},
      {label:"Black / Green Ion", hlId:101250, image:"https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTBYmibZxLb-1LVK2FSIhs9STNil4K1Zm_B1d5m1VLl1x7uLimxCQv6tw0os5kFCk9DDhmHiayNw07WL7Hr7wZ9Xj1FiLRDLZTKmsijQOTAWxgCIKh6ZrBGyrhf5gWR&usqp=CAc"},
      {label:"Grey / Gold Ion",   hlId:101522, image:"https://uk.dragonalliance.com/cdn/shop/files/D1-OTG-CLASSICGREY-2_ba1dfb2c-e151-4b4f-afbd-fe971ec5ecfe_1600x.jpg?v=1722308183"},
      {label:"Black / Purple Ion",hlId:101523, image:"https://stevessnowstore.com/cdn/shop/files/D1_OTG_Icon_Purple_LUMALENS_Purple_Ion_LUMALENS_Amber.jpg?v=1775865450&width=3840"},
    ],
    sizes:[
      {label:"Mikkel 25 B&W",     qty:0, hlId:101249},
      {label:"Black / Green Ion", qty:0, hlId:101250},
      {label:"Grey / Gold Ion",   qty:0, hlId:101522},
      {label:"Black / Purple Ion",qty:0, hlId:101523},
    ],
    images:[
      "https://dragonalliance.ca/cdn/shop/files/D1-OTG-MIKKEL25-1_1024x.jpg?v=1758562288",
      "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTBYmibZxLb-1LVK2FSIhs9STNil4K1Zm_B1d5m1VLl1x7uLimxCQv6tw0os5kFCk9DDhmHiayNw07WL7Hr7wZ9Xj1FiLRDLZTKmsijQOTAWxgCIKh6ZrBGyrhf5gWR&usqp=CAc",
      "https://uk.dragonalliance.com/cdn/shop/files/D1-OTG-CLASSICGREY-2_ba1dfb2c-e151-4b4f-afbd-fe971ec5ecfe_1600x.jpg?v=1722308183",
      "https://stevessnowstore.com/cdn/shop/files/D1_OTG_Icon_Purple_LUMALENS_Purple_Ion_LUMALENS_Amber.jpg?v=1775865450&width=3840"
    ],
    specs:{"Brand":"Dragon","Lens":"Lumalens Cylindrical","Over-Glasses":"Yes (OTG)","Anti-Fog":"Dual-Layer","UV":"100%"}
  },
  {
    name:"Dragon DX3 OTG Goggle", brand:"Dragon", price:74.99, badge:"OTG", badgeType:"new", icon:"🥽",
    cat:"accessories", sub:"goggles", gender:"unisex", age:"adult", cond:"new", popular:165,
    desc:"Dragon DX3 OTG goggle — over-glasses compatible with dual-layer anti-fog Lumalens cylindrical optics. Available in 6 colorways.",
    longDesc:"The Dragon DX3 OTG is built for skiers who wear prescription glasses or simply want more room. A flexible, wide-fitting frame fits comfortably over most eyewear, while dual-layer anti-fog lenses keep your vision clear from first chair to last. Cylindrical Lumalens optics deliver natural color and contrast in any light. Anti-fog coating, 100% UV protection, and a triple-layer face foam for all-day comfort. Available in multiple colorways — select your color below.",
    action:"Add to Cart", link:null,
    colorways:[
      {label:"Black+White / Black",  hlId:101517, image:"https://gotyourgear.com/cdn/shop/products/qV4PepmWx3eNDSXkXDHaPmQuZCXaPVKV-25.jpg?v=1697658243"},
      {label:"Leafy Camo / Amber",   hlId:101518, image:"https://www.eriksbikeshop.com/cdn/shop/files/dragon-dx3-otg-goggles_pr5a25632_b183.jpg?v=1763720177&width=1100"},
      {label:"Black / Black",        hlId:101519, image:"https://gotyourgear.com/cdn/shop/products/JLSQ8cYfGPwtP3YiGEp4Sg1bEftNu6FK-25.jpg?v=1697657105"},

      {label:"White / Green Ion",    hlId:101521, image:"https://www.melbournesnowboard.com.au/cdn/shop/files/0002_white-ll-green-ion.jpg?v=1711688726&width=1800"},
      {label:"Kelp / Dark Smoke",    hlId:101368, image:"https://wws-boardshop.com/cdn/shop/files/DRG1576130341_DRAGON_profile.png?v=1707359311"},
    ],
    sizes:[
      {label:"Black+White / Black",  qty:0, hlId:101517},
      {label:"Leafy Camo / Amber",   qty:0, hlId:101518},
      {label:"Black / Black",        qty:0, hlId:101519},

      {label:"White / Green Ion",    qty:0, hlId:101521},
      {label:"Kelp / Dark Smoke",    qty:0, hlId:101368},
    ],
    images:[
      "https://gotyourgear.com/cdn/shop/products/qV4PepmWx3eNDSXkXDHaPmQuZCXaPVKV-25.jpg?v=1697658243",
      "https://www.eriksbikeshop.com/cdn/shop/files/dragon-dx3-otg-goggles_pr5a25632_b183.jpg?v=1763720177&width=1100",
      "https://gotyourgear.com/cdn/shop/products/JLSQ8cYfGPwtP3YiGEp4Sg1bEftNu6FK-25.jpg?v=1697657105",
      
      "https://www.melbournesnowboard.com.au/cdn/shop/files/0002_white-ll-green-ion.jpg?v=1711688726&width=1800",
      "https://wws-boardshop.com/cdn/shop/files/DRG1576130341_DRAGON_profile.png?v=1707359311"
    ],
    specs:{"Brand":"Dragon","Lens":"Lumalens Cylindrical","Over-Glasses":"Yes (OTG)","Anti-Fog":"Dual-Layer","UV":"100%","Fit":"Wide / OTG"}
  },
  {
    name:"Dragon Lil D Goggle", brand:"Dragon", price:54.99, badge:"Kids", badgeType:"new", icon:"🥽",
    cat:"accessories", sub:"goggles", gender:"unisex", age:"kid", cond:"new", popular:158,
    desc:"Dragon Lil D kids goggle with Lumalens cylindrical optics, anti-fog dual-layer lens, and fun colorways for young riders. Available in 9 colors.",
    action:"Add to Cart", link:null,
    colorways:[
      {label:"Light Pink / Rose",         hlId:100574, image:"https://www.auski.com.au/cdn/shop/products/dragon-lil-d-asian-fit-snow-goggles-2023-lilac-lumalens-light-rose-1_2000x.jpg?v=1674006534"},
      {label:"Charcoal / Amber",          hlId:100575, image:"https://cdn.shoplightspeed.com/shops/632978/files/67899837/650x750x2/dragon-lil-d-2-goggle-charcoal-w-lumalens-amber-20.jpg"},
      {label:"Sea Friends / Dark Smoke",  hlId:100910, image:"https://socalsurfshop.com/media/catalog/product/cache/1/image/650x/040ec09b1e35df139433887a97daa66f/l/i/lil-d-seafriends-1_5000x.jpg"},
      {label:"Dinos / Dark Smoke",        hlId:101385, image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmwqEeoe91BFLaQmowVAOQJtl4mh0BotSSBQ&s"},
      {label:"Forest Friends / Silver Ion",hlId:101386, image:"https://basenz.com/cdn/shop/files/dragon-lil-d-ion-youth-snow-goggles-forest-friends-silver-sgoggle-881.webp?v=1775066900"},

      {label:"Curly Multicolor / Red Ion",hlId:101388, image:"https://www.auski.com.au/cdn/shop/products/dragon-lil-d-asian-fit-snow-goggles-2023-curly-lumalens-red-ion-2_600x.jpg?v=1674006379"},
      {label:"White / Amber",             hlId:101389, image:"https://supersportowy.pl/wp-content/uploads/2024/09/gogle-dragon-lil-d.png"},
      {label:"Koi / Dark Smoke",          hlId:101390, image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYTl6rdoO9sibLiTyif-MWYOAHmfMDNnii1Q&s"},
    ],
    sizes:[
      {label:"Light Pink / Rose",         qty:0, hlId:100574},
      {label:"Charcoal / Amber",          qty:0, hlId:100575},
      {label:"Sea Friends / Dark Smoke",  qty:0, hlId:100910},
      {label:"Dinos / Dark Smoke",        qty:0, hlId:101385},
      {label:"Forest Friends / Silver Ion",qty:0, hlId:101386},

      {label:"Curly Multicolor / Red Ion",qty:0, hlId:101388},
      {label:"White / Amber",             qty:0, hlId:101389},
      {label:"Koi / Dark Smoke",          qty:0, hlId:101390},
    ],
    images:[
      "https://www.auski.com.au/cdn/shop/products/dragon-lil-d-asian-fit-snow-goggles-2023-lilac-lumalens-light-rose-1_2000x.jpg?v=1674006534",
      "https://cdn.shoplightspeed.com/shops/632978/files/67899837/650x750x2/dragon-lil-d-2-goggle-charcoal-w-lumalens-amber-20.jpg",
      "https://socalsurfshop.com/media/catalog/product/cache/1/image/650x/040ec09b1e35df139433887a97daa66f/l/i/lil-d-seafriends-1_5000x.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmwqEeoe91BFLaQmowVAOQJtl4mh0BotSSBQ&s",
      "https://basenz.com/cdn/shop/files/dragon-lil-d-ion-youth-snow-goggles-forest-friends-silver-sgoggle-881.webp?v=1775066900",
      
      "https://www.auski.com.au/cdn/shop/products/dragon-lil-d-asian-fit-snow-goggles-2023-curly-lumalens-red-ion-2_600x.jpg?v=1674006379",
      "https://supersportowy.pl/wp-content/uploads/2024/09/gogle-dragon-lil-d.png",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYTl6rdoO9sibLiTyif-MWYOAHmfMDNnii1Q&s"
    ],
    specs:{"Brand":"Dragon","Lens":"Lumalens Cylindrical","Anti-Fog":"Dual-Layer","UV":"100%","Fit":"Kids / Youth"}
  },
  {
    name:"Dragon R1 Goggle", brand:"Dragon", price:189.99, badge:"Spherical", badgeType:"pop", icon:"🥽",
    cat:"accessories", sub:"goggles", gender:"unisex", age:"adult", cond:"new", popular:170,
    desc:"Dragon's premium wide-angle spherical goggle. Massive field of view, Super Anti-Fog dual-layer lens, and Lumalens technology for vivid contrast in all conditions.",
    action:"Add to Cart", link:null,
    sizes:[{label:"One Size",qty:0,hlId:101524}],
    images:["https://alssports.vteximg.com.br/arquivos/ids/3292827-1520-1520/10608183x1314845.jpg?v=638853877285670000"],
    specs:{"Brand":"Dragon","Lens":"Lumalens Spherical","Foam":"Triple-Layer","Anti-Fog":"Super Anti-Fog Dual-Layer","Style":"Spherical / Premium"}
  },

















  // SNOWBOARD BINDINGS
  {
    name:"Katana FASE Binding", brand:"Rome", price:429.99, customMsrp:429.99, customPrice:429.99, badge:"FASE", badgeType:"pop", icon:"🏂",
    cat:"bindings", sub:"snowboard-binding", gender:"unisex", age:"adult", cond:"new", popular:159,
    desc:"Rome Katana FASE — high-performance step-on freestyle binding using Rome's FASE technology for instant power transfer and locked-in response.",
    action:"Add to Cart", link:null,
    sizes:[{label:"S",qty:0,hlId:101779},{label:"M/L",qty:0,hlId:101391},{label:"L/XL",qty:0,hlId:101392}],
    images:["https://romesnowboards.com/cdn/shop/files/2526_Rome-Web_BN_Katana-AW-FASE_C1-Hero.jpg?v=1757347188","https://romesnowboards.com/cdn/shop/files/2526_Rome-Web_BN_Katana-AW-FASE_C1-Front.jpg?v=1757347188","https://romesnowboards.com/cdn/shop/files/2526_Rome-Web_BN_Katana-AW-FASE_C1-Back.jpg?v=1757347188","https://romesnowboards.com/cdn/shop/files/2526_Rome-Web_BN_Katana-AW-FASE_C1-Side.jpg?v=1757347188"],
    longDesc:"",
    specs:{"Brand":"Nitro","Technology":"FASE (Forward Angled Strap Entry)","Frame":"ProFlex Nylon","Highback":"Asymmetric Freecarve","Baseplate":"3D Canted Aluminum","Straps":"ProFit Ankle + FASE Toe","Flex":"Stiff (8/10)","Terrain":"Freeride / All-Mountain Expert"},
    breakdown:[{label:"Binding",amount:409.99},{label:"Total",amount:409.99}]
  },
  {
    name:"Carbon Supermatic Binding", brand:"Nidecker", price:524.99, customMsrp:524.99, customPrice:524.99, badge:"Carbon", badgeType:"pop", icon:"🏂",
    cat:"bindings", sub:"snowboard-binding", gender:"unisex", age:"adult", cond:"new", popular:161,
    desc:"Top-of-the-line Nidecker OG Supermatic step-in binding with a carbon chassis. The lightest, most responsive auto-entry binding available.",
    action:"Add to Cart", link:null,
    sizes:[{label:"M",qty:0,hlId:101785},{label:"L",qty:0,hlId:101786},{label:"XL",qty:0,hlId:101807}],
    images:["https://images.evo.com/imgp/700/253920/1102643/nidecker-supermatic-carbon-snowboard-bindings-2026-.jpg","https://images.evo.com/imgp/700/253920/1102641/nidecker-supermatic-carbon-snowboard-bindings-2026-.jpg","https://images.evo.com/imgp/700/253920/1102640/nidecker-supermatic-carbon-snowboard-bindings-2026-.jpg","https://images.evo.com/imgp/700/253920/1102650/nidecker-supermatic-carbon-snowboard-bindings-2026-.jpg","https://images.evo.com/imgp/700/253920/1102639/nidecker-supermatic-carbon-snowboard-bindings-2026-.jpg"],
    longDesc:"",
    specs:{"Brand":"Rome","Frame":"Carbon Fiber Chassis (Ultra-Lightweight)","Entry System":"Automatic Step-In (No Strap Riding)","Highback":"Aluminum with 45-Degree Lean","Baseplate":"Carbon Injected","Compatibility":"Requires Rome Supermatic-Compatible Boots","Flex":"Stiff (8/10)","Terrain":"All-Mountain / Expert"},
    breakdown:[{label:"Binding",amount:524.99},{label:"Total",amount:524.99}]
  },

  // SNOWBOARDS

  {
    name:"Jones Mind Expander Womens", hlName:"Mind Expander", brand:"Jones", price:419.99, customMsrp:599.99, customPrice:419.99, msrp:599.99, badge:"Twin", badgeType:"new", icon:"🏂",
    cat:"snowboards", sub:"jones", gender:"women", age:"adult", cond:"new", flatmount:true, popular:162,
    desc:"A surf-inspired twin that hits every feature on the mountain. Christenson Surf Camber profile delivers effortless float in powder, snappy turn response on hardpack, and Traction Tech 3.5 edges for confident grip anywhere.",
    action:"Add to Cart", link:null,
    sizes:[{label:"146cm",qty:0,hlId:101483},{label:"150cm",qty:0,hlId:101484}],
    images:["https://www.christysports.com/dw/image/v2/BGBB_PRD/on/demandware.static/-/Sites-master-winter/default/dw7e6cde93/8100854_000_1.jpg?sw=800&sh=800"],
    longDesc:"",
    longDesc:"The Jones Mind Expander is a playful all-mountain board designed by legendary surf shaper Chris Christenson — built for riders who want to pop pillows and porpoise through powder. A friendly flex, tight sidecut, and Christenson Surf Camber profile offer snappy turn response and effortless float in deep snow. The 3D Contour Base enhances glide and delivers unmatched turn flow and fluidity in any snow condition. Flax/Basalt stringers provide a damp, confident edge feel on chop and ice. For riders who live to bounce down the mountain hitting every terrain feature in sight — this is your board. Built with 100% solar power.",
    specs:{"Brand":"Jones Snowboards","Shape":"Directional Twin","Profile":"Christenson Surf Camber — Camber Dominant with Rocker Tip & Tail","Core":"Dual-Density Paulownia / Poplar Wood Core (Sustainably Sourced)","Fiberglass":"Biaxial Dual-Layer Laminate","Stringers":"Flax / Basalt Power Stringers (100% Natural Fibers)","Base":"Sintered 8000 UHMW-PE (Ultra Fast, Wax Absorbent)","Edges":"Traction Tech 3.5","3D Contour Base":"Yes — Enhanced Glide & Float","Flex":"Medium (5/10)","Eco":"Bio-Resin (27% Plant-Based Carbon), Recycled ABS Sidewalls","Terrain":"All-Mountain, Freestyle, Freeride","Skill Level":"Intermediate–Expert","Factory Wax":"WEND Natural Wax (Ready to Ride)"},
    breakdown:[{label:"Snowboard",amount:599.99},{label:"Total",amount:599.99}]
  },
  {
    name:"Rome Mechanic", hlName:"Mechanic", brand:"Rome", price:399.99, badge:"All-Mountain", badgeType:"new", icon:"🏂",
    cat:"snowboards", sub:"rome", gender:"unisex", age:"adult", cond:"new", flatmount:true, popular:163,
    desc:"Rome's accessible all-mountain board. Forgiving directional twin shape is great for learning or cruising the whole mountain, with a poplar core for a lively feel.",
    action:"Add to Cart", link:null,
    sizes:[{label:"147cm",qty:0,hlId:100856},{label:"150cm",qty:0,hlId:100857},{label:"153cm",qty:0,hlId:100858},{label:"156cm",qty:0,hlId:100859},{label:"157W",qty:0,hlId:100860},{label:"159cm",qty:0,hlId:100861}],
    images:["https://gotyourgear.com/cdn/shop/products/XiRRlqZjulHp70JHemJLlGhxj5vrXtXG-25.jpg?v=1663706289"],
    longDesc:"",
    specs:{"Brand":"Rome Snowboards","Color":"Black & Yellow/Green","Shape":"Directional Twin","Profile":"Camber with Rockered Nose","Core":"Aspen / Poplar Blended Core","Fiberglass":"Biaxial","Base":"Extruded Polyethylene","Flex":"Medium (5/10)","Terrain":"All-Mountain","Skill Level":"Beginner–Intermediate","Country":"USA Design"},
    breakdown:[{label:"Snowboard",amount:399.99},{label:"Total",amount:399.99}]
  },
  {
    name:"Never Summer Proto T3 FR", brand:"Never Summer", price:719.99, customMsrp:719.99, customPrice:719.99, badge:"New", badgeType:"new", icon:"🏂",
    cat:"snowboards", sub:"neversummer", gender:"men", age:"adult", cond:"new", popular:188,
    desc:"Never Summer Proto T3 FR — a freeride-focused directional twin with Never Summer\'s legendary tube construction and a powerful, surfy feel for charging the mountain.",
    longDesc:"The Never Summer Proto T3 FR is a high-performance freeride snowboard built for riders who want to charge the mountain with power and precision. Never Summer\'s proprietary tube construction delivers a damp, lively feel with explosive edge hold, while the directional twin shape gives you float in powder and confidence on hardpack. Available in standard and extended (X/W) sizes for different riding styles. Handcrafted in Denver, CO.",
    action:"Add to Cart", link:null,
    sizes:[
      {label:"156",   qty:0, hlId:101921},
      {label:"157W",  qty:0, hlId:101923},
      {label:"160",   qty:0, hlId:101922},
      {label:"161W",  qty:0, hlId:101924}
    ],
    images:[
      "https://content.backcountry.com/images/items/1200/NVS/NVSR199/ONECOL.jpg",
      "https://content.backcountry.com/images/items/1200/NVS/NVSR199/ONECOL_D7.jpg",
      "https://content.backcountry.com/images/items/1200/NVS/NVSR199/ONECOL_D6.jpg",
      "https://content.backcountry.com/images/items/1200/NVS/NVSR199/ONECOL_D5.jpg"
    ],
    specs:{"Brand":"Never Summer","Profile":"Rocker/Camber","Construction":"Tube Technology","Shape":"Directional Twin","Terrain":"Freeride / All-Mountain","Made In":"Denver, CO"}
  },
  {
    name:"Never Summer Nokhu", brand:"Never Summer", price:689.99, customMsrp:689.99, customPrice:689.99, badge:"New", badgeType:"new", icon:"🏂",
    cat:"snowboards", sub:"neversummer", gender:"men", age:"adult", cond:"new", popular:186,
    desc:"Never Summer Nokhu — a versatile all-mountain board with Never Summer\'s tube construction and a directional shape built for exploring the whole mountain.",
    longDesc:"The Never Summer Nokhu is a directional all-mountain snowboard built for riders who want to explore every corner of the resort and beyond. Never Summer\'s tube construction delivers a smooth, damp ride with powerful edge hold, while the directional shape floats through powder and carves groomers with equal confidence. Available in standard and directional flex (DF) sizes. Handcrafted in Denver, CO.",
    action:"Add to Cart", link:null,
    sizes:[
      {label:"155",    qty:0, hlId:101925},
      {label:"158",    qty:0, hlId:101926},
      {label:"161",    qty:0, hlId:101927},
      {label:"161DF",  qty:0, hlId:101928}
    ],
    images:[
      "https://neversummer.com/cdn/shop/files/26.27_Nokhu_Web.png?v=1765163139",
      "https://neversummer.com/cdn/shop/files/Nokhu_TOP_1800x1800.webp?v=1785442036",
      "https://neversummer.com/cdn/shop/files/Nokhu_BASE_1800x1800.webp?v=1785442036"
    ],
    specs:{"Brand":"Never Summer","Profile":"Rocker/Camber","Construction":"Tube Technology","Shape":"Directional","Terrain":"All-Mountain / Freeride","Made In":"Denver, CO"}
  },
  {
    name:"Never Summer V-Twin", brand:"Never Summer", price:669.99, customMsrp:669.99, customPrice:669.99, badge:"New", badgeType:"new", icon:"🏂",
    cat:"snowboards", sub:"neversummer", gender:"men", age:"adult", cond:"new", popular:185,
    desc:"Never Summer V-Twin — a versatile all-mountain freestyle twin with Never Summer\'s legendary tube construction and a surfy, playful feel.",
    longDesc:"The Never Summer V-Twin is a true twin all-mountain freestyle board built for riders who want to charge the whole mountain and session the park. Never Summer\'s proprietary tube construction delivers a damp, lively feel that\'s unlike anything else on the market. Rockered tip and tail keep it catch-free and playful while the camber underfoot provides the pop and edge hold needed for aggressive riding. Available in standard and extended (X) sizes for a more directional, powder-friendly feel. Handcrafted in Denver, CO.",
    action:"Add to Cart", link:null,
    sizes:[
      {label:"156W", qty:0, hlId:101931},
      {label:"157",  qty:0, hlId:101929},
      {label:"159W", qty:0, hlId:101932},
      {label:"160",  qty:0, hlId:101930},
      {label:"162W", qty:0, hlId:101933}
    ],
    images:["https://neversummer.com/cdn/shop/files/26.27_V-Twin_Web.png?v=1776919392"],
    specs:{"Brand":"Never Summer","Profile":"Rocker/Camber","Construction":"Tube Technology","Shape":"Twin","Terrain":"All-Mountain Freestyle","Made In":"Denver, CO"}
  },
  {
    name:"Rossignol Super Revenant", hlName:"Super Revenant", brand:"Rossignol", price:699.99, badge:"Freeride", badgeType:"pop", icon:"🏂",
    cat:"snowboards", sub:"rossignol", gender:"unisex", age:"adult", cond:"new", flatmount:true, popular:164,
    desc:"90s throwback style meets futuristic all-mountain freestyle performance. 90% camber with AmpTek Elite rocker, RadCut sidecut, and 5S Serrated Edges deliver explosive pop, precise carving, and confident edge hold in all conditions.",
    action:"Add to Cart", link:null,
    sizes:[{label:"154cm",qty:0,hlId:101451},{label:"158cm",qty:0,hlId:101452},{label:"159W",qty:0,hlId:101453},{label:"163W",qty:0,hlId:101454}],
    images:["https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/BCJK_STG/on/demandware.static/-/Sites-global-master-catalog/default/dw0d539268/images/large/1160689_1.jpg?sw=800&sh=800","https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/BCJK_STG/on/demandware.static/-/Sites-global-master-catalog/default/dwa7895d5e/images/large/1160689_2.jpg?sw=800&sh=800","https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/BCJK_STG/on/demandware.static/-/Sites-global-master-catalog/default/dw13cfb6ea/images/large/1160689_3.jpg?sw=800&sh=800","https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/BCJK_STG/on/demandware.static/-/Sites-global-master-catalog/default/dw6c3a451f/images/large/1160689_4.jpg?sw=800&sh=800"],
    longDesc:"90s throwback style meets futuristic all-mountain freestyle performance. The Super Revenant combines a 90% camber pocket with RadCut sidecut technology, 5S Serrated Edges, and a Twin All-Mountain core profile to deliver a board that is steadfast in all conditions. It provides more precision on traverse and carving on groomed snow, while ensuring more grip on hardpack and improved shock absorption on landings. AmpTek Elite Rocker maintains explosive pop and edge-gripping stability, while the RadCut turn technology allows playful ease-of-use at slower speeds and full-length edge grip at higher speeds. Built for riders who demand serious performance with undeniable style. Wood cores from sustainably harvested forests.",
    specs:{"Brand":"Rossignol","Profile":"AmpTek Elite — 90% Camber + Rocker Tip & Tail","Sidecut":"RadCut (Traditional + Reverse Sidecut Blend)","Edges":"5S Serrated Edges (5 Contact Points)","Core":"Twin All-Mountain Poplar Core","Fiberglass":"Basalt + Aramid (Kevlar) + Glass Fiber","Base":"Sintered ABS","Flex":"8/10 (Stiff)","Technology":"AmpTek Elite Rocker, RadCut, Serrated Edges","Shape":"Twin All-Mountain","Terrain":"All-Mountain Freestyle","Skill Level":"Advanced–Expert","Country":"France","Sustainability":"100% Sustainably Harvested Wood Core"},
    breakdown:[{label:"Snowboard",amount:699.99},{label:"Total",amount:699.99}]
  },

  // ── NEW SKIS: ROSSIGNOL ──────────────────────────────
{
    name:"Rossignol Sender Soul Pro", brand:"Rossignol", price:449.99, badge:"Park", badgeType:"pop", icon:"🎿",
    cat:"skis", sub:"rossignol", gender:"unisex", age:"adult", cond:"new", bindings:true, flatmount:false, popular:137,
    desc:"Twin-tip park ski with a poplar core and flat-mount profile. Pop, press, and stomp with confidence at any skill level. Comes with bindings.",
    action:"Add to Cart", link:null,
    sizes:[{label:"130cm",qty:0,hlId:101813},{label:"150cm",qty:0,hlId:101814},{label:"160cm",qty:0,hlId:101815}],
    images:["https://www.sportsbasement.com/cdn/shop/files/100271672-ONE-1.png?v=1754107678"],
    specs:{"Waist Width":"Soul Pro","Profile":"Twin / Flat","Core":"Poplar","Terrain":"Park & Pipe","Skill Level":"Beginner–Advanced","Country":"France"}
  },
{
    name:"Rossignol Arcade 88", brand:"Rossignol", price:949.99, badge:"Carve", badgeType:"new", icon:"🎿",
    cat:"skis", sub:"rossignol", gender:"unisex", age:"adult", cond:"new", bindings:true, flatmount:false, popular:146,
    desc:"88mm waist all-mountain charger. Slightly wider for better off-piste float while maintaining on-piste precision. Comes with bindings.",
    action:"Add to Cart", link:null,
    sizes:[{label:"170cm",qty:0,hlId:101547},{label:"178cm",qty:0,hlId:100998}],
    images:["https://park2peak.com/cdn/shop/files/rossignol_arcade_88_2026_3.jpg?v=1755010223","https://park2peak.com/cdn/shop/files/rossignolarcade8820264.webp?v=1755010223"],
    specs:{"Waist Width":"88mm","Core":"Poplar + Basalt","Profile":"Progressive Camber","Terrain":"All-Mountain","Skill Level":"Advanced","Country":"France"}
  },
  {
    name:"Rossignol Arcade 84 W", brand:"Rossignol", price:849.99, customMsrp:599.99, customPrice:599.99, badge:"Women's", badgeType:"new", icon:"🎿",
    cat:"skis", sub:"rossignol", gender:"women", age:"adult", cond:"new", bindings:true, flatmount:false, popular:147,
    desc:"Women's all-mountain carver at 84mm waist. Lighter construction tuned for women's skiing dynamics — energetic and precise. Comes with bindings.",
    action:"Add to Cart", link:null,
    sizes:[{label:"152cm",qty:0,hlId:101000},{label:"160cm",qty:0,hlId:101070}],
    images:["https://buckmans.com/files/store/items/lg/fw26-raofv02_arcade-w-84-konect_rgb72dpi.jpg","https://buckmans.com/files/store/items/fw26-raofv02_arcade-w-84_72dpi_02.jpg"],
    longDesc:"The Rossignol Arcade 84 W is Rossignol\'s all-mountain workhorse for women — a direct replacement for the celebrated Experience Ti line with more explosiveness and versatility. A titanal beam sandwiched in a poplar wood core with full-length sidewalls delivers powerful, damp, connected performance on groomed runs and beyond. Rossignol\'s Line Control Technology and V-A-S vibration dampening ensure fluid stability and smooth snow contact across every type of terrain. A confident, high-performance ski that earns its keep on demanding days. Comes with bindings included.",
    specs:{"Waist Width":"84mm","Core":"Air Tip Paulownia + Basalt","Profile":"Progressive Camber","Gender":"Women's","Terrain":"All-Mountain","Skill Level":"Advanced","Country":"France"}
  },
  {
    name:"Rossignol Rallybird 94", brand:"Rossignol", price:699.99, badge:"All-Mountain", badgeType:"new", icon:"🎿",
    cat:"skis", sub:"rossignol", gender:"unisex", age:"adult", cond:"new", bindings:false, flatmount:true, popular:141,
    desc:"All-conditions all-mountain ski with a 94mm waist. The Rallybird is Rossignol's do-everything charger. Comes with bindings.",
    action:"Add to Cart", link:null,
    sizes:[{label:"156cm",qty:0,hlId:101001}],
    images:["https://cdn.shopify.com/s/files/1/0510/1705/6454/files/RANML02_RALLYBIRD_94_OPEN_rgb300dpi-Composite.jpg?v=1755628667"],
    longDesc:"The Rossignol Rallybird 94 is a women\'s all-mountain freeride ski that delivers lightweight agility and confident performance across the entire resort and beyond. At 94mm underfoot, it strikes the sweet spot between frontside precision and off-piste capability. Air Tip technology lightens swing weight for effortless maneuverability in soft snow, while a paulownia wood core keeps the ski lively and quick underfoot. Its titanal reinforcement delivers edge grip and rebound when you push hard, and a boost flex profile ensures responsive energy transmission for dynamic performance. A true all-terrain weapon for women who want to go everywhere.",
    specs:{"Waist Width":"94mm","Core":"Air Tip Paulownia","Terrain":"All-Mountain","Skill Level":"Intermediate–Advanced","Country":"France"}
  },
  {
    name:"Rossignol Rallybird Soul Pro", brand:"Rossignol", price:449.99, badge:"", badgeType:"default", icon:"🎿",
    cat:"skis", sub:"rossignol", gender:"unisex", age:"adult", cond:"new", bindings:true, flatmount:false, popular:132,
    desc:"Accessible all-mountain ski designed for explorers. Wide body and twin-tip design handle anything from groomers to side-country. Comes with bindings.",
    action:"Add to Cart", link:null,
    sizes:[{label:"140cm",qty:0,hlId:101554},{label:"160cm",qty:0,hlId:101555}],
    images:["https://www.sportsbasement.com/cdn/shop/files/100271673-ONE-1.png?v=1754107677","https://www.sportsbasement.com/cdn/shop/files/100271673-ONE-2.png?crop=center&height=800&v=1754107677&width=800"],
    longDesc:"The Rossignol Rallybird Soul Pro is an all-terrain weapon for the next generation of freeride rippers — designed to slash, smear, and carve across the mountain at will. A lively poplar PEFC-certified wood core balances stable control with lightweight agility, and a double rocker profile delivers a playful ride with the freedom to blur the boundaries between frontside and freeride. The progressive sidecut makes it easy to engage and disengage carves on groomed runs, while the twin rocker handles soft snow and variable terrain with ease. Approachable and confidence-inspiring — built for smaller or lighter skiers ready to explore everything the mountain has to offer. Comes with bindings included.",
    specs:{"Waist Width":"Soul Pro","Profile":"Rocker / Flat","Core":"Poplar","Terrain":"All-Mountain","Skill Level":"Beginner–Intermediate","Country":"France"}
  },
  {
    name:"Rossignol Nova 6", brand:"Rossignol", price:699.99, badge:"Women's", badgeType:"new", icon:"🎿",
    cat:"skis", sub:"rossignol", gender:"women", age:"adult", cond:"new", bindings:true, flatmount:false, popular:149,
    desc:"Women's all-mountain performer. Poplar and basalt core with progressive rocker delivers confident carving and effortless float. Comes with bindings.",
    action:"Add to Cart", link:null,
    sizes:[{label:"142cm",qty:0,hlId:101003},{label:"149cm",qty:0,hlId:101067},{label:"156cm",qty:0,hlId:101068}],
    images:["https://cdn11.bigcommerce.com/s-186hk/images/stencil/960w/products/103163/181591/2025-rossignol-nova-6-w-ladies-skis-w-xp-11-gw-bindings__54344.1734453526.jpg?c=2"],
    longDesc:"The Rossignol Nova 6 is a women\'s frontside carver built to raise the bar on your on-piste skiing. Race-inspired construction is matched with an innovative shape and tuned for intermediate to advanced skiers looking to experience full engagement in every turn. A carbon-reinforced wood core maintains a lightweight feel while delivering smooth, controlled carves through variable conditions. V-Profile technology offers a perfect balance of flex and pop for an energetic, connected ride. On Trail Rocker through 95% of the ski length gives you explosive power, snap, and edge grip, with just enough tip rocker for easy turn initiation. Step in and find your rhythm. Comes with bindings included.",
    specs:{"Waist Width":"Nova 6","Core":"Air Tip Paulownia + Basalt","Profile":"Rocker / Camber / Rocker","Gender":"Women's","Terrain":"All-Mountain","Skill Level":"Intermediate–Advanced","Country":"France"}
  },

  {
    name:"Rossignol Nova 2", brand:"Rossignol", price:399.99, badge:"Women's", badgeType:"new", icon:"🎿",
    cat:"skis", sub:"rossignol", gender:"women", age:"adult", cond:"new", bindings:true, flatmount:false, popular:131,
    desc:"Women's beginner/intermediate ski. Super lightweight and easy to initiate turns — a great first performance ski. Comes with bindings.",
    action:"Add to Cart", link:null,
    sizes:[{label:"138cm",qty:0,hlId:101559},{label:"154cm",qty:0,hlId:101560}],
    images:["https://shop.petersonsskiandcycle.com/cdn/shop/files/Nova2Express_1024x1024.jpg?v=1759163121"],
    longDesc:"The Rossignol Nova 2 is an all-mountain ski tuned for intermediate women looking to build confidence and progress their skiing across the resort. A forgiving flex and intuitive shape make it easy to learn and improve, while the poplar wood core delivers a smooth, balanced ride in changing snow conditions. A versatile, encouraging companion for skiers who are ready to explore more of the mountain. Comes with bindings included.",
    specs:{"Waist Width":"Nova 2","Core":"Air Tip Paulownia","Profile":"Progressive Camber","Gender":"Women's","Terrain":"Groomed","Skill Level":"Beginner","Country":"France"}
  },
  {
    name:"Rossignol Forza 70", brand:"Rossignol", price:1049.99, customMsrp:649.99, customPrice:649.99, badge:"Race", badgeType:"pop", icon:"🎿",
    cat:"skis", sub:"rossignol", gender:"unisex", age:"adult", cond:"new", bindings:true, flatmount:false, popular:180,
    desc:"Top-of-line GS carving machine. Carbon Power Turn reinforcement and full titanal sandwich construction for maximum power transfer and edge precision. Comes with bindings.",
    action:"Add to Cart", link:null,
    sizes:[{label:"163cm",qty:0,hlId:100081},{label:"173cm",qty:0,hlId:100999}],
    images:["https://www.aspeneast.com/media/catalog/product/cache/0b3539080c8aa2bb24f376d5c8a4a9b3/2/4/242832_EMKHuYuh4rm8K5W9.jpg","https://www.aspeneast.com/media/catalog/product/cache/0b3539080c8aa2bb24f376d5c8a4a9b3/2/4/242832_Base_OXtB0EIALEw2Ivug.jpg"],
    longDesc:"The Rossignol Forza 70 sets a high standard for advanced frontside carving. Oversized dimensions combined with a Supersize Sidecut support aggressive angulation and maximum control through high-speed arcs. Rossignol\'s Line Control Technology eliminates counter-flexing for fluid stability in all conditions, while the full Titanal construction delivers powerful edge grip and explosive rebound. A PEFC-certified poplar wood core limits vibration for race-proven dampening and stability. For expert skiers who demand precision, power, and an uncompromising piste experience — this is the Rossignol flagship carver. Comes with bindings included.",
    specs:{"Waist Width":"70Ti / 70","Core":"Poplar + Paulownia + Carbon + Titanal","Profile":"Full Camber","Terrain":"On-Piste Racing / Carving","Skill Level":"Expert","Country":"France"}
  },
  {
    name:"Rossignol Arcade 78 W", brand:"Rossignol", price:549.99, customMsrp:549.99, customPrice:549.99, badge:"Women's", badgeType:"new", icon:"🎿",
    cat:"skis", sub:"rossignol", gender:"women", age:"adult", cond:"new", bindings:true, flatmount:false, popular:144,
    desc:"Women's carving ski with a 78mm waist. Lightweight and energetic for confident edge-to-edge transitions on groomers. Comes with bindings.",
    action:"Add to Cart", link:null,
    sizes:[{label:"140cm",qty:0,hlId:101556},{label:"148cm",qty:0,hlId:101557},{label:"156cm",qty:0,hlId:101558}],
    images:["https://www.sportsbasement.com/cdn/shop/files/100288834.WArcade78Xpress10W.1.png?v=1754107591"],
    longDesc:"The Rossignol Arcade 78 W is the women\'s version of the crowd-favorite Arcade 78 — an all-mountain ski built to handle whatever the resort throws at you with effortless carving and adaptability. Air Tip technology reduces weight for increased maneuverability, and V-A-S construction absorbs shock for a smooth, connected feel. Rocker combined with reliable edge control gives you the confidence to explore the whole mountain with style and ease. Perfect for women looking for a fun, forgiving, all-conditions resort companion. Comes with bindings included.",
    specs:{"Waist Width":"78mm","Profile":"Progressive Camber","Core":"Air Tip Paulownia","Gender":"Women's","Terrain":"Groomed Piste","Skill Level":"Intermediate–Advanced","Country":"France"}
  },
  {
    name:"Rossignol Super Blackops", brand:"Rossignol", price:749.99, badge:"All-Mountain", badgeType:"pop", icon:"🎿",
    cat:"skis", sub:"rossignol", gender:"unisex", age:"adult", cond:"new", bindings:false, flatmount:true, popular:158,
    desc:"The ultimate all-condition charger. Wider waist, full rocker, and a stiff core make this Rossignol's most capable off-piste ski.",
    action:"Add to Cart", link:null,
    sizes:[{label:"172cm",qty:0,hlId:101587}],
    images:["https://content.backcountry.com/images/items/1200/ROS/ROSZ7WY/ONECOL.jpg","https://content.backcountry.com/images/items/1200/ROS/ROSZ7WY/ONECOL_D1.jpg"],
    longDesc:"The Rossignol Super Blackops blends Rossignol\'s finest modern all-mountain freestyle chassis with legendary archive style — the guts of the acclaimed Blackops 98 paired with graphics inspired by the rare 1994 Super Virage sold only in Japan. The result is a scintillating all-mountain freestyle destroyer you can reach for on any day of the season. Loud, proud, and built to party from first chair to last. A twin-tip design that rips groomed runs, charges variable terrain, and is always ready for whatever the mountain throws next.",
    specs:{"Waist Width":"Super Blackops","Profile":"Full Rocker","Core":"Poplar + Basalt","Terrain":"Freeride / All-Mountain","Skill Level":"Expert","Country":"France"}
  },
  // ── NEW SKIS: SALOMON ────────────────────────────────
{
    name:"Salomon QST Blank Team 2026", brand:"Salomon", price:319.99, customMsrp:319.99, customPrice:319.99, badge:"Jr", badgeType:"new", icon:"🎿",
    cat:"skis", sub:"salomon", gender:"unisex", age:"kid", cond:"new", bindings:true, flatmount:false, popular:120,
    desc:"Kids' all-mountain ski from Salomon. Lightweight and easy to turn, designed to grow with young skiers. Comes with bindings.",
    action:"Add to Cart", link:null,
    sizes:[{label:"128cm",qty:0,hlId:101009},{label:"137cm",qty:0,hlId:101552},{label:"146cm",qty:0,hlId:101015},{label:"152cm",qty:0,hlId:101016}],
    images:["https://content.backcountry.com/images/items/1200/SAL/SALZB3Y/WHREPRBL.jpg","https://content.backcountry.com/images/items/1200/SAL/SALZB3Y/WHREPRBL_D2.jpg"],
    specs:{"Brand":"Salomon","Model":"QST Blank Team","Profile":"Tip Rocker","Core":"Wood Core","Terrain":"All-Mountain","Skill Level":"Beginner–Intermediate","Age":"Junior"}
  },
  {
    name:"Salomon Stance Pro 90", brand:"Salomon", price:749.95, customMsrp:749.95, customPrice:749.95, badge:"All-Mountain", badgeType:"pop", icon:"🎿",
    cat:"skis", sub:"salomon", gender:"unisex", age:"adult", cond:"new", bindings:false, flatmount:true, popular:188,
    desc:"90mm waist frontside charger with Ti reinforcement. Salomon's most powerful and direct on-piste all-mountain ski.",
    action:"Add to Cart", link:null,
    sizes:[{label:"168cm",qty:0,hlId:101017},{label:"176cm",qty:0,hlId:101018}],
    images:["https://www.eriksbikeshop.com/cdn/shop/files/salomon-stance-pro-90-skis_pr5a25493_bc3e.jpg?v=1760690076&width=1100"],
    longDesc:"The Salomon Stance Pro 90 is a crowd favorite that strikes a perfect balance between elegance and strength. A dynamic karuba/poplar wood construction supports a twin-metal frame, delivering the power and edge control needed to conquer the entire mountain with confidence. At 90mm underfoot it bridges all-mountain versatility with frontside precision — equally at home on groomed corduroy and variable off-piste terrain. Whether you\'re pushing hard at speed or cruising with finesse, the Stance Pro 90 rewards every style of skiing. A true do-everything all-mountain ski.",
    specs:{"Waist Width":"90mm","Core":"Mango Wood + TI","Profile":"Progressive Camber","Terrain":"Frontside / All-Mountain","Skill Level":"Expert","Country":"France"}
  },
  {
    name:"Salomon Stance Pro 88 W", brand:"Salomon", price:699.99, customMsrp:699.99, customPrice:699.99, badge:"Women's", badgeType:"pop", icon:"🎿",
    cat:"skis", sub:"salomon", gender:"women", age:"adult", cond:"new", bindings:false, flatmount:true, popular:187,
    desc:"Women's frontside charger with 88mm waist. Ti reinforcement and a women's-specific flex delivers confident, powerful skiing.",
    action:"Add to Cart", link:null,
    sizes:[{label:"161cm",qty:0,hlId:101024}],
    images:["https://www.bluezonesports.com/prodimages/18402-FUSIONC-l.jpg","https://www.bluezonesports.com/prodimages/alt_images/large/L47825400%20(2).jpg"],
    longDesc:"The Salomon Stance Pro 88 W is Salomon\'s women\'s all-mountain benchmark — a ski that delivers the perfect balance of power, control, and versatility for skiers ready to explore the entire resort and beyond. Its karuba/poplar construction supports a twin-metal frame for confident edge grip and dynamic performance across varying snow conditions. Playful enough for creative skiing, powerful enough to handle demanding terrain, and designed specifically for women\'s skiing dynamics. A crowd favorite that earns its place in any quiver.",
    specs:{"Waist Width":"88mm","Core":"Mango Wood + TI","Profile":"Progressive Camber","Gender":"Women's","Terrain":"Frontside / All-Mountain","Skill Level":"Advanced–Expert","Country":"France"}
  },
  {
    name:"Salomon Stance 80 W", brand:"Salomon", price:499.99, customMsrp:499.99, customPrice:499.99, badge:"Women's", badgeType:"new", icon:"🎿",
    cat:"skis", sub:"salomon", gender:"women", age:"adult", cond:"new", bindings:true, flatmount:false, popular:181,
    desc:"Women's on-piste ski with 80mm waist. Light and easy to ski all day on groomers. Comes with bindings.",
    action:"Add to Cart", link:null,
    sizes:[{label:"141cm",qty:0,hlId:101551},{label:"151cm",qty:0,hlId:101027},{label:"159cm",qty:0,hlId:101028}],
    images:["https://www.sunandski.com/web/image/product.product/243882/image_1024/%5B000167685000000%5D%20Salomon%20Women%27s%20Stance%20W%2080%20w-%20M10%20Bindings%20%2727%20%28159%20CM%29?unique=53af3fd","https://www.sunandski.com/web/image/product.image/1865363/image_1024/34190063840002651-0000_02.jpeg?unique=c8b8fa5"],
    longDesc:"The Salomon Stance 80 W is the narrowest ski in the Stance lineup — built for women who thrive on adventure and want a quick, agile, adaptable ride across the entire mountain. A progressive sidecut and confidence-building stability make it a reliable companion at any speed, while titanal laminate construction grips the snow with authority. Designed for versatility and a dynamic feel whether you\'re carving groomers or venturing off the beaten path. Comes with bindings included for a complete, ready-to-ride package.",
    specs:{"Waist Width":"80mm","Core":"Mango Wood","Gender":"Women's","Terrain":"Groomed","Skill Level":"Intermediate","Country":"France"}
  },
  {
    name:"Salomon S/Max N10XT", brand:"Salomon", price:699.95, badge:"Race", badgeType:"pop", icon:"🎿",
    cat:"skis", sub:"salomon", gender:"women", age:"adult", cond:"new", bindings:true, flatmount:false, popular:189,
    desc:"Salomon's race-pedigree all-mountain ski. Titanal reinforcement and full camber deliver maximum edge grip and precision on hardpack. Comes with bindings.",
    action:"Add to Cart", link:null,
    sizes:[{label:"149cm",qty:0,hlId:101029},{label:"156cm",qty:0,hlId:101008},{label:"163cm",qty:0,hlId:101030},{label:"177cm",qty:0,hlId:101550}],
    images:["https://snowflakeskishop.com/cdn/shop/files/26SalomonSMaxN10.jpg?v=1780965128","https://cdn.xspo.de/xspo.public/media/image/fd/0d/a4/24_s-max-n10-xt_L47656500_2.jpg"],
    longDesc:"The Salomon S/Max N°10 XT is a women\'s frontside carving ski for confident, style-conscious skiers who want to leave their mark on the mountain. Combining progressive performance with a modern, elegant design, it delivers increased stability and smooth carving at speed across groomed piste. Built for women committed to carving every turn while keeping their style levels high — a polished, high-performing on-piste companion. Comes with bindings included.",
    specs:{"Waist Width":"N10XT","Core":"Multilayer Wood + TI","Profile":"Full Camber","Terrain":"On-Piste Racing","Skill Level":"Expert","Country":"France"}
  },
  {
    name:"Salomon S/Max N6XT", brand:"Salomon", price:549.99, badge:"Piste", badgeType:"new", icon:"🎿",
    cat:"skis", sub:"salomon", gender:"unisex", age:"adult", cond:"new", bindings:true, flatmount:false, popular:182,
    desc:"Entry-level carving ski on the S/Max platform. Lightweight and forgiving with a progressive camber profile. Comes with bindings.",
    action:"Add to Cart", link:null,
    sizes:[{label:"140cm",qty:0,hlId:101031},{label:"150cm",qty:0,hlId:100672},{label:"160cm",qty:0,hlId:100673}],
    images:["https://d2j6dbq0eux0bg.cloudfront.net/images/115412582/4896629293.jpg","https://d2j6dbq0eux0bg.cloudfront.net/images/115412582/4896625591.jpg"],
    longDesc:"The Salomon S/Max N°6 XT is a women\'s on-piste ski that blends fashionable design with effortless, confidence-building performance. Stable at higher speeds and forgiving across varying snow conditions, it keeps fatigue at bay during long days of carving. Perfect for women looking for a stylish, easy-to-ski frontside companion that looks as good as it performs. Comes with bindings included.",
    specs:{"Waist Width":"N6XT","Core":"Multilayer Wood","Profile":"Progressive Camber","Terrain":"On-Piste","Skill Level":"Intermediate","Country":"France"}
  },
// ── NEW SKIS: ICELANTIC ──────────────────────────────
  // ── NEW SNOWBOARDS: ROSSIGNOL ────────────────────────
  {
    name:"Rossignol Alias", brand:"Rossignol", price:299.99, badge:"Jr", badgeType:"new", icon:"🏂",
    cat:"snowboards", sub:"rossignol", gender:"unisex", age:"kid", cond:"new", flatmount:true, popular:115,
    desc:"Kids' all-mountain snowboard. Forgiving profile and a lightweight core make it easy for young riders to learn and progress.",
    action:"Add to Cart", link:null,
    sizes:[{label:"125cm",qty:0,hlId:101440},{label:"130cm",qty:0,hlId:101441},{label:"135cm",qty:0,hlId:101819},{label:"140cm",qty:0,hlId:101443},{label:"145cm",qty:0,hlId:101444}],
    images:["https://content.backcountry.com/images/items/1200/ROS/ROSZ7RB/ONECOL.jpg"],
    longDesc:"The Rossignol Alias is a versatile all-mountain freestyle snowboard built for riders who want to explore the whole mountain with confidence and creativity. A balanced rocker/camber profile keeps it forgiving and catch-free in variable snow while maintaining enough pop and edge hold for carving and park laps. An approachable flex makes it easy to progress on, and the twin shape lets you ride it switch with ease. A reliable, fun all-conditions board for riders ready to push their limits. Wood cores from sustainably harvested forests.",
    specs:{"Profile":"Banana Rocker","Core":"Poplar","Terrain":"All-Mountain","Skill Level":"Beginner","Age":"Junior","Country":"France"}
  },
  {
    name:"Rossignol Scan", brand:"Rossignol", price:249.99, badge:"Jr", badgeType:"new", icon:"🏂",
    cat:"snowboards", sub:"rossignol", gender:"unisex", age:"kid", cond:"new", flatmount:true, popular:112,
    desc:"Entry-level kids' snowboard for first-timers and beginners. Super soft flex and a flat profile make learning easy and fun.",
    action:"Add to Cart", link:null,
    sizes:[{label:"70cm",qty:0,hlId:101448},{label:"100cm",qty:0,hlId:101447},{label:"120cm",qty:0,hlId:101446}],
    images:["https://images.evo.com/imgp/700/268711/1207319/clone.jpg"],
    longDesc:"The Rossignol Scan is a junior all-mountain snowboard built to help young riders build skills and confidence across the whole mountain. A soft, forgiving flex and easy-riding shape make it approachable and catch-free, while enough stability and edge hold keeps improving riders in control as they push into new terrain. A great first or second board for kids who are ready to start exploring. Wood cores from sustainably harvested forests.",
    specs:{"Profile":"Flat","Core":"Poplar","Terrain":"Groomed / Beginner","Skill Level":"Beginner","Age":"Junior","Country":"France"}
  },

  {
    name:"Rossignol Revenant", brand:"Rossignol", price:699.99, badge:"All-Mountain", badgeType:"pop", icon:"🏂",
    cat:"snowboards", sub:"rossignol", gender:"unisex", age:"adult", cond:"new", flatmount:true, popular:160,
    desc:"All-mountain snowboard with a directional shape and AmpTek camber. Built for riders who want power and versatility across the whole mountain.",
    action:"Add to Cart", link:null,
    sizes:[{label:"159W",qty:0,hlId:101818}],
    images:["https://images.evo.com/imgp/700/254638/1107872/clone.jpg"],
    longDesc:"The Rossignol Revenant delivers surfy, next-generation freeride performance with a zest for powder and all-mountain riding. RadCut sidecut technology blends traditional and reverse sidecuts with a flat base for playful turning and seamless edge transitions. 5S Serrated Edges add extra control on hard snow, while a Twin All-Mountain camber profile maintains explosive power and pop — creating a board that rips with loads of energy. AmpTek All-Mountain Rocker offers well-balanced edge grip, stability, forgiveness, and float across every type of terrain. Mid-stiff flex delivers a stable blend of power and forgiveness for all-mountain freestyle riding. Wood cores from sustainably harvested forests.",
    specs:{"Profile":"AmpTek Camber","Core":"Poplar + Basalt","Shape":"Directional","Terrain":"All-Mountain","Skill Level":"Advanced","Country":"France"}
  },
  // ── NEW SNOWBOARDS: SALOMON ──────────────────────────
{
    name:"Salomon Wonder W", brand:"Salomon", price:479.99, badge:"Women's", badgeType:"new", icon:"🏂",
    cat:"snowboards", sub:"salomon", gender:"women", age:"adult", cond:"new", flatmount:true, popular:135,
    desc:"Women's all-mountain freestyle board. S-Rocker profile and cork dampening make it playful and confident across the whole mountain.",
    action:"Add to Cart", link:null,
    sizes:[{label:"144cm",qty:0,hlId:101502},{label:"148cm",qty:0,hlId:101503},{label:"152cm",qty:0,hlId:101504}],
    images:["https://cdn.dam.salomon.com/53ca1f30-10ed-46ca-a753-b2f4008d5f49/L47945300/PNG-2000px-max-72dpi.png?width=2000&fit=cover&optimize=low&bg-color=ffffff&format=pjpg&canvas=116p%2C144p"],
    specs:{"Profile":"S-Rocker","Core":"Paulownia + Cork","Shape":"Twin","Gender":"Women's","Terrain":"All-Mountain Freestyle","Skill Level":"Intermediate","Country":"France"}
  },

  // ── NEW SNOWBOARDS: JONES ────────────────────────────
  {
    name:"Jones Tweaker Pro", brand:"Jones", price:503.99, customMsrp:629.99, customPrice:503.99, msrp:629.99, badge:"Freestyle", badgeType:"new", icon:"🏂",
    cat:"snowboards", sub:"jones", gender:"unisex", age:"adult", cond:"new", flatmount:true, popular:168,
    desc:"Jones' dedicated freestyle twin. Flat-to-rocker profile, a twin shape, and light poplar/paulownia core for maximum creativity in the park and beyond.",
    action:"Add to Cart", link:null,
    sizes:[{label:"149cm",qty:0,hlId:101478},{label:"151cm",qty:0,hlId:101479},{label:"154cm",qty:0,hlId:101480},{label:"156cm",qty:0,hlId:101481},{label:"159cm",qty:0,hlId:101482}],
    images:["https://blauerboardshop.com/cdn/shop/files/JonesTweakerProSnowboard2026-Men_s.png?v=1747191957"],
    longDesc:"The Jones Tweaker Pro is a supercharged true twin built for high-speed terrain park trickery and ripping creative lines anywhere on the mountain. It features the same shape and profile as the standard Tweaker, but with Koroyd in the wood core for improved vibration dampening, a slightly stiffer flex, and a faster base for riding at top speed and hitting the biggest park features. A triple-density bamboo/paulownia/poplar woodcore delivers pop and durability, full camber provides maximum edge hold and snap, and Traction Tech edges make every turn count. For expert freestyle riders who charge the whole mountain. Built with 100% solar power.",
    specs:{"Profile":"Flat Camber + Rocker Tips","Core":"Dual-Density Poplar / Paulownia","Shape":"True Twin","Terrain":"Freestyle / All-Mountain","Skill Level":"Intermediate–Expert","Made In":"USA Design"}
  },
  {
    name:"Jones Mind Expander Twin", brand:"Jones", price:479.99, customMsrp:599.99, customPrice:479.99, msrp:599.99, badge:"Women's", badgeType:"pop", icon:"🏂",
    cat:"snowboards", sub:"jones", gender:"men", age:"adult", cond:"new", flatmount:true, popular:166,
    desc:"Women's surf-inspired all-mountain twin. Christenson Surf Camber and a women's-specific flex deliver effortless float and snappy turns.",
    action:"Add to Cart", link:null,
    sizes:[{label:"142cm",qty:0,hlId:101507},{label:"146cm",qty:0,hlId:101508},{label:"150cm",qty:0,hlId:101509}],
    images:["https://cdn.shopify.com/s/files/1/0641/4722/6759/files/J.25.SNU.MET-gallery-1.webp?v=1768406988"],
    longDesc:"The Jones Mind Expander W is the women\'s version of the surf-inspired Mind Expander — a playful, all-conditions board designed by surf shaper Chris Christenson that thrives in powder and on any terrain feature the mountain throws at you. A friendly flex and Christenson Surf Camber profile offer a surfy, intuitive feel with great float and snappy turn response. The 3D Contour Base enhances glide and flow, while Flax/Basalt stringers keep the ride damp and composed on firmer snow. For women who want a creative, versatile board that makes every run feel like an adventure. Built with 100% solar power.",
    specs:{"Profile":"Christenson Surf Camber","Core":"Poplar / Paulownia","Shape":"Directional Twin","Gender":"Women's","Terrain":"All-Mountain","Skill Level":"Intermediate–Expert","Made In":"USA Design"}
  },
  {
    name:"Jones Twin Sister W", brand:"Jones", price:463.99, customMsrp:579.99, customPrice:463.99, msrp:579.99, badge:"Women's", badgeType:"new", icon:"🏂",
    cat:"snowboards", sub:"jones", gender:"women", age:"adult", cond:"new", flatmount:true, popular:163,
    desc:"Women's all-mountain freestyle twin. Balanced flex, subtle camber, and Traction Tech edges deliver confidence from park laps to powder turns.",
    action:"Add to Cart", link:null,
    sizes:[{label:"140cm",qty:0,hlId:101491},{label:"143cm",qty:0,hlId:101492},{label:"146cm",qty:0,hlId:101493},{label:"149cm",qty:0,hlId:101494},{label:"152cm",qty:0,hlId:101495}],
    images:["https://www.rei.com/media/2a38ee0d-8f2f-40c4-8a08-dba2637db50e?size=2000"],
    longDesc:"The Jones Twin Sister W is Jones\' most versatile all-mountain women\'s board — a directional twin built for riders who want a playful, capable ride that excels in any snow condition. Balanced rocker in the tip and tail delivers float in pow, while camber underfoot provides the pop and edge hold needed for carving groomers and stomping tricks. A friendly flex and short sidecut make it quick to turn and easy to maneuver, while Traction Tech edges and a 3D Contour Base ensure confident performance everywhere on the mountain. The go-to board for women who want to ride it all. Built with 100% solar power.",
    specs:{"Profile":"Camber + Slight Tip/Tail Rocker","Core":"Poplar / Paulownia","Shape":"True Twin","Gender":"Women's","Terrain":"All-Mountain Freestyle","Skill Level":"Beginner–Advanced"}
  },
  {
    name:"Jones Dream Weaver 2.0 W", brand:"Jones", price:423.99, customMsrp:529.99, customPrice:423.99, msrp:529.99, badge:"Women's", badgeType:"new", icon:"🏂",
    cat:"snowboards", sub:"jones", gender:"women", age:"adult", cond:"new", flatmount:true, popular:158,
    desc:"Women's all-mountain board with a directional twin shape and surf-inspired profile. Easy to ride, confident in any conditions.",
    action:"Add to Cart", link:null,
    sizes:[{label:"142cm",qty:0,hlId:101496},{label:"145cm",qty:0,hlId:101497},{label:"154cm",qty:0,hlId:101498}],
    images:["https://blauerboardshop.com/cdn/shop/files/JonesDreamWeaver2.0Snowboard2026-Women_s_1600x.png?v=1747192712"],
    longDesc:"The redesigned Jones Dream Weaver 2.0 is a high-performance all-mountain women\'s board with a friendly flex built for cruising, carving, and freestyle. A dual-density paulownia/poplar woodcore creates a lightweight, poppy, and durable foundation, while biaxial fiberglass delivers a forgiving yet snappy board feel with quick energy transfer. The Christenson Surf Camber profile adds a unique surf-inspired feel that makes every turn fluid and intuitive. Built for women who want a high-performance ride without an intimidating learning curve — perfect for all-mountain progression from resort to freeride terrain. Built with 100% solar power.",
    specs:{"Profile":"Christenson Surf Camber","Core":"Poplar / Paulownia","Shape":"Directional Twin","Gender":"Women's","Terrain":"All-Mountain","Skill Level":"Intermediate"}
  },


  // ── NEW SNOWBOARDS: NIDECKER ─────────────────────────
  {
    name:"Nidecker Gamma APX", brand:"Nidecker", price:619.99, badge:"All-Mountain", badgeType:"pop", icon:"🏂",
    cat:"snowboards", sub:"nidecker", gender:"unisex", age:"adult", cond:"new", flatmount:true, popular:162,
    desc:"Nidecker's flagship all-mountain freestyle board. APX technology delivers unmatched response and power for expert riders.",
    action:"Add to Cart", link:null,
    sizes:[{label:"153cm",qty:0,hlId:101154},{label:"157cm",qty:0,hlId:101155},{label:"159W",qty:0,hlId:101156}],
    images:["https://spokex.com/cdn/shop/files/N.26.SNU.GAX.XX_ac671d3e-7811-4b48-91be-18217b781f27.jpg?v=1772489414&width=1800"],
    longDesc:"The Nidecker Gamma APX is one of the most unique boards ever created — a freestyle twin that takes concepts borrowed from nature and mutates them into a shape built to inspire creativity all over the mountain. It\'s a true twin nose to tail, but asymmetrical from edge to edge: since turns take more force to initiate on your heel edge, Nidecker gave this side a tighter sidecut than the toe edge — so while the board may look uneven, it actually balances your ride equally toe-to-heel. 3D spooning at the tips enhances butter and a surfy feel when switching edges, while a faster base, upgraded sidewalls, and extra carbon give the APX extra creative punch. Surf Rail construction makes it feel more agile and hold a turn like it\'s on rails. Swiss-designed, snowboard-obsessed since 1984. Backed by a 2-year warranty extendable to 3.",
    specs:{"Profile":"Camber / Rocker Hybrid","Core":"Paulownia + Poplar","Shape":"Directional Twin","Terrain":"All-Mountain","Skill Level":"Advanced–Expert","Country":"Switzerland"}
  },
  {
    name:"Nidecker Elle W", brand:"Nidecker", price:369.99, badge:"Women's", badgeType:"new", icon:"🏂",
    cat:"snowboards", sub:"nidecker", gender:"women", age:"adult", cond:"new", flatmount:true, popular:130,
    desc:"Women's all-mountain board with a catch-free rocker profile. Forgiving and fun for riders building confidence.",
    action:"Add to Cart", link:null,
    sizes:[{label:"139cm",qty:0,hlId:101160},{label:"143cm",qty:0,hlId:101161},{label:"147cm",qty:0,hlId:101162},{label:"151cm",qty:0,hlId:101163}],
    images:["https://content.backcountry.com/images/items/1200/NDK/NDKD07C/ONECOL.jpg"],
    longDesc:"With a super-friendly flex, quality construction, and a stunning graphic, the Nidecker Elle W is guaranteed to keep you stoked on the mountain. It features Nidecker\'s most forgiving FlatRock profile, making it perfectly suited to laid-back, cruisy turns with minimal chance of catching an edge. Built for women who are building confidence and want a board that gets out of the way and lets them ride. Fun, approachable, and stylish — a great first or second snowboard for women ready to explore the mountain. Swiss-designed, snowboard-obsessed since 1984. Backed by a 2-year warranty extendable to 3.",
    specs:{"Profile":"Rocker","Core":"Poplar","Shape":"True Twin","Gender":"Women's","Terrain":"All-Mountain","Skill Level":"Beginner–Intermediate","Country":"Switzerland"}
  },
  {
    name:"Rossignol Soulside W", brand:"Rossignol", price:399.99, badge:"Women's", badgeType:"new", icon:"🏂",
    cat:"snowboards", sub:"rossignol", gender:"women", age:"adult", cond:"new", flatmount:true, popular:132,
    desc:"Women's directional all-mountain board. Hybrid profile and a light core make it easy to ride all day in any conditions.",
    action:"Add to Cart", link:null,
    sizes:[{label:"141cm",qty:0,hlId:101505},{label:"149cm",qty:0,hlId:101506}],
    images:["https://images.evo.com/imgp/700/268707/1207307/rossignol-soulside-snowboard-women-s-2026-.jpg"],
    longDesc:"Versatile and forgiving, the Rossignol Soulside W is a women\'s all-mountain snowboard built for building skills and expanding your range on the mountain. The right combination of rocker and soft flex makes for a maneuverable, catch-free ride that lets you push into new terrain and explore the mountain in any snow conditions. Confidence-inspiring and easy to ride — a perfect companion for women looking to progress their snowboarding across the whole resort. Wood cores from sustainably harvested forests.",
    specs:{"Profile":"Hybrid Rocker / Flat","Core":"Poplar","Shape":"Directional","Gender":"Women's","Terrain":"All-Mountain","Skill Level":"Beginner–Intermediate","Country":"Switzerland"}
  },

  // ── NEW SNOWBOARDS: ROME ─────────────────────────────
  {
    name:"Rossignol Ampage Vol. 2 Wide", brand:"Rossignol", price:349.99, customMsrp:349.99, customPrice:349.99, badge:"2026 Model", badgeType:"pop", icon:"🏂",
    cat:"snowboards", sub:"rossignol", gender:"unisex", age:"adult", cond:"new", popular:142,
    desc:"2026 model at a great price. Wide all-mountain freestyle board for larger feet or extra float.",
    action:"Add to Cart", link:null,
    sizes:[{label:"156W",qty:0,hlId:100841}],
    images:["https://www.evo.com/cdn/shop/files/product-image-1262117.jpg?v=1767739622&width=1200"],
    specs:{"Brand":"Rossignol","Size":"156W","Model Year":"2026","Flex":"Soft"}
  },
  {
    name:"Rossignol Ampage Vol. 1", brand:"Rossignol", price:379.99, badge:"All-Mountain", badgeType:"new", icon:"🏂",
    cat:"snowboards", sub:"rossignol", gender:"unisex", age:"adult", cond:"new", flatmount:true, popular:138,
    desc:"All-mountain freestyle board built for everyday progression. Poplar core and a forgiving directional twin shape for groomers, park, and everything in between.",
    action:"Add to Cart", link:null,
    sizes:[{label:"146cm",qty:0,hlId:101472},{label:"151cm",qty:0,hlId:101473},{label:"155cm",qty:0,hlId:101474}],
    images:["https://images.evo.com/imgp/700/268697/1262117/clone.jpg"],
    longDesc:"One of the best freestyle boards to learn and progress on, the Rossignol Ampage Vol. 1 delivers easy, budget-friendly fun for entry-level and developing riders. A forgiving soft flex and all-mountain shape make it easy to control and maneuver, while enough stability and pop keeps it entertaining as your skills improve. An ideal board for beginner to intermediate riders who want to explore the whole mountain without breaking the bank. Wood cores from sustainably harvested forests.",
    specs:{"Profile":"Flat-to-Rocker","Core":"Aspen / Poplar","Shape":"Directional Twin","Terrain":"All-Mountain Freestyle","Skill Level":"Beginner–Intermediate","Country":"USA Design"}
  },

  {
    name:"Rome Ravine", brand:"Rome", price:599.99, badge:"All-Mountain", badgeType:"new", icon:"🏂",
    cat:"snowboards", sub:"rome", gender:"unisex", age:"adult", cond:"new", flatmount:true, popular:148,
    desc:"Directional all-mountain charger. Poplar core and tip/tail rocker handle everything from groomed runs to side-country pow.",
    action:"Add to Cart", link:null,
    sizes:[{label:"155cm",qty:0,hlId:102332},{label:"158cm",qty:0,hlId:102333},{label:"159W",qty:0,hlId:102334},{label:"162W",qty:0,hlId:102335}],
    images:["https://romesnowboards.com/cdn/shop/files/2627_rome_web_bd_ravine_1.jpg?v=1787636964&width=3840","https://romesnowboards.com/cdn/shop/files/2627_rome_web_bd_ravine_2.jpg?v=1787636964&width=3840","https://romesnowboards.com/cdn/shop/files/2627_rome_web_bd_ravine_3.jpg?v=1787636964&width=3840","https://romesnowboards.com/cdn/shop/files/2627_rome_web_bd_ravine_4.jpg?v=1787636964&width=3840","https://romesnowboards.com/cdn/shop/files/2627_rome_web_bd_ravine_5.jpg?v=1787636964&width=3840","https://romesnowboards.com/cdn/shop/files/2627_rome_web_bd_ravine_6.jpg?v=1787636964&width=3840","https://romesnowboards.com/cdn/shop/files/2627_rome_web_bd_ravine_7.jpg?v=1787636964&width=3840"],
    longDesc:"The Rome Ravine is a versatile all-mountain director — designed for riders who want float in the deep and reliable edge hold on hardpack. Directional Diamond 3D in the nose helps hover through powder and crank long, smooth turns, while the Free-The-Ride Camber profile — rockered in the nose, flat under the front foot, and positively cambered in the tail — delivers the perfect blend of torsional response and playfulness. Super responsive and powerfully snappy, it handles everything from early-season hardpack to pow days with the crew and slushy spring laps with equal ease. From Vermont snowboarders who\'ve built boards since 1996.",
    specs:{"Profile":"Directional Rocker","Core":"Aspen / Poplar","Shape":"Directional","Terrain":"All-Mountain","Skill Level":"Intermediate–Advanced","Country":"USA Design"}
  },
  {
    name:"Rome Ravine W", brand:"Rome", price:579.99, badge:"Women's", badgeType:"new", icon:"🏂",
    cat:"snowboards", sub:"rome", gender:"women", age:"adult", cond:"new", flatmount:true, popular:140,
    desc:"Women's directional all-mountain board. Lighter construction and women's-specific flex for confident riding all over the mountain.",
    action:"Add to Cart", link:null,
    sizes:[{label:"144cm",qty:0,hlId:101499},{label:"147cm",qty:0,hlId:101500},{label:"150cm",qty:0,hlId:101501}],
    images:["https://blauerboardshop.com/cdn/shop/files/2026Women_sRomeRavineSnowboard.png?v=1748125953&width=800"],
    longDesc:"The Rome Women\'s Ravine is a versatile all-mountain boss built for riders who want a dependable board that handles business no matter the conditions. Directional Diamond 3D float, the reliable edge hold of Free-The-Ride Camber, and a medium flex profile inspire confidence in any snow scenario. Rockered in the nose, flat under the front foot, and positively cambered in the tail — this torsionally playful board hovers through powder and locks into the hardest hardpack with ease. As quick and nimble as a shortboard in the tightest trees, yet able to open up and haul down the gnarliest terrain you can find. A rider favorite for a reason. From Vermont snowboarders who\'ve built boards since 1996.",
    specs:{"Profile":"Directional Rocker","Core":"Aspen / Poplar","Shape":"Directional","Gender":"Women's","Terrain":"All-Mountain","Skill Level":"Intermediate","Country":"USA Design"}
  },
  // ── NEW SNOWBOARDS: MISC ─────────────────────────────
  {
    name:"Icelantic × NeverSummer Board", brand:"Icelantic", price:499.0, customMsrp:699.0, customPrice:499.0, msrp:699.0, badge:"Collab", badgeType:"pop", icon:"🏂",
    cat:"snowboards", sub:"jones", gender:"unisex", age:"adult", cond:"new", flatmount:true, popular:175,
    desc:"A unique collaboration between Icelantic and NeverSummer. Combines Icelantic's graphic artistry with NeverSummer's proven board construction.",
    action:"Add to Cart", link:null,
    sizes:[{label:"154cm",qty:0,hlId:101773},{label:"157cm",qty:0,hlId:101774}],
    images:["https://store.icelanticskis.jp/cdn/shop/products/s_IMG_1710_426x1280.jpg?v=1671226676","https://store.icelanticskis.jp/cdn/shop/products/s_IMG_1711_426x1280.jpg?v=1671226675"],
    longDesc:"A one-of-a-kind collaboration between two iconic Colorado snowboard brands — Icelantic and Never Summer. This limited-edition board brings together Icelantic\'s art-driven culture and Never Summer\'s legendary tube construction and STS Sintered base technology. The result is a board with serious performance credentials, a unique graphic story, and the kind of heritage only two Denver-based companies with decades of mountain riding between them could produce. A collector\'s piece that rips.",
    specs:{"Collaboration":"Icelantic × NeverSummer","Profile":"Camber / Rocker Hybrid","Core":"NeverSummer Construction","Terrain":"All-Mountain","Skill Level":"Intermediate–Advanced"}
  },
  // SOCKS

  // ── NEW SNOWBOARDS ────────────────────────────────────────
  {
    name:"Rossignol Jibfluence", brand:"Rossignol", price:379.99, badge:"Jr", badgeType:"new", icon:"🏂",
    cat:"snowboards", sub:"rossignol", gender:"unisex", age:"kid", cond:"new", flatmount:true, popular:118,
    desc:"Kids' all-mountain freestyle snowboard from Rossignol. Poplar core, forgiving flex, and a twin shape built for young riders learning to progress in the park and on the mountain. Available in 135cm and 150cm.",
    action:"Add to Cart", link:null,
    sizes:[{label:"135cm",qty:0,hlId:100377},{label:"150cm",qty:0,hlId:101445}],
    images:["https://cdn.shopify.com/s/files/1/0679/7882/1782/files/product-image-1207312.jpg?v=1767737422"],
    longDesc:"The Rossignol Jibfluence is a junior all-mountain freestyle snowboard built for young riders who are ready to explore the park and the whole mountain. A poplar core, forgiving flex, and twin shape provide a fun, playful ride that encourages progression in the park and out, while the flat-to-rocker profile keeps it catch-free and easy to maneuver. Built for kids who are ready to take their freestyle snowboarding to the next level. Comes in junior sizes. Wood cores from sustainably harvested forests.",
    specs:{"Brand":"Rossignol","Profile":"Flat-to-Rocker","Core":"Poplar","Shape":"Twin","Terrain":"All-Mountain / Park","Skill Level":"Beginner–Intermediate","Age":"Junior","Country":"France"}
  },
  {
    name:"Rossignol UltraViolet Snowboard", brand:"Rossignol", price:349.99, badge:"", badgeType:"default", icon:"🏂",
    cat:"snowboards", sub:"rossignol", gender:"unisex", age:"adult", cond:"new", flatmount:true, popular:122,
    desc:"All-mountain freestyle snowboard with a poplar core and forgiving directional twin shape. A great step-up board for intermediate riders exploring the whole mountain.",
    action:"Add to Cart", link:null,
    sizes:[{label:"139cm",qty:0,hlId:100842}],
    images:["https://images.evo.com/imgp/700/268711/1207319/clone.jpg"],
    longDesc:"One of the best freestyle boards to learn and progress on, the Rossignol UltraViolet delivers easy, budget-friendly fun for entry-level riders. A soft, forgiving flex and all-mountain twin shape make it easy to control, catch-free, and endlessly entertaining for new riders finding their footing on the mountain. A go-anywhere board that makes every run fun. Wood cores from sustainably harvested forests.",
    specs:{"Brand":"Rossignol","Profile":"Flat-to-Rocker","Core":"Poplar","Shape":"Directional Twin","Terrain":"All-Mountain","Skill Level":"Intermediate","Country":"France"}
  },
  {
    name:"Salomon Assassin", brand:"Salomon", price:649.99, customMsrp:649.99, customPrice:649.99, badge:"New", badgeType:"new", icon:"🏂",
    cat:"snowboards", sub:"salomon", gender:"unisex", age:"adult", cond:"new", flatmount:true, popular:179,
    desc:"Salomon's directional all-mountain freeride board. Built for riders who want power and float across variable terrain, from groomers to deep days.",
    longDesc:"The Salomon Assassin is a directional all-mountain freeride board built for riders who want to charge with confidence across the whole mountain. Strong edge hold and a stable platform make it equally at home ripping groomers or floating through fresh snow, giving aggressive riders the power and precision they need to push their limits.",
    action:"Add to Cart", link:null,
    sizes:[
      {label:"159",  qty:0, hlId:101980},
      {label:"158W", qty:0, hlId:101982},
      {label:"163W", qty:0, hlId:101983},
    ],
    images:[
      "https://cdn.shopify.com/s/files/1/0670/5135/6456/files/2027-salomon-assassin-snowboard-l49291700-1-l49291700.jpg?v=1778769540",
      "https://paulreader.com.au/cdn/shop/files/SalomonAssassin2027-Underside_Purple.jpg?v=1770596811"
    ],
    specs:{"Brand":"Salomon","Model":"Assassin","Shape":"Directional","Terrain":"All-Mountain / Freeride","Skill Level":"Advanced–Expert"}
  },
  {
    name:"Rome Artifact", brand:"Rome", price:499.99, customMsrp:499.99, customPrice:499.99, badge:"New", badgeType:"new", icon:"🏂",
    cat:"snowboards", sub:"rome", gender:"unisex", age:"adult", cond:"new", flatmount:true, popular:177,
    desc:"Rome's versatile all-mountain board built for riders who want a playful, capable ride anywhere on the hill.",
    longDesc:"The Rome Artifact is a versatile all-mountain board built to handle whatever the mountain throws at you — groomers, side hits, and everything in between. A balanced, approachable flex keeps it forgiving enough for progressing riders while still delivering the pop and response more advanced riders look for.",
    action:"Add to Cart", link:null,
    sizes:[
      {label:"150",  qty:0, hlId:102328},
      {label:"153",  qty:0, hlId:102329},
      {label:"156",  qty:0, hlId:102330},
      {label:"157W", qty:0, hlId:102331},
    ],
    images:[
      "https://www.evo.com/cdn/shop/files/product-image-1308344.jpg?v=1781550733&width=1200"
    ],
    specs:{"Brand":"Rome","Model":"Artifact","Terrain":"All-Mountain","Skill Level":"Beginner–Intermediate"}
  },
  {
    name:"Rossignol One Wide", brand:"Rossignol", price:649.99, customMsrp:649.99, customPrice:649.99, badge:"New", badgeType:"new", icon:"🏂",
    cat:"snowboards", sub:"rossignol", gender:"unisex", age:"adult", cond:"new", flatmount:true, popular:176,
    desc:"Rossignol's all-mountain freestyle board in a wide platform. A versatile, directional twin built for riders who want one board that does it all.",
    longDesc:"The Rossignol One Wide is a go-anywhere all-mountain freestyle board, built in a wider platform for riders who need the extra width underfoot. A directional twin shape keeps it playful in the park while still holding its own charging groomers and exploring the whole mountain.",
    action:"Add to Cart", link:null,
    sizes:[
      {label:"165W", qty:0, hlId:100359},
    ],
    images:[
      "https://www.mountainshop.net/wp-content/uploads/2025/10/Rossignol-One-Snowboard-2026-3-700x700.png"
    ],
    specs:{"Brand":"Rossignol","Model":"One Wide","Shape":"Directional Twin","Terrain":"All-Mountain / Freestyle","Skill Level":"Intermediate–Advanced","Country":"France"}
  },

  // ── NIDECKER SNOWBOARD BOOTS ─────────────────────────────
  {
    name:"Nidecker Kita APX", brand:"Nidecker", price:459.99, customMsrp:459.99, customPrice:459.99, badge:"New", badgeType:"new", icon:"👟",
    cat:"snowboard-boots", sub:"nidecker", gender:"men", age:"adult", cond:"new", popular:180,
    desc:"Nidecker\'s top-of-the-line all-mountain snowboard boot. The Kita APX delivers a precise, locked-in fit with powerful energy transfer and all-day comfort. Swiss-designed, snowboard-obsessed since 1984.",
    longDesc:"The Nidecker Kita APX is Nidecker\'s flagship performance snowboard boot — engineered for riders who demand the best combination of precision, power, and comfort. A heat-moldable liner conforms to your foot for a custom fit, while the dual-zone lacing system delivers independent upper and lower lockdown. The stiff flex chassis transfers energy directly to your board with zero lag, making it the choice of aggressive all-mountain riders who want total control in any condition. Swiss-designed, snowboard-obsessed since 1984. Backed by a 2-year warranty extendable to 3.",
    action:"Add to Cart", link:null,
    sizes:[
      {label:"8.0",qty:0,hlId:101115},
      {label:"8.5",qty:0,hlId:101116},
      {label:"9.0",qty:0,hlId:101123},
      {label:"9.5",qty:0,hlId:101117},
      {label:"10",qty:0,hlId:101118},
      {label:"10.5",qty:0,hlId:101119},
      {label:"11.0",qty:0,hlId:101120},
      {label:"11.5",qty:0,hlId:101121},
      {label:"12",qty:0,hlId:101122},
      {label:"13.0",qty:0,hlId:101841}
    ],
    images:[
      "https://www.christysports.com/dw/image/v2/BGBB_PRD/on/demandware.static/-/Sites-master-winter/default/dw2b6fd81b/8201271_020_1.jpg?sw=1600&sh=1600",
      "https://blauerboardshop.com/cdn/shop/files/Nidecker_Kita_APX_Snowboard_Boots_2026_-_Men_s_2_1600x.jpg?v=1760210082",
      "https://blauerboardshop.com/cdn/shop/files/Nidecker_Kita_APX_Snowboard_Boots_2026_-_Men_s_1600x.jpg?v=1760210082"
    ],
    specs:{"Brand":"Nidecker","Color":"Black","Flex":"Stiff","Lacing":"Dual-Zone","Liner":"Heat-Moldable","Terrain":"All-Mountain","Skill Level":"Intermediate–Expert","Country":"Switzerland"}
  },
  {
    name:"Nidecker Cascade M", brand:"Nidecker", price:279.99, customMsrp:279.99, customPrice:279.99, badge:"New", badgeType:"new", icon:"👟",
    cat:"snowboard-boots", sub:"nidecker", gender:"men", age:"adult", cond:"new", popular:179,
    desc:"Nidecker's versatile men's all-mountain snowboard boot in Black. Comfortable, reliable performance for riders at every level.",
    longDesc:"The Nidecker Cascade is a dependable all-mountain boot built for riders who want consistent comfort and performance without overcomplicating things. A balanced flex and quality liner construction deliver all-day comfort on the hill, backed by Nidecker's Swiss design heritage dating back to 1984.",
    action:"Add to Cart", link:null,
    sizes:[
      {label:"7.0",  qty:0, hlId:101124},
      {label:"7.5",  qty:0, hlId:101125},
      {label:"8.0",  qty:0, hlId:101126},
      {label:"8.5",  qty:0, hlId:101127},
      {label:"9.0",  qty:0, hlId:101128},
      {label:"9.5",  qty:0, hlId:101129},
      {label:"10.0", qty:0, hlId:101130},
      {label:"10.5", qty:0, hlId:101131},
      {label:"11.0", qty:0, hlId:101132},
      {label:"11.5", qty:0, hlId:101133},
      {label:"12.0", qty:0, hlId:101134},
      {label:"13.0", qty:0, hlId:101135},
    ],
    images:[
      "https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/BCJK_STG/on/demandware.static/-/Sites-global-master-catalog/default/dw7977337a/images/large/1160980_BLCK_1.jpg?sw=800&sh=800",
      "https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/BCJK_STG/on/demandware.static/-/Sites-global-master-catalog/default/dwe01869bd/images/large/1160980_BLCK_2.jpg?sw=800&sh=800",
      "https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/BCJK_STG/on/demandware.static/-/Sites-global-master-catalog/default/dw8fe0647a/images/large/1160980_BLCK_3.jpg?sw=800&sh=800",
      "https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/BCJK_STG/on/demandware.static/-/Sites-global-master-catalog/default/dwcb4a83c5/images/large/1160980_BLCK_5.jpg?sw=800&sh=800"
    ],
    specs:{"Brand":"Nidecker","Model":"Cascade","Color":"Black","Terrain":"All-Mountain","Gender":"Men's","Skill Level":"Beginner–Intermediate","Country":"Switzerland"}
  },
  {
    name:"Nidecker Cascade W", brand:"Nidecker", price:269.99, customMsrp:269.99, customPrice:269.99, badge:"New", badgeType:"new", icon:"👟",
    cat:"snowboard-boots", sub:"nidecker", gender:"women", age:"adult", cond:"new", popular:178,
    desc:"Nidecker's versatile women's all-mountain snowboard boot in Black. Comfortable, reliable performance for riders at every level.",
    longDesc:"The Nidecker Cascade W is a dependable all-mountain boot built for riders who want consistent comfort and performance without overcomplicating things. A balanced flex and quality liner construction deliver all-day comfort on the hill, backed by Nidecker's Swiss design heritage dating back to 1984.",
    action:"Add to Cart", link:null,
    sizes:[
      {label:"5.5", qty:0, hlId:101142},
      {label:"6.0", qty:0, hlId:101143},
      {label:"6.5", qty:0, hlId:101144},
      {label:"7.0", qty:0, hlId:101136},
      {label:"7.5", qty:0, hlId:101137},
      {label:"8.0", qty:0, hlId:101138},
      {label:"8.5", qty:0, hlId:101139},
      {label:"9.0", qty:0, hlId:101140},
      {label:"9.5", qty:0, hlId:101141},
    ],
    images:[
      "https://www.nidecker.com/cdn/shop/files/N.25.BTW.CSW.BK-Cascade_W_Black-2.webp?v=1786452073&width=1946",
      "https://www.nidecker.com/cdn/shop/files/N.25.BTW.CSW.BK-Cascade_W_Black-1.webp?v=1786452076&width=1946",
      "https://www.nidecker.com/cdn/shop/files/N.25.BTW.CSW.BK-Cascade_W_Black-3.webp?v=1786452072&width=1946",
      "https://www.nidecker.com/cdn/shop/files/N.25.BTW.CSW.BK-Cascade_W_Black-5.webp?v=1786452076&width=1946"
    ],
    specs:{"Brand":"Nidecker","Model":"Cascade W","Color":"Black","Terrain":"All-Mountain","Gender":"Women's","Skill Level":"Beginner–Intermediate","Country":"Switzerland"}
  },
  {
    name:"Nidecker Altai M", brand:"Nidecker", price:319.99, customMsrp:319.99, customPrice:319.99, badge:"New", badgeType:"new", icon:"👟",
    cat:"snowboard-boots", sub:"nidecker", gender:"men", age:"adult", cond:"new", popular:181,
    desc:"Nidecker's performance men's all-mountain boot in Black. A precise, locked-in fit for riders who want responsive power transfer.",
    longDesc:"The Nidecker Altai is built for riders who want a precise, responsive fit without sacrificing comfort. A locked-in chassis delivers direct power transfer to your board, while Nidecker's Swiss design heritage ensures quality construction that holds up run after run.",
    action:"Add to Cart", link:null,
    sizes:[
      {label:"7.0",  qty:0, hlId:101103},
      {label:"7.5",  qty:0, hlId:101104},
      {label:"8.0",  qty:0, hlId:101105},
      {label:"8.5",  qty:0, hlId:101106},
      {label:"9.0",  qty:0, hlId:101107},
      {label:"9.5",  qty:0, hlId:101108},
      {label:"10.0", qty:0, hlId:101109},
      {label:"10.5", qty:0, hlId:101110},
      {label:"11",   qty:0, hlId:101111},
      {label:"12",   qty:0, hlId:101112},
      {label:"13",   qty:0, hlId:101113},
      {label:"14",   qty:0, hlId:101114},
    ],
    images:[
      "https://content.backcountry.com/images/items/1200/NDK/NDKD0A9/BLA.jpg",
      "https://content.backcountry.com/images/items/1200/NDK/NDKD0A9/BLA_D4.jpg",
      "https://content.backcountry.com/images/items/1200/NDK/NDKD0A9/BLA_D2.jpg",
      "https://content.backcountry.com/images/items/1200/NDK/NDKD0A9/BLA_D1.jpg"
    ],
    specs:{"Brand":"Nidecker","Model":"Altai","Color":"Black","Terrain":"All-Mountain","Gender":"Men's","Skill Level":"Intermediate–Advanced","Country":"Switzerland"}
  },
  {
    name:"Nidecker Altai W", brand:"Nidecker", price:319.99, customMsrp:319.99, customPrice:319.99, badge:"New", badgeType:"new", icon:"👟",
    cat:"snowboard-boots", sub:"nidecker", gender:"women", age:"adult", cond:"new", popular:182,
    desc:"Nidecker's performance women's all-mountain boot in Purple. A precise, locked-in fit for riders who want responsive power transfer.",
    longDesc:"The Nidecker Altai W is built for riders who want a precise, responsive fit without sacrificing comfort. A locked-in chassis delivers direct power transfer to your board, while Nidecker's Swiss design heritage ensures quality construction that holds up run after run.",
    action:"Add to Cart", link:null,
    sizes:[
      {label:"5.5", qty:0, hlId:101145},
      {label:"6.0", qty:0, hlId:101146},
      {label:"6.5", qty:0, hlId:101147},
      {label:"7.0", qty:0, hlId:101148},
      {label:"7.5", qty:0, hlId:101149},
      {label:"8.0", qty:0, hlId:101150},
      {label:"8.5", qty:0, hlId:101151},
      {label:"9.0", qty:0, hlId:101152},
      {label:"9.5", qty:0, hlId:101153},
    ],
    images:[
      "https://www.nidecker.com/cdn/shop/files/N.26.BTW.ATW.C1-Altai_W_Purple-1.webp?v=1786448609&width=1946",
      "https://www.nidecker.com/cdn/shop/files/N.26.BTW.ATW.C1-Altai_W_Purple-4.webp?v=1786448610&width=1946",
      "https://www.nidecker.com/cdn/shop/files/N.26.BTW.ATW.C1-Altai_W_Purple-5.webp?v=1786448609&width=1946",
      "https://www.nidecker.com/cdn/shop/files/N.26.BTW.ATW.C1-Altai_W_Purple-3.webp?v=1786448609&width=1946"
    ],
    specs:{"Brand":"Nidecker","Model":"Altai W","Color":"Purple","Terrain":"All-Mountain","Gender":"Women's","Skill Level":"Intermediate–Advanced","Country":"Switzerland"}
  },
  {
    name:"Salomon Faction BOA", brand:"Salomon", price:279.99, customMsrp:279.99, customPrice:279.99, badge:"", badgeType:"default", icon:"👟",
    cat:"snowboard-boots", sub:"salomon", gender:"men", age:"adult", cond:"new", popular:175,
    desc:"Salomon\'s mid-range all-mountain snowboard boot. The Faction BOA delivers a dialed fit with single-zone BOA lacing, a medium flex, and comfortable all-day performance across the whole mountain.",
    longDesc:"The Salomon Faction BOA is a versatile all-mountain snowboard boot built for riders who want a reliable, comfortable setup without breaking the bank. Single-zone BOA lacing lets you dial in your fit quickly and consistently every session, while the medium flex chassis delivers a balanced blend of response and forgiveness across groomed runs and variable terrain. Salomon\'s Custom Fit liner molds to your foot for personalized comfort, and the rubber outsole provides solid traction on the hill and off. A go-everywhere boot for all-mountain riders who want quality Salomon engineering at an accessible price point.",
    action:"Add to Cart", link:null,
    sizes:[
      {label:"7",qty:0,hlId:100682},
      {label:"7.5",qty:0,hlId:101092},
      {label:"8",qty:0,hlId:100683},
      {label:"8.5",qty:0,hlId:100684},
      {label:"9",qty:0,hlId:100685},
      {label:"9.5",qty:0,hlId:100686},
      {label:"10",qty:0,hlId:100687},
      {label:"10.5",qty:0,hlId:100688},
      {label:"11",qty:0,hlId:100689},
      {label:"11.5",qty:0,hlId:100690},
      {label:"12",qty:0,hlId:100691},
      {label:"12.5",qty:0,hlId:101093},
      {label:"13",qty:0,hlId:100692}
    ],
    images:[
      "https://images.evo.com/imgp/700/239780/1013306/salomon-faction-boa-snowboard-boots-.jpg",
      "https://images.evo.com/imgp/700/239780/1013305/salomon-faction-boa-snowboard-boots-.jpg"
    ],
    specs:{"Brand":"Salomon","Lacing":"BOA Single-Zone","Flex":"Medium","Liner":"Custom Fit Molding","Terrain":"All-Mountain","Skill Level":"Beginner–Intermediate","Color":"Black / Steeple Gray"}
  },
  {
    name:"Bataleon Salsa Double BOA", brand:"Bataleon", price:439.99, customMsrp:439.99, customPrice:439.99, badge:"New", badgeType:"new", icon:"👟",
    cat:"snowboard-boots", sub:"bataleon", gender:"women", age:"adult", cond:"new", popular:174,
    desc:"Bataleon's all-mountain Salsa boot with a Dual BOA system for a secure, precise fit. Vibram outsole and P2 Premium Liner deliver comfort and traction from powder to groomers.",
    longDesc:"The Bataleon Salsa is built for all-mountain riders who want performance and comfort in equal measure. A Vibram outsole and updated midsole pair with a Dual BOA system for a secure, dialed-in fit, while the P2 Premium Liner with stitched ankle support keeps you comfortable and in control all day long — whether you're navigating powder or carving groomers.",
    action:"Add to Cart", link:null,
    sizes:[
      {label:"8",    qty:0, hlId:101945},
      {label:"8.5",  qty:0, hlId:101946},
      {label:"9",    qty:0, hlId:101947},
      {label:"9.5",  qty:0, hlId:101948},
      {label:"10",   qty:0, hlId:101949},
      {label:"10.5", qty:0, hlId:101950},
      {label:"11",   qty:0, hlId:101951},
      {label:"11.5", qty:0, hlId:101952},
      {label:"12",   qty:0, hlId:101953},
      {label:"13",   qty:0, hlId:101954},
    ],
    images:[
      "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQeqxfyFeik6xwYhiC6NOU6nEym996MZMUGbJ16phKRQQ7-gJk0l9j0ZlABQbMxxmtxhtv1oQRJeDc0df2nFkwOtCIlra1ywQ-HhetxD7Ka7u_GMzcWgWJ3",
      "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQw0zSPlBGGxrgc2rlW32whI5uP0iBtzk2Cu1DR24LFXN-U6A29FhV3Lnq_zN60SQPkPHDW2475_EglQcl8mJ5-lBiiO5_nfN_nwfecGfczuS93KLqQ_Dax",
      "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQJsQHI4mIqIRkpWR7BnLW1e_T8jrEvDK2T7teRv8FHo1xQmCpfdOsnjp-h1LwuHy0hyFNlhxFB5U7XHN4qahCU8VZ7JnLDqPGPOhEHO2dtOuVpVndREPjb",
      "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSJe_HlgVCV4eSQOZlSA0C8M8Pa4SA4Ft4FhsodrXHJ-eih5Jb1_QweMRDn_or-NEXCM7pYeahka6D6H41cVL1uAyNLVozofPoOq_snqGTG5H5M0Luq-KJSqb0",
      "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTOeTE0YuBfrgLfxih2HetIjsTaRf3j05V10XFvFAYoKNy1Xi6X2kcpqVKP1gHga9hpEsTb9Eb6jp1MhShYaZLBFHlntoADrBvuJWTVeY4",
      "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTsHtz8M2OK-MTPoAs9RsZgFvARgac_2AcSJUIqwiDsn9dpgzyzQdSYqVGIEjqMNMAiiNU2twrykNu0fW7z8HWJ250xy-9X2QGpXwHi"
    ],
    specs:{"Brand":"Bataleon","Model":"Salsa Double BOA","Lacing":"Dual BOA","Outsole":"Vibram","Liner":"P2 Premium","Terrain":"All-Mountain","Gender":"Women's"}
  },
  {
    name:"Salomon Dialogue Dual BOA Wide", brand:"Salomon", price:429.99, customMsrp:429.99, customPrice:429.99, badge:"New", badgeType:"new", icon:"👟",
    cat:"snowboard-boots", sub:"salomon", gender:"men", age:"adult", cond:"new", popular:176,
    desc:"Salomon's freestyle-focused Dialogue boot in a Wide fit. Dual Zone BOA lacing with STR8JKT Pro heel harness delivers precise, customizable support.",
    longDesc:"The Salomon Dialogue Dual BOA Wide blends all-day comfort with progressive freestyle performance in a wider fit for riders who need extra volume. The H4/M+2 Dual Zone BOA system lets you dial in independent adjustments for the upper and lower zones, while the STR8JKT Pro internal harness locks in your heel for confident lateral control. A mid-stiff flex handles everything from park laps to side hits without sacrificing board feel.",
    action:"Add to Cart", link:null,
    sizes:[
      {label:"7",    qty:0, hlId:102137},
      {label:"7.5",  qty:0, hlId:102138},
      {label:"8",    qty:0, hlId:102139},
      {label:"8.5",  qty:0, hlId:102140},
      {label:"9",    qty:0, hlId:102141},
      {label:"9.5",  qty:0, hlId:102142},
      {label:"10",   qty:0, hlId:102143},
      {label:"11",   qty:0, hlId:102144},
      {label:"11.5", qty:0, hlId:102145},
      {label:"13",   qty:0, hlId:102146},
    ],
    images:[
      "https://www.evo.com/cdn/shop/files/product-image-1311297.jpg?v=1782160333&width=1200",
      "https://www.evo.com/cdn/shop/files/product-image-1311298.jpg?v=1782160333&width=2560",
      "https://www.evo.com/cdn/shop/files/product-image-1311301.jpg?v=1782160333&width=2560"
    ],
    specs:{"Brand":"Salomon","Model":"Dialogue Dual BOA Wide","Lacing":"H4/M+2 Dual Zone BOA","Flex":"Mid-Stiff","Fit":"Wide","Terrain":"Freestyle / All-Mountain","Skill Level":"Intermediate–Advanced"}
  },
  {
    name:"Salomon Launch BOA SJ", brand:"Salomon", price:389.99, customMsrp:389.99, customPrice:389.99, badge:"New", badgeType:"new", icon:"👟",
    cat:"snowboard-boots", sub:"salomon", gender:"men", age:"adult", cond:"new", popular:177,
    desc:"Salomon's accessible all-mountain Launch BOA SJ. Easy, reliable BOA lacing with a comfortable medium flex for riders at every level.",
    longDesc:"The Salomon Launch BOA SJ delivers quick, reliable BOA lacing in a comfortable, approachable package built for all-mountain riding. A medium flex chassis keeps things forgiving for developing riders while still holding up to a full day on the hill. A great entry point into Salomon's BOA boot lineup.",
    action:"Add to Cart", link:null,
    sizes:[
      {label:"8",    qty:0, hlId:100774},
      {label:"8.5",  qty:0, hlId:100775},
      {label:"9",    qty:0, hlId:102147},
      {label:"9.5",  qty:0, hlId:102148},
      {label:"10",   qty:0, hlId:102149},
      {label:"10.5", qty:0, hlId:102150},
      {label:"11",   qty:0, hlId:102151},
      {label:"11.5", qty:0, hlId:102152},
      {label:"12",   qty:0, hlId:102153},
      {label:"12.5", qty:0, hlId:102154},
    ],
    images:[
      "https://cdn.dam.salomon.com/0014fcf7-0671-47c1-8bdd-b40c010d18ef/L49262200/PNG-2000px-max-72dpi.png?width=640&fit=cover&optimize=medium&bg-color=f5f5f5&format=pjpg&auto=avif&canvas=116p%2C144p",
      "https://cdn.dam.salomon.com/90ad1c0a-93a8-45fc-ad82-b3e200a0ebf5/L49262200/PNG-2000px-max-72dpi.png?width=640&fit=cover&optimize=medium&bg-color=f5f5f5&format=pjpg&auto=avif&canvas=116p%2C144p",
      "https://cdn.dam.salomon.com/ea6a2168-6a42-4a93-832a-b3e200a0edd5/L49262200/PNG-2000px-max-72dpi.png?width=640&fit=cover&optimize=medium&bg-color=f5f5f5&format=pjpg&auto=avif&canvas=116p%2C144p"
    ],
    specs:{"Brand":"Salomon","Model":"Launch BOA SJ","Lacing":"BOA Single-Zone","Flex":"Medium","Terrain":"All-Mountain","Skill Level":"Beginner–Intermediate"}
  },
  {
    name:"Baffin Tundra Boot", brand:"Baffin", price:210.00, customMsrp:210.00, customPrice:210.00, badge:"New", badgeType:"new", icon:"🥾",
    cat:"winter-boots", sub:"baffin", gender:"men", age:"adult", cond:"new", popular:170,
    desc:"Baffin Tundra — a premium insulated winter boot built for extreme cold. Rated to -40°F with a removable inner boot system and durable outer shell.",
    longDesc:"The Baffin Tundra is one of the most capable cold-weather boots available. Rated to -40°F/-40°C, it features Baffin\'s multi-layer insulation system, a removable inner boot for drying and customization, and a durable rubber outer shell for traction on snow and ice. Built in Canada with serious winter in mind — perfect for skiing trips, ice fishing, or any day when the cold means business.",
    action:"Add to Cart", link:null,
    sizes:[
      {label:"8",  qty:0, hlId:102239},
      {label:"9",  qty:0, hlId:102240},
      {label:"10", qty:0, hlId:102241},
      {label:"11", qty:0, hlId:102242},
      {label:"12", qty:0, hlId:102243}
    ],
    images:[
      "https://www.shoebacca.com/cdn/shop/files/43000162-001_1l.jpg?v=1789430484&width=1160",
      "https://www.shoebacca.com/cdn/shop/files/43000162-001_2l.jpg?v=1789430484&width=1160",
      "https://www.shoebacca.com/cdn/shop/files/43000162-001_3l.jpg?v=1789430484&width=1160",
      "https://www.shoebacca.com/cdn/shop/files/43000162-001_4l.jpg?v=1789430484&width=1160",
      "https://www.shoebacca.com/cdn/shop/files/43000162-001_5l.jpg?v=1789430484&width=1160"
    ],
    specs:{"Brand":"Baffin","Rating":"-40°F / -40°C","Insulation":"Multi-Layer System","Inner Boot":"Removable","Made In":"Canada","Gender":"Men\'s"}
  },
  {
    name:"Baffin Chloe Boot", brand:"Baffin", price:210.00, customMsrp:210.00, customPrice:210.00, badge:"New", badgeType:"new", icon:"🥾",
    cat:"winter-boots", sub:"baffin", gender:"women", age:"adult", cond:"new", popular:168,
    desc:"Baffin Chloe — a women's insulated winter boot built for cold-weather comfort and traction. Available in Black and Coastal Grey.",
    longDesc:"The Baffin Chloe brings the same cold-weather reliability as the rest of the Baffin lineup in a boot built specifically for women. A durable outer shell and insulated construction keep feet warm and dry through winter conditions, while a grippy outsole handles ice and packed snow with confidence. Available in Black and Coastal Grey — select your color below.",
    action:"Add to Cart", link:null,
    colorways:[
      {label:"Black",         image:"https://m.media-amazon.com/images/I/71jWH+Czk8L._AC_SY575_.jpg"},
      {label:"Coastal Grey",  image:"https://m.media-amazon.com/images/I/71HwmN0-IoL._AC_SY575_.jpg"},
    ],
    sizes:[
      {label:"Black — 6",         qty:0, hlId:102244},
      {label:"Black — 7",         qty:0, hlId:102246},
      {label:"Black — 8",         qty:0, hlId:102248},
      {label:"Black — 9",         qty:0, hlId:102250},
      {label:"Black — 10",        qty:0, hlId:102252},
      {label:"Coastal Grey — 6",  qty:0, hlId:102245},
      {label:"Coastal Grey — 7",  qty:0, hlId:102247},
      {label:"Coastal Grey — 8",  qty:0, hlId:102249},
      {label:"Coastal Grey — 9",  qty:0, hlId:102251},
      {label:"Coastal Grey — 10", qty:0, hlId:102253},
    ],
    images:[
      "https://m.media-amazon.com/images/I/71jWH+Czk8L._AC_SY575_.jpg",
      "https://m.media-amazon.com/images/I/615+hl35M4L._AC_SY575_.jpg",
      "https://m.media-amazon.com/images/I/511UyGaOCQL._AC_SY575_.jpg",
      "https://m.media-amazon.com/images/I/711kHFEpn8L._AC_SY575_.jpg",
      "https://m.media-amazon.com/images/I/71HwmN0-IoL._AC_SY575_.jpg",
      "https://m.media-amazon.com/images/I/71L-bpcP6wL._AC_SY575_.jpg",
      "https://m.media-amazon.com/images/I/71qJ0wcdJyL._AC_SY575_.jpg",
      "https://m.media-amazon.com/images/I/71FOm+OVYYL._AC_SY575_.jpg",
      "https://m.media-amazon.com/images/I/618XmJ8Tf9L._AC_SY575_.jpg",
      "https://m.media-amazon.com/images/I/61tCbktcw-L._AC_SY575_.jpg"
    ],
    specs:{"Brand":"Baffin","Gender":"Women\'s","Colors":"Black, Coastal Grey","Sizes":"6-10"}
  },
  {
    name:"Baffin Hunter Boot", brand:"Baffin", price:75.00, customMsrp:75.00, customPrice:75.00, badge:"New", badgeType:"new", icon:"🥾",
    cat:"winter-boots", sub:"baffin", gender:"men", age:"adult", cond:"new", popular:148,
    desc:"Baffin Hunter — a rugged men's rubber winter boot in Forest/Black. Built for durability and traction in cold, wet conditions.",
    longDesc:"The Baffin Hunter is a dependable rubber winter boot built for anyone who spends time outdoors in cold, wet, and muddy conditions. A durable rubber shell in Forest/Black handles the elements while a grippy outsole keeps footing solid on ice and slush.",
    action:"Add to Cart", link:null,
    sizes:[
      {label:"8",  qty:0, hlId:102266},
      {label:"9",  qty:0, hlId:102267},
      {label:"10", qty:0, hlId:102268},
      {label:"11", qty:0, hlId:102269},
      {label:"12", qty:0, hlId:102270},
      {label:"13", qty:0, hlId:102271},
      {label:"14", qty:0, hlId:102272},
    ],
    images:[
      "https://www.baffin.com/cdn/shop/products/HUNTER_85620000_394_PRIMARY_f840c28a-3761-42e9-8956-d6e75be7974b.png?v=1734125772&width=560",
      "https://www.baffin.com/cdn/shop/products/HUNTER_85620000_394_SOLE.png?v=1734125772&width=560",
      "https://www.baffin.com/cdn/shop/products/HUNTER_85620000_394_HEEL.png?v=1734125772&width=560",
      "https://www.baffin.com/cdn/shop/products/HUNTER_85620000_394_MEDIAL.png?v=1734125772&width=560",
      "https://www.baffin.com/cdn/shop/products/HUNTER_85620000_394_TOP.png?v=1734125773&width=560"
    ],
    specs:{"Brand":"Baffin","Gender":"Men\'s","Color":"Forest/Black","Sizes":"8-14"}
  },
  {
    name:"Baffin Cloud Low Boot", brand:"Baffin", price:168.00, customMsrp:168.00, customPrice:168.00, badge:"New", badgeType:"new", icon:"🥾",
    cat:"winter-boots", sub:"baffin", gender:"women", age:"adult", cond:"new", popular:149,
    desc:"Baffin Cloud Low — a lightweight women's winter boot available in White and Black.",
    longDesc:"The Baffin Cloud Low pairs everyday comfort with cold-weather protection in a low-profile silhouette. Available in White and Black — select your color below.",
    action:"Add to Cart", link:null,
    colorways:[
      {label:"White", image:"https://www.baffin.com/cdn/shop/files/CLOUDLOW_EASEW008_WAE_PRIMARY.png?v=1761766711&width=560"},
      {label:"Black", image:"https://www.baffin.com/cdn/shop/files/CLOUDLOW_EASEW008_BK1_PRIMARY.png?v=1761766711&width=560"},
    ],
    sizes:[
      {label:"White — 6",  qty:0, hlId:102273},
      {label:"White — 7",  qty:0, hlId:102275},
      {label:"White — 8",  qty:0, hlId:102277},
      {label:"White — 9",  qty:0, hlId:102279},
      {label:"White — 10", qty:0, hlId:102281},
      {label:"Black — 6",  qty:0, hlId:102274},
      {label:"Black — 7",  qty:0, hlId:102276},
      {label:"Black — 8",  qty:0, hlId:102278},
      {label:"Black — 9",  qty:0, hlId:102280},
      {label:"Black — 10", qty:0, hlId:102282},
    ],
    images:[
      "https://www.baffin.com/cdn/shop/files/CLOUDLOW_EASEW008_WAE_PRIMARY.png?v=1761766711&width=560",
      "https://www.baffin.com/cdn/shop/files/CLOUDLOW_EASEW008_WAE_SOLE.png?v=1761766711&width=560",
      "https://www.baffin.com/cdn/shop/files/CLOUDLOW_EASEW008_WAE_HEEL.png?v=1761766711&width=560",
      "https://www.baffin.com/cdn/shop/files/CLOUDLOW_EASEW008_WAE_MEDIAL.png?v=1761766711&width=560",
      "https://www.baffin.com/cdn/shop/files/CLOUDLOW_EASEW008_WAE_TOP.png?v=1761766711&width=560",
      "https://www.baffin.com/cdn/shop/files/CLOUDLOW_EASEW008_BK1_PRIMARY.png?v=1761766711&width=560",
      "https://www.baffin.com/cdn/shop/files/CLOUDLOW_EASEW008_BK1_SOLE.png?v=1761766711&width=560",
      "https://www.baffin.com/cdn/shop/files/CLOUDLOW_EASEW008_BK1_HEEL.png?v=1761766711&width=560",
      "https://www.baffin.com/cdn/shop/files/CLOUDLOW_EASEW008_BK1_MEDIAL.png?v=1761766711&width=560",
      "https://www.baffin.com/cdn/shop/files/CLOUDLOW_EASEW008_BK1_TOP.png?v=1761766711&width=560"
    ],
    specs:{"Brand":"Baffin","Gender":"Women\'s","Colors":"White, Black","Sizes":"6-10"}
  },
  {
    name:"Baffin Canada Boot", brand:"Baffin", price:192.00, customMsrp:192.00, customPrice:192.00, badge:"New", badgeType:"new", icon:"🥾",
    cat:"winter-boots", sub:"baffin", gender:"men", age:"adult", cond:"new", popular:150,
    desc:"Baffin Canada — a premium insulated men's winter boot in Black, built for extreme cold weather performance.",
    longDesc:"The Baffin Canada is part of Baffin's Heritage collection, built for serious cold-weather performance. A durable Black shell and advanced insulation keep feet warm and protected through winter's worst conditions.",
    action:"Add to Cart", link:null,
    sizes:[
      {label:"8",  qty:0, hlId:102283},
      {label:"9",  qty:0, hlId:102284},
      {label:"10", qty:0, hlId:102285},
      {label:"11", qty:0, hlId:102286},
      {label:"12", qty:0, hlId:102287},
    ],
    images:[
      "https://www.baffin.com/cdn/shop/products/CANADA_HTGEM001_BBI_PRIMARY.png?v=1734125716&width=560",
      "https://www.baffin.com/cdn/shop/products/HERITAGE_SOLE_BBI_1.png?v=1734125716&width=560",
      "https://www.baffin.com/cdn/shop/products/CANADA_HTGEM001_BBI_HEEL.png?v=1734125716&width=560",
      "https://www.baffin.com/cdn/shop/products/CANADA_HTGEM001_BBI_MEDIAL.png?v=1734125716&width=560",
      "https://www.baffin.com/cdn/shop/products/CANADA_HTGEM001_BBI_TOP.png?v=1734125716&width=560"
    ],
    specs:{"Brand":"Baffin","Gender":"Men\'s","Color":"Black","Sizes":"8-12"}
  },
  {
    name:"Baffin Wander Boot", brand:"Baffin", price:90.00, customMsrp:90.00, customPrice:90.00, badge:"New", badgeType:"new", icon:"🥾",
    cat:"winter-boots", sub:"baffin", gender:"unisex", age:"kid", cond:"new", popular:147,
    desc:"Baffin Wander — a kid's winter boot available in Black, Blue, and Pink. Sizes 1-4 and 8-12.",
    longDesc:"The Baffin Wander keeps kids warm and comfortable on winter adventures, from the school bus stop to the sledding hill. Available in Black, Blue, and Pink — select your color below.",
    action:"Add to Cart", link:null,
    colorways:[
      {label:"Black", image:"https://www.baffin.com/cdn/shop/files/WANDER-Y001_BBI_PRIMARY.png?v=1742499150&width=560"},
      {label:"Blue",  image:"https://www.baffin.com/cdn/shop/files/WANDER-Y001_BBM_PRIMARY.png?v=1742564626&width=560"},
      {label:"Pink",  image:"https://www.baffin.com/cdn/shop/files/WANDER-Y001_PK1_PRIMARY.png?v=1742564626&width=560"},
    ],
    sizes:[
      {label:"Black — 1",  qty:0, hlId:102303},
      {label:"Black — 2",  qty:0, hlId:102306},
      {label:"Black — 3",  qty:0, hlId:102309},
      {label:"Black — 4",  qty:0, hlId:102312},
      {label:"Black — 8",  qty:0, hlId:102288},
      {label:"Black — 9",  qty:0, hlId:102291},
      {label:"Black — 10", qty:0, hlId:102294},
      {label:"Black — 11", qty:0, hlId:102297},
      {label:"Black — 12", qty:0, hlId:102300},
      {label:"Blue — 1",   qty:0, hlId:102304},
      {label:"Blue — 2",   qty:0, hlId:102307},
      {label:"Blue — 3",   qty:0, hlId:102310},
      {label:"Blue — 4",   qty:0, hlId:102313},
      {label:"Blue — 8",   qty:0, hlId:102289},
      {label:"Blue — 9",   qty:0, hlId:102292},
      {label:"Blue — 10",  qty:0, hlId:102295},
      {label:"Blue — 11",  qty:0, hlId:102298},
      {label:"Blue — 12",  qty:0, hlId:102301},
      {label:"Pink — 1",   qty:0, hlId:102305},
      {label:"Pink — 2",   qty:0, hlId:102308},
      {label:"Pink — 3",   qty:0, hlId:102311},
      {label:"Pink — 4",   qty:0, hlId:102314},
      {label:"Pink — 8",   qty:0, hlId:102290},
      {label:"Pink — 9",   qty:0, hlId:102293},
      {label:"Pink — 10",  qty:0, hlId:102296},
      {label:"Pink — 11",  qty:0, hlId:102299},
      {label:"Pink — 12",  qty:0, hlId:102302},
    ],
    images:[
      "https://www.baffin.com/cdn/shop/files/WANDER-Y001_BBI_PRIMARY.png?v=1742499150&width=560",
      "https://www.baffin.com/cdn/shop/files/WANDER-Y001_BBI_SOLE.png?v=1742499154&width=560",
      "https://www.baffin.com/cdn/shop/files/WANDER-Y001_BBI_HEEL.png?v=1742564626&width=560",
      "https://www.baffin.com/cdn/shop/files/WANDER-Y001_BBI_MEDIAL.png?v=1742564626&width=560",
      "https://www.baffin.com/cdn/shop/files/WANDER-Y001_BBI_TOP.png?v=1742564626&width=560",
      "https://www.baffin.com/cdn/shop/files/WANDER-Y001_BBM_PRIMARY.png?v=1742564626&width=560",
      "https://www.baffin.com/cdn/shop/files/WANDER-Y001_BBM_SOLE.png?v=1742564626&width=560",
      "https://www.baffin.com/cdn/shop/files/WANDER-Y001_BBM_HEEL.png?v=1742564626&width=560",
      "https://www.baffin.com/cdn/shop/files/WANDER-Y001_BBM_MEDIAL.png?v=1742564626&width=560",
      "https://www.baffin.com/cdn/shop/files/WANDER-Y001_BBM_TOP.png?v=1742564626&width=560",
      "https://www.baffin.com/cdn/shop/files/WANDER-Y001_PK1_PRIMARY.png?v=1742564626&width=560",
      "https://www.baffin.com/cdn/shop/files/WANDER-Y001_PK1_SOLE.png?v=1742564626&width=560",
      "https://www.baffin.com/cdn/shop/files/WANDER-LIFESTYLE_3ff2e0cb-8c30-43ae-b1cd-1d8ae8801754.png?v=1742564626&width=560",
      "https://www.baffin.com/cdn/shop/files/WANDER-Y001_PK1_HEEL.png?v=1742564626&width=560",
      "https://www.baffin.com/cdn/shop/files/WANDER-Y001_PK1_MEDIAL.png?v=1742564626&width=560"
    ],
    specs:{"Brand":"Baffin","Gender":"Kid\'s","Colors":"Black, Blue, Pink","Sizes":"1-4, 8-12"}
  },
  {
    name:"Baffin Ice Castle Boot", brand:"Baffin", price:70.00, customMsrp:70.00, customPrice:70.00, badge:"New", badgeType:"new", icon:"🥾",
    cat:"winter-boots", sub:"baffin", gender:"unisex", age:"kid", cond:"new", popular:146,
    desc:"Baffin Ice Castle — a kid's rubber winter boot available in Black and Black/Lavender.",
    longDesc:"The Baffin Ice Castle is a cozy, easy-on rubber winter boot built for kids. Durable construction with warm insulation keeps little feet comfortable in snow and slush. Available in Black and Black/Lavender — select your color below.",
    action:"Add to Cart", link:null,
    colorways:[
      {label:"Black",          image:"https://www.baffin.com/cdn/shop/products/ICE_CASTLE_WRUB-Y011_BBI_PRIMARY.png?v=1771384407&width=560"},
      {label:"Black/Lavender", image:"https://www.baffin.com/cdn/shop/products/ICE_CASTLE_WRUB-Y011_BBO_PRIMARY.png?v=1771384407&width=560"},
    ],
    sizes:[
      {label:"Black — 1",           qty:0, hlId:102320},
      {label:"Black — 2",           qty:0, hlId:102322},
      {label:"Black — 3",           qty:0, hlId:102324},
      {label:"Black — 4",           qty:0, hlId:102326},
      {label:"Black/Lavender — 1",  qty:0, hlId:102321},
      {label:"Black/Lavender — 2",  qty:0, hlId:102323},
      {label:"Black/Lavender — 3",  qty:0, hlId:102325},
      {label:"Black/Lavender — 4",  qty:0, hlId:102327},
    ],
    images:[
      "https://www.baffin.com/cdn/shop/products/ICE_CASTLE_WRUB-Y011_BBI_PRIMARY.png?v=1771384407&width=560",
      "https://www.baffin.com/cdn/shop/products/ICECASTLE_SOLE_BBI_3f1a5960-dab9-47fb-82d5-0134f8392c90.png?v=1771384407&width=560",
      "https://www.baffin.com/cdn/shop/products/ICE_CASTLE_WRUB-Y011_BBI_TOP-callout.png?v=1771384407&width=560",
      "https://www.baffin.com/cdn/shop/files/ICECASTLE_BBI_ONFOOT.png?v=1771384407&width=560",
      "https://www.baffin.com/cdn/shop/products/ICE_CASTLE_WRUB-Y011_BBI_HEEL.png?v=1771384407&width=560",
      "https://www.baffin.com/cdn/shop/products/ICE_CASTLE_WRUB-Y011_BBI_MEDIAL.png?v=1771384407&width=560",
      "https://www.baffin.com/cdn/shop/products/ICE_CASTLE_WRUB-Y011_BBO_PRIMARY.png?v=1771384407&width=560",
      "https://www.baffin.com/cdn/shop/products/ICECASTLE_SOLE_BBO.png?v=1771384407&width=560",
      "https://www.baffin.com/cdn/shop/products/icecastle-top.png?v=1771384407&width=560",
      "https://www.baffin.com/cdn/shop/products/ICE_CASTLE_WRUBY011_BBO_ONFOOT_3-2000x2000png.png?v=1771384407&width=560",
      "https://www.baffin.com/cdn/shop/products/ICE_CASTLE_WRUB-Y011_BBO_HEEL_1.png?v=1771384407&width=560",
      "https://www.baffin.com/cdn/shop/products/ICE_CASTLE_WRUB-Y011_BBO_MEDIAL.png?v=1771384407&width=560"
    ],
    specs:{"Brand":"Baffin","Gender":"Kid\'s","Colors":"Black, Black/Lavender","Sizes":"1-4"}
  },
  {
    name:"Baffin Dana Boot", brand:"Baffin", price:300.00, customMsrp:300.00, customPrice:300.00, badge:"New", badgeType:"new", icon:"🥾",
    cat:"winter-boots", sub:"baffin", gender:"women", age:"adult", cond:"new", popular:151,
    desc:"Baffin Dana — a premium lightweight women's winter boot in Black, built for warmth without the bulk.",
    longDesc:"The Baffin Dana combines lightweight comfort with serious cold-weather protection, built for women who need reliable warmth without sacrificing mobility. A sleek Black design with advanced insulation technology.",
    action:"Add to Cart", link:null,
    sizes:[
      {label:"6",  qty:0, hlId:102315},
      {label:"7",  qty:0, hlId:102316},
      {label:"8",  qty:0, hlId:102317},
      {label:"9",  qty:0, hlId:102318},
      {label:"10", qty:0, hlId:102319},
    ],
    images:[
      "https://www.baffin.com/cdn/shop/products/DANA_LITEW013_BK1_PRIMARY.png?v=1627526968&width=560",
      "https://www.baffin.com/cdn/shop/products/ULTRALITE_SOLE_GY2.png?v=1627526968&width=560",
      "https://www.baffin.com/cdn/shop/files/Dana_Spring_Swap_2026.png?v=1772648781&width=560",
      "https://www.baffin.com/cdn/shop/products/DANA_LITEW013_BK1_HEEL.png?v=1772648781&width=560",
      "https://www.baffin.com/cdn/shop/products/DANA_LITEW013_BK1_MEDIAL.png?v=1772648781&width=560",
      "https://www.baffin.com/cdn/shop/products/DANA_LITEW013_BK1_TOP.png?v=1772648781&width=560",
      "https://www.baffin.com/cdn/shop/products/editorial-technology-dana.jpg?v=1772648781&width=560",
      "https://www.baffin.com/cdn/shop/products/editorial-rating-dana.jpg?v=1772648781&width=560"
    ],
    specs:{"Brand":"Baffin","Gender":"Women\'s","Color":"Black","Sizes":"6-10"}
  },
  {
    name:"Baffin Cush Slipper", brand:"Baffin", price:72.00, customMsrp:72.00, customPrice:72.00, badge:"New", badgeType:"new", icon:"🧦",
    cat:"accessories", sub:"footwear", gender:"unisex", age:"adult", cond:"new", popular:150,
    desc:"Baffin Cush Slipper — a cozy, cushioned indoor slipper built for warmth and comfort after a day on the mountain. Available in Black and Navy Blue.",
    longDesc:"The Baffin Cush Slipper is the perfect companion after a day on the slopes — a soft, cushioned footbed and durable outsole make it comfortable enough for lounging but sturdy enough for a quick trip outside. Available in Black and Navy Blue — select your color below.",
    action:"Add to Cart", link:null,
    colorways:[
      {label:"Black",      image:"https://www.baffin.com/cdn/shop/files/CUSHSLIPPER_61270000_001_PRIMARY_2b193e72-bdb1-47ef-b9f2-bc03e189257a.png?v=1752853931&width=560"},
      {label:"Navy Blue",  image:"https://www.baffin.com/cdn/shop/files/CUSHSLIPPER_61270000_007_PRIMARY_3aed8304-f72f-40de-a3d0-43f3d7f56af8.png?v=1752853931&width=560"},
    ],
    sizes:[
      {label:"Black — S (3-4)",        qty:0, hlId:102254},
      {label:"Black — M (5-6)",        qty:0, hlId:102256},
      {label:"Black — L (7-8)",        qty:0, hlId:102258},
      {label:"Black — XL (9-10)",      qty:0, hlId:102260},
      {label:"Black — XXL (11-12)",    qty:0, hlId:102262},
      {label:"Black — 3XL (13-14)",    qty:0, hlId:102264},
      {label:"Navy Blue — S (3-4)",    qty:0, hlId:102255},
      {label:"Navy Blue — M (5-6)",    qty:0, hlId:102257},
      {label:"Navy Blue — L (7-8)",    qty:0, hlId:102259},
      {label:"Navy Blue — XL (9-10)",  qty:0, hlId:102261},
      {label:"Navy Blue — XXL (11-12)",qty:0, hlId:102263},
      {label:"Navy Blue — 3XL (13-14)",qty:0, hlId:102265},
    ],
    images:[
      "https://www.baffin.com/cdn/shop/files/CUSHSLIPPER_61270000_001_PRIMARY_2b193e72-bdb1-47ef-b9f2-bc03e189257a.png?v=1752853931&width=560",
      "https://www.baffin.com/cdn/shop/files/CUSHSLIPPER_61270000_001_SOLE.png?v=1752853931&width=560",
      "https://www.baffin.com/cdn/shop/files/CUSHSLIPPER_61270000_001_MEDIAL.png?v=1752853931&width=560",
      "https://www.baffin.com/cdn/shop/files/CUSHSLIPPER_61270000_001_PAIR.png?v=1752853931&width=560",
      "https://www.baffin.com/cdn/shop/files/CUSHSLIPPER_61270000_001_TOP.png?v=1752853931&width=560",
      "https://www.baffin.com/cdn/shop/files/CUSHSLIPPER_61270000_007_PRIMARY_3aed8304-f72f-40de-a3d0-43f3d7f56af8.png?v=1752853931&width=560",
      "https://www.baffin.com/cdn/shop/files/CUSHSLIPPER_61270000_007_SOLE.png?v=1752853931&width=560",
      "https://www.baffin.com/cdn/shop/files/CUSHSLIPPER_61270000_007_MEDIAL.png?v=1752853931&width=560",
      "https://www.baffin.com/cdn/shop/files/CUSHSLIPPER_61270000_007_TOP.png?v=1752853931&width=560",
      "https://www.baffin.com/cdn/shop/files/CUSHSLIPPER_61270000_007_PAIR.png?v=1752853931&width=560"
    ],
    specs:{"Brand":"Baffin","Type":"Indoor/Outdoor Slipper","Colors":"Black, Navy Blue","Sizing":"S (3-4), M (5-6), L (7-8), XL (9-10), XXL (11-12), 3XL (13-14)"}
  },

];
PRODUCTS.push(...BINDINGS);

// Compatible bindings shown for all flat-mount skis
const COMPAT_BINDINGS_NAMES = {
  "Icelantic Pioneer 96":         "ski-binding",
  "Icelantic Pioneer 86":         "ski-binding",
  "Icelantic Riveter 85":         "ski-binding",
  "Icelantic Shaman 99":          "ski-binding",
  "Kästle EX74":                  "ski-binding",
  "Kästle RX9":                   "ski-binding",
  "Kästle M9 76":                 "ski-binding",
  "Kästle M9 82":                 "ski-binding",
  "Kästle MX 88":                 "ski-binding",
  "Kästle Paragon 93":            "ski-binding",
  "Kästle Quartz":                "ski-binding",
  "Kästle Obsidian":              "ski-binding",
  "Kästle M8 84":                 "ski-binding",
  "Kästle Legend":                "ski-binding",
  "Kästle KX Holly":              "ski-binding",
  "Kästle ZX Alpha":              "ski-binding",
  "Rossignol Savage":             "ski-binding",
  "Rossignol Super Blackops":     "ski-binding",
  "Rossignol Sender Free 100":    "ski-binding",
  "Rossignol Sender Free Pro":    "ski-binding",
  "Salomon Stance Pro 90":        "ski-binding",
  "Salomon Stance Pro 88 W":      "ski-binding",
  "Salomon QST 100":              "ski-binding",
  "Salomon QST Blank Team 2026":  "ski-binding",
};
// No sub-category fallback — compatible bindings only for explicitly listed skis above
const COMPATIBLE_BINDINGS_MAP = {};

  // ── Search aliases: misspellings, alternate names, common terms ──────────────
  const SEARCH_ALIASES = {
    // Kästle
    "kaste":"kastle","kaestle":"kastle","castle":"kastle","kastl":"kastle","kasttle":"kastle",
    "kastle skis":"kastle","kaestle skis":"kastle","austrian":"kastle",
    // Salomon
    "salomnon":"salomon","salamon":"salomon","salomin":"salomon","salomn":"salomon","salomoon":"salomon",
    // Rossignol
    "rossignal":"rossignol","rossignall":"rossignol","rosignol":"rossignol","rosignall":"rossignol",
    "rossi":"rossignol","rosi":"rossignol","rossig":"rossignol","rossignole":"rossignol",
    // Icelantic
    "icelantik":"icelantic","ice lantic":"icelantic","icelantick":"icelantic","icelantics":"icelantic",
    "ice lantic skis":"icelantic","icelanticskis":"icelantic",
    // Jones
    "jones snowboards":"jones","jeremy jones":"jones",
    // Nidecker
    "nidaker":"nidecker","nydecker":"nidecker","nideker":"nidecker",
    // Rome
    "rome sds":"rome","rome snowboards":"rome",
    // Roxa
    "roxa boots":"roxa","rox a":"roxa",

    // ── Category aliases ───────────────────────────────────────────────────────
    "skis":"ski","ski":"ski","alpine ski":"ski","alpine skis":"ski","downhill ski":"ski","downhill skis":"ski",
    "snowboard":"snowboard","snowboards":"snowboard","board":"snowboard","boards":"snowboard","shred":"snowboard",
    "ski boot":"boot","ski boots":"boot","boots":"boot","alpine boot":"boot","alpine boots":"boot",
    "snowboard binding":"binding","snowboard bindings":"binding","bindings":"binding","binding":"binding",
    "snow board":"snowboard","snow ski":"ski","snow skis":"ski",

    // ── Terrain / style ────────────────────────────────────────────────────────
    "all mountain":"all-mountain","all-mountain":"all-mountain","allm":"all-mountain","versatile":"all-mountain",
    "carving":"carve","carver":"carve","carve ski":"carve","carving ski":"carve","carving skis":"carve",
    "on piste":"carve","on-piste":"carve","groomer":"carve","groomers":"carve","piste":"carve","hardpack":"carve",
    "groomed":"carve","corduroy":"carve","blue run":"carve","green run":"carve",
    "freeride":"freeride","off piste":"freeride","off-piste":"freeride","offpiste":"freeride",
    "backcountry":"freeride","back country":"freeride","sidecountry":"freeride","side country":"freeride",
    "big mountain":"freeride","powder":"powder","pow":"powder","deep snow":"powder","deep pow":"powder",
    "powder ski":"powder","powder skis":"powder","powder board":"powder","pow ski":"powder",
    "wide":"powder","wide ski":"powder","fat ski":"powder","fat skis":"powder",
    "park":"park","freestyle":"park","twin tip":"park","twin-tip":"park","twin":"park",
    "jib":"park","rail":"park","jump":"park","halfpipe":"park","pipe":"park","kicker":"park",
    "race":"race","racing":"race","gs":"race","giant slalom":"race","slalom":"race","super g":"race",
    "speed":"race","titanal":"race","stiff":"race",
    "frontside":"frontside","front side":"frontside",
    "surf":"surf","surf inspired":"surf","surfy":"surf",
    "directional":"directional","directional twin":"directional",

    // ── Skill level ────────────────────────────────────────────────────────────
    "beginner":"beginner","beginners":"beginner","starter":"beginner","learn to ski":"beginner",
    "learning":"beginner","first ski":"beginner","first time":"beginner","easy":"beginner",
    "intermediate":"intermediate","mid level":"intermediate","improving":"intermediate",
    "advanced":"advanced","expert":"expert","aggressive":"expert","high performance":"expert","high-performance":"expert",

    // ── Age / gender ───────────────────────────────────────────────────────────
    "kids":"junior","kid":"junior","children":"junior","child":"junior","youth":"junior","little ones":"junior",
    "toddler":"junior","small kids":"junior","boys":"junior","girls":"junior","little kids":"junior",
    "junior":"junior","jr":"junior","juniors":"junior",
    "womens":"women","women's":"women","ladies":"women","woman":"women","female":"women","girls ski":"women","ladies ski":"women",
    "mens":"men","men's":"men","man":"men","male":"men","guys":"men","boys ski":"men",
    "unisex":"unisex","gender neutral":"unisex","anyone":"unisex",
    "adult":"adult","adults":"adult","grown up":"adult","grown-up":"adult",

    // ── Material / construction ────────────────────────────────────────────────
    "poplar":"poplar","paulownia":"paulownia","wood core":"wood","titanal":"titanal",
    "carbon":"carbon","basalt":"basalt","flax":"flax","cork":"cork",
    "rocker":"rocker","camber":"camber","flat":"flat","hybrid":"hybrid",
    "usa made":"usa","made in usa":"usa","american made":"usa","american":"usa",
    "made in austria":"kastle","austrian made":"kastle",
    "made in france":"rossignol","french":"rossignol",

    // ── Flex / feel ────────────────────────────────────────────────────────────
    "soft":"soft","soft flex":"soft","forgiving":"soft","mellow":"soft","playful":"soft","fun":"soft",
    "medium flex":"medium","medium":"medium",
    "stiff flex":"stiff","stiff":"stiff","powerful":"stiff","responsive":"stiff","aggressive":"stiff",
    "damp":"damp","dampening":"damp","vibration":"damp","smooth":"damp",

    // ── Waist width / shape ────────────────────────────────────────────────────
    "narrow":"narrow","skinny":"narrow","thin":"narrow",
    "mid fat":"midfat","mid-fat":"midfat","mid wide":"midfat",
    "quiver killer":"quiver","one ski quiver":"quiver","do it all":"quiver","quiver":"quiver",
    "directional shape":"directional","true twin":"twin",

    // ── Boot specific ──────────────────────────────────────────────────────────
    "walk mode":"walkmode","touring":"walkmode","hike and ride":"walkmode","hike to ride":"walkmode",
    "wide fit":"wide","wide last":"wide","high volume":"wide","hv":"wide","wide feet":"wide",
    "flex 80":"80flex","flex 90":"90flex","flex 100":"100flex",
    "mondo":"boot","mondopoint":"boot","mondo point":"boot",

    // ── Snowboard binding specific ─────────────────────────────────────────────
    "step in":"stepin","step-in":"stepin","strap":"strap","strap binding":"strap",
    "auto entry":"stepin","click in":"stepin",
    "highback":"highback","high back":"highback","baseplate":"baseplate",

    // ── Activity / scene ──────────────────────────────────────────────────────
    "resort":"resort","mountain":"resort","hill":"resort","slope":"resort","slopes":"resort",
    "moguls":"bumps","bumps":"bumps","trees":"trees","glades":"trees","chutes":"freeride",
    "ice":"carve","icy":"carve","eastern":"carve","east coast":"carve","new england":"carve","northeast":"carve",
    "out west":"powder","western":"powder","west coast":"powder","utah":"powder","colorado":"powder","vail":"powder",
    "new york":"carve","ny":"carve","vermont":"carve","vt":"carve","new hampshire":"carve","nh":"carve",

    // ── Price / value ──────────────────────────────────────────────────────────
    "cheap":"beginner","affordable":"beginner","budget":"beginner","value":"beginner","deal":"beginner",
    "premium":"expert","luxury":"expert","high end":"expert","top of the line":"expert","top end":"expert",
    "gift":"beginner","present":"beginner",

    // ── Other common searches ──────────────────────────────────────────────────
    "new":"new","sale":"sale","popular":"popular","best seller":"popular","top rated":"popular","best":"popular",
    "demo":"new","rental":"beginner","rental ski":"beginner",
    "rocker ski":"rocker","flat ski":"flat","camber ski":"camber",
    "waist":"waist","waist width":"waist","underfoot":"waist","100mm":"qst","90mm":"stance","88mm":"arcade",
    "helmet":"accessory","goggle":"accessory","glove":"accessory","poles":"accessory","bag":"accessory",
    "tune":"tune","wax":"wax","mount":"mount","setup":"tune","binding mount":"mount",
  };

  function tsNormalizeQuery(raw) {
    const lower = raw.toLowerCase().trim();
    // Exact alias match first
    if (SEARCH_ALIASES[lower]) return SEARCH_ALIASES[lower];
    // Partial: if the query starts with an alias key, normalize that part
    for (const key of Object.keys(SEARCH_ALIASES)) {
      if (lower.startsWith(key + " ") || lower === key) return SEARCH_ALIASES[key];
    }
    return lower;
  }

  // ── Per-product keyword tags — every term a customer might search ─────────────
  const PRODUCT_TAGS = {
    // ── KÄSTLE SKIS ──────────────────────────────────────────────────────────
    "Kästle EX74":
      "carve carving frontside piste groomer expert stiff narrow precision edge hold austrian austria hollowtech titanal 74mm skinny slalom gs race feel on-piste",
    "Kästle RX9":
      "carve carving race frontside piste gs slalom groomer expert stiff titanal austrian austria hollowtech 76mm world cup inspired symbio intermediate advanced",
    "Kästle M9 76":
      "frontside piste carve groomer intermediate expert 76mm austrian austria hollowtech titanal energetic agile quick",
    "Kästle M9 82":
      "all-mountain frontside carve groomer intermediate expert 82mm austrian austria hollowtech titanal versatile",
    "Kästle MX 88":
      "all-mountain carve legendary iconic best seller expert advanced 88mm double titanal early rise austrian austria hollowtech charger",
    "Kästle Paragon 93":
      "all-mountain freeride expert advanced 93mm triple wood double titanal austrian austria hollowtech rocker camber charger",
    "Kästle Quartz":
      "all-mountain women womens ladies female 72mm intermediate advanced lightweight titanal austrian austria hollowtech smooth confident",
    "Kästle Obsidian":
      "all-mountain freeride intermediate expert 92mm rocker camber double rocker austrian austria hollowtech accessible",
    "Kästle M8 84":
      "all-mountain intermediate expert 84mm rocker camber austrian austria titanal hollowtech versatile balanced",
    "Kästle RX12 Junior":
      "kids junior race carving beginner intermediate boys girls bindings included hollowtech austrian austria poplar beech",
    "Kästle KX Holly":
      "kids junior beginner toddler young children little ones easy first ski hollowtech austrian austria 80cm 90cm",
    "Kästle ZX Alpha":
      "kids junior intermediate freeride all-mountain hollowtech austrian austria rocker camber 139 149",

    // ── ICELANTIC SKIS ───────────────────────────────────────────────────────
    "Icelantic Pioneer 96":
      "all-mountain powder freeride quiver killer one ski quiver usa american made poplar 96mm rocker camber versatile intermediate advanced expert charger",
    "Icelantic Pioneer 86":
      "frontside all-mountain usa american made poplar 86mm rocker camber carve frontside intermediate advanced expert",
    "Icelantic Riveter 85":
      "all-mountain women womens ladies female usa american made poplar 85mm rocker camber intermediate advanced confident",
    "Icelantic Shaman 99":
      "all-mountain powder wide 99mm usa american made rocker camber intermediate advanced charger stability variable conditions",

    // ── ROSSIGNOL SKIS ───────────────────────────────────────────────────────
    "Rossignol Arcade 78":
      "carve carving piste groomer men mens intermediate 78mm progressive camber poplar france french precise energetic",
    "Rossignol Arcade 78 W":
      "carve carving piste groomer women womens ladies intermediate 78mm progressive camber poplar france french precise energetic",
    "Rossignol Arcade 84 W":
      "all-mountain women womens ladies carve intermediate advanced 84mm progressive camber poplar basalt france french",
    "Rossignol Arcade 88":
      "all-mountain carve wide intermediate advanced 88mm progressive camber poplar basalt france french off-piste float",
    "Rossignol Forza 70":
      "race carve expert titanal gs slalom 70mm full camber power transfer edge precision stiff france french top of line",
    "Rossignol Nova 2":
      "beginner women womens ladies easy first ski progressive camber lightweight france french simple starter learn",
    "Rossignol Nova 6":
      "all-mountain women womens ladies intermediate advanced 79mm rocker camber poplar basalt france french confident float carve",
    "Rossignol Rallybird 94":
      "all-mountain versatile intermediate advanced 94mm rocker camber poplar france french do everything charger wide",
    "Rossignol Rallybird Soul Pro":
      "all-mountain beginner twin tip accessible freeride twin france french poplar",
    "Rossignol Savage":
      "freeride powder wide off-piste expert 108mm carbon poplar camber rocker france french aggressive deep snow",
    "Rossignol Sender Free 100":
      "freeride powder wide off-piste intermediate advanced 100mm rocker france french deep snow float lively",
    "Rossignol Sender Free Pro":
      "freeride powder wide off-piste advanced expert france french high performance aggressive precision",
    "Rossignol Sprayer":
      "park freestyle twin tip men mens intermediate 158 168cm france french poplar paulownia flat camber rocker playful",
    "Rossignol Sender Soul Pro":
      "park freestyle twin tip accessible beginner intermediate france french poplar flat",
    "Rossignol Super Blackops":
      "freeride powder off-piste wide expert advanced full rocker poplar basalt france french big mountain",

    // ── SALOMON SKIS ─────────────────────────────────────────────────────────
    "Salomon QST 100":
      "all-mountain powder wide quiver killer intermediate expert 100mm rocker camber poplar beech cork edge amplifier france french versatile float",
    "Salomon QST Jr — Blue/Purple":
      "kids junior beginner intermediate boys girls blue purple 100cm 110cm 120cm 140cm 150cm france french lightweight easy progress",
    "Salomon QST Jr — Pink/Orange":
      "kids junior beginner intermediate girls pink orange colorful 100cm 110cm 120cm 140cm 150cm france french lightweight easy progress",
    "Salomon QST Blank Team 2026":
      "kids junior beginner intermediate boys girls 128 137 146 152cm france french lightweight tip rocker easy progress",
    "Salomon Stance Pro 90":
      "all-mountain frontside carve expert advanced 90mm progressive camber mango wood titanal france french powerful direct",
    "Salomon Stance Pro 88 W":
      "all-mountain frontside carve expert advanced women womens ladies 88mm progressive camber mango wood titanal france french confident powerful",
    "Salomon Stance 80 W":
      "groomer piste women womens ladies intermediate 80mm progressive camber mango wood france french easy all day",
    "Salomon S/Max N10XT":
      "race carve piste expert advanced 149 156 163 177cm titanal full camber france french on-piste precision hardpack",
    "Salomon S/Max N6XT":
      "carve piste intermediate beginner 140 150 160cm progressive camber france french groomer lightweight",

    // ── ROSSIGNOL SNOWBOARDS ─────────────────────────────────────────────────
    "Rossignol Super Revenant":
      "all-mountain freestyle carve expert stiff 90s throwback serrated edges amptek camber radcut sidecut france french aggressive pop twin",
    "Rossignol Revenant":
      "all-mountain directional advanced amptek camber poplar basalt france french power versatile",
    "Rossignol Ampage Vol. 1":
      "all-mountain freestyle beginner intermediate flat rocker aspen poplar directional twin france french progression groomer park",
    "Rossignol Alias":
      "kids junior beginner snowboard boys girls banana rocker poplar france french first board easy fun 125 130 135 140 145cm",
    "Rossignol Scan":
      "kids junior beginner snowboard toddler little ones flat poplar france french first board super soft easy 70 100 120cm",
    "Rossignol Soulside W":
      "all-mountain women womens ladies beginner intermediate hybrid rocker flat poplar directional france french",

    // ── JONES SNOWBOARDS ─────────────────────────────────────────────────────
    "Jones Flagship":
      "freeride powder directional rocker power core tapered poplar deep snow float charger legend best seller men mens backcountry sidecountry",
    "Jones Aviator 2.0":
      "all-mountain resort quiver hybrid camber directional flax basalt float groomers powder intermediate advanced men mens",
    "Jones Tweaker Pro":
      "park freestyle twin flat rocker poplar paulownia playful creative jib rail jump pipe men mens unisex",
    "Jones Mind Expander Womens":
      "all-mountain surf inspired christenson surf camber twin powder float hardpack traction tech men mens poplar paulownia",
    "Jones Mind Expander Twin":
      "all-mountain surf inspired christenson surf camber twin women womens ladies powder float traction tech",
    "Jones Twin Sister W":
      "park all-mountain freestyle twin women womens ladies confidence traction tech intermediate advanced",
    "Jones Dream Weaver 2.0 W":
      "all-mountain women womens ladies directional twin christenson surf camber easy confident conditions",

    // ── SALOMON SNOWBOARDS ───────────────────────────────────────────────────
    "Salomon Dancehaul":
      "freestyle all-mountain twin hybrid camber s-rocker float playful slash spin charge unisex intermediate",
    "Salomon Wonder W":
      "all-mountain freestyle women womens ladies s-rocker cork dampening playful confident france french intermediate twin",

    // ── ROME SNOWBOARDS ──────────────────────────────────────────────────────
    "Rome Mechanic":
      "all-mountain beginner intermediate forgiving directional twin poplar rocker men mens unisex accessible usa learn progress",
    "Rome Ravine":
      "all-mountain directional charger powder float groomers sidecountry intermediate advanced men mens unisex poplar rocker",
    "Rome Ravine W":
      "all-mountain women womens ladies directional lightweight intermediate poplar rocker",

    // ── NIDECKER SNOWBOARDS ──────────────────────────────────────────────────
    "Nidecker Gamma APX":
      "all-mountain freestyle expert advanced apx technology powerful responsive unisex switzerland swiss camber rocker",
    "Nidecker Elle W":
      "all-mountain beginner intermediate women womens ladies rocker forgiving fun confidence switzerland swiss",

    // ── ICELANTIC × NEVERSUMMER ──────────────────────────────────────────────
    "Icelantic × NeverSummer Board":
      "collab collaboration limited edition all-mountain camber rocker hybrid intermediate advanced unisex art graphic",

    // ── SKI BOOTS ────────────────────────────────────────────────────────────
    "Roxa R/Fit 80":
      "ski boot men mens intermediate flex 80 all-mountain comfortable versatile roxa italian italy 25.5 26.5 27.5 28.5 29.5",
    "Roxa R/Fit Hike 85W":
      "ski boot women womens walk mode hiking alpine intermediate advanced flex 85 roxa italian italy 23.5 24.5 25.5 26.5",
    "Roxa R/Fit Hike 90":
      "ski boot men mens walk mode hiking alpine intermediate advanced flex 90 backcountry approach roxa italian italy 25.5 26.5 27.5 28.5 29.5",
    "Roxa R/Fit 100":
      "ski boot men mens advanced expert flex 100 high volume wide fit comfort performance roxa italian italy all-mountain 25.5 26.5 27.5 28.5",
    "Salomon Select HV 80W":
      "ski boot women womens wide fit high volume flex 80 intermediate comfortable performance 24.5 25.5 26.5",

    // ── SNOWBOARD BINDINGS ───────────────────────────────────────────────────
    "Katana FASE Binding":
      "snowboard binding fase step freestyle all-mountain expert stiff power transfer strap rome katana advanced",
    "Carbon Supermatic Binding":
      "snowboard binding step-in automatic carbon lightweight responsive nidecker supermatic expert advanced all-mountain",
    "Rossignol Myth Binding":
      "snowboard binding beginner intermediate soft flexible easy all-mountain entry level women womens rossignol myth",
    "Nidecker Fuse Binding":
      "snowboard binding all-mountain stiff aggressive expert advanced performance nidecker fuse fusion",
    "Salomon Rhythm Binding":
      "snowboard binding medium flex all-mountain park groomer easy forgiving beginner intermediate salomon rhythm strap",
    // Pret helmets
    // Dragon goggles
    "Dragon DX3 OTG Goggle":            "goggle goggles dragon dx3 otg over glasses prescription ski snowboard cylindrical anti-fog all colors",
    "Dragon R1 Goggle":                   "goggle goggles dragon r1 wide angle spherical premium ski snowboard max coverage",

    "Nidecker Kita APX":              "snowboard boots nidecker kita apx stiff performance all-mountain heat moldable dual lace mens",
    "Salomon Faction BOA": "snowboard boots salomon faction boa medium flex all-mountain mens lace up comfortable",
  };

const SHOP_EMAIL  = "info@tuneskis.com";
const HL_TOKEN    = "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkYTYyMzc3My05MTkzLTQyZDctOTMwMi02MGU3ZTI3MTVjYjgiLCJpYXQiOjE3NzM1OTM4NzEsInN1YiI6MTAwMDE3LCJhdWQiOjU1OTIxLCJpc3MiOm51bGx9.KRaSs789CQVOOhl7xy0JoYJkKvqJ3TiEZ3jSugagZ6k";
const HL_BASE     = "https://tuneskis.retail.heartland.us/api";
const HL_SERVER   = "https://tuneskis-server.onrender.com";

// ══ STATE ════════════════════════════════════════════════
let cart        = JSON.parse(localStorage.getItem("ts_cart6") || "[]");
let activeCat   = "all";
let activeSub   = "all";
let searchQuery = "";

// ══ HELPERS ══════════════════════════════════════════════
function tsGetSelectedSize(idx) {
  const sel = document.getElementById("ts-size-" + idx);
  return sel ? sel.value : "";
}

function tsTotalStock(p) {
  if (!p.sizes || !p.sizes.length) return null;
  return p.sizes.reduce((s, x) => s + x.qty, 0);
}

function tsStockNoteHTML(p, selectedSize) {
  if (!p.sizes || !p.sizes.length) return "";
  if (!selectedSize) {
    const total = tsTotalStock(p);
    if (total === 0) return '<div class="ts-stock-note out">Out of stock</div>';
    if (total === 1) return '<div class="ts-stock-note low">1 left in stock</div>';
    if (total <= 4) return `<div class="ts-stock-note low">${total} in stock</div>`;
    return "";
  }
  const found = p.sizes.find(s => s.label === selectedSize);
  if (!found) return "";
  if (found.qty === 0) return '<div class="ts-stock-note out">Out of stock in this size</div>';
  if (found.qty === 1) return '<div class="ts-stock-note low">Only 1 left in this size!</div>';
  if (found.qty <= 4) return `<div class="ts-stock-note low">${found.qty} in stock in this size</div>`;
  return "";
}

function tsUpdateStockNote(idx) {
  const p = PRODUCTS[idx];
  const sel = document.getElementById("ts-size-" + idx);
  const selectedSize = sel ? sel.value : "";
  const noteEl = document.getElementById("ts-stock-note-" + idx);
  if (noteEl) noteEl.innerHTML = tsStockNoteHTML(p, selectedSize);
  // disable/enable add to cart button
  const btn = document.getElementById("ts-addcart-" + idx);
  if (btn) {
    const found = p.sizes && selectedSize ? p.sizes.find(s => s.label === selectedSize) : null;
    btn.disabled = !selectedSize || (found && found.qty === 0);
    btn.style.background = btn.disabled ? "#ccc" : "";
  }
}

function tsSizeSelectHTML(p, idx, selectId) {
  if (!p.sizes || !p.sizes.length) return "";
  const opts = p.sizes.map(s => {
    const oos = s.qty === 0;
    return `<option value="${s.label}"${oos ? ' disabled' : ''}>${s.label}${oos ? " — Unavailable" : ""}</option>`;
  });
  return `<select class="ts-size-select" id="${selectId}" onchange="tsUpdateStockNote(${idx})">
    <option value="" disabled selected>Select a size\u2026</option>
    ${opts.join("")}
  </select>`;
}

// ══ CATEGORY & SUBCATEGORY ════════════════════════════════
function tsCat(cat, btn) {
  tsHideCustomViews();
  activeCat = cat;
  activeSub = "all";
  document.querySelectorAll(".ts-catbtn").forEach(b=>b.classList.remove("on"));
  btn.classList.add("on");
  document.getElementById("ts-cat-label").textContent = btn.textContent.trim();
  tsRenderSubcats();
  tsFilter();
}

function tsRenderSubcats() {
  const subs = SUBCATS[activeCat] || [];
  const wrap = document.getElementById("filter-sub");
  const sec  = document.getElementById("sub-section");
  if (!subs.length) { sec.style.display="none"; } else { sec.style.display=""; }
  if (wrap) wrap.innerHTML = subs.map(s =>
    s.v === "---"
      ? `<span style="display:inline-block;width:1px;height:18px;background:#ddd;margin:0 4px;vertical-align:middle;"></span>`
      : `<button class="ts-subcat-btn${s.v===activeSub?' on':''}" onclick="tsSub('${s.v}',this)">${s.l}</button>`
  ).join("");
  // Show/hide size sliders based on category
  const cmSec     = document.getElementById("size-cm-filter-section");
  const bootSec   = document.getElementById("size-boot-filter-section");
  const usBootSec = document.getElementById("size-usboot-filter-section");
  if (cmSec)     cmSec.style.display     = (activeCat === "skis" || activeCat === "snowboards" || activeCat === "all") ? "" : "none";
  if (bootSec)   bootSec.style.display   = (activeCat === "ski-boots" || activeCat === "boots" || activeCat === "all") ? "" : "none";
  if (usBootSec) usBootSec.style.display = (activeCat === "boots") ? "" : "none";
}

function tsSub(sub, btn) {
  if (sub === "---") return;
  activeSub = sub;
  document.querySelectorAll(".ts-subcat-btn").forEach(b=>b.classList.remove("on"));
  btn.classList.add("on");
  tsFilter();
}

// ── SIZE SLIDER ───────────────────────────────────────────
function tsSizeSlider(type) {
  if (type === 'cm') {
    let lo = parseInt(document.getElementById('size-cm-min').value);
    let hi = parseInt(document.getElementById('size-cm-max').value);
    if (lo > hi) { const t=lo; lo=hi; hi=t; document.getElementById('size-cm-min').value=lo; document.getElementById('size-cm-max').value=hi; }
    const isAll = lo === 70 && hi === 184;
    document.getElementById('size-cm-val').textContent = isAll ? 'All sizes' : lo + ' – ' + hi + ' cm';
    const pct1 = (lo - 70) / (184 - 70) * 100;
    const pct2 = (hi - 70) / (184 - 70) * 100;
    const fill = document.getElementById('size-cm-fill');
    if (fill) { fill.style.left = pct1 + '%'; fill.style.width = (pct2 - pct1) + '%'; }
  } else if (type === 'usboot') {
    let lo = parseInt(document.getElementById('size-usboot-min').value);
    let hi = parseInt(document.getElementById('size-usboot-max').value);
    if (lo > hi) { const t=lo; lo=hi; hi=t; document.getElementById('size-usboot-min').value=lo; document.getElementById('size-usboot-max').value=hi; }
    const loD = lo/10, hiD = hi/10;
    const isAll = lo === 10 && hi === 140;
    document.getElementById('size-usboot-val').textContent = isAll ? 'All sizes' : loD.toFixed(1) + ' – ' + hiD.toFixed(1);
    const pct1 = (lo - 10) / (140 - 10) * 100;
    const pct2 = (hi - 10) / (140 - 10) * 100;
    const fill = document.getElementById('size-usboot-fill');
    if (fill) { fill.style.left = pct1 + '%'; fill.style.width = (pct2 - pct1) + '%'; }
  } else {
    let lo = parseInt(document.getElementById('size-boot-min').value);
    let hi = parseInt(document.getElementById('size-boot-max').value);
    if (lo > hi) { const t=lo; lo=hi; hi=t; document.getElementById('size-boot-min').value=lo; document.getElementById('size-boot-max').value=hi; }
    const loD = lo/10, hiD = hi/10;
    const isAll = lo === 225 && hi === 305;
    document.getElementById('size-boot-val').textContent = isAll ? 'All sizes' : loD.toFixed(1) + ' – ' + hiD.toFixed(1);
    const pct1 = (lo - 225) / (305 - 225) * 100;
    const pct2 = (hi - 225) / (305 - 225) * 100;
    const fill = document.getElementById('size-boot-fill');
    if (fill) { fill.style.left = pct1 + '%'; fill.style.width = (pct2 - pct1) + '%'; }
  }
  tsFilter();
}

// ══ FILTER & RENDER ═══════════════════════════════════════
function tsFilter() {
  const genders = [...document.querySelectorAll("#ts-store input[value='men'],#ts-store input[value='women'],#ts-store input[value='unisex']")].filter(x=>x.checked).map(x=>x.value);
  const ages    = [...document.querySelectorAll("#ts-store input[value='adult'],#ts-store input[value='kid']")].filter(x=>x.checked).map(x=>x.value);
  const pMin    = parseFloat(document.getElementById("price-min").value) || 0;
  const pMax    = parseFloat(document.getElementById("price-max").value) || Infinity;
  const sort    = document.getElementById("ts-sort").value;
  const q       = tsNormalizeQuery(searchQuery);
  const bindingsOnly = document.getElementById("filter-bindings-included") ? document.getElementById("filter-bindings-included").checked : false;
  const flatMountOnly = document.getElementById("filter-flat-mount") ? document.getElementById("filter-flat-mount").checked : false;
  // Size range sliders
  const cmMinEl  = document.getElementById("size-cm-min");
  const cmMaxEl  = document.getElementById("size-cm-max");
  const btMinEl  = document.getElementById("size-boot-min");
  const btMaxEl  = document.getElementById("size-boot-max");
  const cmMin  = cmMinEl  ? parseInt(cmMinEl.value)  : 70;
  const cmMax  = cmMaxEl  ? parseInt(cmMaxEl.value)  : 184;
  const btMin  = btMinEl  ? parseInt(btMinEl.value)  : 225;
  const btMax  = btMaxEl  ? parseInt(btMaxEl.value)  : 305;
  const usbtMinEl = document.getElementById("size-usboot-min");
  const usbtMaxEl = document.getElementById("size-usboot-max");
  const usbtMin = usbtMinEl ? parseInt(usbtMinEl.value) : 10;
  const usbtMax = usbtMaxEl ? parseInt(usbtMaxEl.value) : 140;
  const cmActive     = !(cmMin === 70  && cmMax === 184);
  const bootActive   = !(btMin === 225 && btMax === 305);
  const usbootActive = !(usbtMin === 10 && usbtMax === 140);

  let items = PRODUCTS.filter(p => {
    if (activeCat !== "all") {
      if (activeCat === "boots") {
        if (p.cat !== "ski-boots" && p.cat !== "snowboard-boots" && p.cat !== "winter-boots") return false;
      } else if (p.cat !== activeCat) return false;
    }
    if (activeCat !== "all" && activeSub !== "all") {
      if (activeCat === "boots") {
        if (activeSub === "ski"     && p.cat !== "ski-boots") return false;
        if (activeSub === "snowboard" && p.cat !== "snowboard-boots") return false;
        if (activeSub === "winter"  && p.cat !== "winter-boots") return false;
        if (["roxa","salomon","nidecker","baffin"].includes(activeSub) && p.sub !== activeSub) return false;
      } else if (p.sub !== activeSub) return false;
    }
    if (!genders.includes(p.gender)) return false;
    if (!ages.includes(p.age))       return false;
    if (p.price < pMin || p.price > pMax) return false;
    if (q) {
      const tags = (PRODUCT_TAGS[p.name] || "").toLowerCase();
      const searchFields = [p.name, p.desc, p.brand, p.badge || "", tags].map(s => s.toLowerCase()).join(" ");
      // Also strip accents so "kastle" matches "Kästle"
      const brandNorm = p.brand.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
      const nameNorm  = p.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
      // Also try matching each word of a multi-word query independently
      const rawQ = searchQuery.toLowerCase().trim();
      const words = rawQ.split(/\s+/).filter(w => w.length > 1);
      const allFieldsNorm = searchFields + " " + brandNorm + " " + nameNorm;
      const matchesNormalized = allFieldsNorm.includes(q);
      const matchesAllWords   = words.length > 1 && words.every(w => allFieldsNorm.includes(w));
      if (!matchesNormalized && !matchesAllWords) return false;
    }
    if (bindingsOnly && p.cat === "skis" && !p.bindings) return false;
    if (flatMountOnly && (p.cat === "skis" || p.cat === "snowboards") && !p.flatmount) return false;
    // Size range filter — cm slider for skis & snowboards
    if (cmActive && (p.cat === "skis" || p.cat === "snowboards")) {
      if (!p.sizes || !p.sizes.length) return false;
      const hasCmSize = p.sizes.some(s => {
        const m = s.label.match(/^(\d+)cm$/);
        if (!m) return false;
        const v = parseInt(m[1]);
        return v >= cmMin && v <= cmMax && s.qty > 0;
      });
      if (!hasCmSize) return false;
    }
    // Size range filter — boot slider
    if (bootActive && p.cat === "ski-boots") {
      if (!p.sizes || !p.sizes.length) return false;
      const hasBootSize = p.sizes.some(s => {
        const v = parseFloat(s.label);
        if (isNaN(v)) return false;
        return Math.round(v * 10) >= btMin && Math.round(v * 10) <= btMax;
      });
      if (!hasBootSize) return false;
    }
    // Size range filter — boot slider (US sizes: snowboard & winter boots)
    if (usbootActive && (p.cat === "snowboard-boots" || p.cat === "winter-boots")) {
      if (!p.sizes || !p.sizes.length) return false;
      const hasUsBootSize = p.sizes.some(s => {
        const v = parseFloat(s.label);
        if (isNaN(v)) return false;
        return Math.round(v * 10) >= usbtMin && Math.round(v * 10) <= usbtMax;
      });
      if (!hasUsBootSize) return false;
    }
    return true;
  });

  if      (sort==="price_lo") items.sort((a,b)=>a.price-b.price);
  else if (sort==="price_hi") items.sort((a,b)=>b.price-a.price);
  else if (sort==="name")     items.sort((a,b)=>a.name.localeCompare(b.name));
  else                        items.sort((a,b)=>tsDiscountPct(b)-tsDiscountPct(a) || b.popular-a.popular);
  // Always push fully out-of-stock items to bottom
  items.sort((a,b)=>{
    const aStock = a.sizes ? a.sizes.reduce((s,x)=>s+x.qty,0) : 1;
    const bStock = b.sizes ? b.sizes.reduce((s,x)=>s+x.qty,0) : 1;
    if (aStock === 0 && bStock > 0) return 1;
    if (bStock === 0 && aStock > 0) return -1;
    return 0;
  });

  document.getElementById("ts-count-label").textContent = items.length + " item" + (items.length!==1?"s":"");

  const tags = [];
  if (activeSub !== "all") tags.push({label: activeSub.charAt(0).toUpperCase()+activeSub.slice(1), action: ()=>{activeSub="all"; tsRenderSubcats(); tsFilter();}});
  document.getElementById("ts-active-filters").innerHTML = tags.map((t,i)=>
    `<button class="ts-filter-tag" onclick="filterTagClick(${i})">✕ ${t.label}</button>`
  ).join("");
  window._filterTags = tags;

  const grid = document.getElementById("ts-grid");
  const none = document.getElementById("ts-no-results");
  if (!items.length) { grid.innerHTML=""; none.classList.add("show"); return; }
  none.classList.remove("show");

  // Split into in-stock and out-of-stock
  const inStockItems  = items.filter(p => !p.sizes || p.sizes.reduce((s,x)=>s+x.qty,0) > 0);
  const outStockItems = items.filter(p =>  p.sizes && p.sizes.reduce((s,x)=>s+x.qty,0) === 0);

  const renderCard = p => {
    const idx       = PRODUCTS.indexOf(p);
    const priceStr  = p.price===0 ? "Call Us" : tsPriceDisplay(p.price, p.msrp);
    const badgeHTML = p.badge ? `<div class="ts-card-badge ${p.badgeType}">${p.badge}</div>` : "";
    const mediaHTML = `<div class="ts-card-img-wrap">${
      p.images && p.images.length
        ? `<img class="ts-card-img-thumb" src="${p.images[0]}" alt="${p.name}" />`
        : `<div class="ts-card-emoji">${p.icon}</div>`
    }</div>`;
    const metaStr   = [p.gender==="men"?"Men's":p.gender==="women"?"Women's":"Unisex", p.age==="kid"?"Kids":"Adult"].join(" · ");
    const mountLabel = p.cat === "skis" ? (p.flatmount ? " · Flat Mount" : p.bindings ? " · Bindings Included" : "") : "";

    // Size selector
    const hasSizes = p.sizes && p.sizes.length > 0;
    const totalStock = hasSizes ? p.sizes.reduce((s,x)=>s+x.qty,0) : null;
    const sizeWrapHTML = hasSizes ? `
      <div class="ts-size-wrap" onclick="event.stopPropagation()">
        <span class="ts-size-label">Size</span>
        ${tsSizeSelectHTML(p, idx, "ts-size-"+idx)}
        <div id="ts-stock-note-${idx}">${tsStockNoteHTML(p, "")}</div>
      </div>` : "";

    const addDisabled = hasSizes ? ' disabled' : '';
    const addBtn = p.link
      ? `<a class="ts-pill" href="${p.link}" target="_blank">${p.action}</a>`
      : `<button class="ts-pill" id="ts-addcart-${idx}"${addDisabled}${hasSizes?' style="background:#ccc;border-color:#ccc"':''} onclick="event.stopPropagation();tsAdd(this,${idx})">${p.action}</button>`;

    return `
      <div class="ts-card" onclick="tsPOpen(${idx})">
        <div class="ts-card-inner">
          ${badgeHTML}
          ${mediaHTML}
          <div class="ts-card-info">
            <div class="ts-card-brand">${p.brand}</div>
            <div class="ts-card-name">${p.name}</div>
            <div class="ts-card-meta">${metaStr}${mountLabel}</div>
            <div class="ts-card-desc">${p.desc}</div>
            <div class="ts-card-price">${priceStr}</div>
          </div>
          ${sizeWrapHTML}
          <div class="ts-card-btns">
            <button class="ts-pill outline" onclick="event.stopPropagation();tsPOpen(${idx})">Details</button>
            ${addBtn}
          </div>
        </div>
      </div>`;
  };

  const inStockHTML  = inStockItems.map(renderCard).join("");
  const outStockHTML = outStockItems.length ? `
    <div class="ts-oos-divider" id="ts-oos-divider">
      <button class="ts-oos-toggle" onclick="tsToggleOOS(this)">
        <span>▼ Show ${outStockItems.length} out-of-stock item${outStockItems.length > 1 ? 's' : ''}</span>
      </button>
    </div>
    <div class="ts-oos-section" id="ts-oos-section" style="display:none;">
      ${outStockItems.map(renderCard).join("")}
    </div>` : "";

  grid.innerHTML = inStockHTML + outStockHTML;

}

function tsToggleOOS(btn) {
  const sec = document.getElementById('ts-oos-section');
  const isHidden = sec.style.display === 'none';
  sec.style.display = isHidden ? '' : 'none';
  btn.innerHTML = isHidden
    ? '<span>▲ Hide out-of-stock items</span>'
    : '<span>▼ Show ' + sec.querySelectorAll('.ts-card').length + ' out-of-stock item' + (sec.querySelectorAll('.ts-card').length > 1 ? 's' : '') + '</span>';
}

function filterTagClick(i) { window._filterTags[i].action(); }
function tsSearch(val) { searchQuery=val; tsFilter(); }

function tsClearFilters() {
  // reset all state variables
  activeCat   = "all";
  activeSub   = "all";
  searchQuery = "";
  // reset UI inputs
  const searchEl  = document.getElementById("ts-search");
  const priceMin  = document.getElementById("price-min");
  const priceMax  = document.getElementById("price-max");
  const sortEl    = document.getElementById("ts-sort");
  if (searchEl) searchEl.value = "";
  if (priceMin) priceMin.value = "";
  if (priceMax) priceMax.value = "";
  if (sortEl)   sortEl.value   = "popular";
  // uncheck nothing — make sure all checkboxes are ON
  document.querySelectorAll("#ts-store input[type='checkbox']").forEach(x => x.checked = true);
  // options filters are opt-in, reset them to off
  const bEl = document.getElementById("filter-bindings-included");
  const fEl = document.getElementById("filter-flat-mount");
  if (bEl) bEl.checked = false;
  if (fEl) fEl.checked = false;
  // reset size sliders
  const cmMinEl = document.getElementById("size-cm-min");
  const cmMaxEl = document.getElementById("size-cm-max");
  const btMinEl = document.getElementById("size-boot-min");
  const btMaxEl = document.getElementById("size-boot-max");
  const usbtMinEl = document.getElementById("size-usboot-min");
  const usbtMaxEl = document.getElementById("size-usboot-max");
  if (cmMinEl) cmMinEl.value = 70;
  if (cmMaxEl) cmMaxEl.value = 184;
  if (btMinEl) btMinEl.value = 225;
  if (btMaxEl) btMaxEl.value = 305;
  if (usbtMinEl) usbtMinEl.value = 10;
  if (usbtMaxEl) usbtMaxEl.value = 140;
  const cmVal = document.getElementById("size-cm-val");
  const btVal = document.getElementById("size-boot-val");
  const usbtVal = document.getElementById("size-usboot-val");
  if (cmVal) cmVal.textContent = "All sizes";
  if (btVal) btVal.textContent = "All sizes";
  if (usbtVal) usbtVal.textContent = "All sizes";
  const cmFill = document.getElementById("size-cm-fill");
  const btFill = document.getElementById("size-boot-fill");
  const usbtFill = document.getElementById("size-usboot-fill");
  if (cmFill) { cmFill.style.left="0%"; cmFill.style.width="100%"; }
  if (btFill) { btFill.style.left="0%"; btFill.style.width="100%"; }
  if (usbtFill) { usbtFill.style.left="0%"; usbtFill.style.width="100%"; }
  // reset category tab highlights
  document.querySelectorAll(".ts-catbtn").forEach(b => b.classList.remove("on"));
  const allCatBtn = document.querySelector(".ts-catbtn");
  if (allCatBtn) allCatBtn.classList.add("on");
  // reset cat label
  const catLabel = document.getElementById("ts-cat-label");
  if (catLabel) catLabel.textContent = "All";
  // re-render and filter
  tsRenderSubcats();
  tsFilter();
}

// ══ CART ADD (from card) ══════════════════════════════════
function tsAdd(btn, idx) {
  const p = PRODUCTS[idx];
  const size = tsGetSelectedSize(idx);
  if (p.sizes && p.sizes.length && !size) { alert("Please select a size."); return; }
  // check stock
  if (p.sizes && p.sizes.length && size) {
    const found = p.sizes.find(s => s.label === size);
    if (found && found.qty === 0) { alert("This size is out of stock."); return; }
  }
  const cartKey = p.name + (size ? " — " + size : "");
  const sizeObj = p.sizes ? p.sizes.find(s => s.label === size) : null;
  const hlId    = sizeObj && sizeObj.hlId ? sizeObj.hlId : null;
  const ex = cart.find(i => i.key === cartKey);
  ex ? ex.qty++ : cart.push({key:cartKey, name:p.name, size:size, price:p.price, msrp:p.msrp||null, cat:p.cat, brand:p.brand, icon:p.icon, qty:0, hlId:hlId});
  tsSave(); tsUpdateUI();
  const orig = btn.textContent; btn.textContent="Added ✓"; btn.style.background="#27ae60";
  setTimeout(()=>{btn.textContent=orig; btn.style.background="";},1400);
  tsOpenCart();
}

// ══ PRODUCT DETAIL ════════════════════════════════════════
function tsPOpen(idx) {
  const p = PRODUCTS[idx];
  document.getElementById("pm-title").textContent = p.name;

  const gallery = document.getElementById("pm-gallery");
  if (p.images && p.images.length) {
    gallery.innerHTML = `
      <div class="ts-mag-wrap" onmousemove="tsMagMove(event,this)" onmouseleave="tsMagLeave(this)" onclick="tsZoomOpen(document.getElementById('pm-main-img').src)">
        <img class="ts-pm-main-img" id="pm-main-img" src="${p.images[0]}" alt="${p.name}" style="pointer-events:none;" />
        <div class="ts-mag-lens" id="mag-modal-lens"></div>
        <div class="ts-mag-result" id="mag-modal-result"></div>
        <div style="position:absolute;bottom:8px;right:8px;background:rgba(0,0,0,0.5);color:#fff;font-size:0.72em;padding:3px 9px;border-radius:3px;pointer-events:none;">🔍 Click to zoom</div>
      </div>
      ${p.images.length>1?`<div class="ts-pm-thumbs">${p.images.map((src,i)=>`<img class="ts-pm-thumb${i===0?' active':''}" src="${src}" onclick="tsPThumb(this,'${src}')" />`).join("")}</div>`:""}`;
  } else {
    gallery.innerHTML = `<div class="ts-pm-main-emoji">${p.icon}</div>`;
  }

  const specsRows = p.specs ? Object.entries(p.specs).map(([k,v])=>`<tr><td>${k}</td><td>${v}</td></tr>`).join("") : "";
  const specsHTML = specsRows ? `<div class="ts-accordion"><button class="ts-accordion-btn" onclick="tsAccToggle(this)">Specs <span class="ts-acc-arrow">▼</span></button><div class="ts-accordion-body"><table class="ts-pm-specs">${specsRows}</table></div></div>` : "";
  const detailDescHTML = ((p.brand === "Icelantic" || p.brand === "Kästle" || p.brand === "Rossignol" || p.brand === "Salomon" || p.brand === "Jones" || p.brand === "Nidecker" || p.brand === "Rome" || p.brand === "Bataleon") && p.longDesc) ? `<div class="ts-accordion"><button class="ts-accordion-btn" onclick="tsAccToggle(this)">Detailed Description <span class="ts-acc-arrow">▼</span></button><div class="ts-accordion-body"><p style="font-size:14px;line-height:1.7;color:#444;margin:0;">${p.longDesc}</p></div></div>` : "";

  const bdRows = p.breakdown ? p.breakdown.map(r=>`<div class="ts-pm-brow"><span>${r.label}</span><span>${r.amount===0?(r.note||"—"):"$"+r.amount.toFixed(2)}</span></div>`).join("") : "";
  const bdHTML = "";

  const priceStr  = p.price===0 ? "Call Us" : tsPriceDisplay(p.price, p.msrp);
  const badgeHTML = p.badge ? `<span class="ts-pm-badge ${p.badgeType}">${p.badge}</span>` : "";

  // Size picker in modal
  const hasSizes = p.sizes && p.sizes.length > 0;
  const modalSizeId = "pm-size-select-" + idx;
  // Colorway picker for products with colorways array
  const colorwayHTML = p.colorways ? `
    <div class="ts-pm-colorway-wrap">
      <span class="ts-pm-size-label">Color</span>
      <div class="ts-pm-colorways" id="pm-colorways-${idx}">
        ${p.colorways.map((c,ci) => `
          <div class="ts-pm-colorway-item${ci===0?' active':''}" 
               onclick="tsPColorway(${idx},${ci})"
               title="${c.label}">
            <img src="${c.image}" />
            <span>${c.label}</span>
          </div>`).join('')}
      </div>
    </div>` : "";

  const sizePickerHTML = hasSizes ? `
    <div class="ts-pm-size-wrap">
      <span class="ts-pm-size-label">${p.colorways ? 'Confirm Color' : 'Select Size'}</span>
      ${tsSizeSelectHTML(p, idx, modalSizeId)}
      <div id="pm-stock-note-${idx}" style="margin-top:5px;font-size:0.78em;"></div>
    </div>` : "";

  const addBtn = p.link
    ? `<a class="ts-pm-contact" href="${p.link}" target="_blank">${p.action}</a>`
    : `<button class="ts-pm-add" onclick="tsPAdd(${idx})">Add to Cart</button>`;

  // Compatible Bindings
  const compatSubcat = COMPAT_BINDINGS_NAMES[p.name] || (p.cat === "snowboards" ? "snowboard-binding" : COMPATIBLE_BINDINGS_MAP[p.sub]);
  let compatHTML = "";
  if (compatSubcat) {
    // Smart binding selection: 2 same-brand + price-matched
  const allCompatBindings = BINDINGS.filter(b => b.sub === compatSubcat);
  let compatItems = [];
  if (p.cat === "snowboards") {
    // Sort all by price proximity to board price
    const boardPrice = p.price;
    const sameBrand  = allCompatBindings.filter(b => b.brand.toLowerCase() === p.brand.toLowerCase());
    const otherBrand = allCompatBindings.filter(b => b.brand.toLowerCase() !== p.brand.toLowerCase());
    // Sort each group by price proximity
    const byProximity = arr => arr.slice().sort((a,b) => Math.abs(a.price - boardPrice) - Math.abs(b.price - boardPrice));
    const brandPicks = byProximity(sameBrand).slice(0, 2);
    const otherPicks = byProximity(otherBrand).slice(0, 2);
    compatItems = [...brandPicks, ...otherPicks].slice(0, 4);
    // If not enough brand matches, fill with price-proximate others
    if (compatItems.length < 4) {
      const used = new Set(compatItems.map(b => b.name));
      const extras = byProximity(allCompatBindings).filter(b => !used.has(b.name));
      compatItems = [...compatItems, ...extras].slice(0, 4);
    }
  } else {
    compatItems = allCompatBindings.slice(0, 4);
  }
    if (compatItems.length) {
      const sectionTitle = compatSubcat === "snowboard-binding" ? "Popular Binding Choices" : "Popular Binding Choices";
      const itemsHTML = compatItems.map((b, bi) => {
        const bIdx = PRODUCTS.indexOf(b);
        const bPriceHTML = b.price === 0 ? "Call Us" : tsPriceDisplay(b.price, b.msrp);
        return `<div class="ts-compat-item" onclick="tsPOpen(${bIdx})" style="cursor:pointer;">
          <div class="ts-compat-item-left">
            <span class="ts-compat-item-brand">${b.brand}</span>
            <span class="ts-compat-item-name">${b.name} <span style="font-size:11px;color:#888;">↗</span></span>
          </div>
          <span class="ts-compat-item-price">${bPriceHTML}</span>
          <button class="ts-compat-add" id="compat-btn-${bi}" onclick="event.stopPropagation();tsCompatAdd(${bIdx}, ${bi}, this)">+ Add</button>
        </div>`;
      }).join("");
      compatHTML = `
        <div class="ts-compat-section">
          <div class="ts-compat-title"><i class="fa fa-link"></i> ${sectionTitle}</div>
          <div class="ts-compat-list">${itemsHTML}</div>
        </div>`;
    }
  }

  document.getElementById("pm-info").innerHTML = `
    <div class="ts-pm-brand">${p.brand}</div>
    <div class="ts-pm-name">${p.name}</div>
    ${badgeHTML}
    <div class="ts-pm-price">${priceStr}</div>
    <div class="ts-pm-price-note">Binding mount & tune included free with every ski purchase.</div>
    ${colorwayHTML || ""}${sizePickerHTML}
    ${p.desc?`<div class="ts-pm-desc">${p.desc}</div>`:""}
    ${compatHTML}
    ${specsHTML}${detailDescHTML}
    ${bdHTML}
    <div class="ts-pm-actions">
      ${addBtn}
      <a class="ts-pm-contact" href="tel:8888637547"><i class="fa fa-phone"></i> Call Us</a>
    </div>`;

  // Set default size in modal picker — start unselected, show total stock
  if (hasSizes) {
    const modalSel = document.getElementById(modalSizeId);
    const noteEl = document.getElementById("pm-stock-note-"+idx);
    if (noteEl) noteEl.innerHTML = tsStockNoteHTML(p, "");
    if (modalSel) {
      modalSel.addEventListener("change", function() {
        const found = p.sizes.find(s => s.label === this.value);
        if (noteEl && found) {
          noteEl.innerHTML = tsStockNoteHTML(p, this.value);
        }
      });
    }
  }

  document.getElementById("ts-pscrim").classList.add("open");
  document.body.style.overflow = "hidden";
}

function tsPThumb(el,src) { const m=document.getElementById("pm-main-img"); if(m) m.src=src; document.querySelectorAll(".ts-pm-thumb").forEach(t=>t.classList.remove("active")); el.classList.add("active"); }

function tsCompatAdd(bIdx, btnIdx, btn) {
  const b = PRODUCTS[bIdx];
  const cartKey = b.name;
  const ex = cart.find(i => i.key === cartKey);
  ex ? ex.qty++ : cart.push({key:cartKey, name:b.name, size:"", price:b.price, msrp:b.msrp||b.price, icon:b.icon, qty:1});
  tsSave(); tsUpdateUI();
  btn.textContent = "✓ Added";
  btn.classList.add("added");
  btn.disabled = true;
}

function tsPAdd(idx) {
  const p = PRODUCTS[idx];
  // Try to get size from modal picker first, then card picker
  const modalSel = document.getElementById("pm-size-select-"+idx);
  const size = modalSel ? modalSel.value : tsGetSelectedSize(idx);
  if (p.sizes && p.sizes.length && !size) { alert("Please select a size."); return; }
  if (p.sizes && p.sizes.length && size) {
    const found = p.sizes.find(s => s.label === size);
    if (found && found.qty === 0) { alert("This size is out of stock."); return; }
  }
  const cartKey = p.name + (size ? " — " + size : "");
  const sizeObj = p.sizes ? p.sizes.find(s => s.label === size) : null;
  const hlId    = sizeObj && sizeObj.hlId ? sizeObj.hlId : null;
  const ex = cart.find(i => i.key === cartKey);
  ex ? ex.qty++ : cart.push({key:cartKey, name:p.name, size:size, price:p.price, msrp:p.msrp||null, cat:p.cat, brand:p.brand, icon:p.icon, qty:0, hlId:hlId});
  tsSave(); tsUpdateUI(); tsPCloseBtn(); setTimeout(()=>tsOpenCart(),250);
}

function tsPClose(e) { if(e.target===document.getElementById("ts-pscrim")) tsPCloseBtn(); }
function tsPCloseBtn() { document.getElementById("ts-pscrim").classList.remove("open"); document.body.style.overflow=""; }

// ══ ZOOM ══════════════════════════════════════════════════
function tsZoomOpen(src) { document.getElementById("ts-zoom-img").src=src; document.getElementById("ts-zoom-overlay").classList.add("open"); }
function tsZoomClose() { document.getElementById("ts-zoom-overlay").classList.remove("open"); }
document.addEventListener("keydown",e=>{ if(e.key==="Escape"){ tsZoomClose(); tsPCloseBtn(); } });

// ══ ACCORDION ═════════════════════════════════════════════
function tsAccToggle(btn) { const b=btn.nextElementSibling; const o=b.classList.contains("open"); btn.classList.toggle("open",!o); b.classList.toggle("open",!o); }

// ══ CART ══════════════════════════════════════════════════
function tsRemove(key) { cart=cart.filter(i=>i.key!==key); tsSave(); tsUpdateUI(); tsRenderDrawer(); }
function tsQty(key,d) { const i=cart.find(x=>x.key===key); if(i){i.qty=Math.max(1,i.qty+d); if(i.deal) i.qty=1; tsSave(); tsUpdateUI(); tsRenderDrawer();} }
function tsSave()  { localStorage.setItem("ts_cart6",JSON.stringify(cart)); }
function tsTotal() {
  return cart.reduce((s,i) => s + i.price * (i.qty||1), 0);
}
function tsUpdateUI() { const n=cart.reduce((s,i)=>s+i.qty,0); document.getElementById("ts-badge-count").textContent=n; document.getElementById("ts-dtotal").textContent="$"+tsTotal().toFixed(2); }
function tsRenderDrawer() {
  const el=document.getElementById("ts-ditems");
  if(!cart.length){el.innerHTML=`<div class="ts-empty-cart">Your cart is empty.</div>`;return;}
  el.innerHTML=cart.map((i,n)=>`
    <div class="ts-ci">
      <div class="ts-ci-icon">${i.icon}</div>
      <div style="flex:1">
        <div class="ts-ci-name">${i.name}</div>
        ${i.size ? `<div class="ts-ci-size">Size: ${i.size}</div>` : ""}
        <div class="ts-ci-price">$${i.price.toFixed(2)}</div>
        <div class="ts-ci-row">
          <button class="ts-qb" data-idx="${n}" data-d="-1" onclick="tsQtyIdx(this)">−</button>
          <span class="ts-qv">${i.qty}</span>
          <button class="ts-qb" data-idx="${n}" data-d="1" onclick="tsQtyIdx(this)">+</button>
        </div>
      </div>
      <button class="ts-rm" data-idx="${n}" onclick="tsRemoveIdx(this)">✕</button>
    </div>`).join("");
}
function tsRemoveIdx(btn) {
  const n = parseInt(btn.getAttribute('data-idx'));
  if (!isNaN(n) && cart[n]) { cart.splice(n,1); tsSave(); tsUpdateUI(); tsRenderDrawer(); }
}
function tsQtyIdx(btn) {
  const n = parseInt(btn.getAttribute('data-idx'));
  const d = parseInt(btn.getAttribute('data-d'));
  if (!isNaN(n) && cart[n]) { cart[n].qty = Math.max(1, cart[n].qty + d); if (cart[n].deal) cart[n].qty = 1; tsSave(); tsUpdateUI(); tsRenderDrawer(); }
}
function tsOpenCart()  { tsRenderDrawer(); document.getElementById("ts-drawer").classList.add("open"); document.getElementById("ts-scrim").classList.add("open"); }
function tsCloseCart() { document.getElementById("ts-drawer").classList.remove("open"); document.getElementById("ts-scrim").classList.remove("open"); }

// ══ CHECKOUT ══════════════════════════════════════════════
function tsCloseCheckout() { document.getElementById("ts-mscrim").classList.remove("open"); }
async function tsSubmit() {
  const fn=document.getElementById("m-fn").value.trim(), ln=document.getElementById("m-ln").value.trim(), em=document.getElementById("m-em").value.trim(), ph=document.getElementById("m-ph").value.trim(), no=document.getElementById("m-no").value.trim();
  if(!fn||!ln||!em){alert("Please fill in first name, last name, and email.");return;}
  const btn=document.getElementById("ts-submit-btn"); btn.disabled=true; btn.textContent="Placing order…";
  if(HL_SERVER){try{const r=await fetch(HL_SERVER+"/order",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({customer:{firstName:fn,lastName:ln,email:em,phone:ph},items:cart.map(i=>({name:i.name,size:i.size,qty:i.qty,price:i.price,hlId:i.hlId||null})),total:tsTotal(),notes:no})}); const d=await r.json(); if(d.success){tsSuccess(fn,em,d.orderId);return;}}catch(e){}}
  const lines=cart.map(i=>`${i.icon} ${i.name}${i.size?" ("+i.size+")":""} x${i.qty} = $${(i.price*i.qty).toFixed(2)}`).join("%0A");
  window.open(`mailto:${SHOP_EMAIL}?subject=${encodeURIComponent("New Order — "+fn+" "+ln)}&body=${encodeURIComponent("Customer: "+fn+" "+ln+"\nEmail: "+em+"\nPhone: "+ph+"\nNotes: "+(no||"None")+"\n\n")+lines+encodeURIComponent("\n\nTotal: $"+tsTotal().toFixed(2))}`,"_blank");
  tsSuccess(fn,em,null);
}
function tsSuccess(fn,em,id) {
  cart=[]; tsSave(); tsUpdateUI();
  document.getElementById("ts-modal-body").innerHTML=`<div class="ts-success"><div class="ts-success-icon">✅</div><h3>Order Received!</h3><p>Thanks, ${fn}! We'll follow up at <strong>${em}</strong>${id?` (order #${id})`:""} to confirm everything.<br><br>Call <a href="tel:8888637547">(888) 863-7547</a> or stop by 272 Saratoga Rd.</p></div>`;
}

// ══ MAGNIFIER ═════════════════════════════════════════════
function tsMagMove(e, wrap) {
  const img    = wrap.querySelector('img');
  const lens   = wrap.querySelector('.ts-mag-lens');
  const result = wrap.querySelector('.ts-mag-result');
  if (!img || !lens || !result) return;

  const rect  = wrap.getBoundingClientRect();
  const x     = e.clientX - rect.left;
  const y     = e.clientY - rect.top;
  const zoom  = 3;
  const lensW = lens.offsetWidth;
  const lensH = lens.offsetHeight;
  const resW  = result.offsetWidth  || 320;
  const resH  = result.offsetHeight || 380;

  // Clamp lens center so it stays within image bounds
  const cx = Math.max(lensW/2, Math.min(x, rect.width  - lensW/2));
  const cy = Math.max(lensH/2, Math.min(y, rect.height - lensH/2));

  // Position lens
  lens.style.left    = cx + "px";
  lens.style.top     = cy + "px";
  lens.style.display = "block";

  // Lens background (small zoomed preview inside lens)
  const lbgX = (cx / rect.width)  * (rect.width  * zoom) - lensW / 2;
  const lbgY = (cy / rect.height) * (rect.height * zoom) - lensH / 2;
  lens.style.backgroundImage    = `url('${img.src}')`;
  lens.style.backgroundSize     = `${rect.width * zoom}px ${rect.height * zoom}px`;
  lens.style.backgroundPosition = `-${lbgX}px -${lbgY}px`;

  // Result panel background (same zoom, sized to result panel)
  const rbgX = (cx / rect.width)  * (rect.width  * zoom) - resW / 2;
  const rbgY = (cy / rect.height) * (rect.height * zoom) - resH / 2;
  result.style.backgroundImage    = `url('${img.src}')`;
  result.style.backgroundSize     = `${rect.width * zoom}px ${rect.height * zoom}px`;
  result.style.backgroundPosition = `-${rbgX}px -${rbgY}px`;
  result.style.display = "block";
}

function tsMagLeave(wrap) {
  const lens   = wrap.querySelector('.ts-mag-lens');
  const result = wrap.querySelector('.ts-mag-result');
  if (lens)   lens.style.display   = "none";
  if (result) result.style.display = "none";
}

// ══ INIT ══════════════════════════════════════════════════


// ══ HEARTLAND LIVE INVENTORY SYNC ════════════════════════
// Exact qty map from Heartland — keyed by (name_fragment, size_label)
// Updated: 2026-03-15. Re-run the console script to refresh.

// Hide any package-picker card whose product is fully out of stock
function pkgRefreshStock() {
  document.querySelectorAll('#ts-package-view .pkg-card, #ts-ski-package-view .pkg-card').forEach(function(card) {
    var name = card.getAttribute('data-name');
    var prod = PRODUCTS.find(function(p){ return p.name === name; });
    if (!prod || !prod.sizes || !prod.sizes.length) { card.style.display = ''; return; }
    var inStock = prod.sizes.some(function(s){ return s.qty > 0; });
    card.style.display = inStock ? '' : 'none';
  });
}
window.pkgRefreshStock = pkgRefreshStock;

async function hlSyncInventory() {
  try {
    const resp = await fetch('https://tuneskis-server.onrender.com/inventory');
    if (!resp.ok) return;
    const data = await resp.json();
    if (!data.success || !data.items) return;

    // Build hlId → qty map
    const hlMap = {};
    data.items.forEach(function(item) {
      hlMap[item.id] = { qty: item.qty || 0, price: item.price || 0 };
    });

    // Update each product size by hlId directly
    var updated = 0;
    PRODUCTS.forEach(function(prod) {
      if (!prod || !prod.sizes) return;
      prod.sizes.forEach(function(sz) {
        if (!sz.hlId) return;
        var entry = hlMap[sz.hlId];
        if (entry !== undefined) {
          sz.qty = entry.qty;
          updated++;
        }
      });
      // Update price from first size with a valid hlId and price
      for (var i = 0; i < prod.sizes.length; i++) {
        var entry = hlMap[prod.sizes[i].hlId];
        if (entry && entry.price > 0) {
          if (prod.customMsrp) {
            // Use custom pricing — don't overwrite with Heartland
            prod.msrp  = prod.customMsrp;
            prod.price = prod.customPrice || tsDiscountedPrice(prod.customMsrp);
          } else {
            prod.msrp  = entry.price;
            prod.price = tsDiscountedPrice(entry.price);
          }
          break;
        }
      }
    });

    window._tsHlMap = hlMap;
    console.log('[TuneSkis] Live sync: updated', updated, 'sizes from Heartland');
    tsFilter();
    pkgRefreshStock();
    dealRender();
  } catch(e) {
    console.warn('[TuneSkis] Sync failed:', e.message);
  }
}

// ══ INIT ══════════════════════════════
(function waitForGrid() {
  var grid = document.getElementById('ts-grid');
  if (!grid) { setTimeout(waitForGrid, 50); return; }
  // Init slider fills to full width
  const cmFill = document.getElementById("size-cm-fill");
  const btFill = document.getElementById("size-boot-fill");
  const usbtFillInit = document.getElementById("size-usboot-fill");
  if (usbtFillInit) { usbtFillInit.style.left="0%"; usbtFillInit.style.width="100%"; }
  if (cmFill) { cmFill.style.left="0%"; cmFill.style.width="100%"; }
  if (btFill) { btFill.style.left="0%"; btFill.style.width="100%"; }
  tsRenderSubcats();
  tsUpdateUI();
  // Hide grid until inventory sync completes
  const tsGrid = document.getElementById('ts-grid');
  if (tsGrid) tsGrid.style.visibility = 'hidden';
  setTimeout(async function() {
    await hlSyncInventory();
    if (tsGrid) tsGrid.style.visibility = '';
    tsFilter();
  }, 300);
})();

window.tsFilter = tsFilter;
window.tsCat = tsCat;
window.tsSub = tsSub;
window.tsSizeSlider = tsSizeSlider;
window.tsSearch = tsSearch;
window.tsClearFilters = tsClearFilters;
window.tsAdd = tsAdd;
window.tsRemove = tsRemove;
window.tsRemoveIdx = tsRemoveIdx;
window.tsQtyIdx = tsQtyIdx;
window.tsQty = tsQty;
window.tsOpenCart = tsOpenCart;
window.tsCloseCart = tsCloseCart;
window.tsOpenCheckout = tsOpenCheckout;
window.tsCloseCheckout = tsCloseCheckout;
window.tsSubmit = tsSubmit;
window.tsPOpen = tsPOpen;
window.tsPClose = tsPClose;
window.tsPCloseBtn = tsPCloseBtn;
window.tsZoomOpen = tsZoomOpen;
window.tsZoomClose = tsZoomClose;
window.tshShowShop = tshShowShop;
window.tshShowHome = tshShowHome;

function tshShowPackage() {
  tshShowShop();
  setTimeout(function() {
    var store = document.getElementById("ts-store");
    var pkg = document.getElementById("ts-package-view");
    var skiPkg = document.getElementById("ts-ski-package-view");
    var dealV = document.getElementById("ts-deal-view");
    if (store) store.style.display = "none";
    if (skiPkg) skiPkg.style.display = "none";
    if (dealV) dealV.style.display = "none";
    if (pkg) { pkg.style.display = "block"; window.scrollTo({top:0,behavior:"smooth"}); }
    pkgRefreshStock();
  }, 150);
}
window.tshShowPackage = tshShowPackage;

function tshShowSkiPackage() {
  tshShowShop();
  setTimeout(function() {
    var store = document.getElementById("ts-store");
    var pkg = document.getElementById("ts-ski-package-view");
    var boardPkg = document.getElementById("ts-package-view");
    if (store) store.style.display = "none";
    if (boardPkg) boardPkg.style.display = "none";
    var dealV = document.getElementById("ts-deal-view");
    if (dealV) dealV.style.display = "none";
    if (pkg) { pkg.style.display = "block"; window.scrollTo({top:0,behavior:"smooth"}); }
    pkgRefreshStock();
  }, 150);
}
window.tshShowSkiPackage = tshShowSkiPackage;

// ── Hide every custom view (packages, deal) and bring the store grid back ──
function tsHideCustomViews() {
  ["ts-package-view","ts-ski-package-view","ts-deal-view"].forEach(function(id){
    var el = document.getElementById(id); if (el) el.style.display = "none";
  });
  var store = document.getElementById("ts-store"); if (store) store.style.display = "";
}

// ══════════════════════════════════════════════════════════════
//  DEAL OF THE DAY ENGINE
// ══════════════════════════════════════════════════════════════
var DEAL_DAYS = ["sun","mon","tue","wed","thu","fri","sat"];
var DEAL_DAY_NAMES = {sun:"Sunday",mon:"Monday",tue:"Tuesday",wed:"Wednesday",thu:"Thursday",fri:"Friday",sat:"Saturday"};

// "Now" as a Date whose clock fields are Eastern (shop) time
function dealNowNY() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" }));
}
function dealRevealOn(dateNY) {
  var t = new Date(dateNY); t.setHours(DEAL_OF_DAY.revealHour, DEAL_OF_DAY.revealMinute, 0, 0); return t;
}
function dealDateStr(dateNY) {
  return dateNY.getFullYear() + "-" +
         ("0" + (dateNY.getMonth()+1)).slice(-2) + "-" +
         ("0" + dateNY.getDate()).slice(-2);
}
function dealKeyFor(dateNY) {
  var byDate = DEAL_OF_DAY.byDate || {};
  return byDate[dealDateStr(dateNY)] || DEAL_DAYS[dateNY.getDay()];
}
function dealFor(dateNY) {
  var d = DEAL_OF_DAY.deals[dealKeyFor(dateNY)];
  // A Heartland item is optional: with one, stock comes from Heartland;
  // without one, the server's own sales counter enforces the limit.
  // A day just needs to be switched on and filled in.
  return (d && d.active && d.name && d.price > 0) ? d : null;
}
// Next reveal moment that actually has a deal configured (within the next week)
function dealNextReveal(nowNY) {
  for (var i = 0; i < 8; i++) {
    var day = new Date(nowNY); day.setDate(day.getDate() + i);
    var reveal = dealRevealOn(day);
    if (reveal > nowNY && dealFor(day)) return { at: reveal, deal: dealFor(day), key: dealKeyFor(day) };
  }
  return null;
}
function dealLiveQty(deal, dealKey) {
  // No Heartland item wired up? Use the server's own sales counter instead.
  if (!deal || !deal.hlId) {
    var st = window._tsDealStatus;
    if (st && (st.key === dealKey || st.key === deal.capKey)) return st.left;
    return null;                                    // unknown until first poll
  }
  var map = window._tsHlMap;
  if (!map || map[deal.hlId] === undefined) return null;   // unknown until sync
  return map[deal.hlId].qty;
}
// Next occurrence of revealHour:revealMinute, regardless of whether any day
// actually has a valid deal configured — always ticks toward *something*.
function dealGenericCountdown(nowNY) {
  var next = new Date(nowNY);
  next.setHours(DEAL_OF_DAY.revealHour, DEAL_OF_DAY.revealMinute, 0, 0);
  if (next <= nowNY) next.setDate(next.getDate() + 1);
  return next;
}
// Most recent PAST day (not today) with an active, named deal — for the
// "looks like that one got away" teaser. Lenient: doesn't require hlId,
// since this is just a look-what-you-missed display, not a sale.
function dealPreviousDeal(nowNY) {
  // Never look back past the day deals actually started running, otherwise
  // the same weekly config slot gets reported as a "past" deal before it
  // has ever gone live — which would leak the product early.
  var startStr = DEAL_OF_DAY.startDate;
  var start = startStr ? new Date(startStr + "T00:00:00") : null;
  for (var i = 1; i <= 7; i++) {
    var day = new Date(nowNY); day.setDate(day.getDate() - i);
    if (start && day < start) break;
    var d = DEAL_OF_DAY.deals[dealKeyFor(day)];
    if (d && d.active && d.name) return d;
  }
  return null;
}
// Returns {state, deal, qty, countdownTo, key}
function dealState() {
  var now = dealNowNY();

  // ⚠️ PREVIEW MODE — add ?dealtest=live to the store URL to see the deal page
  // as it will look, without waiting for a time window and without Heartland.
  //   tuneskis.com/store?dealtest=live     → deal showing, buyable
  //   tuneskis.com/store?dealtest=pending  → pre-reveal teaser + countdown
  //   tuneskis.com/store?dealtest=soldout  → sold out state
  // Only the person with that URL sees it — normal visitors are unaffected,
  // so there is no way for a real customer to stumble onto a test deal.
  // Which day's deal it previews: ?dealday=thu (defaults to thu).
  try {
    var _qs = new URLSearchParams(window.location.search);
    var _mode = _qs.get("dealtest");
    if (_mode) {
      var _dayKey = _qs.get("dealday") || "thu";
      var _d = DEAL_OF_DAY.deals[_dayKey];
      if (_d) {
        if (_mode === "live")    return { state:"live",    deal:_d, qty:1, key:_dayKey, isTest:true };
        if (_mode === "soldout") return { state:"soldout", deal:_d, countdownTo: dealGenericCountdown(now), key:_dayKey, isTest:true };
        if (_mode === "pending") return { state:"pending", deal:_d, countdownTo: dealGenericCountdown(now), key:_dayKey, isTest:true };
      }
    }
  } catch(e) {}

  var todays = dealFor(now);
  var revealToday = dealRevealOn(now);
  if (todays && now < revealToday) {
    return { state:"pending", deal:todays, countdownTo:revealToday, key:dealKeyFor(now) };
  }
  if (todays && now >= revealToday) {
    var q = dealLiveQty(todays, dealKeyFor(now));
    if (q === null || q > 0) return { state:"live", deal:todays, qty:q, key:dealKeyFor(now) };
    var nxt = dealNextReveal(now);
    return { state:"soldout", deal:todays, countdownTo: nxt ? nxt.at : null, key:dealKeyFor(now) };
  }
  var next = dealNextReveal(now);
  return {
    state:"none",
    countdownTo: next ? next.at : dealGenericCountdown(now),
    nextDeal: next ? next.deal : null,
    previousDeal: dealPreviousDeal(now)
  };
}
function dealFmtCountdown(target) {
  var ms = Math.max(0, target - dealNowNY());
  var s = Math.floor(ms/1000), d = Math.floor(s/86400), h = Math.floor((s%86400)/3600), m = Math.floor((s%3600)/60), sec = s%60;
  var pad = function(n){ return (n<10?"0":"")+n; };
  return (d > 0 ? d + "d " : "") + pad(h) + ":" + pad(m) + ":" + pad(sec);
}
function dealRevealLabel() {
  var h = DEAL_OF_DAY.revealHour, m = DEAL_OF_DAY.revealMinute;
  var ampm = h >= 12 ? "PM" : "AM"; var h12 = h % 12; if (h12 === 0) h12 = 12;
  return h12 + (m ? ":" + (m<10?"0":"")+m : "") + " " + ampm;
}
function dealMoney(n) { return "$" + Number(n).toFixed(2); }

// "Today's" / "Tomorrow's" / "Thursday's" — relative to NY now
function dealDayLabel(targetDate, nowNY) {
  var a = new Date(nowNY.getFullYear(), nowNY.getMonth(), nowNY.getDate());
  var b = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  var diffDays = Math.round((b - a) / 86400000);
  if (diffDays === 0) return "Today's";
  if (diffDays === 1) return "Tomorrow's";
  return DEAL_DAY_NAMES[DEAL_DAYS[targetDate.getDay()]] + "'s";
}

// Render both the homepage banner and the dedicated page from one state
function dealRender() {
  var st = dealState();
  var now = dealNowNY();
  var $ = function(id){ return document.getElementById(id); };
  var banner = null, bTopline = null, bCount = null; // homepage banner is static for now
  var pImgWrap = $("ts-deal-imgwrap"), pImg = $("ts-deal-img"), pMystery = $("ts-deal-mystery"), pTag = $("ts-deal-tag"), pName = $("ts-deal-name"),
      pDesc = $("ts-deal-desc"), pPrice = $("ts-deal-price"), pMsrp = $("ts-deal-msrp"), pLeft = $("ts-deal-left"), pCount = $("ts-deal-count"),
      pBtn = $("ts-deal-btn"), pRules = $("ts-deal-rules"), pSizeWrap = $("ts-deal-sizewrap"), pSizeSel = $("ts-deal-size"),
      pSpecsWrap = $("ts-deal-specs-wrap"), pSpecsTable = $("ts-deal-specs-table"), pBindingsBadge = $("ts-deal-bindings-badge"),
      pThumbs = $("ts-deal-thumbs");
  function renderSpecs(deal) {
    if (!pSpecsWrap || !pSpecsTable) return;
    var specs = deal && deal.specs;
    var keys = specs ? Object.keys(specs) : [];
    if (!keys.length) { pSpecsWrap.style.display = "none"; return; }
    pSpecsTable.innerHTML = keys.map(function(k){ return "<tr><td>" + k + "</td><td>" + specs[k] + "</td></tr>"; }).join("");
    pSpecsWrap.style.display = "";
  }
  function renderDealThumbs(deal) {
    if (!pThumbs) return;
    var imgs = (deal && deal.images && deal.images.length) ? deal.images : (deal && deal.image ? [deal.image] : []);
    if (imgs.length < 2) { pThumbs.style.display = "none"; pThumbs.innerHTML = ""; return; }
    pThumbs.innerHTML = imgs.map(function(src, i){
      return '<img class="ts-pm-thumb' + (i === 0 ? ' active' : '') + '" src="' + src + '" alt="Photo ' + (i+1) + '">';
    }).join("");
    pThumbs.style.display = "flex";
    Array.prototype.forEach.call(pThumbs.querySelectorAll(".ts-pm-thumb"), function(el){
      el.addEventListener("click", function(){
        if (pImg) pImg.src = el.src;
        Array.prototype.forEach.call(pThumbs.querySelectorAll(".ts-pm-thumb"), function(t){ t.classList.remove("active"); });
        el.classList.add("active");
      });
    });
  }
  if (!pBtn) return;
  var setText = function(el, t){ if (el) el.textContent = t; };
  var show = function(el, on){ if (el) el.style.display = on ? "" : "none"; };

  var revealTxt = dealRevealLabel();
  if (st.state === "none") {
    if (st.countdownTo) {
      show(banner, true);
      setText(bTopline, dealDayLabel(st.countdownTo, now) + " deal drops at " + revealTxt);
      setText(bCount, dealFmtCountdown(st.countdownTo));
    } else { show(banner, false); }
    var prev = st.previousDeal;
    show(pMystery, !prev);
    show(pImg, !!(prev && prev.image)); if (pImg && prev && prev.image) { pImg.src = prev.image; pImg.style.opacity = "0.45"; }
    setText(pTag, "🔥 Deal of the Day");
    setText(pName, prev ? "Looks like that one got away" : (st.countdownTo ? dealDayLabel(st.countdownTo, now) + " deal drops at " + revealTxt : "No deals scheduled right now"));
    setText(pDesc, prev ? ("The last deal was " + prev.name + " for " + dealMoney(prev.price) + " — gone! Next one drops " + dealDayLabel(st.countdownTo, now).replace(/'s$/, "") + " at " + revealTxt + ".")
                          : "Check back soon — our best deals are gone fast.");
    show(pPrice, false); show(pMsrp, false); show(pLeft, false); show(pSizeWrap, false);
    setText(pCount, st.countdownTo ? dealFmtCountdown(st.countdownTo) : "");
    show(pCount, !!st.countdownTo);
    if (pBtn) { pBtn.disabled = true; pBtn.textContent = "Not Available Yet"; }
    renderSpecs(null);
    show(pBindingsBadge, false);
    renderDealThumbs(null);
  }
  else if (st.state === "pending") {
    show(banner, true);
    setText(bTopline, dealDayLabel(st.countdownTo, now) + " deal drops at " + revealTxt);
    setText(bCount, dealFmtCountdown(st.countdownTo));
    show(pImg, false); show(pMystery, true);
    setText(pTag, "🔥 " + dealDayLabel(st.countdownTo, now) + " Deal Drops at " + revealTxt);
    setText(pName, "Mystery Deal");
    setText(pDesc, st.deal.teaser || "Something good is coming. First come, first served.");
    show(pPrice, false); show(pMsrp, false); show(pSizeWrap, false);
    show(pLeft, true); setText(pLeft, "Only " + st.deal.limit + " available");
    show(pCount, true); setText(pCount, dealFmtCountdown(st.countdownTo));
    if (pBtn) { pBtn.disabled = true; pBtn.textContent = "Unlocks at " + revealTxt; }
    renderSpecs(null);
    show(pBindingsBadge, false);
    renderDealThumbs(null);
  }
  else if (st.state === "live") {
    var left = (st.qty === null) ? st.deal.limit : Math.min(st.qty, st.deal.limit);
    show(banner, true);
    setText(bTopline, "🔥 LIVE NOW — " + dealMoney(st.deal.price) + (st.deal.msrp > st.deal.price ? " (reg. " + dealMoney(st.deal.msrp) + ")" : "") + " · " + left + " left");
    setText(bCount, "");
    show(pMystery, false); show(pImg, !!st.deal.image); if (pImg && st.deal.image) pImg.src = st.deal.image;
    setText(pTag, "🔥 Deal of the Day — Live Now");
    setText(pName, st.deal.name);
    setText(pDesc, st.deal.desc || "");
    show(pPrice, true); setText(pPrice, dealMoney(st.deal.price));
    show(pMsrp, st.deal.msrp > st.deal.price); setText(pMsrp, st.deal.msrp > st.deal.price ? dealMoney(st.deal.msrp) : "");
    show(pLeft, true); setText(pLeft, left + " left — first come, first served");
    show(pCount, false);
    var hasSizes = st.deal.sizes && st.deal.sizes.length > 0;
    show(pSizeWrap, hasSizes);
    if (hasSizes && pSizeSel) {
      // Only (re)populate if the option list doesn't already match this deal's sizes —
      // avoids wiping the customer's selection on every periodic re-render.
      var curOpts = Array.prototype.map.call(pSizeSel.options, function(o){ return o.value; }).join("|");
      var wantOpts = [""].concat(st.deal.sizes).join("|");
      if (curOpts !== wantOpts) {
        pSizeSel.innerHTML = "";
        var def = document.createElement("option"); def.value = ""; def.textContent = "Choose a size...";
        pSizeSel.appendChild(def);
        st.deal.sizes.forEach(function(s){ var o = document.createElement("option"); o.value = s; o.textContent = s; pSizeSel.appendChild(o); });
      }
    }
    if (pBtn) {
      if (hasSizes && (!pSizeSel || !pSizeSel.value)) { pBtn.disabled = true; pBtn.textContent = "Select a Size"; }
      else { pBtn.disabled = false; pBtn.textContent = "Buy Now — " + dealMoney(st.deal.price); }
    }
    renderSpecs(st.deal);
    show(pBindingsBadge, !!st.deal.bindings);
    renderDealThumbs(st.deal);
  }
  else if (st.state === "soldout") {
    show(banner, true);
    setText(bTopline, "SOLD OUT" + (st.countdownTo ? " — " + dealDayLabel(st.countdownTo, now) + " drop at " + revealTxt : ""));
    setText(bCount, st.countdownTo ? dealFmtCountdown(st.countdownTo) : "");
    show(pMystery, false); show(pImg, !!st.deal.image); if (pImg && st.deal.image) { pImg.src = st.deal.image; pImg.style.opacity = "0.4"; }
    setText(pTag, "🔥 Deal of the Day — SOLD OUT");
    setText(pName, st.deal.name);
    setText(pDesc, "This one's gone. " + (st.countdownTo ? dealDayLabel(st.countdownTo, now) + " deal drops at " + revealTxt + "." : ""));
    show(pPrice, true); setText(pPrice, dealMoney(st.deal.price));
    show(pMsrp, st.deal.msrp > st.deal.price); setText(pMsrp, st.deal.msrp > st.deal.price ? dealMoney(st.deal.msrp) : "");
    show(pLeft, true); setText(pLeft, "SOLD OUT"); show(pSizeWrap, false);
    show(pCount, !!st.countdownTo); setText(pCount, st.countdownTo ? dealFmtCountdown(st.countdownTo) : "");
    if (pBtn) { pBtn.disabled = true; pBtn.textContent = "Sold Out"; }
    renderSpecs(st.deal);
    show(pBindingsBadge, !!st.deal.bindings);
    renderDealThumbs(st.deal);
  }
  if (st.state === "live") { if (pImg) pImg.style.opacity = ""; }
  if (pRules) pRules.textContent = "Deals unlock daily at " + revealTxt + " Eastern. Only one available. While supplies last.";
}
window.dealRender = dealRender;

// Lightweight stock refresh for the deal only (doesn't re-render the store grid)
function dealPollStock() {
  var st = dealState();
  if (st.state !== "live" && st.state !== "soldout") return;
  // Deal has no Heartland item — ask the server how many have sold today
  if (st.deal && !st.deal.hlId && st.key) {
    fetch("https://tuneskis-server.onrender.com/deal-status?key=" + encodeURIComponent(st.deal.capKey || st.key) + "&absolute=" + (st.deal.capKey ? 1 : 0) + "&limit=" + (st.deal.limit || 1))
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(function(d){ if (d && d.success) { window._tsDealStatus = d; dealRender(); } })
      .catch(function(){});
    return;
  }
  fetch("https://tuneskis-server.onrender.com/inventory")
    .then(function(r){ return r.ok ? r.json() : null; })
    .then(function(data){
      if (!data || !data.success || !data.items) return;
      var map = window._tsHlMap || {};
      data.items.forEach(function(it){ map[it.id] = { qty: it.qty || 0, price: it.price || 0 }; });
      window._tsHlMap = map;
      dealRender();
    }).catch(function(){});
}

function dealBuy() {
  var st = dealState();
  if (st.state !== "live") { alert("This deal isn't available right now."); dealRender(); return; }
  var hasSizes = st.deal.sizes && st.deal.sizes.length > 0;
  var sizeSel = document.getElementById("ts-deal-size");
  var chosenSize = hasSizes ? (sizeSel && sizeSel.value) : "Deal of the Day";
  if (hasSizes && !chosenSize) { alert("Please select a size first."); return; }
  var key = "DEAL:" + st.key;
  if (cart.find(function(i){ return i.key === key; })) { alert("Deal of the Day is limited to 1 per customer — it's already in your cart."); tsOpenCart(); return; }
  cart.push({ key:key, name:"🔥 " + st.deal.name, size:chosenSize, price:st.deal.price, msrp:st.deal.msrp||null, icon:"🔥", qty:1, hlId:st.deal.hlId, deal:true, dealKey:st.key, dealCapKey:st.deal.capKey||null, dealLimit:st.deal.limit||1 });
  tsSave(); tsUpdateUI(); tsOpenCart();
}
window.dealBuy = dealBuy;

function tshShowDeal(btn) {
  tshShowShop();
  setTimeout(function() {
    tsHideCustomViews();
    var store = document.getElementById("ts-store"); if (store) store.style.display = "none";
    var v = document.getElementById("ts-deal-view");
    if (v) { v.style.display = "block"; window.scrollTo({top:0,behavior:"smooth"}); }
    document.querySelectorAll(".ts-catbtn").forEach(function(b){ b.classList.remove("on"); });
    if (btn && btn.classList) btn.classList.add("on");
    dealRender();
    dealPollStock();   // get the true remaining count immediately on open
  }, 150);
}
window.tshShowDeal = tshShowDeal;

function dealBack() { tsHideCustomViews(); }
window.dealBack = dealBack;

// Tick the countdowns every second; refresh live stock every 90s
setInterval(function(){
  var st = dealState();
  if (st.state === "live") return;           // live shows stock, not a timer
  var c1 = document.getElementById("tsh-deal-count"), c2 = document.getElementById("ts-deal-count");
  var t = st.countdownTo ? dealFmtCountdown(st.countdownTo) : "";
  if (c1) c1.textContent = t;
  if (c2) c2.textContent = t;
  if (st.countdownTo && st.countdownTo - dealNowNY() <= 1000) setTimeout(dealRender, 1200); // flip to live at reveal
}, 1000);
setInterval(dealPollStock, 90000);

var pkgSel = {board:null, binding:null, boot:null};

function pkgPick(type, card) {
  var name = card.getAttribute("data-name");
  var price = parseFloat(card.getAttribute("data-price"));
  var prod = PRODUCTS.find(function(p){ return p.name === name; });
  var sizes = prod ? prod.sizes : [];
  var inStock = sizes.filter(function(s){ return s.qty > 0; });

  // If no sizes or only one, select directly
  if (!sizes.length) {
    pkgConfirm(type, card, name, price, "");
    return;
  }

  // Show size popup
  var overlay = document.createElement("div");
  overlay.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:99999;display:flex;align-items:center;justify-content:center;";
  var modal = document.createElement("div");
  modal.style.cssText = "background:#fff;border-radius:12px;padding:24px;max-width:320px;width:90%;font-family:Lato,sans-serif;";

  var title = document.createElement("div");
  title.style.cssText = "font-weight:700;font-size:1rem;margin-bottom:12px;";
  title.textContent = name;

  var sizeLabel = document.createElement("div");
  sizeLabel.style.cssText = "font-size:0.72rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#888;margin-bottom:8px;";
  sizeLabel.textContent = "Select Size";

  var sel = document.createElement("select");
  sel.style.cssText = "width:100%;padding:10px;border:1px solid #ddd;border-radius:6px;font-size:0.9rem;margin-bottom:16px;";
  var def = document.createElement("option");
  def.value = ""; def.textContent = "Choose a size...";
  sel.appendChild(def);
  sizes.forEach(function(s) {
    var opt = document.createElement("option");
    opt.value = s.label;
    opt.textContent = s.label + (s.qty === 0 ? " (out of stock)" : "");
    opt.disabled = s.qty === 0;
    sel.appendChild(opt);
  });

  var btnRow = document.createElement("div");
  btnRow.style.cssText = "display:flex;gap:8px;";

  var cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  cancelBtn.style.cssText = "flex:1;padding:10px;border:1px solid #ddd;border-radius:6px;background:#fff;cursor:pointer;font-size:0.9rem;";
  cancelBtn.onclick = function(){ document.body.removeChild(overlay); };

  var selectBtn = document.createElement("button");
  selectBtn.textContent = "Select";
  selectBtn.style.cssText = "flex:1;padding:10px;border:none;border-radius:6px;background:#1a1a2e;color:#fff;cursor:pointer;font-size:0.9rem;font-weight:700;";
  selectBtn.onclick = function() {
    if (!sel.value) { sel.style.borderColor = "red"; return; }
    document.body.removeChild(overlay);
    pkgConfirm(type, card, name, price, sel.value);
  };

  btnRow.appendChild(cancelBtn); btnRow.appendChild(selectBtn);
  modal.appendChild(title); modal.appendChild(sizeLabel); modal.appendChild(sel); modal.appendChild(btnRow);
  overlay.appendChild(modal);
  overlay.addEventListener("click", function(e){ if(e.target===overlay) document.body.removeChild(overlay); });
  document.body.appendChild(overlay);
}

function pkgConfirm(type, card, name, price, size) {
  card.parentElement.querySelectorAll(".pkg-card").forEach(function(c) {
    c.classList.remove("pkg-sel");
    var chk = c.querySelector(".pkg-chk");
    if (chk) chk.style.display = "none";
  });
  card.classList.add("pkg-sel");
  var chk = card.querySelector(".pkg-chk");
  if (chk) chk.style.display = "flex";
  pkgSel[type] = {name:name, price:price, size:size};
  pkgUpdate();
}
window.pkgConfirm = pkgConfirm;
window.pkgPick = pkgPick;

function pkgUpdate() {
  var ready = pkgSel.board && pkgSel.binding && pkgSel.boot;
  var btn = document.getElementById("pkg-btn");
  var info = document.getElementById("pkg-info");
  if (btn) { btn.disabled = !ready; btn.style.opacity = ready ? "1" : "0.4"; }
  if (info) {
    if (ready) {
      var retail = pkgSel.board.price + pkgSel.binding.price + pkgSel.boot.price;
      info.innerHTML = pkgSel.board.name + (pkgSel.board.size?" ("+pkgSel.board.size+")":"") + " + " +
        pkgSel.binding.name + (pkgSel.binding.size?" ("+pkgSel.binding.size+")":"") + " + " +
        pkgSel.boot.name + (pkgSel.boot.size?" ("+pkgSel.boot.size+")":"") +
        "<br><span style='color:#27ae60;font-weight:600'>Retail $" + retail.toFixed(2) + " — you save $" + (retail-699.99).toFixed(2) + "!</span>" +
        "<span style='color:#aaa;font-size:0.72rem'> + tax & shipping</span>";
    } else {
      info.textContent = "Select a board, bindings, and boots.";
    }
  }
}

function pkgBack() {
  var store = document.getElementById("ts-store");
  var pkg = document.getElementById("ts-package-view");
  if (store) store.style.display = "";
  if (pkg) pkg.style.display = "none";
}
window.pkgBack = pkgBack;

function pkgAddToCart() {
  if (!pkgSel.board || !pkgSel.binding || !pkgSel.boot) return;
  var desc = pkgSel.board.name + " + " + pkgSel.binding.name + " + " + pkgSel.boot.name;
  var ex = cart.find(function(i){ return i.key === "Snowboard Package"; });
  if (ex) { ex.qty++; } else {
    cart.push({key:"Snowboard Package", name:"Snowboard Package", size:desc, price:699.99, icon:"🏂", qty:1, hlId:null});
  }
  tsSave(); tsUpdateUI();
  pkgBack();
  tsOpenCart();
}
window.pkgAddToCart = pkgAddToCart;

// ── Ski Package (RX9 + Roxa Boots) — mirrors the snowboard package above, independently ──
var skiPkgSel = {ski:null, boot:null};

function skiPkgPick(type, card) {
  var name = card.getAttribute("data-name");
  var price = parseFloat(card.getAttribute("data-price"));
  var prod = PRODUCTS.find(function(p){ return p.name === name; });
  var sizes = prod ? prod.sizes : [];

  if (!sizes.length) {
    skiPkgConfirm(type, card, name, price, "");
    return;
  }

  var overlay = document.createElement("div");
  overlay.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:99999;display:flex;align-items:center;justify-content:center;";
  var modal = document.createElement("div");
  modal.style.cssText = "background:#fff;border-radius:12px;padding:24px;max-width:320px;width:90%;font-family:Lato,sans-serif;";

  var title = document.createElement("div");
  title.style.cssText = "font-weight:700;font-size:1rem;margin-bottom:12px;";
  title.textContent = name;

  var sizeLabel = document.createElement("div");
  sizeLabel.style.cssText = "font-size:0.72rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#888;margin-bottom:8px;";
  sizeLabel.textContent = "Select Size";

  var sel = document.createElement("select");
  sel.style.cssText = "width:100%;padding:10px;border:1px solid #ddd;border-radius:6px;font-size:0.9rem;margin-bottom:16px;";
  var def = document.createElement("option");
  def.value = ""; def.textContent = "Choose a size...";
  sel.appendChild(def);
  sizes.forEach(function(s) {
    var opt = document.createElement("option");
    opt.value = s.label;
    opt.textContent = s.label + (s.qty === 0 ? " (out of stock)" : "");
    opt.disabled = s.qty === 0;
    sel.appendChild(opt);
  });

  var btnRow = document.createElement("div");
  btnRow.style.cssText = "display:flex;gap:8px;";

  var cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  cancelBtn.style.cssText = "flex:1;padding:10px;border:1px solid #ddd;border-radius:6px;background:#fff;cursor:pointer;font-size:0.9rem;";
  cancelBtn.onclick = function(){ document.body.removeChild(overlay); };

  var selectBtn = document.createElement("button");
  selectBtn.textContent = "Select";
  selectBtn.style.cssText = "flex:1;padding:10px;border:none;border-radius:6px;background:#1a1a2e;color:#fff;cursor:pointer;font-size:0.9rem;font-weight:700;";
  selectBtn.onclick = function() {
    if (!sel.value) { sel.style.borderColor = "red"; return; }
    document.body.removeChild(overlay);
    skiPkgConfirm(type, card, name, price, sel.value);
  };

  btnRow.appendChild(cancelBtn); btnRow.appendChild(selectBtn);
  modal.appendChild(title); modal.appendChild(sizeLabel); modal.appendChild(sel); modal.appendChild(btnRow);
  overlay.appendChild(modal);
  overlay.addEventListener("click", function(e){ if(e.target===overlay) document.body.removeChild(overlay); });
  document.body.appendChild(overlay);
}
window.skiPkgPick = skiPkgPick;

function skiPkgConfirm(type, card, name, price, size) {
  card.parentElement.querySelectorAll(".pkg-card").forEach(function(c) {
    c.classList.remove("pkg-sel");
    var chk = c.querySelector(".pkg-chk");
    if (chk) chk.style.display = "none";
  });
  card.classList.add("pkg-sel");
  var chk = card.querySelector(".pkg-chk");
  if (chk) chk.style.display = "flex";
  skiPkgSel[type] = {name:name, price:price, size:size};
  skiPkgUpdate();
}
window.skiPkgConfirm = skiPkgConfirm;

function skiPkgUpdate() {
  var ready = skiPkgSel.ski && skiPkgSel.boot;
  var btn = document.getElementById("ski-pkg-btn");
  var info = document.getElementById("ski-pkg-info");
  if (btn) { btn.disabled = !ready; btn.style.opacity = ready ? "1" : "0.4"; }
  if (info) {
    if (ready) {
      var retail = skiPkgSel.ski.price + skiPkgSel.boot.price;
      info.innerHTML = skiPkgSel.ski.name + (skiPkgSel.ski.size?" ("+skiPkgSel.ski.size+")":"") + " + " +
        skiPkgSel.boot.name + (skiPkgSel.boot.size?" ("+skiPkgSel.boot.size+")":"") +
        "<br><span style='color:#27ae60;font-weight:600'>Retail $" + retail.toFixed(2) + " — you save $" + (retail-799.99).toFixed(2) + "!</span>" +
        "<span style='color:#aaa;font-size:0.72rem'> + tax & shipping</span>";
    } else {
      info.textContent = "Select your skis and boots.";
    }
  }
}

function skiPkgBack() {
  var store = document.getElementById("ts-store");
  var pkg = document.getElementById("ts-ski-package-view");
  if (store) store.style.display = "";
  if (pkg) pkg.style.display = "none";
}
window.skiPkgBack = skiPkgBack;

function skiPkgAddToCart() {
  if (!skiPkgSel.ski || !skiPkgSel.boot) return;
  var desc = skiPkgSel.ski.name + " + " + skiPkgSel.boot.name;
  var ex = cart.find(function(i){ return i.key === "RX9 Roxa Boot Package"; });
  if (ex) { ex.qty++; } else {
    cart.push({key:"RX9 Roxa Boot Package", name:"RX9 + Roxa Boot Package", size:desc, price:799.99, icon:"🎿", qty:1, hlId:null});
  }
  tsSave(); tsUpdateUI();
  skiPkgBack();
  tsOpenCart();
}
window.skiPkgAddToCart = skiPkgAddToCart;
window.tshScrollToShop = tshScrollToShop;
window.tshGoTo = tshGoTo;
window.tshGoToBrand = tshGoToBrand;
window.filterTagClick = filterTagClick;
window.tsToggleOOS = tsToggleOOS;
window.tsRenderSubcats = tsRenderSubcats;
window.tsUpdateUI = tsUpdateUI;
window.hlSyncInventory = hlSyncInventory;
window.tsCoClose = tsCoClose;
window.tsCoCloseBtn = tsCoCloseBtn;
window.tsPColorway = tsPColorway;
window.tsFulfillToggle = tsFulfillToggle;
window.tsCoUpdateShipping = tsCoUpdateShipping;
window.tsCoSubmit = tsCoSubmit;
window.tsPThumb = tsPThumb;
window.tsPAdd = tsPAdd;
window.tsCompatAdd = tsCompatAdd;
window.tsAccToggle = tsAccToggle;
window.tsUpdateStockNote = tsUpdateStockNote;
window.tsMagMove = tsMagMove;
window.tsMagLeave = tsMagLeave;
window.tshBrandScroll = tshBrandScroll;


// ════════════════════════════════════════════════════
// CHECKOUT — Stripe
// ════════════════════════════════════════════════════
var tsStripe = null;
var tsStripeCard = null;
var tsStripeReady = false;
var tsCoCartItems = [];

function tsLoadStripe(cb) {
  if (window.Stripe) { cb(); return; }
  var s = document.createElement('script');
  s.src = 'https://js.stripe.com/v3/';
  s.onload = cb;
  document.head.appendChild(s);
}

function tsInitStripe() {
  tsLoadStripe(function() {
    tsStripe = Stripe('pk_live_51HLDWtJA4jGUqgBgt2tGAJyeb3b3qlJSlJLgjkws7dCCuGkFqOJkXPrZ3bBQg2ROOIsKDHUuEwGnYwW09mwC6n5200jndEtVoq');
    var elements = tsStripe.elements();
    tsStripeCard = elements.create('card', {
      style: {
        base: {
          fontFamily: 'Lato, sans-serif',
          fontSize: '15px',
          color: '#222',
          '::placeholder': { color: '#aaa' }
        },
        invalid: { color: '#e74c3c' }
      },
      hidePostalCode: true
    });
    tsStripeCard.mount('#ts-stripe-card');
    tsStripeReady = true;
  });
}

function tsFulfillToggle() {
  var isPickup = document.getElementById('ts-fulfill-pickup').checked;
  var shipSec = document.getElementById('ts-co-ship-section');
  if (shipSec) shipSec.style.display = isPickup ? 'none' : '';
  tsCoUpdateShipping();
}

function tsOpenCheckout() {
  var items = cart;
  if (!items.length) { alert('Your cart is empty!'); return; }

  // If modal not in DOM yet, wait for it
  if (!document.getElementById('ts-co-summary')) {
    setTimeout(tsOpenCheckout, 150); return;
  }

  tsCoCartItems = items;

  var summaryHtml = items.map(function(i) {
    return '<div class="ts-co-summary-line"><span>' + i.name +
      (i.size ? ' <small style="color:#888">('+i.size+')</small>' : '') +
      (i.qty > 1 ? ' ×'+i.qty : '') +
      '</span><span>$' + (i.price * (i.qty||1)).toFixed(2) + '</span></div>';
  }).join('');
  document.getElementById('ts-co-summary').innerHTML = summaryHtml;
  document.getElementById('ts-co-total').textContent = '$' + tsTotal().toFixed(2);
  document.getElementById('ts-co-pay-btn').textContent = 'Pay $' + tsTotal().toFixed(2);

  var err = document.getElementById('ts-co-error');
  err.classList.remove('show'); err.textContent = '';

  document.getElementById('ts-checkout-scrim').classList.add('open');
  document.body.style.overflow = 'hidden';

  // Reset fulfillment toggle
  var shipEl = document.getElementById('ts-fulfill-ship');
  if (shipEl) shipEl.checked = true;
  var pickEl = document.getElementById('ts-fulfill-pickup');
  if (pickEl) pickEl.checked = false;
  var shipSec = document.getElementById('ts-co-ship-section');
  if (shipSec) shipSec.style.display = '';

  setTimeout(function() {
    var stateEl = document.getElementById('ts-co-state');
    if (stateEl) {
      stateEl.addEventListener('input', tsCoUpdateShipping);
      stateEl.addEventListener('change', tsCoUpdateShipping);
    }
    tsCoUpdateShipping();
  }, 100);

  // Init Stripe
  if (!tsStripeReady) tsInitStripe();
}

// ── Tax calculation (NY 8%) ──────────────────────────────────
function tsCalcTax(subtotal, state) {
  return Math.round(subtotal * 0.08 * 100) / 100; // flat 8% sales tax on every order
}

// ── Shipping calculation ─────────────────────────────────────
function tsCalcShipping(state, total) {
  var isPickup = document.getElementById('ts-fulfill-pickup') && document.getElementById('ts-fulfill-pickup').checked;
  if (isPickup) return { cost: 0, label: 'In-Store Pickup' };
  if (total >= 600) return { cost: 0, label: 'Free Shipping' };
  var nearby = ['NY','NJ','CT','MA','VT','NH','ME','PA'];
  if (nearby.indexOf((state||'').toUpperCase()) !== -1) return { cost: 20, label: 'Standard Shipping ($20)' };
  return { cost: 30, label: 'Standard Shipping ($30)' };
}

function tsCoUpdateShipping() {
  var state = (document.getElementById('ts-co-state') || {}).value || '';
  var subtotal = cart.reduce(function(s,i){ return s + i.price*(i.qty||1); }, 0);
  var shipping = tsCalcShipping(state, subtotal);
  var tax = tsCalcTax(subtotal, state);
  var total = subtotal + shipping.cost + tax;

  var shipEl = document.getElementById('ts-co-shipping-line');
  if (shipEl) {
    shipEl.querySelector('.ts-co-ship-label').textContent = shipping.label;
    shipEl.querySelector('.ts-co-ship-cost').textContent = shipping.cost === 0 ? 'FREE' : '$' + shipping.cost.toFixed(2);
  }
  var taxEl = document.getElementById('ts-co-tax-line');
  if (taxEl) taxEl.textContent = tax > 0 ? 'Tax (NY 8%): $' + tax.toFixed(2) : '';

  document.getElementById('ts-co-total').textContent = '$' + total.toFixed(2);
  document.getElementById('ts-co-pay-btn').textContent = 'Pay $' + total.toFixed(2);
  return { shipping, tax, total };
}

function tsCoSubmit() {
  var isPickup = document.getElementById('ts-fulfill-pickup') && document.getElementById('ts-fulfill-pickup').checked;
  var name    = document.getElementById('ts-co-name').value.trim();
  var email   = document.getElementById('ts-co-email').value.trim();
  var phone   = document.getElementById('ts-co-phone').value.trim();
  var address = isPickup ? '272 Saratoga Rd' : document.getElementById('ts-co-address').value.trim();
  var city    = isPickup ? 'Schenectady'     : document.getElementById('ts-co-city').value.trim();
  var state   = isPickup ? 'NY'              : document.getElementById('ts-co-state').value.trim();
  var zip     = isPickup ? '12302'           : document.getElementById('ts-co-zip').value.trim();

  if (!name || !email) { tsCoShowError('Please enter your name and email.'); return; }
  if (!isPickup && (!address || !city || !state || !zip)) {
    tsCoShowError('Please fill in all shipping fields.'); return;
  }

  if (!tsStripeReady || !tsStripeCard) {
    tsCoShowError('Payment form not ready. Please wait a moment and try again.'); return;
  }

  var btn = document.getElementById('ts-co-pay-btn');
  btn.disabled = true;
  btn.textContent = 'Processing...';

  var subtotal = cart.reduce(function(s,i){ return s + i.price*(i.qty||1); }, 0);
  var shipping = tsCalcShipping(state, subtotal);
  var tax = tsCalcTax(subtotal, state);
  var grandTotal = Math.round((subtotal + shipping.cost + tax) * 100) / 100;

  window._tsCoShipping = { name, email, phone, address, city, state, zip, isPickup, shipping, tax, grandTotal };

  // Create payment intent on server
  fetch('https://tuneskis-server.onrender.com/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: Math.round(grandTotal * 100),
      currency: 'usd',
      // Sent so the server can re-verify stock before charging the card —
      // this is what prevents two people buying the same last item.
      items: cart.map(function(i){ return { hlId: i.hlId || null, qty: i.qty || 1, name: i.name, size: i.size, dealKey: i.dealKey || null, dealCapKey: i.dealCapKey || null, dealLimit: i.dealLimit || null }; })
    })
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    if (data && data.soldOut) {
      // Someone beat them to it. Drop it from the cart and refresh the deal UI.
      cart = cart.filter(function(i){ return i.hlId !== data.hlId; });
      tsSave(); tsUpdateUI(); tsRenderDrawer();
      if (typeof dealPollStock === 'function') dealPollStock();
      if (typeof dealRender === 'function') dealRender();
      throw new Error(data.error || 'That item just sold out.');
    }
    if (!data.clientSecret) throw new Error(data.error || 'Server error');
    return tsStripe.confirmCardPayment(data.clientSecret, {
      payment_method: {
        card: tsStripeCard,
        billing_details: { name: name, email: email }
      }
    });
  })
  .then(function(result) {
    if (result.error) {
      tsCoShowError(result.error.message);
      btn.disabled = false;
      btn.textContent = 'Pay $' + grandTotal.toFixed(2);
    } else if (result.paymentIntent.status === 'succeeded') {
      tsCoProcessPayment(result.paymentIntent.id);
    }
  })
  .catch(function(err) {
    tsCoShowError('Connection error. Please try again.');
    btn.disabled = false;
    btn.textContent = 'Pay $' + grandTotal.toFixed(2);
  });
}

function tsCoProcessPayment(paymentIntentId) {
  var s = window._tsCoShipping;
  var items = tsCoCartItems.map(function(i) {
    // dealKey/dealCapKey MUST be included — the server uses them to record the
    // sale against the Deal of the Day limit. Without them the cap never
    // increments and a second buyer could get the same one-of-one item.
    return { name: i.name, size: i.size||'', qty: i.qty||1, price: i.price, hlId: i.hlId||null,
             dealKey: i.dealKey||null, dealCapKey: i.dealCapKey||null };
  });

  fetch('https://tuneskis-server.onrender.com/send-order-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customer: { name: s.name, email: s.email, phone: s.phone,
        address: { line1: s.address, city: s.city, state: s.state, zip: s.zip }
      },
      order: {
        orderId: paymentIntentId,
        items: items,
        subtotal: cart.reduce(function(t,i){ return t + i.price*(i.qty||1); }, 0),
        shipping: s.shipping.cost,
        tax: s.tax,
        total: s.grandTotal,
        fulfillment: s.isPickup ? 'In-Store Pickup' : 'Ship to ' + s.address + ', ' + s.city + ' ' + s.state
      }
    })
  });

  tsCoShowSuccess(paymentIntentId, s.email);
  cart = []; tsSave(); tsUpdateUI();
  tsStripeReady = false; tsStripeCard = null; tsStripe = null;
}

function tsCoShowSuccess(txnId, email) {
  document.getElementById('ts-co-body').innerHTML =
    '<div class="ts-co-success">' +
    '<div class="ts-co-success-icon">✅</div>' +
    '<h3>Order Confirmed!</h3>' +
    '<p>Thank you for your order.</p>' +
    '<p>A confirmation will be sent to <strong>' + email + '</strong></p>' +
    '<p>The Tune Skis team will be in touch shortly.</p>' +
    '<div class="ts-txn">Payment ID: ' + txnId + '</div>' +
    '<button onclick="tsCoCloseBtn()" style="margin-top:20px;padding:12px 28px;background:#1a1a2e;color:#fff;border:none;border-radius:8px;font-family:Montserrat,sans-serif;font-weight:700;cursor:pointer;">Close</button>' +
    '</div>';
}

function tsPColorway(prodIdx, colorIdx) {
  const p = PRODUCTS[prodIdx];
  if (!p || !p.colorways) return;
  const c = p.colorways[colorIdx];
  // Update main image
  const mainImg = document.getElementById('pm-main-img');
  if (mainImg) mainImg.src = c.image;
  // Update active thumb
  const thumbs = document.querySelectorAll('.ts-pm-thumb');
  thumbs.forEach((t,i) => t.classList.toggle('active', i === colorIdx));
  // Update active colorway
  const cwItems = document.querySelectorAll('#pm-colorways-' + prodIdx + ' .ts-pm-colorway-item');
  cwItems.forEach((el,i) => el.classList.toggle('active', i === colorIdx));
  // Update size selector to match colorway hlId
  const sel = document.getElementById('pm-size-select-' + prodIdx);
  if (sel) {
    for (let i = 0; i < sel.options.length; i++) {
      if (sel.options[i].value === c.label) {
        sel.selectedIndex = i;
        sel.dispatchEvent(new Event('change'));
        break;
      }
    }
  }
}

function tsCoShowError(msg) {
  var el = document.getElementById('ts-co-error');
  if (el) { el.textContent = msg; el.classList.add('show'); }
}

function tsCoClose(e) {
  if (e.target === document.getElementById('ts-checkout-scrim')) tsCoCloseBtn();
}

function tsCoCloseBtn() {
  document.getElementById('ts-checkout-scrim').classList.remove('open');
  document.body.style.overflow = '';
}


// Package view
(function(){
  var style = document.createElement("style");
  style.textContent = ".pkg-card{background:#fff;border:2px solid #e0e0e0;border-radius:10px;padding:12px;cursor:pointer;transition:border 0.15s;text-align:center;}.pkg-card:hover{border-color:#4db8ff;}.pkg-card.pkg-sel{border-color:#1a1a2e;}.pkg-chk{display:none;background:#1a1a2e;color:#fff;border-radius:50%;width:22px;height:22px;align-items:center;justify-content:center;font-size:13px;margin:6px auto 0;}.pkg-img{width:100%;height:120px;object-fit:contain;background:#f8f8f8;border-radius:6px;}";
  document.head.appendChild(style);

  var wrap = document.createElement("div");
  wrap.id = "ts-package-view";
  wrap.style.cssText = "display:none;max-width:860px;margin:0 auto;padding:32px 20px 80px;font-family:Lato,sans-serif;";
  var root = document.getElementById("ts-storefront-root") || document.body;
  root.appendChild(wrap);

  function mkLabel(txt) {
    var d = document.createElement("p");
    d.style.cssText = "font-size:0.7rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#888;margin:0 0 10px;";
    d.textContent = txt;
    return d;
  }
  function mkGrid() {
    var d = document.createElement("div");
    d.style.cssText = "display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px;margin-bottom:28px;";
    return d;
  }
  function mkCard(type, name, price, imgSrc) {
    var card = document.createElement("div");
    card.className = "pkg-card";
    card.setAttribute("data-name", name);
    card.setAttribute("data-price", price);
    card.addEventListener("click", function(){ pkgPick(type, card); });
    var img = document.createElement("img");
    img.src = imgSrc; img.className = "pkg-img";
    var lbl = document.createElement("div");
    lbl.style.cssText = "font-size:0.82rem;font-weight:700;margin-top:8px;";
    lbl.textContent = name;
    var msrp = document.createElement("div");
    msrp.style.cssText = "font-size:0.75rem;color:#888;margin-top:2px;";
    msrp.textContent = "MSRP: $" + price.toFixed(2);
    var chk = document.createElement("div");
    chk.className = "pkg-chk"; chk.textContent = "✓";
    card.appendChild(img); card.appendChild(lbl); card.appendChild(msrp); card.appendChild(chk);
    return card;
  }

  // Back button
  var back = document.createElement("button");
  back.textContent = "← Back to Store";
  back.onclick = pkgBack;
  back.style.cssText = "background:#1a1a2e;color:#fff;border:none;padding:9px 18px;border-radius:6px;cursor:pointer;font-weight:700;margin-bottom:24px;font-family:Montserrat,sans-serif;";
  wrap.appendChild(back);

  // Title
  var h2 = document.createElement("h2");
  h2.style.cssText = "font-size:1.4rem;font-weight:700;margin-bottom:4px;font-family:Montserrat,sans-serif;";
  h2.textContent = "🏂 Customize Your Package";
  wrap.appendChild(h2);
  var sub = document.createElement("p");
  sub.style.cssText = "color:#888;margin-bottom:28px;";
  sub.innerHTML = "Package price: <strong style='color:#1a1a2e'>$699.99</strong>";
  wrap.appendChild(sub);

  // Board
  wrap.appendChild(mkLabel("Choose Snowboard"));
  var boardGrid = mkGrid();
  boardGrid.appendChild(mkCard("board","Rossignol Ampage Vol. 2 Wide",349.99,"https://www.evo.com/cdn/shop/files/product-image-1262117.jpg?v=1767739622&width=1200"));
  boardGrid.appendChild(mkCard("board","Rossignol Ampage Vol. 1",379.99,"https://images.evo.com/imgp/700/268697/1262117/clone.jpg"));
  boardGrid.appendChild(mkCard("board","Rome Mechanic",399.99,"https://gotyourgear.com/cdn/shop/products/XiRRlqZjulHp70JHemJLlGhxj5vrXtXG-25.jpg?v=1663706289"));
  wrap.appendChild(boardGrid);

  // Bindings
  wrap.appendChild(mkLabel("Choose Bindings"));
  var bindGrid = mkGrid();
  bindGrid.appendChild(mkCard("binding","Rossignol Myth Binding",179.99,"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsNn_RTeBU6Fq2IduH14g-UDZ139V4NTZbNAemY404RZfOs75rtrOXpco&s=10"));
  bindGrid.appendChild(mkCard("binding","Rossignol Works Binding",179.99,"https://www.rossignol.com/dw/image/v2/BJJZ_PRD/on/demandware.static/-/Sites-rossignol-catalog/default/dwb2c92e3d/images/large/RGPC210000_72DPI_01_v00.jpg?sw=1200&sh=1200"));
  bindGrid.appendChild(mkCard("binding","Rossignol Ultraviolet Binding",179.99,"https://www.philbricks.com/cdn/shop/files/jpwzk6eacykcfzrvimjq_535x.jpg?v=1776807735"));
  wrap.appendChild(bindGrid);

  // Boots
  wrap.appendChild(mkLabel("Choose Boots"));
  var bootGrid = mkGrid();
  bootGrid.appendChild(mkCard("boot","Salomon Faction BOA",279.99,"https://images.evo.com/imgp/700/239780/1013306/salomon-faction-boa-snowboard-boots-.jpg"));
  wrap.appendChild(bootGrid);

  // Summary bar
  var summary = document.createElement("div");
  summary.style.cssText = "background:#fff;border:2px solid #e0e0e0;border-radius:10px;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;";
  var left = document.createElement("div");
  var total = document.createElement("div");
  total.style.cssText = "font-size:1.1rem;font-weight:700;";
  total.textContent = "Package Total: $699.99";
  var info = document.createElement("div");
  info.id = "pkg-info";
  info.style.cssText = "font-size:0.8rem;color:#888;margin-top:4px;";
  info.textContent = "Select a board, bindings, and boots.";
  left.appendChild(total); left.appendChild(info);
  var btn = document.createElement("button");
  btn.id = "pkg-btn";
  btn.disabled = true;
  btn.onclick = pkgAddToCart;
  btn.style.cssText = "background:#1a1a2e;color:#fff;border:none;border-radius:6px;padding:12px 28px;font-size:0.9rem;font-weight:700;cursor:pointer;opacity:0.4;font-family:Montserrat,sans-serif;";
  btn.textContent = "Add Package to Cart";
  summary.appendChild(left); summary.appendChild(btn);
  wrap.appendChild(summary);
})();

// Ski package view (RX9 + Roxa Boots)
(function(){
  var wrap = document.createElement("div");
  wrap.id = "ts-ski-package-view";
  wrap.style.cssText = "display:none;max-width:860px;margin:0 auto;padding:32px 20px 80px;font-family:Lato,sans-serif;";
  var root = document.getElementById("ts-storefront-root") || document.body;
  root.appendChild(wrap);

  function mkLabel(txt) {
    var d = document.createElement("p");
    d.style.cssText = "font-size:0.7rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#888;margin:0 0 10px;";
    d.textContent = txt;
    return d;
  }
  function mkGrid() {
    var d = document.createElement("div");
    d.style.cssText = "display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px;margin-bottom:28px;";
    return d;
  }
  function mkCard(type, name, price, imgSrc) {
    var card = document.createElement("div");
    card.className = "pkg-card";
    card.setAttribute("data-name", name);
    card.setAttribute("data-price", price);
    card.addEventListener("click", function(){ skiPkgPick(type, card); });
    var img = document.createElement("img");
    img.src = imgSrc; img.className = "pkg-img";
    var lbl = document.createElement("div");
    lbl.style.cssText = "font-size:0.82rem;font-weight:700;margin-top:8px;";
    lbl.textContent = name;
    var msrp = document.createElement("div");
    msrp.style.cssText = "font-size:0.75rem;color:#888;margin-top:2px;";
    msrp.textContent = "MSRP: $" + price.toFixed(2);
    var chk = document.createElement("div");
    chk.className = "pkg-chk"; chk.textContent = "✓";
    card.appendChild(img); card.appendChild(lbl); card.appendChild(msrp); card.appendChild(chk);
    return card;
  }

  // Back button
  var back = document.createElement("button");
  back.textContent = "← Back to Store";
  back.onclick = skiPkgBack;
  back.style.cssText = "background:#1a1a2e;color:#fff;border:none;padding:9px 18px;border-radius:6px;cursor:pointer;font-weight:700;margin-bottom:24px;font-family:Montserrat,sans-serif;";
  wrap.appendChild(back);

  // Title
  var h2 = document.createElement("h2");
  h2.style.cssText = "font-size:1.4rem;font-weight:700;margin-bottom:4px;font-family:Montserrat,sans-serif;";
  h2.textContent = "🎿 Customize Your Package";
  wrap.appendChild(h2);
  var sub = document.createElement("p");
  sub.style.cssText = "color:#888;margin-bottom:28px;";
  sub.innerHTML = "Package price: <strong style='color:#1a1a2e'>$799.99</strong>";
  wrap.appendChild(sub);

  // Skis
  wrap.appendChild(mkLabel("Choose Skis"));
  var skiGrid = mkGrid();
  skiGrid.appendChild(mkCard("ski","Kästle RX9",950.00,"https://kaestle.com/cdn/shop/files/rx9_01.jpg?v=1752671657"));
  wrap.appendChild(skiGrid);

  // Boots
  wrap.appendChild(mkLabel("Choose Boots"));
  var bootGrid = mkGrid();
  bootGrid.appendChild(mkCard("boot","Roxa R/Fit 80",349.99,"https://www.utahskigear.com/cdn/shop/files/RFIT80.jpg?v=1693330629&width=1800"));
  bootGrid.appendChild(mkCard("boot","Roxa R/Fit Hike 85W",449.99,"https://cdn11.bigcommerce.com/s-gvjzgt2kex/images/stencil/original/attribute_rule_images/26680_source_1745273743.jpg"));
  bootGrid.appendChild(mkCard("boot","Roxa R/Fit 100",449.99,"https://www.roxa.com/wp-content/uploads/2025/06/RFIT-HV-100-1.webp"));
  bootGrid.appendChild(mkCard("boot","Roxa R/Fit MV 110",649.99,"https://cdn11.bigcommerce.com/s-8p220y2h7i/images/stencil/608x608/products/72621/95945/3__05143.1727116205.JPG?c=2"));
  bootGrid.appendChild(mkCard("boot","Roxa Trinity 95",699.99,"https://www.christysports.com/dw/image/v2/BGBB_PRD/on/demandware.static/-/Sites-master-winter/default/dwf9f6680e/8101098_050_1.jpg?sw=1600&sh=1600"));
  bootGrid.appendChild(mkCard("boot","Roxa R/Fit HV 75",349.99,"https://cdn11.bigcommerce.com/s-gvjzgt2kex/images/stencil/1280x1280/products/9347/179574/145223_BLACK-AQUA_LG__20758.1752095426.jpg?c=1"));
  bootGrid.appendChild(mkCard("boot","Roxa R/Fit HV 80",349.99,"https://www.roxa.com/wp-content/uploads/2025/06/RFIT-HV-80-763x1024.webp"));
  bootGrid.appendChild(mkCard("boot","Roxa Element 120",724.99,"https://bootfitters.com/files/styles/mug/public/images/boots/element_120_u75.png"));
  bootGrid.appendChild(mkCard("boot","Roxa R/Fit Pro 110",649.99,"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUwTtCr-goC9TfuDsWQnyQDos9zq2dmPSGpKd0DALDhgPcNsjvRG5VgmI&s=10"));
  bootGrid.appendChild(mkCard("boot","Roxa R/Fit Pro 120",699.99,"https://content.backcountry.com/images/items/900/RXA/RXAC04A/DKGREORA.jpg"));
  bootGrid.appendChild(mkCard("boot","Roxa R/Fit Pro 85 W",449.99,"https://cdn11.bigcommerce.com/s-eoq23gh9op/images/stencil/1280x1280/products/241/662/RFIT-PRO-85-W__63210.1698828184.jpg?c=1?imbypass=on"));
  wrap.appendChild(bootGrid);

  // Summary bar
  var summary = document.createElement("div");
  summary.style.cssText = "background:#fff;border:2px solid #e0e0e0;border-radius:10px;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;";
  var left = document.createElement("div");
  var total = document.createElement("div");
  total.style.cssText = "font-size:1.1rem;font-weight:700;";
  total.textContent = "Package Total: $799.99";
  var info = document.createElement("div");
  info.id = "ski-pkg-info";
  info.style.cssText = "font-size:0.8rem;color:#888;margin-top:4px;";
  info.textContent = "Select your skis and boots.";
  left.appendChild(total); left.appendChild(info);
  var btn = document.createElement("button");
  btn.id = "ski-pkg-btn";
  btn.disabled = true;
  btn.onclick = skiPkgAddToCart;
  btn.style.cssText = "background:#1a1a2e;color:#fff;border:none;border-radius:6px;padding:12px 28px;font-size:0.9rem;font-weight:700;cursor:pointer;opacity:0.4;font-family:Montserrat,sans-serif;";
  btn.textContent = "Add Package to Cart";
  summary.appendChild(left); summary.appendChild(btn);
  wrap.appendChild(summary);
})();

// ── Deal of the Day HOMEPAGE BANNER — built here so it doesn't depend on the header file ──
(function insertDealBanner(){
  var home = document.getElementById("ts-home");
  var cats = home && home.querySelector(".tsh-cats-section");
  if (!home || !cats) { setTimeout(insertDealBanner, 100); return; }
  // remove any older header-based banner so there's never two
  var old = document.getElementById("tsh-deal-banner"); if (old) old.parentNode.removeChild(old);
  if (document.getElementById("tsh-dotd")) return;

  var css = document.createElement("style");
  css.textContent =
    "#tsh-dotd{position:relative;overflow:hidden;text-align:center;padding:80px 7vw;cursor:pointer;" +
      "background:linear-gradient(135deg,#061222 0%,#0e2d4d 22%,#4db8ff 45%,#f3faff 50%,#4db8ff 55%,#0e2d4d 78%,#061222 100%);" +
      "background-size:320% 320%;background-repeat:no-repeat;animation:tshDotdBg 13s ease-in-out infinite;" +
      "border-top:3px solid #4db8ff;border-bottom:3px solid #4db8ff;}" +
    "#tsh-dotd::before{content:'';position:absolute;top:0;left:-60%;width:40%;height:100%;pointer-events:none;" +
      "background:linear-gradient(120deg,transparent,rgba(255,255,255,0.2),transparent);animation:tshDotdShine 3.2s ease-in-out infinite;}" +
    "@keyframes tshDotdBg{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}" +
    "@keyframes tshDotdShine{0%{left:-60%}55%,100%{left:130%}}" +
    "@keyframes tshDotdPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.03)}}" +
    "#tsh-dotd .dotd-countline{position:relative;z-index:2;margin:0 0 14px;}" +
    "#tsh-dotd .dotd-countlabel{display:block;font-family:Montserrat,Arial,sans-serif;font-size:0.8rem;font-weight:700;" +
      "letter-spacing:0.16em;text-transform:uppercase;color:#fff;margin:0 0 8px;text-shadow:0 0 14px rgba(77,184,255,0.9);}" +
    "#tsh-dotd .dotd-countdown{display:block;font-family:'Bebas Neue',Impact,sans-serif;font-size:2.7rem;letter-spacing:0.14em;" +
      "color:#fff;text-shadow:0 0 20px rgba(77,184,255,0.9);}" +
    "#tsh-dotd .dotd-title{position:relative;z-index:2;font-family:'Bebas Neue',Impact,sans-serif;font-size:7rem;line-height:0.95;" +
      "letter-spacing:0.05em;color:#fff;text-transform:uppercase;margin:0 0 28px;text-shadow:0 0 40px rgba(77,184,255,0.9),0 0 14px rgba(0,0,0,0.25);" +
      "animation:tshDotdPulse 1.6s ease-in-out infinite;}" +
    "#tsh-dotd .dotd-btn{position:relative;z-index:2;display:inline-block;background:#fff;color:#1a1a2e;border:none;border-radius:3px;" +
      "padding:16px 44px;font-family:Montserrat,Arial,sans-serif;font-size:0.95rem;font-weight:800;letter-spacing:0.2em;" +
      "text-transform:uppercase;cursor:pointer;transition:transform .2s,box-shadow .2s;}" +
    "#tsh-dotd .dotd-btn:hover{transform:scale(1.06);box-shadow:0 0 30px 4px rgba(77,184,255,0.6);}" +
    "@media(max-width:640px){#tsh-dotd{padding:52px 6vw}#tsh-dotd .dotd-title{font-size:3.6rem}#tsh-dotd .dotd-countdown{font-size:1.9rem}}";
  document.head.appendChild(css);

  var banner = document.createElement("div");
  banner.id = "tsh-dotd";
  banner.innerHTML =
    '<div class="dotd-countline"><span class="dotd-countlabel">Next Deal Drops In</span><span class="dotd-countdown" id="dotd-countdown">--:--:--</span></div>' +
    '<div class="dotd-title">DEAL OF THE DAY</div>' +
    '<button class="dotd-btn" type="button">See Today\'s Deal →</button>';
  banner.addEventListener("click", function(){ if (typeof tshShowDeal === "function") tshShowDeal(); });
  home.insertBefore(banner, cats);

  // Countdown to the next DEAL_OF_DAY.revealHour:revealMinute, Eastern time —
  // automatically resets to the next day's 12:00 PM once it passes.
  function dotdNextDrop() {
    var now = dealNowNY();
    var next = new Date(now);
    next.setHours(DEAL_OF_DAY.revealHour, DEAL_OF_DAY.revealMinute, 0, 0);
    if (next <= now) next.setDate(next.getDate() + 1);
    return next;
  }
  function dotdTick() {
    var el = document.getElementById("dotd-countdown");
    if (!el) return;
    el.textContent = dealFmtCountdown(dotdNextDrop());
  }
  dotdTick();
  setInterval(dotdTick, 1000);
})();

// Deal of the Day page
(function(){
  var wrap = document.createElement("div");
  wrap.id = "ts-deal-view";
  wrap.style.cssText = "display:none;width:100%;padding:32px 5vw 80px;box-sizing:border-box;font-family:Lato,sans-serif;";
  var root = document.getElementById("ts-storefront-root") || document.body;
  root.appendChild(wrap);

  var back = document.createElement("button");
  back.textContent = "← Back to Store";
  back.onclick = dealBack;
  back.style.cssText = "background:#1a1a2e;color:#fff;border:none;padding:9px 18px;border-radius:6px;cursor:pointer;font-weight:700;margin-bottom:24px;font-family:Montserrat,sans-serif;";
  wrap.appendChild(back);

  var card = document.createElement("div");
  card.style.cssText = "background:#fff;border:2px solid #e0e0e0;border-radius:12px;padding:28px;display:grid;grid-template-columns:minmax(0,360px) 1fr;gap:28px;align-items:start;";
  var leftCol = document.createElement("div");
  var imgwrap = document.createElement("div");
  imgwrap.id = "ts-deal-imgwrap";
  imgwrap.style.cssText = "position:relative;background:#f6f6f6;border-radius:10px;min-height:280px;display:flex;align-items:center;justify-content:center;overflow:hidden;margin-bottom:10px;";
  var img = document.createElement("img");
  img.id = "ts-deal-img"; img.alt = "Deal of the Day";
  img.style.cssText = "width:100%;height:100%;max-height:360px;object-fit:contain;display:none;cursor:pointer;";
  var mystery = document.createElement("div");
  mystery.id = "ts-deal-mystery";
  mystery.textContent = "?";
  mystery.style.cssText = "font-family:'Bebas Neue',Montserrat,sans-serif;font-size:9rem;color:#1a1a2e;opacity:0.15;line-height:1;";
  var bindingsBadge = document.createElement("div");
  bindingsBadge.id = "ts-deal-bindings-badge";
  bindingsBadge.textContent = "Bindings Included";
  bindingsBadge.style.cssText = "display:none;position:absolute;top:10px;right:10px;background:#1a1a2e;color:#fff;font-family:Montserrat,sans-serif;font-size:0.68rem;font-weight:700;letter-spacing:0.04em;padding:6px 11px;border-radius:4px;z-index:2;";
  imgwrap.appendChild(img); imgwrap.appendChild(mystery); imgwrap.appendChild(bindingsBadge);
  var thumbs = document.createElement("div");
  thumbs.id = "ts-deal-thumbs";
  thumbs.className = "ts-pm-thumbs";
  thumbs.style.cssText = "display:none;";
  leftCol.appendChild(imgwrap); leftCol.appendChild(thumbs);

  var info = document.createElement("div");
  var tag = document.createElement("div"); tag.id = "ts-deal-tag";
  tag.style.cssText = "font-size:0.7rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#e8641b;margin-bottom:10px;";
  var name = document.createElement("h2"); name.id = "ts-deal-name";
  name.style.cssText = "font-size:1.6rem;font-weight:700;margin:0 0 10px;font-family:Montserrat,sans-serif;color:#1a1a2e;";
  var desc = document.createElement("p"); desc.id = "ts-deal-desc";
  desc.style.cssText = "color:#666;line-height:1.6;margin:0 0 16px;";
  var priceRow = document.createElement("div"); priceRow.style.cssText = "display:flex;align-items:baseline;gap:12px;margin-bottom:8px;";
  var price = document.createElement("span"); price.id = "ts-deal-price";
  price.style.cssText = "font-size:2rem;font-weight:800;color:#1a1a2e;font-family:Montserrat,sans-serif;";
  var msrp = document.createElement("span"); msrp.id = "ts-deal-msrp";
  msrp.style.cssText = "font-size:1.1rem;color:#999;text-decoration:line-through;";
  priceRow.appendChild(price); priceRow.appendChild(msrp);
  var left = document.createElement("div"); left.id = "ts-deal-left";
  left.style.cssText = "font-size:0.85rem;font-weight:700;color:#e8641b;margin-bottom:14px;";
  var sizeWrap = document.createElement("div"); sizeWrap.id = "ts-deal-sizewrap";
  sizeWrap.style.cssText = "margin-bottom:16px;";
  var sizeLabel = document.createElement("label");
  sizeLabel.style.cssText = "display:block;font-size:0.72rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#888;margin-bottom:6px;";
  sizeLabel.textContent = "Select Size";
  var sizeSel = document.createElement("select"); sizeSel.id = "ts-deal-size";
  sizeSel.style.cssText = "width:100%;max-width:280px;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:0.9rem;font-family:Lato,sans-serif;";
  sizeSel.onchange = function(){ dealRender(); };
  sizeWrap.appendChild(sizeLabel); sizeWrap.appendChild(sizeSel);
  var count = document.createElement("div"); count.id = "ts-deal-count";
  count.style.cssText = "font-family:'Bebas Neue',Montserrat,sans-serif;font-size:3rem;letter-spacing:0.08em;color:#1a1a2e;line-height:1;margin-bottom:16px;";
  var btn = document.createElement("button"); btn.id = "ts-deal-btn";
  btn.disabled = true; btn.onclick = dealBuy;
  btn.style.cssText = "background:#e8641b;color:#fff;border:none;border-radius:6px;padding:14px 32px;font-size:0.95rem;font-weight:700;cursor:pointer;font-family:Montserrat,sans-serif;";
  var rules = document.createElement("p"); rules.id = "ts-deal-rules";
  rules.style.cssText = "font-size:0.72rem;color:#999;margin:14px 0 0;";
  info.appendChild(tag); info.appendChild(name); info.appendChild(desc); info.appendChild(priceRow);
  info.appendChild(left); info.appendChild(sizeWrap); info.appendChild(count); info.appendChild(btn); info.appendChild(rules);
  card.appendChild(leftCol); card.appendChild(info);
  wrap.appendChild(card);

  // Full specs — same table/accordion the regular product pages use
  var specsWrap = document.createElement("div"); specsWrap.id = "ts-deal-specs-wrap";
  specsWrap.style.cssText = "margin-top:20px;display:none;";
  var specsAcc = document.createElement("div"); specsAcc.className = "ts-accordion";
  var specsBtn = document.createElement("button"); specsBtn.className = "ts-accordion-btn"; specsBtn.type = "button";
  specsBtn.onclick = function(){ tsAccToggle(specsBtn); };
  specsBtn.innerHTML = 'Specs <span class="ts-acc-arrow">▼</span>';
  var specsBody = document.createElement("div"); specsBody.className = "ts-accordion-body";
  var specsTable = document.createElement("table"); specsTable.className = "ts-pm-specs"; specsTable.id = "ts-deal-specs-table";
  specsBody.appendChild(specsTable);
  specsAcc.appendChild(specsBtn); specsAcc.appendChild(specsBody);
  specsWrap.appendChild(specsAcc);
  wrap.appendChild(specsWrap);

  var style = document.createElement("style");
  style.textContent = "#ts-deal-btn:disabled{opacity:0.45;cursor:not-allowed;}@media(max-width:640px){#ts-deal-view > div:nth-child(2){grid-template-columns:1fr !important;}}";
  document.head.appendChild(style);

  dealRender();
})();

})();
