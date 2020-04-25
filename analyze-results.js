// See analysis-reasoning.md
const fs = require("fs");
const slugify = require("slugify");
const sitesList = require("./gatsby-sites-24-04-2020.json");

// Used to prevent non-gatsby sites accidentally included in the results folder don't get included in the list
const listFilenames = sitesList.map((site) => {
  return `${slugify(site.main_url || site.url)
    .replace("http:", "")
    .replace("https:", "")}.json`;
});

const { getGoogleFontsInfo } = require("./analysis/googleFonts");
const { getDataDuplicationInfo } = require("./analysis/dataDuplication");
const { getJsBundlesInfo } = require("./analysis/jsBundles");
const analyzeAggregate = require("./analysis/aggregate");

function analyzeResult(result) {
  if (
    !result ||
    !result.audits ||
    !result.audits["network-requests"] ||
    !result.audits["network-requests"].details
  ) {
    return;
  }
  const requests = result.audits["network-requests"].details.items;
  const { requestedUrl } = result;

  const googleFonts = getGoogleFontsInfo(requests);

  const dataDuplication = getDataDuplicationInfo({ requests, requestedUrl });

  const jsBundles = getJsBundlesInfo({ requests, requestedUrl });

  return {
    googleFonts,
    dataDuplication,
    jsBundles,
  };
}

function extractLighthouseScores(result) {
  if (!result || !result.categories || !result.categories.performance) {
    return;
  }
  return {
    perfScore: result.categories.performance.score,
  };
}

function analyzeWebsite(fileName) {
  try {
    const v5Result = JSON.parse(fs.readFileSync("./results/v5/" + fileName));
    const analysis = analyzeResult(v5Result);
    const scoresV5 = extractLighthouseScores(v5Result);
    const scoresV6 = extractLighthouseScores(
      JSON.parse(fs.readFileSync("./results/v6/" + fileName))
    );
    // We don't want to nest v5 info in "site.v5", as that includes most of t
    return {
      requestedUrl: v5Result.requestedUrl,
      analysis,
      scoresV5,
      scoresV6,
    };
  } catch (error) {
    console.error(
      `${fileName} couldn't be analysed, maybe its results don't exist in one lighthouse version?`
    );
    console.error(error);
  }
}

function analyzeAllSites() {
  const fileNames = fs.readdirSync("./results/v5");
  return (
    fileNames
      // Prevent non-gatsby sites from being included in the list
      .filter((fileName) => listFilenames.indexOf(fileName) >= 0)
      .map(analyzeWebsite)
  );
}

function analyzeResults() {
  const individualSites = analyzeAllSites().filter(
    (s) => s && s.analysis && s.scoresV5 && s.scoresV6
  );
  const aggregate = analyzeAggregate(individualSites);

  fs.writeFileSync(
    "./results/analysis.json",
    JSON.stringify(
      {
        aggregate,
        individualSites,
      },
      null,
      2
    ),
    { encoding: "utf-8" }
  );
}

if (!fs.existsSync("results/v5")) {
  throw "No results for v5 available, shutting down";
} else if (!fs.existsSync("results/v6")) {
  throw "No results for v6 available, shutting down";
}

analyzeResults();
