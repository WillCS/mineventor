export let WebGLHelper = {
  setupCanvas(canvas: HTMLCanvasElement): WebGLRenderingContext {
    let gl: WebGLRenderingContext | null = canvas.getContext('webgl', { stencil: true });

    if (gl) {
      return gl;
    } else {
      throw new Error('WebGL is not supported in this browser.');
    }
  },

  compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
    let shader: WebGLShader | null = gl.createShader(type);

    if (!shader) {
      throw new Error('An unexpected error occurred during shader creation.');
    }

    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      return shader;
    } else {
      console.log(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      throw new Error('Shader failed to compile.');
    }
  },

  createShaderProgram(gl: WebGLRenderingContext, vertex: WebGLShader, fragment: WebGLShader): WebGLProgram {
    let program: WebGLProgram | null = gl.createProgram();

    if (!program) {
      throw new Error('An unexpected error occurred during shader program creation.');
    }

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);

    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
      return program;
    } else {
      console.log(gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      throw new Error('Program failed to link.');
    }
  },

  buildShaderProgram(gl: WebGLRenderingContext, vertexShaderSource: string, fragmentShaderSource: string): WebGLProgram {
    let vertexShader: WebGLShader | undefined = undefined;
    let fragmentShader: WebGLShader | undefined = undefined;

    try {
      vertexShader =
        this.compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
      fragmentShader =
        this.compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    } catch (error) {
      throw new Error('Shaders failed to compile.');
    }

    try {
      return this.createShaderProgram(gl, vertexShader, fragmentShader);
    } catch (error) {
      throw new Error('Shaders compiled but failed to link.');
    }
  },

  resizeCanvasToProperSize(canvas: HTMLCanvasElement): void {
    let pixelRatio: number = window.devicePixelRatio;

    canvas.width = Math.floor(canvas.clientWidth * pixelRatio);
    canvas.height = Math.floor(canvas.clientHeight * pixelRatio);
  }
}
