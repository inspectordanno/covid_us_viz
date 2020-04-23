import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as d3 from "d3";
// import shuffle from "lodash/shuffle";

import { dispatchDateIndex } from '../actions/actions';
import albersProjection from "../util/albersProjection";

const DataPoints = ({ countyData, bbox, width, height }) => {
  const canvasRef = useRef();
  const dispatch = useDispatch();
  const [startPositions, setStartPositions] = useState();
  const [dateIndex, setDateIndex] = useState(0);
  const [frequencyTracker, setFrequencyTracker] = useState({});

  const pointRadius = 2;
  const duration = 500;
  const delay = 5;

  //creating [x, y] position of every single point in the "sky"
  //aka the starting positions for the datapoints
  const populateStartPositions = (bbox) => {
    const startPosArr = [];
    //center of circles [x, y] are (2 * radius) away from each other
    //Thus, each loop iteration increase is 2r

    //calculates x position of every point
    //first point is +radius away from the left, last point is -radius away from the right
    for (
      let x = bbox.left + pointRadius;
      x < bbox.right - pointRadius;
      x += pointRadius * 2
    ) {
      //calculates y position of every point
      //first point is +radius away from the top, last point is -radius away from the bottom
      for (
        let y = bbox.top + pointRadius;
        y < bbox.bottom - pointRadius;
        y += pointRadius * 2
      ) {
        startPosArr.push([x, y]);
      }
    }
    setStartPositions(startPosArr);
  };

  const joinStartPositions = (currentDayData, startPositions) => {
    //shuffles the start positions array and assigns a start position for every covid datapoint

    // startPositions = shuffle(startPositions); //uncomment for random start positions

    return currentDayData.map((d, i) => {
      //we use the modulus to get which start position should be associated with the covid datapoint
      //if there are less covid points than start points, i is returned
      //if there are more more covid points than start points, it is as if we are "looping" through the
      //covid points, and each succession of the loop is associated with the start point again
      //startPosIndex = x % y
      //where x is the index of the covid point array (i), and y is the length of the start point array (shuffledStartPositions.length)
      //first go around 1 % 6 === 1
      //second go around 7 % 6 === 1
      //third go around 13 % 6 === 1
      const startPosIndex = i % startPositions.length;

      return {
        ...d,
        startX: startPositions[startPosIndex][0],
        startY: startPositions[startPosIndex][1],
      };
    });
  };

  //populates startPositions
  useEffect(() => {
    if (bbox) {
      populateStartPositions(bbox);
    }
  }, [bbox]);

  useEffect(() => {
    if (canvasRef.current && startPositions) {
      const currentDayData = countyData[dateIndex][1];
      const canvas = d3.select(canvasRef.current);
      const context = canvas.node().getContext("2d");
      const customBase = document.createElement("custom");
      const custom = d3.select(customBase);

      const calculateNewData = (measure) => {
        const newData = [];

        currentDayData.forEach((d) => {
          //repeat for every new case/death
          let timesToRepeat = d[measure];

          const totalMeasure = measure === 'newCases' ? 'totalCases' : 'totalDeaths';

          while (timesToRepeat) {
            newData.push({
              date: d.date,
              fips: d.fips,
              coordinates: d.coordinates,
              nthPoint: d[totalMeasure] - timesToRepeat + 1,
            });
            timesToRepeat -= 1;
          }
        });

        return newData;
      };

      const todayNewData = calculateNewData("newCases"); //choose 'newCases' or 'newDeaths'
      const todayNewStartPos = joinStartPositions(todayNewData, startPositions);

      const projection = albersProjection(width, height);

      const tempTracker = { ...frequencyTracker };

      const dataBind = (data) => {
        custom
          .selectAll(".covid_point")
          .data(data, (d, i) => `${d.date} ${i}`) //key is date plus index in the array
          .join("circle")
          .attr("class", "covid_point")
          .attr("x", d => d.startX)
          .attr("y", d => d.startY)
          .attr('opacity', '1')
          .transition()
          .duration(duration)
          .delay((d, i) => i * delay)
          .attr("x", d => projection(d.coordinates)[0])
          .attr("y", d => projection(d.coordinates)[1])
          .transition()
          .attr('opacity', 0)
          .on('end', (d) => {
            // const powerTen = [1, 10, 100, 1000, 10000, 100000];
            // powerTen.forEach(power => {
            //   if (d.nthPoint === power) {
            //     tempTracker[d.fips] = power;
            //   }
            // });
            tempTracker[d.fips] = d.nthPoint;
          })
          .end()
          .then(() => {
            //if today isn't the last day, set the next day to be tomorrow
            if (dateIndex !== countyData.length - 1) {
              dispatch(dispatchDateIndex(dateIndex + 1));
              setFrequencyTracker(tempTracker);
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
          const opacity = node.attr('opacity');
          const r = pointRadius;

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

      //if no new data for today, and today isn't the last day, wait a second and then increase day
      //otherwise, dayIndex is increased with transition().end
      if (todayNewData.length === 0 && dateIndex !== countyData.length - 1) {
        d3.timeout(() => {
          dispatch(dispatchDateIndex(dateIndex + 1));
          setDateIndex(dateIndex + 1);
        }, duration);
      } else {
        //bind data
        dataBind(todayNewStartPos);

        //constantly repeating draw function
        const t = d3.timer(draw);

        //comment this out to stop animation
        // if (dateIndex > 0) {
        //   t.stop();
        // }

        //cleanup function that stops timer on every rerender
        return () => t.stop();
      }
    }
  }, [canvasRef.current, startPositions, dateIndex]);

  useEffect(() => {
    console.log(frequencyTracker);
  }, [frequencyTracker])

  return startPositions && width && height ? (
    <canvas
      className="DataPoints"
      width={width}
      height={height}
      ref={canvasRef}
    />
  ) : null;
};

export default DataPoints;
