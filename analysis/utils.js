const { jStat } = require("jstat");

// Get function for finding nested property in object
// See https://medium.com/javascript-inside/safely-accessing-deeply-nested-values-in-javascript-99bf72a0855a
const get = (p, o) =>
  p.split('.').reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, o)

exports.aggregateNumericProperty = function({
  property,
  sites,
  // Great for debugging
  includeValues = false
}) {
  if (!property || !sites) {
    return
  }
  const values = sites.map(site => {
    return get(property, site) || undefined
  })
  return {
    mean: jStat.mean(values),
    median: jStat.median(values),
    stdev: jStat.stdev(values),
    min: jStat.min(values),
    max: jStat.max(values),
    values: includeValues && values
  }
}