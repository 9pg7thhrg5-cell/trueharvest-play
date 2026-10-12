/*
 * The service worker of TrueHarvest Tycoon as a web app (D-244). scripts/web-service-worker.ts writes it into the web
 * build as sw.js, with BUILD below replaced by the build's version and its plan (src/web/web-app-build.ts):
 *   - at install it keeps the app shell (the page, the code, the styles, the manifest, the logo), so the game opens
 *     offline after the first visit;
 *   - the pictures and the intro movie are kept the first time each is shown, and served from the device afterwards;
 *     the movie is played from the network until a whole copy is kept, then in ranges from that copy;
 *   - its caches carry the build's version, so a new build makes new caches; at activation the pictures the new build
 *     still uses (the same name, so the same picture) move to its cache and every older cache is deleted;
 *   - a new build waits until the player chooses "Reload" on the notice of src/web/web-app.ts (the SKIP_WAITING message).
 */
const BUILD = {"version":"4.1.1-24af1766a8","shell":["assets/counties-10m-Bpk20aew.js","assets/index-D2DZhDOk.css","assets/index-agBBUTDS.js","assets/map-local-layers-DZ_O_ejp.js","assets/web-app-B5pJAP-i.css","assets/web-app-Bv1lIQQK.js","index.html","manifest.webmanifest","trueharvest-logo.png"],"art":["assets/a220-zbu3rtvB.webp","assets/a321-Dhrr9CFw.webp","assets/academy-B2ltKh8K.webp","assets/aframax_tanker-jjeiOm2r.webp","assets/agrotourism_fields-DyIRDIS-.webp","assets/arena-CWAM6orh.webp","assets/atr72-CjezL4E2.webp","assets/b737-BIOukDoJ.webp","assets/b757-CyjHFqdx.webp","assets/b767-BOtsh5tO.webp","assets/bakery-CDcIUfBQ.webp","assets/bank_branch-D4jiLKlJ.webp","assets/bbq_smokehouse-nwXb8464.webp","assets/beef_plant-CSc56CiI.webp","assets/berth_cranes-U69NwnVW.webp","assets/box_diesel-CjUwzY9u.webp","assets/box_electric-BGiVCa9s.webp","assets/breakfast_brunch---5JobzY.webp","assets/brewery-C852IHrj.webp","assets/broiler_farm-CavYDNqO.webp","assets/burger_qsr-Di6h5-92.webp","assets/cabins-BofzONLD.webp","assets/chicken-CTk_dFrY.webp","assets/chp_plant-CURNFQy2.webp","assets/clinic-CufkhNPo.webp","assets/coffee_ice_cream-DXvKZqs0.webp","assets/coffee_roastery-DnlUVCoU.webp","assets/cold_storage-DnhxwmiT.webp","assets/concrete_plant-B-IGPdWY.webp","assets/construction_company-CYNesiwI.webp","assets/crabber_165-CMhVB_NR.webp","assets/crude_tanker-Rt1arfCk.webp","assets/cruise_ship_hotel-C9vVpkW9.webp","assets/csa-CpAr_TNc.webp","assets/dairy-BBrz919Q.webp","assets/desalination-CvxlEaLH.webp","assets/digester-Dl-ee5Bk.webp","assets/distillery-d4UKH-jb.webp","assets/distribution_center-CkImvqwp.webp","assets/dual_purpose_165-B6CWJZ2B.webp","assets/equestrian_center-DHOaG3kx.webp","assets/factory_trawler_300-Dd5_7gak.webp","assets/farm-DJ0W-Qrf.webp","assets/fast_casual_grill-Bf7BjqGl.webp","assets/feed_mill-C1S563ZA.webp","assets/feeder_1000-bkahXhE_.webp","assets/feeder_1800-BRzHWyz4.webp","assets/feedlot-B0oVx2MI.webp","assets/fish_plant-CWawis1w.webp","assets/fish_plant_dutch_harbor-BDIh-Onl.webp","assets/fish_plant_shelburne-Db-gdGPF.webp","assets/fish_plant_vacamonte-BRwbpdGX.webp","assets/fish_plant_westport-DLDPLMLP.webp","assets/fishmeal_plant-e4BGZgTd.webp","assets/founder_art--T8_DE4G.webp","assets/founder_cars_classic-BAD7WO6n.webp","assets/founder_cars_super-DBefX_Vm.webp","assets/founder_home_amsterdam-CX3MGOvJ.webp","assets/founder_home_florida-dE84Ia9A.webp","assets/founder_home_mountain-xZz7z9Zm.webp","assets/founder_home_penthouse-BjLkOy23.webp","assets/founder_jet_light-DeP3Ayk8.webp","assets/founder_jet_longrange-CebJsgd7.webp","assets/founder_jet_midsize-Bq7-BuLo.webp","assets/founder_racehorses-CFab63iF.webp","assets/founder_sports_team-Cflsb8TO.webp","assets/founder_trophy_cabinet-j9N7uq37.webp","assets/founder_wine_cellar-BCgEaiqT.webp","assets/founder_yacht_40m-C6StRzhX.webp","assets/founder_yacht_60m-CZTZXlsw.webp","assets/founder_yacht_90m-B4f-Q4jN.webp","assets/fuel_terminal-BC-syzgk.webp","assets/hangar-D2iF-URQ.webp","assets/harbor_agrotourism_fields-tR89qr32.webp","assets/harbor_arena-BbseOMMO.webp","assets/harbor_equestrian_center-Aw-eL8wJ.webp","assets/harbor_farm-CiX65vhq.webp","assets/harbor_rv_park-Dfgb8r2r.webp","assets/harbor_tug-D3WTSiak.webp","assets/harbor_waterpark-LHySkgY7.webp","assets/hog_farm-D-iYmrlB.webp","assets/ice_plant-BrZeB08A.webp","assets/intro-EGqRlaBG.mp4","assets/italian_casual-nZt0nm7C.webp","assets/kansas_hub-rhMPBmO8.webp","assets/lamb_feedlot-CmZAoXkX.webp","assets/lamb_plant-W1BuHnEQ.webp","assets/lm100j-Hu16Jmmv.webp","assets/longliner_165-CDHfarpO.webp","assets/longliner_85-BHdYJ_Os.webp","assets/mediterranean-D9_nUAqV.webp","assets/mixed_compound-DR-n5tfY.webp","assets/mobile_concrete_plant-CZ3rq2Z0.webp","assets/multi_75-C3q6cUrD.webp","assets/multi_75_shelburne-CXf00-3_.webp","assets/multi_75_westport-BsNZ78Sw.webp","assets/own_airport-CBhXW0YF.webp","assets/paita_desert_farm-CcrLJphg.webp","assets/payment_card-VOKk8NUg.webp","assets/pet_food-BWGP2Rpf.webp","assets/pizza_bakery-BQpqQEvj.webp","assets/pork_plant-J9MdSDgB.webp","assets/poultry_plant-DxAV5MA2.webp","assets/procurement_office-wmGePaF6.webp","assets/rail_reefer-DgEUFkNS.webp","assets/rail_terminal-BoIF9hV1.webp","assets/reefer_yard-CLoz_joZ.webp","assets/refinery-BdVQst88.webp","assets/rendering_plant-BZQ3xWxW.webp","assets/rescue_helicopter-Cgqbh5z3.webp","assets/roastery-ZxkcCamS.webp","assets/rv_park-DoqQ63uI.webp","assets/salmon_farm-CWWtzGKr.webp","assets/salmon_ras-CJtNWTI9.webp","assets/scalloper_165-BQ3WkDOF.webp","assets/seafood_casual-Cl1KxFwL.webp","assets/seafood_premium-DwasTGZX.webp","assets/seafood_qsr-IHRpJCFK.webp","assets/seiner_165-poZUJded.webp","assets/semi_diesel-C9BmTXjd.webp","assets/semi_electric-BER-lUCm.webp","assets/shipyard-CIutfX4b.webp","assets/shrimp_farm-NdIG003o.webp","assets/shrimp_ras-B-ynTD5n.webp","assets/site_brownsville-D-GUpx4A.webp","assets/site_colon-DNy67fTL.webp","assets/site_dutch_harbor-CmCN7DGc.webp","assets/site_houston-CK18nxy_.webp","assets/site_kansas-BG6wAodh.webp","assets/site_paita-B1eQy-4f.webp","assets/site_shelburne-BPVHepym.webp","assets/site_vacamonte-B3sxvnK4.webp","assets/site_westport-D_nmdQHA.webp","assets/small_500-Ch4B9gMX.webp","assets/solar_farm-DQYtydvJ.webp","assets/sports_bar-CT-7GFMP.webp","assets/sports_compound-BbkVIHqF.webp","assets/staff_housing-TQ8ruF1f.webp","assets/steakhouse-CPYMnZrY.webp","assets/stock_listing-CWGs0IRA.webp","assets/subcenter-BSNvGNHC.webp","assets/tannery-CGgHNI0P.webp","assets/training_center-BG7TMPZH.webp","assets/trawler_165-xcZmwISZ.webp","assets/upscale_steak-B8Iv8TGp.webp","assets/wastewater-CygCK1I6.webp","assets/water_bottling-2e8imZpd.webp","assets/waterpark-DT4zxrnu.webp","assets/wharf-Zvy6v3Op.webp","assets/winery-r172MQ54.webp"]};

