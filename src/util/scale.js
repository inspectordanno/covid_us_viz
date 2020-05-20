import { schemeRdBu, interpolateRdBu } from "d3-scale-chromatic";
import { scaleThreshold, scaleQuantize, scaleLinear, scaleSequential } from "d3-scale";

//percentages, ex. 1%, 5%, 10%
const percentChangeDomain = [-200, 200];

//domain and range for threshold scale

//domains for each measure, for each municipality
const domain = {
  totalCases: [1, 10, 100, 1000, 10000, 100000],
  totalDeaths: [1, 10, 100, 500, 1000, 5000],
  newCases: [1, 10, 100, 500, 1000, 5000],
  newDeaths: [1, 5, 10, 50, 100, 500],
  percentChangeCases: percentChangeDomain,
  percentChangeDeaths: percentChangeDomain, //percentages, ex. 1%, 5%, 10%
};

//number of colors in range must always be one more than number of values in domain
const range = {
  number: [
    //schemeTurbo
    "#23171b",
    "#3987f9",
    "#2ee5ae",
    "#95fb51",
    "#feb927",
    "#e54813",
    "#900c00",
  ],
  percent: ["blue", "red"]
};

const scale = (measure) => {
  const domainType = measure.includes("percent") ? "percent" : "number";

  if (domainType === "number") {
    return scaleThreshold().domain(domain[measure]).range(range[domainType]);
  } else {
    return scaleLinear().domain(domain[measure]).range(range[domainType]);
  }
};

export default scale;
