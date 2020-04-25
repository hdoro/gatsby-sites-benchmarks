const { aggregateNumericProperty } = require("./utils");

exports.aggregateJsBundlesInfo = function (sites) {
  function aggregate(key) {
    return {
      resourceSize: aggregateNumericProperty({
        property: `analysis.jsBundles.${key}.resourceSize`,
        sites,
      }),
      transferSize: aggregateNumericProperty({
        property: `analysis.jsBundles.${key}.transferSize`,
        sites,
      }),
      count: aggregateNumericProperty({
        property: `analysis.jsBundles.${key}.count`,
        sites,
      }),
    };
  }
  return {
    total: aggregate("total"),
    local: aggregate("local"),
    thirdParty: {
      ...aggregate("thirdParty"),
      originCount: aggregateNumericProperty({
        property: `analysis.jsBundles.thirdParty.originCount`,
        sites,
      }),
    },
  };
};

// Goes through all files and return a single value
function calculateSize(files, isResource) {
  return files.reduce(
    (total, req) => total + (isResource ? req.resourceSize : req.transferSize),
    0
  );
}

exports.getJsBundlesInfo = function ({ requests, requestedUrl }) {
  const allJsFiles = requests
    .filter(
      (req) =>
        req.mimeType === "application/javascript" ||
        req.resourceType === "Script"
    )
    .map(({ url, transferSize, resourceSize }) => ({
      url,
      transferSize,
      resourceSize,
      // If not from the requested URL, we'll treat it as third party
      isThirdParty: !url.includes(requestedUrl),
    }));

  const localFiles = allJsFiles.filter((req) => !req.isThirdParty);
  const thirdPartyFiles = allJsFiles.filter((req) => !req.isThirdParty);
  const thirdPartyOrigins = thirdPartyFiles.reduce((origins, { url }) => {
    const origin = new URL(url).origin;
    if (origins.indexOf(origin) >= 0) {
      return origins;
    }
    return [...origins, origin];
  }, []);

  return {
    total: {
      resourceSize: calculateSize(allJsFiles, true),
      transferSize: calculateSize(allJsFiles, false),
      count: allJsFiles.length,
    },
    local: {
      resourceSize: calculateSize(localFiles, true),
      transferSize: calculateSize(localFiles, false),
      count: localFiles.length,
    },
    thirdParty: {
      resourceSize: calculateSize(thirdPartyFiles, true),
      transferSize: calculateSize(thirdPartyFiles, false),
      count: thirdPartyFiles.length,
      originCount: thirdPartyOrigins.length,
    },
  };
};