const PREFIX = 'trueharvest-';
const SHELL_CACHE = `${PREFIX}shell-${BUILD.version}`;
const ART_CACHE = `${PREFIX}art-${BUILD.version}`;
const at = (path) => new URL(path, self.location.href).href;
const SHELL = new Set(BUILD.shell.map(at));
const ART = new Set(BUILD.art.map(at));
const INDEX = at('index.html');
/** Files whose names carry their content's hash may come from the browser's own cache; the others are asked fresh. */
const HASHED = /\/assets\//;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) =>
      cache.addAll(BUILD.shell.map((p) => new Request(at(p), { cache: HASHED.test(at(p)) ? 'default' : 'no-cache' }))),
    ),
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      const art = await caches.open(ART_CACHE);
      for (const name of names) {
        if (!name.startsWith(`${PREFIX}art-`) || name === ART_CACHE) continue;
        const old = await caches.open(name);
        for (const req of await old.keys()) {
          if (!ART.has(req.url) || (await art.match(req))) continue;
          const res = await old.match(req);
          if (res) await art.put(req, res);
        }
      }
      for (const name of names) {
        if (name.startsWith(PREFIX) && name !== SHELL_CACHE && name !== ART_CACHE) await caches.delete(name);
      }
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  const key = url.origin + url.pathname;
  if (req.mode === 'navigate') {
    if (req.url.startsWith(self.registration.scope)) event.respondWith(shellPage(req));
    return;
  }
  if (SHELL.has(key)) {
    event.respondWith(fromShell(key, req));
    return;
  }
  if (!ART.has(key)) return;
  if (req.headers.has('range')) {
    // the movie: from the kept copy in ranges, or from the network while a whole copy is kept for next time
    const range = req.headers.get('range');
    event.waitUntil(
      caches.open(ART_CACHE).then(async (cache) => {
        if (!(await cache.match(key))) await keepWhole(cache, key);
      }),
    );
    event.respondWith(
      caches.open(ART_CACHE).then(async (cache) => {
        const kept = await cache.match(key);
        return kept ? rangeOf(kept, range) : fetch(req);
      }),
    );
    return;
  }
  event.respondWith(fromArt(event, key, req));
});

