/*
 * The service worker of TrueHarvest Tycoon as a web app (D-244). scripts/web-service-worker.ts writes it into the web
 * build as sw.js, with BUILD below replaced by the build's version and its plan (src/web/web-app-build.ts):
 *   - at install it keeps the app shell (the page, the code, the styles, the manifest, the logo), so the game opens
 *     offline after the first visit;
 *   - the pictures and the intro movie are kept the first time each is shown, and served from the device afterwards;
 *     the movie is played from the network until a whole copy is kept, then in ranges from that copy;
 *   - its caches carry the build's version, so a new build makes new caches; at activation the pictures the new build
 *     still uses (the same name, so the same picture) move to its cache and every older cache is deleted;
 *   - a new build waits until the player chooses "Reload" on the notice of src/web/web-app.ts (the SKIP_WAITING message);
 *   - the keeper of the page (src/web/keeper.ts, D-249) asks for the art list with the size of each file and the name of
 *     the art cache (the KEEP_PLAN message, answered on its port), fetches what the cache lacks itself (its requests carry
 *     the KEEP_HEADER and are left to the network here), and puts them into the art cache, so everything plays offline.
 */
const BUILD = {"version":"4.1.1-1817931e1b","shell":["assets/counties-10m-Bpk20aew.js","assets/index-Cp90wsF0.js","assets/index-DBsrJAtj.css","assets/map-local-layers-DZ_O_ejp.js","assets/web-app-B5pJAP-i.css","assets/web-app-Bp-ESV8J.js","index.html","manifest.webmanifest","trueharvest-logo.png"],"art":["assets/a220-zbu3rtvB.webp","assets/a321-Dhrr9CFw.webp","assets/academy-B2ltKh8K.webp","assets/aframax_tanker-jjeiOm2r.webp","assets/agrotourism_fields-DyIRDIS-.webp","assets/arena-CWAM6orh.webp","assets/atr72-CjezL4E2.webp","assets/b737-BIOukDoJ.webp","assets/b757-CyjHFqdx.webp","assets/b767-BOtsh5tO.webp","assets/bakery-CDcIUfBQ.webp","assets/bank_branch-D4jiLKlJ.webp","assets/bbq_smokehouse-nwXb8464.webp","assets/beef_plant-CSc56CiI.webp","assets/berth_cranes-U69NwnVW.webp","assets/box_diesel-CjUwzY9u.webp","assets/box_electric-BGiVCa9s.webp","assets/breakfast_brunch---5JobzY.webp","assets/brewery-C852IHrj.webp","assets/broiler_farm-CavYDNqO.webp","assets/burger_qsr-Di6h5-92.webp","assets/cabins-BofzONLD.webp","assets/chicken-CTk_dFrY.webp","assets/chp_plant-CURNFQy2.webp","assets/clinic-CufkhNPo.webp","assets/coffee_ice_cream-DXvKZqs0.webp","assets/coffee_roastery-DnlUVCoU.webp","assets/cold_storage-DnhxwmiT.webp","assets/concrete_plant-B-IGPdWY.webp","assets/construction_company-CYNesiwI.webp","assets/crabber_165-CMhVB_NR.webp","assets/crude_tanker-Rt1arfCk.webp","assets/cruise_ship_hotel-C9vVpkW9.webp","assets/csa-CpAr_TNc.webp","assets/dairy-BBrz919Q.webp","assets/desalination-CvxlEaLH.webp","assets/digester-Dl-ee5Bk.webp","assets/distillery-d4UKH-jb.webp","assets/distribution_center-CkImvqwp.webp","assets/dual_purpose_165-B6CWJZ2B.webp","assets/equestrian_center-DHOaG3kx.webp","assets/factory_trawler_300-Dd5_7gak.webp","assets/farm-DJ0W-Qrf.webp","assets/fast_casual_grill-Bf7BjqGl.webp","assets/feed_mill-C1S563ZA.webp","assets/feeder_1000-bkahXhE_.webp","assets/feeder_1800-BRzHWyz4.webp","assets/feedlot-B0oVx2MI.webp","assets/fish_plant-CWawis1w.webp","assets/fish_plant_dutch_harbor-BDIh-Onl.webp","assets/fish_plant_shelburne-Db-gdGPF.webp","assets/fish_plant_vacamonte-BRwbpdGX.webp","assets/fish_plant_westport-DLDPLMLP.webp","assets/fishmeal_plant-e4BGZgTd.webp","assets/founder_art--T8_DE4G.webp","assets/founder_cars_classic-BAD7WO6n.webp","assets/founder_cars_super-DBefX_Vm.webp","assets/founder_home_amsterdam-CX3MGOvJ.webp","assets/founder_home_florida-dE84Ia9A.webp","assets/founder_home_mountain-xZz7z9Zm.webp","assets/founder_home_penthouse-BjLkOy23.webp","assets/founder_jet_light-DeP3Ayk8.webp","assets/founder_jet_longrange-CebJsgd7.webp","assets/founder_jet_midsize-Bq7-BuLo.webp","assets/founder_racehorses-CFab63iF.webp","assets/founder_sports_team-Cflsb8TO.webp","assets/founder_trophy_cabinet-j9N7uq37.webp","assets/founder_wine_cellar-BCgEaiqT.webp","assets/founder_yacht_40m-C6StRzhX.webp","assets/founder_yacht_60m-CZTZXlsw.webp","assets/founder_yacht_90m-B4f-Q4jN.webp","assets/fuel_terminal-BC-syzgk.webp","assets/hangar-D2iF-URQ.webp","assets/harbor_agrotourism_fields-tR89qr32.webp","assets/harbor_arena-BbseOMMO.webp","assets/harbor_equestrian_center-Aw-eL8wJ.webp","assets/harbor_farm-CiX65vhq.webp","assets/harbor_rv_park-Dfgb8r2r.webp","assets/harbor_tug-D3WTSiak.webp","assets/harbor_waterpark-LHySkgY7.webp","assets/hog_farm-D-iYmrlB.webp","assets/ice_plant-BrZeB08A.webp","assets/intro-EGqRlaBG.mp4","assets/italian_casual-nZt0nm7C.webp","assets/kansas_hub-rhMPBmO8.webp","assets/lamb_feedlot-CmZAoXkX.webp","assets/lamb_plant-W1BuHnEQ.webp","assets/lm100j-Hu16Jmmv.webp","assets/longliner_165-CDHfarpO.webp","assets/longliner_85-BHdYJ_Os.webp","assets/mediterranean-D9_nUAqV.webp","assets/mixed_compound-DR-n5tfY.webp","assets/mobile_concrete_plant-CZ3rq2Z0.webp","assets/multi_75-C3q6cUrD.webp","assets/multi_75_shelburne-CXf00-3_.webp","assets/multi_75_westport-BsNZ78Sw.webp","assets/own_airport-CBhXW0YF.webp","assets/paita_desert_farm-CcrLJphg.webp","assets/payment_card-VOKk8NUg.webp","assets/pet_food-BWGP2Rpf.webp","assets/pizza_bakery-BQpqQEvj.webp","assets/pork_plant-J9MdSDgB.webp","assets/poultry_plant-DxAV5MA2.webp","assets/procurement_office-wmGePaF6.webp","assets/rail_reefer-DgEUFkNS.webp","assets/rail_terminal-BoIF9hV1.webp","assets/reefer_yard-CLoz_joZ.webp","assets/refinery-BdVQst88.webp","assets/rendering_plant-BZQ3xWxW.webp","assets/rescue_helicopter-Cgqbh5z3.webp","assets/roastery-ZxkcCamS.webp","assets/rv_park-DoqQ63uI.webp","assets/salmon_farm-CWWtzGKr.webp","assets/salmon_ras-CJtNWTI9.webp","assets/scalloper_165-BQ3WkDOF.webp","assets/seafood_casual-Cl1KxFwL.webp","assets/seafood_premium-DwasTGZX.webp","assets/seafood_qsr-IHRpJCFK.webp","assets/seiner_165-poZUJded.webp","assets/semi_diesel-C9BmTXjd.webp","assets/semi_electric-BER-lUCm.webp","assets/shipyard-CIutfX4b.webp","assets/shrimp_farm-NdIG003o.webp","assets/shrimp_ras-B-ynTD5n.webp","assets/site_brownsville-D-GUpx4A.webp","assets/site_colon-DNy67fTL.webp","assets/site_dutch_harbor-CmCN7DGc.webp","assets/site_houston-CK18nxy_.webp","assets/site_kansas-BG6wAodh.webp","assets/site_paita-B1eQy-4f.webp","assets/site_shelburne-BPVHepym.webp","assets/site_vacamonte-B3sxvnK4.webp","assets/site_westport-D_nmdQHA.webp","assets/small_500-Ch4B9gMX.webp","assets/solar_farm-DQYtydvJ.webp","assets/sports_bar-CT-7GFMP.webp","assets/sports_compound-BbkVIHqF.webp","assets/staff_housing-TQ8ruF1f.webp","assets/steakhouse-CPYMnZrY.webp","assets/stock_listing-CWGs0IRA.webp","assets/subcenter-BSNvGNHC.webp","assets/tannery-CGgHNI0P.webp","assets/training_center-BG7TMPZH.webp","assets/trawler_165-xcZmwISZ.webp","assets/upscale_steak-B8Iv8TGp.webp","assets/wastewater-CygCK1I6.webp","assets/water_bottling-2e8imZpd.webp","assets/waterpark-DT4zxrnu.webp","assets/wharf-Zvy6v3Op.webp","assets/winery-r172MQ54.webp"],"artBytes":{"assets/a220-zbu3rtvB.webp":96060,"assets/a321-Dhrr9CFw.webp":103036,"assets/academy-B2ltKh8K.webp":247732,"assets/aframax_tanker-jjeiOm2r.webp":104028,"assets/agrotourism_fields-DyIRDIS-.webp":274096,"assets/arena-CWAM6orh.webp":198538,"assets/atr72-CjezL4E2.webp":109148,"assets/b737-BIOukDoJ.webp":114088,"assets/b757-CyjHFqdx.webp":112558,"assets/b767-BOtsh5tO.webp":75664,"assets/bakery-CDcIUfBQ.webp":146460,"assets/bank_branch-D4jiLKlJ.webp":106040,"assets/bbq_smokehouse-nwXb8464.webp":136794,"assets/beef_plant-CSc56CiI.webp":158038,"assets/berth_cranes-U69NwnVW.webp":184534,"assets/box_diesel-CjUwzY9u.webp":100070,"assets/box_electric-BGiVCa9s.webp":90074,"assets/breakfast_brunch---5JobzY.webp":145082,"assets/brewery-C852IHrj.webp":245668,"assets/broiler_farm-CavYDNqO.webp":116630,"assets/burger_qsr-Di6h5-92.webp":115930,"assets/cabins-BofzONLD.webp":187722,"assets/chicken-CTk_dFrY.webp":142362,"assets/chp_plant-CURNFQy2.webp":158094,"assets/clinic-CufkhNPo.webp":142890,"assets/coffee_ice_cream-DXvKZqs0.webp":119950,"assets/coffee_roastery-DnlUVCoU.webp":106426,"assets/cold_storage-DnhxwmiT.webp":170550,"assets/concrete_plant-B-IGPdWY.webp":204256,"assets/construction_company-CYNesiwI.webp":160330,"assets/crabber_165-CMhVB_NR.webp":176762,"assets/crude_tanker-Rt1arfCk.webp":146754,"assets/cruise_ship_hotel-C9vVpkW9.webp":144242,"assets/csa-CpAr_TNc.webp":142910,"assets/dairy-BBrz919Q.webp":172316,"assets/desalination-CvxlEaLH.webp":155452,"assets/digester-Dl-ee5Bk.webp":232226,"assets/distillery-d4UKH-jb.webp":237660,"assets/distribution_center-CkImvqwp.webp":167480,"assets/dual_purpose_165-B6CWJZ2B.webp":133442,"assets/equestrian_center-DHOaG3kx.webp":240716,"assets/factory_trawler_300-Dd5_7gak.webp":115112,"assets/farm-DJ0W-Qrf.webp":244252,"assets/fast_casual_grill-Bf7BjqGl.webp":137648,"assets/feed_mill-C1S563ZA.webp":179552,"assets/feeder_1000-bkahXhE_.webp":81464,"assets/feeder_1800-BRzHWyz4.webp":95600,"assets/feedlot-B0oVx2MI.webp":157024,"assets/fish_plant-CWawis1w.webp":170780,"assets/fish_plant_dutch_harbor-BDIh-Onl.webp":178680,"assets/fish_plant_shelburne-Db-gdGPF.webp":153532,"assets/fish_plant_vacamonte-BRwbpdGX.webp":149302,"assets/fish_plant_westport-DLDPLMLP.webp":159768,"assets/fishmeal_plant-e4BGZgTd.webp":193172,"assets/founder_art--T8_DE4G.webp":63436,"assets/founder_cars_classic-BAD7WO6n.webp":168828,"assets/founder_cars_super-DBefX_Vm.webp":109354,"assets/founder_home_amsterdam-CX3MGOvJ.webp":128782,"assets/founder_home_florida-dE84Ia9A.webp":188926,"assets/founder_home_mountain-xZz7z9Zm.webp":156398,"assets/founder_home_penthouse-BjLkOy23.webp":67816,"assets/founder_jet_light-DeP3Ayk8.webp":64456,"assets/founder_jet_longrange-CebJsgd7.webp":93942,"assets/founder_jet_midsize-Bq7-BuLo.webp":84714,"assets/founder_racehorses-CFab63iF.webp":166606,"assets/founder_sports_team-Cflsb8TO.webp":141440,"assets/founder_trophy_cabinet-j9N7uq37.webp":100556,"assets/founder_wine_cellar-BCgEaiqT.webp":130798,"assets/founder_yacht_40m-C6StRzhX.webp":129360,"assets/founder_yacht_60m-CZTZXlsw.webp":115712,"assets/founder_yacht_90m-B4f-Q4jN.webp":91424,"assets/fuel_terminal-BC-syzgk.webp":162766,"assets/hangar-D2iF-URQ.webp":126444,"assets/harbor_agrotourism_fields-tR89qr32.webp":189994,"assets/harbor_arena-BbseOMMO.webp":167416,"assets/harbor_equestrian_center-Aw-eL8wJ.webp":160830,"assets/harbor_farm-CiX65vhq.webp":177510,"assets/harbor_rv_park-Dfgb8r2r.webp":218318,"assets/harbor_tug-D3WTSiak.webp":131794,"assets/harbor_waterpark-LHySkgY7.webp":191248,"assets/hog_farm-D-iYmrlB.webp":151666,"assets/ice_plant-BrZeB08A.webp":162314,"assets/intro-EGqRlaBG.mp4":43662093,"assets/italian_casual-nZt0nm7C.webp":177094,"assets/kansas_hub-rhMPBmO8.webp":168410,"assets/lamb_feedlot-CmZAoXkX.webp":203652,"assets/lamb_plant-W1BuHnEQ.webp":176800,"assets/lm100j-Hu16Jmmv.webp":164574,"assets/longliner_165-CDHfarpO.webp":148738,"assets/longliner_85-BHdYJ_Os.webp":186348,"assets/mediterranean-D9_nUAqV.webp":148440,"assets/mixed_compound-DR-n5tfY.webp":249594,"assets/mobile_concrete_plant-CZ3rq2Z0.webp":143372,"assets/multi_75-C3q6cUrD.webp":133534,"assets/multi_75_shelburne-CXf00-3_.webp":124880,"assets/multi_75_westport-BsNZ78Sw.webp":127926,"assets/own_airport-CBhXW0YF.webp":142878,"assets/paita_desert_farm-CcrLJphg.webp":188620,"assets/payment_card-VOKk8NUg.webp":60176,"assets/pet_food-BWGP2Rpf.webp":197682,"assets/pizza_bakery-BQpqQEvj.webp":127408,"assets/pork_plant-J9MdSDgB.webp":139546,"assets/poultry_plant-DxAV5MA2.webp":122510,"assets/procurement_office-wmGePaF6.webp":170264,"assets/rail_reefer-DgEUFkNS.webp":127222,"assets/rail_terminal-BoIF9hV1.webp":192836,"assets/reefer_yard-CLoz_joZ.webp":179168,"assets/refinery-BdVQst88.webp":181754,"assets/rendering_plant-BZQ3xWxW.webp":173198,"assets/rescue_helicopter-Cgqbh5z3.webp":226114,"assets/roastery-ZxkcCamS.webp":156244,"assets/rv_park-DoqQ63uI.webp":245670,"assets/salmon_farm-CWWtzGKr.webp":147982,"assets/salmon_ras-CJtNWTI9.webp":239270,"assets/scalloper_165-BQ3WkDOF.webp":187130,"assets/seafood_casual-Cl1KxFwL.webp":135072,"assets/seafood_premium-DwasTGZX.webp":157738,"assets/seafood_qsr-IHRpJCFK.webp":97128,"assets/seiner_165-poZUJded.webp":104306,"assets/semi_diesel-C9BmTXjd.webp":86526,"assets/semi_electric-BER-lUCm.webp":94122,"assets/shipyard-CIutfX4b.webp":208366,"assets/shrimp_farm-NdIG003o.webp":179868,"assets/shrimp_ras-B-ynTD5n.webp":225882,"assets/site_brownsville-D-GUpx4A.webp":308222,"assets/site_colon-DNy67fTL.webp":272632,"assets/site_dutch_harbor-CmCN7DGc.webp":260148,"assets/site_houston-CK18nxy_.webp":308678,"assets/site_kansas-BG6wAodh.webp":399874,"assets/site_paita-B1eQy-4f.webp":293860,"assets/site_shelburne-BPVHepym.webp":362000,"assets/site_vacamonte-B3sxvnK4.webp":301010,"assets/site_westport-D_nmdQHA.webp":340038,"assets/small_500-Ch4B9gMX.webp":122284,"assets/solar_farm-DQYtydvJ.webp":169954,"assets/sports_bar-CT-7GFMP.webp":158656,"assets/sports_compound-BbkVIHqF.webp":253194,"assets/staff_housing-TQ8ruF1f.webp":231428,"assets/steakhouse-CPYMnZrY.webp":93926,"assets/stock_listing-CWGs0IRA.webp":122654,"assets/subcenter-BSNvGNHC.webp":127008,"assets/tannery-CGgHNI0P.webp":220452,"assets/training_center-BG7TMPZH.webp":185630,"assets/trawler_165-xcZmwISZ.webp":171848,"assets/upscale_steak-B8Iv8TGp.webp":139538,"assets/wastewater-CygCK1I6.webp":242480,"assets/water_bottling-2e8imZpd.webp":206906,"assets/waterpark-DT4zxrnu.webp":211170,"assets/wharf-Zvy6v3Op.webp":178202,"assets/winery-r172MQ54.webp":270396}};

