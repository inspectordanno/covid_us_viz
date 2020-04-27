const init = (gl, sides, radius, vertex, fragment) => {
  // Get A WebGL context
  const gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  // Use our boilerplate utils to compile the shaders and link into a program
  const program = webglUtils.createProgramFromSources(gl, [vertex, fragment]);

  // look up where the vertex data needs to go.
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  // look up uniform locations
  const resolutionUniformLocation = gl.getUniformLocation(program,"u_resolution");
  const translationUniformLocation = gl.getUniformLocation(program, "u_translation");
  const colorUniformLocation = gl.getUniformLocation(program, "u_color");

  // Create a buffer to put three 2d clip space points in
  const positionBuffer = gl.createBuffer();

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const positions = [];

  for (i = 0; i <= sides; i++){
    positions.push(radius * Math.cos(i * 2 * Math.PI/stops)); // x coord
    positions.push(radius * Math.sin(i * 2 * Math.PI/stops)); // y coord
  }

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  return {
    program,
    attributes: {
      position: positionAttributeLocation
    },
    uniforms: {
      resolution: resolutionUniformLocation,
      translation: translationUniformLocation,
      color: colorUniformLocation
    }
  };
}

export default init;