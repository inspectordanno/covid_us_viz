import regl from "regl";

const pointWidth = 2;

//start draw loop
regl.frame(() => {
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
  });
});

const drawPoints = regl({
  frag,
  vert,

  attributes: {
    // each of these gets mapped to a single entry for each of
    // the points. this means the vertex shader will receive
    // just the relevant value for a given point.
    positionStart: points.map((d) => [d.startX, d.startY]),
    positionEnd: points.map(d => [d.endX, d.endY]),
    color: points.map((d) => d.color),
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

export default drawPoints;