const PREFIX = 'trueharvest-';
const SHELL_CACHE = `${PREFIX}shell-${BUILD.version}`;
const ART_CACHE = `${PREFIX}art-${BUILD.version}`;
const at = (path) => new URL(path, self.location.href).href;
const SHELL = new Set(BUILD.shell.map(at));
const ART = new Set(BUILD.art.map(at));
const INDEX = at('index.html');
/** Files whose names carry their content's hash may come from the browser's own cache; the others are asked fresh. */
const HASHED = /\/assets\//;
/** The keeper's requests (src/web/keep-offline.ts KEEP_HEADER and KEEP_PLAN). */
const KEEP_HEADER = 'X-TrueHarvest-Keep';
const KEEP_PLAN = 'KEEP_PLAN';
const ART_BYTES = BUILD.artBytes || {};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) =>
      cache.addAll(BUILD.shell.map((p) => new Request(at(p), { cache: HASHED.test(at(p)) ? 'default' : 'no-cache' }))),
    ),
  );
});

self.addEventListener('message', (event) => {
  const type = event.data && event.data.type;
  if (type === 'SKIP_WAITING') self.skipWaiting();
  else if (type === KEEP_PLAN && event.ports && event.ports[0]) {
    event.ports[0].postMessage({
      type: KEEP_PLAN,
      cache: ART_CACHE,
      files: BUILD.art.map((p) => ({ url: at(p), bytes: ART_BYTES[p] || 0 })),
    });
  }
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
  // the keeper fetches the file itself and puts it into the art cache
  if (req.headers.has(KEEP_HEADER)) return;
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
