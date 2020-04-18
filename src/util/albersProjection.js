import { geoAlbersUsa } from 'd3';

const albersProjection = (width, height) => {
  return geoAlbersUsa()
    .translate([width * .5, height * .55])
    .scale(width * 1.25);
}

export default albersProjection;