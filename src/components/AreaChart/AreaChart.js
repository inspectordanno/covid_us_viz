import React from "react";
import { AreaClosed, Line, Bar } from "@vx/shape";
import { curveMonotoneX } from "@vx/curve";
import { GridRows, GridColumns } from "@vx/grid";
import { scaleTime, scaleLinear } from "@vx/scale";
import { useTooltip, Tooltip } from "@vx/tooltip";
import { localPoint } from "@vx/event";
import { bisector, max } from "d3-array";
import { format } from "d3-format"
import { timeFormat } from "d3-time-format";

import styles from './areaChart.module.scss';

// util
const formatDate = timeFormat("%b %d, '%y");
const bisectDate = bisector((d) => new Date(d.date)).left;

const measureDict = {
  'totalCases': 'cumulative cases',
  'totalDeaths': 'cumulative deaths',
  'newCases': 'new cases',
  'newDeaths': 'new deaths'
};

const titleDict = {
  'totalCases': 'cases per day, cumulative',
  'totalDeaths': 'deaths per day, cumulative',
  'newCases': 'new cases per day',
  'newDeaths': 'new deaths per day'
}

const AreaChart = ({
  plotData,
  measure,
  level,
  name,
  width,
  height,
  margin,
}) => {

  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip();

   // bounds
   const xMax = width - margin.left - margin.right;
   const yMax = height - margin.top - margin.bottom;
 
   // scales
   const xScale = scaleTime({
     range: [0, xMax],
     domain: [plotData[0].date, plotData[plotData.length - 1].date],
   });
 
   const yScale = scaleLinear({
     range: [yMax, yMax * .05],
     domain: [0, max(plotData.map(d => d.data))]
   });

  const handleTooltip = (event) => {
    const { x } = localPoint(event.target.ownerSVGElement, event);
    const x0 = xScale.invert(x);
    const index = bisectDate(plotData, x0, 1);
    const d0 = plotData[index - 1];
    const d1 = plotData[index];
    let d = d0;
    if (d1 && d1.date) {
      d = x0 - d0.date < d1.date - x0 ? d0 : d1;
    }
  
    showTooltip({
      tooltipData: d,
      tooltipLeft: x,
      tooltipTop: yScale(d.data),
    });
  };

  if (width < 10) return null;

  return (
    <div>
      <div>
        {`${name}, ${titleDict[measure]}`}
      </div>
      <svg width={width} height={height}>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="#32deaa"
          rx={14}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity={1} />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0.2} />
          </linearGradient>
        </defs>
        <GridRows
          lineStyle={{ pointerEvents: "none" }}
          scale={yScale}
          width={xMax}
          strokeDasharray="2,2"
          stroke="rgba(255,255,255,0.3)"
        />
        <GridColumns
          lineStyle={{ pointerEvents: "none" }}
          scale={xScale}
          height={yMax}
          strokeDasharray="2,2"
          stroke="rgba(255,255,255,0.3)"
        />
        <AreaClosed
          data={plotData}
          x={(d) => xScale(d.date)}
          y={(d) => yScale(d.data)}
          yScale={yScale}
          strokeWidth={1}
          stroke={"url(#gradient)"}
          fill={"url(#gradient)"}
          curve={curveMonotoneX}
        />
        <Bar
          x={0}
          y={0}
          width={width}
          height={height}
          fill="transparent"
          rx={14}
          data={plotData}
          onTouchStart={handleTooltip}
          onTouchMove={handleTooltip}
          onMouseMove={handleTooltip}
          onMouseLeave={hideTooltip}
        />
        {tooltipOpen && (
          <g>
            <Line
              from={{ x: tooltipLeft, y: 0 }}
              to={{ x: tooltipLeft, y: yMax }}
              stroke="rgba(92, 119, 235, 1.000)"
              strokeWidth={2}
              style={{ pointerEvents: "none" }}
              strokeDasharray="2,2"
            />
            <circle
              cx={tooltipLeft}
              cy={tooltipTop + 1}
              r={4}
              fill="black"
              fillOpacity={0.1}
              stroke="black"
              strokeOpacity={0.1}
              strokeWidth={2}
              style={{ pointerEvents: "none" }}
            />
            <circle
              cx={tooltipLeft}
              cy={tooltipTop}
              r={4}
              fill="rgba(92, 119, 235, 1.000)"
              stroke="white"
              strokeWidth={2}
              style={{ pointerEvents: "none" }}
            />
          </g>
        )}
      </svg>
      {tooltipOpen && (
        <div>
          <Tooltip
            top={tooltipTop - height - 12}
            left={tooltipLeft + 12}
            className={styles.tooltip}
            style={{
              backgroundColor: "rgba(92, 119, 235, 1.000)",
              color: "white",
              width: '100px',
            }}
          >
            <div style={{ fontWeight: 600 }}>
              {format(",d")(tooltipData.data)}
            </div>
            <div>{tooltipData.data !== 1 ? measureDict[measure] : measureDict[measure].slice(0, -1)}</div>
          </Tooltip>
          <Tooltip
            top={yMax - height - 70}
            left={tooltipLeft}
            className={styles.tooltip}
            style={{
              backgroundColor: 'white',
              transform: "translateX(-50%)",
              width: '85px',
            }}  
          >
            {formatDate(tooltipData.date)}
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default AreaChart;
