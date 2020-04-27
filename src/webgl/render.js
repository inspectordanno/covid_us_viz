const render = (
  sides,
  program,
  positionAttributeLocation,
  resolutionUniformLocation,
  translationUniformLocation,
  colorUniformLocation
) => {
  //sets canvas width and height to current size of canvas as specified in css
  webglUtils.resizeCanvasToDisplaySize(gl.canvas);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);

  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation);

  // Bind the position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 2; // 2 components per stop
  var type = gl.FLOAT; // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0; // start at the beginning of the buffer
  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );

  // set the resolution
  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

  //set the translation
  gl.uniform2fv(translationUniformLocation, translation);

  //set the color
  gl.uniform4fv(colorUniformLocation, color);

  // draw
  var primitiveType = gl.TRIANGLE_FAN;
  var offset = 0;
  const count = sides + 1; //adding one for center of circle
  gl.drawArrays(primitiveType, offset, count);
};

export default render;
