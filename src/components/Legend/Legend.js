import React from 'react';
import { format } from 'd3-format';
import { scaleThreshold } from '@vx/scale';
import { LegendThreshold, LegendItem, LegendLabel } from '@vx/legend';


import styles from '../Header/header.module.scss';

const Legend = () => {

  return (
    <div className={styles.legend}>
      <LegendThreshold scale={thresholdScale}>
          {labels => {
            return labels.reverse().map((label, i) => {
              const size = 15;
              return (
                <LegendItem
                  key={`legend-quantile-${i}`}
                  margin="1px 0"
                >
                  <svg width={size} height={size}>
                    <rect fill={label.value} width={size} height={size} />
                  </svg>
                  <LegendLabel align={'left'} margin={'2px 0 0 10px'}>
                    {label.text}
                  </LegendLabel>
                </LegendItem>
              );
            });
          }}
        </LegendThreshold>
    </div>
  )
}

export default Legend;