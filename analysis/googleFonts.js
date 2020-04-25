exports.aggregateGoogleFontsInfo = function (sites) {
  const haveFontFiles = sites.filter(
    (s) => s.analysis.googleFonts.fontFiles.length > 0
  );
  const haveStylesheets = sites.filter(
    (s) => s.analysis.googleFonts.stylesheets.length > 0
  );

  // We can't rely on transfer size as the browser might fetch the font from cache, in which case transferSize = 0
  // We'll use resourceSize instead
  const totalFontResourceSize = haveFontFiles.map((s) =>
    s.analysis.googleFonts.fontFiles.reduce(
      (total, { resourceSize }) => total + resourceSize,
      0
    )
  );

  return {
    haveStylesheet: haveStylesheets.length,
    haveFontFiles: haveFontFiles.length,
    highestFontResourceSize: Math.max(...totalFontResourceSize),
    smallestFontResourceSize: Math.min(...totalFontResourceSize),
  };
};

exports.getGoogleFontsInfo = function (requests) {
  // First, let's check for Google Fonts stylesheets
  // eg. https://fonts.googleapis.com/css?family=Roboto
  const stylesheets = requests
    .filter(({ url }) => url && url.includes("https://fonts.googleapis.com"))
    .map(({ url, transferSize, resourceSize }) => ({
      url,
      transferSize,
      resourceSize,
    }));
  // Then actual font files
  // eg. https://fonts.gstatic.com/s/roboto/v20/...
  const fontFiles = requests
    .filter(({ url }) => url && url.includes("https://fonts.gstatic.com"))
    .map(({ url, transferSize, resourceSize }) => ({
      url,
      transferSize,
      resourceSize,
    }));
  return {
    stylesheets,
    fontFiles,
  };
};
