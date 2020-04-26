const { aggregateNumericProperty } = require("./utils");

exports.aggregateImagesInfo = function (sites) {
  function aggregate(key) {
    return {
      score: aggregateNumericProperty({
        property: `analysis.images.${key}.score`,
        sites,
      }),
      numericValue: aggregateNumericProperty({
        property: `analysis.images.${key}.numericValue`,
        sites,
      }),
    };
  }
  return {
    offscreenImages: aggregate('offscreenImages'),
    responsiveImages: aggregate('responsiveImages'),
  };
};

exports.getImagesInfo = function ({ audits }) {
  const offscreenImages = audits["offscreen-images"];
  const responsiveImages = audits["uses-responsive-images"];
  return {
    offscreenImages: {
      score: offscreenImages.score,
      numericValue: offscreenImages.numericValue,
    },
    responsiveImages: {
      score: responsiveImages.score,
      numericValue: responsiveImages.numericValue,
    },
  };
};
