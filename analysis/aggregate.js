const { aggregateGoogleFontsInfo } = require("./googleFonts");
const { aggregateJsBundlesInfo } = require("./jsBundles");
const { aggregateNumericProperty } = require("./utils");

module.exports = function analyzeAggregate(sites) {
  return {
    // General info
    sitesAnalyzed: sites.length,
    // Lighthouse scoring
    perfScoreV5: aggregateNumericProperty({
      property: "scoresV5.perfScore",
      sites,
      // includeValues: true
    }),
    perfScoreV6: aggregateNumericProperty({
      property: "scoresV6.perfScore",
      sites,
      // includeValues: true
    }),
    googleFonts: aggregateGoogleFontsInfo(sites),
    jsBundles: aggregateJsBundlesInfo(sites),
  };
};
