import REGL from 'regl';
import { useDispatch } from 'react-redux';

import { frag, vert } from '../webgl/shaders';
import { dispatchDateIndex } from '../actions/actions';

//credit:
//https://bl.ocks.org/pbeshai/5309144c8a5faa3dfec5401cc850c7b5
const mainRegl = (gl, dateIndex, points, width, height) => {
  const regl = REGL(gl);

  const pointWidth = 2;
  // duration of the animation ignoring delays
  const duration = 1500; // 1500ms = 1.5s

  const createDrawPoints = (points) => {
    const drawPoints = regl({
      frag,
      vert,
      attributes: {
        // each of these gets mapped to a single entry for each of
        // the points. this means the vertex shader will receive
        // just the relevant value for a given point.
        positionStart: points.map((d) => [d.startX, d.startY]),
        positionEnd: points.map(d => [d.endX, d.endY]),
      },
    
      uniforms: {
        // by using `regl.prop` to pass these in, we can specify
        // them as arguments to our drawPoints function
        pointWidth: regl.prop("pointWidth"),
    
        // regl actually provides these as viewportWidth and
        // viewportHeight but I am using these outside and I want
        // to ensure they are the same numbers, so I am explicitly
        // passing them in.
        stageWidth: regl.prop("stageWidth"),
        stageHeight: regl.prop("stageHeight"),
    
        //time for the animation to run in milliseconds
        duration: regl.prop("duration"),
    
        elapsed: ({ time }, { startTime = 0 }) =>
        (time - startTime) * 1000,
      },
    
      // specify the number of points to draw
      count: points.length,
    
      // specify that each vertex is a point (not part of a mesh)
      primitive: "points", 
    });
    return drawPoints;
  }

  const drawPoints = createDrawPoints(points);

  //start draw loop
  let startTime = null;
  const frameLoop = regl.frame(({ time }) => {
    // keep track of start time so we can get time elapsed
    // this is important since time doesn't reset when starting new animations
    if (startTime === null) {
      startTime = time;
    }

    //clear buffer
    regl.clear({
      //background color (white)
      color: [0, 0, 0, 0],
      depth: 1,
    });
  
    // draw the points using our created regl func
    // note that the arguments are available via `regl.prop`
    drawPoints({
      pointWidth,
      stageWidth: width,
      stageHeight: height,
      duration,
      startTime
    });

    // if we have exceeded the maximum duration, move on to the next animation
    if (time - startTime > duration / 1000) {
      frameLoop.cancel();
      //clear buffer
      regl.clear({
        //background color (white)
        color: [0, 0, 0, 0],
        depth: 1,
      });
    }
  });  
}


export default mainRegl;
