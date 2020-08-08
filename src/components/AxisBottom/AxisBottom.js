import React from "react";
import { scaleTime } from '@vx/scale';
import { AxisBottom as Axis } from '@vx/axis';
import { timeFormat } from "d3-time-format";

import styles from './AxisBottom.module.scss';

import colors from '../../util/colors';

const AxisBottom = ({ dates, width, margin, screenWidth }) => {
  const xMax = width - margin.left - margin.right;
  const height = 30;

  const scale = scaleTime({
    range: [0, xMax],
    domain: [dates[0], dates[dates.length - 1]],
  })

  //responsive number of ticks
  const getNumTicks = () => {
    if (screenWidth <= 1000) return 6;
    return 8;
  }

  console.log(getNumTicks())

  return (
    <svg width={width} height={height} className={styles.axisBottom}>
      <Axis 
        top={0}
        left={margin.left}
        styles={{ paddingRight: margin.left }}
        scale={scale}
        stroke={colors.darkblue}
        strokeWidth={2.5}
        numTicks={getNumTicks()}
        tickStroke={colors.darkblue}
        tickLabelProps={() => ({
          fill: colors.darkblue,
          textAnchor: "middle",
          fontSize: 12,
          fontFamily: "sans-serif",
          fontWeight: 600,
          dx: "-0.25em",
          dy: "0.25em",
        })}
        tickFormat={(num) => timeFormat('%b %d')(num)}
      />
    </svg>
  )
}

export default AxisBottom;


