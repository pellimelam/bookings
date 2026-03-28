const fs = require("fs");

/* INPUT FILES (ROOT) */
const files = [
  "./geo_dataset_1.json",
  "./geo_dataset_2.json",
  "./geo_dataset_3.json",
  "./geo_dataset_4.json"
];

let merged = {};

/* 1. MERGE ALL FILES */
for (const file of files) {
  if (!fs.existsSync(file)) {
    console.log("❌ Missing:", file);
    continue;
  }

  const data = JSON.parse(fs.readFileSync(file, "utf-8"));
  Object.assign(merged, data);
}

console.log("✅ TOTAL STATES:", Object.keys(merged).length);

/* 2. CREATE /geo FOLDER */
if (!fs.existsSync("./geo")) {
  fs.mkdirSync("./geo");
}

/* 3. CREATE STATES FILE */
let states = {};

for (const stateKey in merged) {
  states[stateKey] = {
    name: merged[stateKey].name
  };
}

fs.writeFileSync(
  "./geo/states.v1.json",
  JSON.stringify(states)
);

console.log("✅ states.v1.json created");

/* 4. CREATE STATE FILES */
for (const stateKey in merged) {

  const stateData = merged[stateKey];

  const output = {
    name: stateData.name,
    districts: stateData.districts
  };

  fs.writeFileSync(
    `./geo/${stateKey}.v1.json`,
    JSON.stringify(output)
  );

  console.log("✅ created:", stateKey);
}

console.log("🚀 GEO SPLIT COMPLETE");
