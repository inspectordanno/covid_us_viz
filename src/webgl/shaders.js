//shaders
const glsl = (x) => x;

export const vertex = glsl`
  attribute vec2 a_position;

  uniform vec2 u_resolution;
  uniform vec2 u_translation;

  void main() {

    //add in the translation
    vec2 position = a_position + u_translation;

    // convert the circle points from pixels to 0.0 to 1.0
    vec2 zeroToOne = position / u_resolution;

    // convert from 0->1 to 0->2
    vec2 zeroToTwo = zeroToOne * 2.0;

    // convert from 0->2 to -1->+1 (clipspace)
    vec2 clipSpace = zeroToTwo - 1.0;

    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
  }
`;

export const fragment = glsl`
  // fragment shaders don't have a default precision so we need
  // to pick one. mediump is a good default. It means "medium precision"
  precision mediump float;

  uniform vec4 u_color;
 
  // gl_FragColor is a special variable in a fragment shader
  void main() {
    gl_FragColor = u_color;
  }
`;