const lighthouse = require("lighthouse");
const chromeLauncher = require("chrome-launcher");
const slugify = require("slugify");
const fs = require("fs");

// https://raw.githubusercontent.com/gatsbyjs/gatsby/master/docs/sites.yml
const sites = require("../gatsby-sites-24-04-2020.json");

const RESULTS_BASE_DIR = "../results";
const LIGHTHOUSE_VER = "v6";
const RESULTS_DIR = `${RESULTS_BASE_DIR}/${LIGHTHOUSE_VER}`;

const testOptions = {
  onlyCategories: ["performance", "accessibility"],
};

const chromeFlags = ["--headless"];

async function profileSite(url) {
  const results = await lighthouse(url, testOptions).then(
    (results) => results.lhr
  );
  return results;
}

async function getResults() {
  const chrome = await chromeLauncher.launch({
    chromeFlags,
  });
  testOptions.port = chrome.port;
  console.time(`\n\nTesting all ${sites.length} sites`);
  for (const site of sites) {
    const url = site.main_url || site.url;
    const testFileName = `${RESULTS_DIR}/${slugify(url)
      .replace("http:", "")
      .replace("https:", "")}.json`;

    try {
      const currResult = fs.readFileSync(testFileName, { encoding: "utf-8" });
      // If we already have the test, go to next
      if (currResult && JSON.parse(currResult).lighthouseVersion) {
        continue;
      }
    } catch (error) {
      // console.info(`Couldn't parse file ${testFileName}, will fetch anyway`)
    }

    const index = sites.indexOf(site);
    console.time(`${index + 1}: ${url}`);
    const results = await profileSite(url).catch((error) => {
      console.error(`\nCouldn't profile ${url}`, error, `\n`);
    });
    console.timeEnd(`${index + 1}: ${url}`);

    fs.writeFileSync(testFileName, JSON.stringify(results, null, 2), {
      encoding: "utf-8",
    });
  }
  console.timeEnd(`\n\nTesting all ${sites.length} sites`);
  await chrome.kill();
}

if (!fs.existsSync(RESULTS_BASE_DIR)) {
  fs.mkdirSync(RESULTS_BASE_DIR);
}

if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR);
}

getResults();
