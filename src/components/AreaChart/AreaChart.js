import React from "react";
import { AreaClosed, Line, Bar } from "@vx/shape";
import { curveMonotoneX } from "@vx/curve";
import { GridRows, GridColumns } from "@vx/grid";
import { scaleTime, scaleLinear } from "@vx/scale";
import { useTooltip, Tooltip } from "@vx/tooltip";
import { localPoint } from "@vx/event";
import { bisector, max } from "d3-array";
import { timeFormat, timeParse } from "d3-time-format";
import sma from 'sma';

// util
const formatDate = timeFormat("%b %d, '%y");
const parseTime = timeParse('%Y-%m-%d');
const bisectDate = bisector((d) => new Date(d.date)).left;

const AreaChart = ({
  covidData,
  countyFips,
  measure,
  averageWindow,
  width,
  height,
  margin,
  events,
}) => {

  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip();

  const fipsData = covidData.get(countyFips);
  const dates = fipsData.map(d => parseTime(d.date));
  const measureNumbers = fipsData.map(d => d[measure]);
  const measureAverages = sma(measureNumbers, averageWindow);

   // bounds
   const xMax = width - margin.left - margin.right;
   const yMax = height - margin.top - margin.bottom;
 
   // scales
   const xScale = scaleTime({
     range: [0, xMax],
     domain: [plotData[0].date, plotData[plotData.length - 1].date],
   });
 
   const yScale = scaleLinear({
     range: [yMax, 0],
     domain: [0, max(plotData.map(d => d.data)) + yMax / 3],
     nice: true,
   });

    const plotData = measureAverages.map((d, i) => {
      return { date: dates[i], data: +d }
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
      tooltipTop: yScale(d.close),
    });
  };

  if (width < 10) return null;

  return (
    <div>
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
          x={(d) => xScale(d)}
          y={(d) => yScale(d)}
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
            top={tooltipTop - 12}
            left={tooltipLeft + 12}
            style={{
              backgroundColor: "rgba(92, 119, 235, 1.000)",
              color: "white",
            }}
          >
            {`${tooltipData.data} ${measure}`}
          </Tooltip>
          <Tooltip
            top={yMax - 14}
            left={tooltipLeft}
            style={{
              transform: "translateX(-50%)",
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
