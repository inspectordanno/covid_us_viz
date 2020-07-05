import React, { Fragment, useRef } from "react";
import { AreaClosed, Line, Bar } from "@vx/shape";
import { Group } from "@vx/group";
import { curveMonotoneX } from "@vx/curve";
import { Grid } from "@vx/grid";
import { AxisLeft } from "@vx/axis";
import { scaleTime, scaleLinear, scaleBand } from "@vx/scale";
import { useTooltip, Tooltip } from "@vx/tooltip";
import { localPoint } from "@vx/event";
import { bisector, max } from "d3-array";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import styles from "./AreaChart.module.scss";

import colors from "../../util/colors";
import usePrevious from "../../hooks/usePrevious";

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

const AreaChart = ({ plotData, measure, name, width, height, margin }) => {
  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip();

  const pathRef = useRef();
  const previousPath = usePrevious(pathRef.current);

  // if (pathRef) {
  //   console.log(pathRef.current.getAttribute('d'));
  //   console.log(previousPath.getAttribute('d'));
  // }

  // bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

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

  const tooltipPadding = { left: 10, top: 0 };

  tooltipPadding.top = height - tooltipTop < 30 ? 40 : 10;

  const measureTooltipWidth = 100;
  const dateTooltipWidth = 85;

  const yScale = scaleLinear({
    range: [yMax, 0],
    domain: [0, max(plotData.map((d) => d.rawNumber))],
    nice: true,
  });

  const handleTooltip = (event) => {
    if (window.innerWidth > 768) {
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
    }
  };

  return (
    <div className={styles.chartContainer}>
      <div className={styles.title}>
        <span className={styles.municipality}>{name}</span>
        {`, ${titleDict[measure]}`}
      </div>
      <svg width={width} height={height} className={styles.AreaChart}>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={colors.lightblue}
          rx={14}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity={1} />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0.2} />
          </linearGradient>
        </defs>
        <Group left={margin.left} top={margin.top}>
          <Grid
            lineStyle={{ pointerEvents: "none" }}
            xScale={xScaleCurve}
            yScale={yScale}
            width={xMax}
            height={yMax}
            strokeDasharray="2,2"
            stroke={colors.darkblue}
            opacity={0.25}
          />
          <AxisLeft
            top={0}
            left={0}
            hideZero
            scale={yScale}
            numTicks={5}
            label={titleDict[measure]}
            labelProps={{
              fill: colors.darkblue,
              textAnchor: "middle",
              fontSize: 12,
              fontFamily: "sans-serif",
              fontWeight: 500,
            }}
            stroke={colors.darkblue}
            tickStroke={colors.darkblue}
            tickLabelProps={(value, index) => ({
              fill: colors.darkblue,
              textAnchor: "end",
              fontSize: 10,
              fontFamily: "sans-serif",
              fontWeight: 600,
              dx: "-0.25em",
              dy: "0.25em",
            })}
            tickFormat={(num) => format(".1s")(num)}
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
                  fill={colors.darkblue}
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
              innerRef={pathRef}
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
                fill={colors.darkblue}
                stroke="white"
                strokeWidth={2}
                style={{ pointerEvents: "none" }}
              />
            </g>
          )}
        </Group>
      </svg>
      {tooltipOpen && (
        <Fragment>
          <Tooltip
            top={tooltipTop - height - tooltipPadding.top}
            left={tooltipLeft + tooltipPadding.left + measureTooltipWidth * 0.6}
            className={styles.tooltip}
            style={{
              backgroundColor: colors.darkblue,
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
            top={yMax - height * 1.2}
            left={tooltipLeft + tooltipPadding.left + dateTooltipWidth * 0.5}
            className={styles.tooltip}
            style={{
              backgroundColor: "white",
              transform: "translateX(-50%)",
              width: dateTooltipWidth + "px",
              color: colors.darkblue,
            }}
          >
            {formatDate(tooltipData.date)}
          </Tooltip>
        </Fragment>
      )}
    </div>
  );
};

export default AreaChart;
