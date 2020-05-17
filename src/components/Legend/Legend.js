import React from "react";
import { format } from "d3-format";
import { scaleThreshold } from '@vx/scale';
import { LegendThreshold, LegendItem, LegendLabel } from "@vx/legend";

import styles from "../Header/header.module.scss";
import { schemeTurbo } from "../../util/colors";

const Legend = () => {

  const thresholdScale = scaleThreshold({
    
  });

  const formatLabel = (text) => {
    const words = text.split(' ');

    //if first word is number (not less/more, subtract 1 from last number to complete threshold)
    if (+words[0]) {
      words[2] = words[2] - 1;
    } 

    const formatted = words.map(word => {
      //if number format, if not a number, do nothing
      if (+word) {
        return format(",d")(word);
      } else {
        return word;
      }
    })

    const joined = formatted.join(' ');

    if (joined === 'Less than 1') {
      return '0';
    } else {
      return joined;
    }
  }

  return (
    <div className={styles.legend}>
      <div>Title</div>
      <LegendThreshold 
        scale={thresholdScale}
        >
        {(labels) => {
          return labels.map((label, i) => {
            const size = 15;
            return (
              <LegendItem key={`legend-quantile-${i}`} margin="1px 0">
                <svg width={size} height={size}>
                  <rect fill={label.value} width={size} height={size} />
                </svg>
                <LegendLabel align={"left"} margin={"2px 0 0 10px"}>
                  {formatLabel(label.text)}
                </LegendLabel>
              </LegendItem>
            );
          });
        }}
      </LegendThreshold>
    </div>
  );
};

export default Legend;