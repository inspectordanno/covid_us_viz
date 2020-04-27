import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as d3 from "d3";
import { Random } from "random-js";
// import shuffle from "lodash/shuffle";

import { dispatchDateIndex } from "../actions/actions";
import albersProjection from "../util/albersProjection";

const DataPoints = ({ countyData, dateIndex, setDateIndex, width, height }) => {
  const canvasRef = useRef();
  const [prevPoints, setPrevPoints] = useState([]);
  const random = new Random();

  useEffect(() => {
      const todayData = countyData[dateIndex][1];
      const canvas = d3.select(canvasRef.current);
      const context = canvas.node().getContext("2d");
      const customBase = document.createElement("custom");
      const custom = d3.select(customBase);

      const calculateStartPoints = () => {
        const x = random.integer(0, width);
        const y = random.integer(0, height);
        return [x, y];
      }

      const calculateNewData = (measure) => {
        const newData = [];

        todayData.forEach((d) => {
          //repeat for every new case/death
          let timesToRepeat = d[measure];

          const totalMeasure =
            measure === "newCases" ? "totalCases" : "totalDeaths";

          while (timesToRepeat) {
            newData.push({
              date: d.date,
              fips: d.fips,
              coordinates: d.coordinates,
              nthPoint: d[totalMeasure] - timesToRepeat + 1,
              startPoints: calculateStartPoints()
            });
            timesToRepeat -= 1;
          }
        });

        return newData;
      };

      const todayNewData = calculateNewData("newCases"); //choose 'newCases' or 'newDeaths'
      console.log(prevPoints.length);
      console.log(todayNewData.length);
      const cumData = [...prevPoints, ...todayNewData];

      const projection = albersProjection(width, height);

      const duration = 500;

      const dataBind = (data) => {
        custom
          .selectAll(".covid_point")
          .data(data, (d, i) => `${d.date} ${i}`) //key is date plus index in the array
          .join("circle")
          .attr("class", "covid_point")
          .attr("x", d => d.startPoints[0])
          .attr("y", d => d.startPoints[1])
          .attr('opacity', '0')
          .transition()
          .duration(duration)
          .attr("opacity", "1")
          .transition()
          .duration(duration)
          .transition()
          .attr("opacity", 0)
          .end()
          .then(() => {
            setPrevPoints(cumData);
            if (dateIndex < countyData.length) {
              setDateIndex(dateIndex + 1);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      };

      const draw = () => {
        //clear canvas
        context.clearRect(0, 0, width, height);

        custom.selectAll(".covid_point").each(function () {
          const node = d3.select(this);
          const cx = node.attr("x");
          const cy = node.attr("y");
          const opacity = node.attr("opacity");
          const r = 2;

          //drawing a circle
          //context.arc(x-center, y-center, radius, startAngle, endAngle, counterclockwise)
          context.fillStyle = "black";
          context.beginPath();
          context.arc(cx, cy, r, 0, 2 * Math.PI, true);
          context.globalAlpha = opacity;
          context.fill();
          context.closePath();
        });
      };

      //bind data
      dataBind(cumData);

      //constantly repeating draw function
      const t = d3.timer(draw);

      //cleanup function that stops timer on every rerender
      return () => t.stop();

  }, [dateIndex]);

  return (
    <canvas
      className="DataPoints"
      width={width}
      height={height}
      ref={canvasRef}
    />
  );
};

export default DataPoints;
