const { aggregateNumericProperty } = require('./utils')

exports.aggregateDataDuplicationInfo = function(sites) {
  return {
    indexPageData: {
      transferSize: aggregateNumericProperty({
        property: 'analysis.dataDuplication.indexPageData.transferSize',
        sites
      }),
      resourceSize: aggregateNumericProperty({
        property: 'analysis.dataDuplication.indexPageData.resourceSize',
        sites
      }),
    },
    indexHtml: {
      transferSize: aggregateNumericProperty({
        property: 'analysis.dataDuplication.indexHtml.transferSize',
        sites
      }),
      resourceSize: aggregateNumericProperty({
        property: 'analysis.dataDuplication.indexHtml.resourceSize',
        sites
      }),
    },
  };
}

exports.getDataDuplicationInfo = function({ requests, finalUrl }) {
  // `https://dispel.io/` has a weird test result that doesn't load `page-data.json` for the homepage, and hence shows as if `indexPageData.transferSize = 0`. Removed from the analysis
  if (finalUrl === "https://dispel.io/") {
    return {}
  }
  
  // In Gatsby v2, as far as I know, this is where the homepage's data is stored
  const indexPageDataUrl = finalUrl + "page-data/index/page-data.json";
  // Find the index page data and get its transferSize
  const indexData = requests.find(({ url }) => url === indexPageDataUrl)
    ;
  // Find the homepage's HTML and get its transfer and resourceSize
  const indexHtmlReq = requests.find(({ url }) => url === finalUrl);
  return {
    indexPageData: {
      transferSize: indexData && indexData.transferSize,
      resourceSize: indexData && indexData.resourceSize,
    },
    indexHtml: {
      transferSize: indexHtmlReq && indexHtmlReq.transferSize,
      resourceSize: indexHtmlReq && indexHtmlReq.resourceSize,
    },
  };
};
