const { aggregateGoogleFontsInfo } = require("./googleFonts");
const { aggregateJsBundlesInfo } = require("./jsBundles");
const { aggregateJsImpactInfo } = require("./jsImpact");
const { aggregateDataDuplicationInfo } = require("./dataDuplication");
const { aggregateImagesInfo } = require("./images");

const { aggregateNumericProperty } = require("./utils");

module.exports = function analyzeAggregate(sites) {
  return {
    // General info
    sitesAnalyzed: sites.length,
    // Lighthouse scoring
    perfScoreV5: aggregateNumericProperty({
      property: "scoresV5.perfScore",
      sites,
      // log: true,
      // includeValues: true
    }),
    perfScoreV6: aggregateNumericProperty({
      property: "scoresV6.perfScore",
      sites,
      // log: true,
      // includeValues: true
    }),
    googleFonts: aggregateGoogleFontsInfo(sites),
    jsBundles: aggregateJsBundlesInfo(sites),
    jsImpact: aggregateJsImpactInfo(sites),
    dataDuplication: aggregateDataDuplicationInfo(sites),
    images: aggregateImagesInfo(sites)
  };
};
