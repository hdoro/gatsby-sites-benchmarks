const { aggregateNumericProperty } = require("./utils");

exports.aggregateJsImpactInfo = function (sites) {
  function aggregate(key) {
    return {
      score: aggregateNumericProperty({
        property: `analysis.jsImpact.${key}.score`,
        sites,
      }),
      numericValue: aggregateNumericProperty({
        property: `analysis.jsImpact.${key}.numericValue`,
        sites,
      }),
    };
  }
  return {
    totalBlockingTime: aggregate('totalBlockingTime'),
    maxPotentialFid: aggregate('maxPotentialFid'),
    firstCpuIdle: aggregate('firstCpuIdle'),
    timeToInteractive: aggregate('timeToInteractive'),
  };
};

exports.getJsImpactInfo = function ({ audits }) {
  const totalBlockingTime = audits["total-blocking-time"];
  const maxPotentialFid = audits["max-potential-fid"];
  const firstCpuIdle = audits["first-cpu-idle"];
  const timeToInteractive = audits["interactive"];
  return {
    totalBlockingTime: {
      score: totalBlockingTime.score,
      numericValue: totalBlockingTime.numericValue,
    },
    maxPotentialFid: {
      score: maxPotentialFid.score,
      numericValue: maxPotentialFid.numericValue,
    },
    firstCpuIdle: {
      score: firstCpuIdle.score,
      numericValue: firstCpuIdle.numericValue,
    },
    timeToInteractive: {
      score: timeToInteractive.score,
      numericValue: timeToInteractive.numericValue,
    },
  };
};
