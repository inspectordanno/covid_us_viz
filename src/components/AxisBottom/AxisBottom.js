import React from "react";
import { scaleTime } from '@vx/scale';
import { AxisBottom as Axis } from '@vx/axis';
import { timeFormat } from "d3-time-format";

import styles from './AxisBottom.module.scss';

import colors from '../../util/colors';

const AxisBottom = ({ dates, width, margin }) => {
  const xMax = width - margin.left - margin.right;
  const height = 30;

  const scale = scaleTime({
    range: [0, xMax],
    domain: [dates[0], dates[dates.length - 1]],
  })

  return (
    <svg width={width} height={height} className={styles.AxisBottom}>
      <Axis 
        top={0}
        left={margin.left}
        styles={{ paddingRight: margin.left }}
        scale={scale}
        stroke={colors.darkblue}
        strokeWidth={2.5}
        numTicks={8}
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


