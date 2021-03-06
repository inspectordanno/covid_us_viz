//shaders
const glsl = (x) => x;

export const frag = glsl`
  //set the precision
  precision mediump float;

  // gl_FragColor is a special variable that holds the color
  // of a pixel
  void main() {
    gl_FragColor = vec4(0, 0, 0, 1);
  }
`;

export const vert = glsl`
  // per vertex attributes
  attribute vec2 positionStart;
  attribute vec2 positionEnd;

  // values that are the same for all vertices
  uniform float pointWidth;
  uniform float stageWidth;
  uniform float stageHeight;
  uniform float elapsed;
  uniform float duration;

  // helper function to transform from pixel space to normalized
  // device coordinates (NDC). In NDC (0,0) is the middle,
  // (-1, 1) is the top left and (1, -1) is the bottom right.
  vec2 normalizeCoords(vec2 position) {
    // read in the positions into x and y vars
    float x = position[0];
    float y = position[1];

    return vec2(
      2.0 * ((x / stageWidth) - 0.5),
      // invert y to treat [0,0] as bottom left in pixel space
      -(2.0 * ((y / stageHeight) - 0.5))
    );
  }
  // helper function to handle cubic easing (copied from d3)
  // note there are premade ease functions available via glslify.
  float easeCubicInOut(float t) {
    t *= 2.0;
    t = (t <= 1.0 ? t * t * t : (t -= 2.0) * t * t + 2.0) / 2.0;

    if (t > 1.0) {
      t = 1.0;
    }

    return t;
  }

  void main() {
    // update the size of a point based on the prop pointWidth
    gl_PointSize = pointWidth;

    // number between 0 and 1 indicating how far through the
    // animation this vertex is.
    float t;

    // drawing without animation, so show end state immediately
    if (duration == 0.0) {
      t = 1.0;

    // otherwise we are animating, so use cubic easing
    } else {
      t = easeCubicInOut(elapsed / duration);
    }

    // interpolate position
    vec2 position = mix(positionStart, positionEnd, t);

    // scale to normalized device coordinates
    // gl_Position is a special variable that holds the
    // position of a vertex
    gl_Position = vec4(normalizeCoords(position), 0.0, 1.0);
  }
`;
