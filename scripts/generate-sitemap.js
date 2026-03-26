import fs from "fs";

const files = [
"./geo_dataset_1.json",
"./geo_dataset_2.json",
"./geo_dataset_3.json",
"./geo_dataset_4.json"
];

let urls = [];

for (const file of files) {

  const data = JSON.parse(fs.readFileSync(file, "utf-8"));

  for (const stateKey in data) {
    const state = data[stateKey];

    for (const districtKey in state.districts) {
      const district = state.districts[districtKey];

      for (const subKey in district.subdistricts) {
        const sub = district.subdistricts[subKey];

        sub.villages.forEach(v => {

          const url = `https://booking.vidhwaan.com/geo/${stateKey}/${districtKey}/${subKey}/${v.slug}/`;

          urls.push(url);

        });

      }
    }
  }
}

/* GENERATE XML */

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

urls.forEach(u => {
  xml += `<url><loc>${u}</loc></url>\n`;
});

xml += `</urlset>`;

fs.writeFileSync("./sitemap.xml", xml);

console.log("✅ Sitemap generated:", urls.length);
