//localities with no fips code but are included in data

const fipsExceptions = {
  nyc: 'nyc', //new york city
  kc: 'kc', //kansas city, mi
  pr: 'pr', //puerto rico,
  guam: 'guam', //guam
  vi: 'vi', //virgin islands
  nmi: 'nmi' //northern mariana islandsoi
}

module.exports = fipsExceptions;