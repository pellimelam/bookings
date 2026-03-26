const fs = require("fs");

/* ensure folder exists */
if (!fs.existsSync("./sitemaps")) {
  fs.mkdirSync("./sitemaps");
}

const files = [
"./geo_dataset_1.json",
"./geo_dataset_2.json",
"./geo_dataset_3.json",
"./geo_dataset_4.json"
];

let urls = [];

/* 🔥 BUILD URLS */
for (const file of files) {

  const data = JSON.parse(fs.readFileSync(file, "utf-8"));

  for (const stateKey in data) {
    const state = data[stateKey];

    urls.push(`https://booking.vidhwaan.com/#/geo/${stateKey}/`);

    for (const districtKey in state.districts) {
      const district = state.districts[districtKey];

      urls.push(`https://booking.vidhwaan.com/#/geo/${stateKey}/${districtKey}/`);

      for (const subKey in district.subdistricts) {
        const sub = district.subdistricts[subKey];

        urls.push(`https://booking.vidhwaan.com/#/geo/${stateKey}/${districtKey}/${subKey}/`);

        sub.villages.forEach(v => {
          urls.push(`https://booking.vidhwaan.com/#/geo/${stateKey}/${districtKey}/${subKey}/${v.slug}/`);
        });

      }
    }
  }
}

console.log("Total URLs:", urls.length);

/* 🔥 SPLIT */
const chunkSize = 50000;
let sitemapFiles = [];

for (let i = 0; i < urls.length; i += chunkSize) {

  const chunk = urls.slice(i, i + chunkSize);
  const index = Math.floor(i / chunkSize) + 1;

  const filename = `sitemap-${index}.xml`;
  const filepath = `./sitemaps/${filename}`;

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  chunk.forEach(u => {
    xml += `<url><loc>${u}</loc></url>\n`;
  });

  xml += `</urlset>`;

  fs.writeFileSync(filepath, xml);

  sitemapFiles.push(filename);

  console.log("Generated:", filename);
}

/* 🔥 INDEX FILE (ROOT) */
let indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
indexXml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

sitemapFiles.forEach(file => {
  indexXml += `<sitemap><loc>https://booking.vidhwaan.com/sitemaps/${file}</loc></sitemap>\n`;
});

indexXml += `</sitemapindex>`;

fs.writeFileSync("./sitemap.xml", indexXml);

console.log("✅ Sitemap index generated");
