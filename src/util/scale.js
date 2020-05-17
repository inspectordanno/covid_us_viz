//domain and range for threshold scale

//domains for each measure, for each municipality
export const domain = {
  'totalCases': [1, 10, 100, 1000, 10000, 100000],
  'totalDeaths': [1, 10, 100, 500, 1000, 5000],
  'newCases': [1, 10, 100, 500, 1000, 5000],
  'newDeaths': [1, 5, 10, 50, 100, 500],
  'percentChange': [1, 5, 10, 50, 100, 1000] //percentages, ex. 1%, 5%, 10%
}

//schemeTurbo
export const range = [
  "#23171b",
  "#3987f9",
  "#2ee5ae",
  "#95fb51",
  "#feb927",
  "#e54813",
  "#900c00"
];