const math = require("mathjs");

// Get function for finding nested property in object
// See https://medium.com/javascript-inside/safely-accessing-deeply-nested-values-in-javascript-99bf72a0855a
const get = (property, obj) =>
  property
    .split(".")
    .reduce(
      (currValue, key) =>
        currValue && currValue[key] !== null && currValue[key] !== undefined
          ? currValue[key]
          : null,
      obj
    );

exports.aggregateNumericProperty = function ({
  property,
  sites,
  // For debugging
  log = false,
  includeValues = false,
}) {
  if (!property || !sites) {
    return;
  }
  const values = sites
    .map((site) => get(property, site))
    .filter((v) => v !== null && v !== undefined);

  const aggregated = {
    mean: math.mean(values),
    median: math.median(values),
    std: math.std(values),
    min: math.min(values),
    max: math.max(values),
    values: includeValues ? values : undefined,
  };
  if (log) {
    console.log({ length: values.length, ...aggregated, values: "" });
  }
  return aggregated;
};
