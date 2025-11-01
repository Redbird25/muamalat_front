const fs = require("fs");
const filePath = "./package.json"

const package_json = JSON.parse(fs.readFileSync(filePath).toString());
package_json.build_date = new Date().getTime();


fs.writeFileSync(filePath, JSON.stringify(package_json, null, 2));

const jsonData = {
  build_date: package_json.build_date,
  latest_version: package_json.version
}

const jsonContent = JSON.stringify(jsonData);
fs.writeFileSync("./public/meta.json", jsonContent, "utf-8", function (error) {
  if (error) {
    console.log("An error occured while saving build date and time to meta.json")
    return console.log(error)
  }
  
  console.log("Latest build date and time updated in meta.json file")
});