import React from "react";
import { AreaClosed, Line, Bar } from "@vx/shape";
import { Group } from "@vx/group";
import { curveMonotoneX } from "@vx/curve";
import { GridRows, GridColumns } from "@vx/grid";
import { AxisLeft } from "@vx/axis";
import { scaleTime, scaleLinear, scaleBand } from "@vx/scale";
import { useTooltip, Tooltip } from "@vx/tooltip";
import { localPoint } from "@vx/event";
import { bisector, max } from "d3-array";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import styles from "./areaChart.module.scss";

// util
const formatDate = timeFormat("%b %d, '%y");
const bisectDate = bisector((d) => new Date(d.date)).left;

const measureDict = {
  totalCases: "cumulative cases",
  totalDeaths: "cumulative deaths",
  newCases: "new cases",
  newDeaths: "new deaths",
};

const titleDict = {
  totalCases: "cases per day, cumulative",
  totalDeaths: "deaths per day, cumulative",
  newCases: "new cases per day",
  newDeaths: "new deaths per day",
};

const AreaChart = ({ plotData, measure, level, name, }) => {
  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip();

  const width = 600;
  const height = 400;
  const margin = { left: 60, right: 0, top: 10, bottom: 0 };

  // bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  // responsive utils for axis ticks
  const numTicksForHeight = (height) => {
    if (height <= 300) return 3;
    if (300 < height && height <= 600) return 5;
    return 10;
  };

  // scales
  const xScaleCurve = scaleTime({
    range: [0, xMax],
    domain: [plotData[0].date, plotData[plotData.length - 1].date],
  });

  const xScaleBar = scaleBand({
    range: [0, xMax],
    domain: plotData.map((d) => d.date),
    padding: 0.2,
  });

  const barWidth = xScaleBar.bandwidth();

  const yScale = scaleLinear({
    range: [yMax, 0],
    domain: [0, max(plotData.map((d) => d.rawNumber))],
    nice: true
  });

  const handleTooltip = (event) => {
    const { x } = localPoint(event.target.ownerSVGElement, event);
    const x0 = xScaleCurve.invert(x - margin.left);
    const index = bisectDate(plotData, x0, 1);
    const d0 = plotData[index - 1];
    const d1 = plotData[index];
    let d = d0;
    if (d1 && d1.date) {
      d = x0 - d0.date < d1.date - x0 ? d0 : d1;
    }

    showTooltip({
      tooltipData: d,
      tooltipLeft: xScaleBar(d.date) + barWidth * 0.5,
      tooltipTop: yScale(d.rawNumber),
    });
  };

  if (width < 10) return null;

  const tooltipPadding = { left: 10, top: 0 };

  tooltipPadding.top = height - tooltipTop < 30 ? 40 : 10;

  return (
    <div>
      <div>{`${name}, ${titleDict[measure]}`}</div>
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
        <Group left={margin.left} top={margin.top}>
          <GridRows
            lineStyle={{ pointerEvents: "none" }}
            scale={yScale}
            width={xMax}
            strokeDasharray="2,2"
            stroke="rgba(255,255,255,0.3)"
          />
          <GridColumns
            lineStyle={{ pointerEvents: "none" }}
            scale={xScaleCurve}
            height={yMax}
            strokeDasharray="2,2"
            stroke="rgba(255,255,255,0.3)"
          />
          <AxisLeft
            top={0}
            left={0}
            hideZero
            scale={yScale}
            numTicks={numTicksForHeight(height)}
            label={titleDict[measure]}
            labelProps={{
              fill: "#8e205f",
              textAnchor: "middle",
              fontSize: 12,
              fontFamily: "sans-serif",
            }}
            stroke="#1b1a1e"
            tickStroke="#8e205f"
            tickLabelProps={(value, index) => ({
              fill: "#8e205f",
              textAnchor: "end",
              fontSize: 10,
              fontFamily: "sans-serif",
              dx: "-0.25em",
              dy: "0.25em",
            })}
            tickFormat={(num) => format(".1s")(num)}
            tickComponent={({ formattedValue, ...tickProps }) => (
              <text {...tickProps}>{formattedValue}</text>
            )}
          />
          <Group>
            {plotData.map((d) => {
              const barWidth = xScaleBar.bandwidth();
              const barHeight = yMax - yScale(d.rawNumber);
              const barX = xScaleBar(d.date);
              const barY = yMax - barHeight;

              return (
                <Bar
                  key={`bar-${formatDate(d.date)}`}
                  id={`bar-${formatDate(d.date)}`}
                  x={barX}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  fill="green"
                />
              );
            })}
            <AreaClosed
              data={plotData}
              x={(d) => xScaleCurve(d.date)}
              y={(d) => yScale(d.average)}
              yScale={yScale}
              strokeWidth={1}
              stroke={"url(#gradient)"}
              fill={"url(#gradient)"}
              curve={curveMonotoneX}
            />
          </Group>
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
                from={{ x: tooltipLeft, y: height }}
                to={{ x: tooltipLeft, y: tooltipTop }}
                stroke="rgba(92, 119, 235, 1.000)"
                strokeWidth={barWidth}
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
        </Group>
      </svg>
      {tooltipOpen && (
        <div>
          <Tooltip
            top={tooltipTop - height - tooltipPadding.top}
            left={tooltipLeft + tooltipPadding.left}
            className={styles.tooltip}
            style={{
              backgroundColor: "rgba(92, 119, 235, 1.000)",
              color: "white",
              width: "100px",
            }}
          >
            <div style={{ fontWeight: 600 }}>
              {format(",d")(tooltipData.rawNumber)}
            </div>
            <div>
              {tooltipData.rawNumber !== 1
                ? measureDict[measure]
                : measureDict[measure].slice(0, -1)}
            </div>
          </Tooltip>
          <Tooltip
            top={yMax - height * 1.1}
            left={tooltipLeft}
            className={styles.tooltip}
            style={{
              backgroundColor: "white",
              transform: "translateX(-50%)",
              width: "85px",
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