/** The game's page for every address in its scope: the kept page, or the network before the first install. */
async function shellPage(req) {
  const cache = await caches.open(SHELL_CACHE);
  const kept = await cache.match(INDEX);
  if (kept) return kept;
  return fetch(req);
}

async function fromShell(key, req) {
  const cache = await caches.open(SHELL_CACHE);
  const kept = await cache.match(key);
  return kept || fetch(req);
}

/** A picture: the kept copy, else the network, kept when it arrives whole. */
async function fromArt(event, key, req) {
  const cache = await caches.open(ART_CACHE);
  const kept = await cache.match(key);
  if (kept) return kept;
  const res = await fetch(req);
  if (res.status === 200 && (res.type === 'basic' || res.type === 'default')) event.waitUntil(cache.put(key, res.clone()));
  return res;
}

const keeping = new Set();

/** Keeps a whole copy of a file asked for in ranges (the movie), once at a time. */
async function keepWhole(cache, key) {
  if (keeping.has(key)) return;
  keeping.add(key);
  try {
    const res = await fetch(key);
    if (res.status === 200) await cache.put(key, res);
  } catch (e) {
    // offline or cut off: the next showing tries again
  } finally {
    keeping.delete(key);
  }
}

/** The part of a kept file a Range header asks for (one range, as a video element asks), or 416 when it cannot be served. */
async function rangeOf(kept, range) {
  const blob = await kept.blob();
  const size = blob.size;
  const m = /^bytes=(\d*)-(\d*)$/.exec(String(range).trim());
  let start = -1;
  let end = -1;
  if (m && m[1] !== '') {
    start = Number(m[1]);
    end = m[2] === '' ? size - 1 : Math.min(Number(m[2]), size - 1);
  } else if (m && m[2] !== '') {
    start = Math.max(0, size - Number(m[2]));
    end = size - 1;
  }
  if (start < 0 || start >= size || end < start) {
    return new Response(null, { status: 416, statusText: 'Range Not Satisfiable', headers: { 'Content-Range': `bytes */${size}` } });
  }
  return new Response(blob.slice(start, end + 1), {
    status: 206,
    statusText: 'Partial Content',
    headers: {
      'Content-Type': kept.headers.get('Content-Type') || 'application/octet-stream',
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Content-Length': String(end - start + 1),
      'Accept-Ranges': 'bytes',
    },
  });
}
