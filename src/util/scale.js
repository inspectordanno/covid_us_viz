import { schemeRdBu } from 'd3-scale-chromatic';
import { scaleThreshold } from 'd3-scale';

//domain and range for threshold scale

//domains for each measure, for each municipality
const domain = {
  'totalCases': [1, 10, 100, 1000, 10000, 100000],
  'totalDeaths': [1, 10, 100, 500, 1000, 5000],
  'newCases': [1, 10, 100, 500, 1000, 5000],
  'newDeaths': [1, 5, 10, 50, 100, 500],
  'percentChange': [-500, -100, -50, -25, 0, 25, 50, 100, 500] //percentages, ex. 1%, 5%, 10%
}

//number of colors in range must always be one more than number of values in domain
const range = {
  'number': [ //schemeTurbo
    "#23171b",
    "#3987f9",
    "#2ee5ae",
    "#95fb51",
    "#feb927",
    "#e54813",
    "#900c00"
  ],
  'percent': schemeRdBu[domain.percentChange.length + 1]
}

const scale = (measure) => {
  const domainType = measure.includes('percent') ? 'percent' : 'number';

  return scaleThreshold()
    .domain(domain[measure])
    .range(range[domainType])
}

export default scale;