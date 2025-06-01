import { useEffect, useMemo, useRef } from 'react';

export interface LogoDotsShaderProps {
  opacities?: number[];
  colors?: number[][];
  totalSize?: number;
  dotSize?: number;
  maxFps?: any;
  svgMask?: string;
}

function createShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string
) {
  let shader = gl.createShader(type);
  if (!shader) {
    return console.error('Failed to create shader');
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Failed to create shader: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createBuffer(gl: WebGL2RenderingContext, arr: any) {
  let buffer = gl.createBuffer();
  let bufferType =
    arr instanceof Uint16Array || arr instanceof Uint32Array
      ? gl.ELEMENT_ARRAY_BUFFER
      : gl.ARRAY_BUFFER;

  gl.bindBuffer(bufferType, buffer);
  gl.bufferData(bufferType, arr, gl.STATIC_DRAW);

  return buffer;
}

function createMaskTexture(
  gl: WebGL2RenderingContext,
  svgString: string,
  width: number,
  height: number
): Promise<WebGLTexture | null> {
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const ctx = tempCanvas.getContext('2d');

  if (!ctx) return Promise.resolve(null);

  const img = new Image();
  const svgContent = svgString.includes('xmlns')
    ? svgString
    : svgString.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');

  const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(svgBlob);

  return new Promise<WebGLTexture | null>(resolve => {
    img.onload = () => {
      // Clear canvas to black (mask transparent)

      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, width, height);

      // Calculate aspect ratio and position to center
      const svgWidth = parseFloat(img.width.toString());
      const svgHeight = parseFloat(img.height.toString());
      const scale = Math.min(width / svgWidth, height / svgHeight);
      const scaledWidth = svgWidth * scale;
      const scaledHeight = svgHeight * scale;
      const offsetX = (width - scaledWidth) / 2;
      const offsetY = (height - scaledHeight) / 2;

      // Draw SVG centered and maintaining aspect ratio
      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
      ctx.restore();

      // Create texture
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        tempCanvas
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      URL.revokeObjectURL(url);
      resolve(texture);
    };

    img.onerror = e => {
      console.error('Error loading SVG:', e);
      URL.revokeObjectURL(url);
      resolve(null);
    };

    img.src = url;
  });
}

const DEFAULT_SHADER_SOURCE = `
float intro_offset = distance(u_resolution / 2.0 / u_total_size, st2) * 0.01 + (random(st2) * 0.15);
opacity *= step(intro_offset, u_time);
opacity *= clamp((1.0 - step(intro_offset + 0.1, u_time)) * 1.25, 1.0, 1.25);
`;

const LogoDotsShader = (props: LogoDotsShaderProps) => {
  const {
    colors = [
      [226, 67, 41],
      [252, 109, 38],
      [252, 163, 38, 1],
    ],
    opacities = [0.4, 0.4, 0.6, 0.6, 0.6, 0.8, 0.8, 0.8, 0.8, 1],
    totalSize = 3,
    dotSize = 1,
    maxFps = 30,
    svgMask,
  } = props;
  const source = DEFAULT_SHADER_SOURCE;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const center = ['x', 'y'];

  // Modified fragment shader to include mask sampling
  const fragmentSource = `#version 300 es
    precision mediump float;

    in vec2 fragCoord;

    uniform float u_time;
    uniform float u_opacities[10];
    uniform vec3 u_colors[6];
    uniform float u_total_size;
    uniform float u_dot_size;
    uniform vec2 u_resolution;
    uniform sampler2D u_mask_texture; // Mask texture
    uniform bool u_use_mask;          // Whether to use mask

    out vec4 fragColor;
    float PHI = 1.61803398874989484820459;
    float random(vec2 xy) {
      return fract(tan(distance(xy * PHI, xy) * 0.5) * xy.x);
    }

    float map(float value, float min1, float max1, float min2, float max2) {
      return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }

    void main() {
      vec2 st = fragCoord.xy;\n
    `
    .concat(
      center.includes('x')
        ? 'st.x -= abs(floor((mod(u_resolution.x, u_total_size) - u_dot_size) * 0.5));'
        : '',
      '\n  '
    )
    .concat(
      center.includes('y')
        ? 'st.y -= abs(floor((mod(u_resolution.y, u_total_size) - u_dot_size) * 0.5));'
        : '',
      '\n\n  float opacity = step(0.0, st.x);\n  opacity *= step(0.0, st.y);\n\n  vec2 st2 = vec2(int(st.x / u_total_size), int(st.y / u_total_size));\n\n  float frequency = 5.0;\n  float show_offset = random(st2);\n  float rand = random(st2 * floor((u_time / frequency) + show_offset + frequency) + 1.0);\n  opacity *= u_opacities[int(rand * 10.0)];\n  opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.x / u_total_size));\n  opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.y / u_total_size));\n\n  vec3 color = u_colors[int(show_offset * 6.0)];\n\n  '
    )
    .concat(
      source,
      '\n\n  if (u_use_mask) {\n    vec2 maskCoord = fragCoord / u_resolution;\n    float maskValue = texture(u_mask_texture, maskCoord).r;\n    opacity *= maskValue;\n  }\n\n  fragColor = vec4(color, opacity);\n  fragColor.rgb *= fragColor.a;\n}\n'
    );

  const uniforms = useMemo(() => {
    let e =
      colors.length === 2
        ? [colors[0], colors[0], colors[0], colors[1], colors[1], colors[1]]
        : colors.length === 3
        ? [colors[0], colors[0], colors[1], colors[1], colors[2], colors[2]]
        : [colors[0], colors[0], colors[0], colors[0], colors[0], colors[0]];

    return {
      u_colors: {
        value: e.map(e => [e[0] / 255, e[1] / 255, e[2] / 255]),
        type: 'uniform3fv',
      },
      u_opacities: {
        value: opacities,
        type: 'uniform1fv',
      },
      u_total_size: {
        value: totalSize,
        type: 'uniform1f',
      },
      u_dot_size: {
        value: dotSize,
        type: 'uniform1f',
      },
      u_use_mask: {
        value: !!svgMask,
        type: 'uniform1i',
      },
    };
  }, [colors, opacities, totalSize, dotSize, svgMask]);

  useEffect(() => {
    const windowDpr = window.devicePixelRatio;
    const canvas = canvasRef.current!;
    const glCanvas = document.createElement('canvas');
    const dpr = Math.max(1, Math.min(windowDpr ?? 1, 2));
    let raf: any;

    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    glCanvas.width = canvas.offsetWidth * dpr;
    glCanvas.height = canvas.offsetHeight * dpr;

    const gl = glCanvas.getContext('webgl2');
    const ctx2d = canvas.getContext('2d');

    if (!gl || !ctx2d) {
      return;
    }

    const vertexShader = createShader(
      gl,
      gl.VERTEX_SHADER,
      `#version 300 es

      precision mediump float;
      
      in vec2 coordinates;
      
      uniform vec2 u_resolution;
      
      out vec2 fragCoord;
      
      void main(void) { 
        gl_Position = vec4(coordinates, 0.0, 1.0);
        fragCoord = (coordinates + 1.0) * 0.5 * u_resolution;
        fragCoord.y = u_resolution.y - fragCoord.y;
      }
      `
    );
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

    if (!vertexShader || !fragmentShader) {
      return;
    }

    const glProgram = gl.createProgram()!;
    gl.attachShader(glProgram, vertexShader);
    gl.attachShader(glProgram, fragmentShader);

    gl.linkProgram(glProgram);

    if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
      throw `Failed to compile WebGL program: \n\n${gl.getProgramInfoLog(
        glProgram
      )}`;
    }
    gl.useProgram(glProgram);

    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const positionsBuffer = createBuffer(gl, positions);

    let coordinatesAttrLocation = gl.getAttribLocation(
      glProgram,
      'coordinates'
    );
    gl.enableVertexAttribArray(coordinatesAttrLocation);
    gl.vertexAttribPointer(coordinatesAttrLocation, 2, gl.FLOAT, false, 0, 0);

    const resolutionAttrLocation = gl.getUniformLocation(
      glProgram,
      'u_resolution'
    );
    const timeAttrLocation = gl.getUniformLocation(glProgram, 'u_time');
    const scrollAttrLocation = gl.getUniformLocation(glProgram, 'u_scroll');
    const maskTextureLocation = gl.getUniformLocation(
      glProgram,
      'u_mask_texture'
    );

    // Set up texture for mask if provided
    let maskTexture: WebGLTexture | null = null;
    if (svgMask) {
      createMaskTexture(gl, svgMask, canvas.width, canvas.height)?.then(
        texture => {
          maskTexture = texture;

          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, maskTexture);
          gl.uniform1i(maskTextureLocation, 0);
        }
      );
    } else {
      // Create a default white texture (no masking)
      maskTexture = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, maskTexture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        1,
        1,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        new Uint8Array([255, 255, 255, 255])
      );
      gl.uniform1i(maskTextureLocation, 0);
    }

    for (let key in uniforms) {
      const uniformLocation = gl.getUniformLocation(glProgram, key);
      //@ts-ignore
      const uniform = uniforms[key];

      switch (uniform.type) {
        case 'uniform1f':
          gl.uniform1f(uniformLocation, uniform.value);
          break;
        case 'uniform3f':
          // @ts-ignore
          gl.uniform3f(uniformLocation, ...uniform.value);
          break;
        case 'uniform1fv':
          gl.uniform1fv(uniformLocation, uniform.value);
          break;
        case 'uniform3fv':
          gl.uniform3fv(uniformLocation, uniform.value.flat());
          break;
        case 'uniform1i':
          gl.uniform1i(uniformLocation, uniform.value ? 1 : 0);
          break;
        default:
          return uniform;
      }
    }

    gl.uniform2f(
      resolutionAttrLocation,
      canvas.width / dpr,
      canvas.height / dpr
    );
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.disable(gl.DEPTH_TEST);

    let lastSecondPassed: number | null = null;
    let timePassed = 0;

    function run(e: number) {
      if (!gl) {
        return;
      }

      let secondsPassed = e / 1e3;

      if (lastSecondPassed === null) {
        lastSecondPassed = secondsPassed;
      }

      if (maxFps !== Infinity) {
        if (e - timePassed < 1000 / maxFps) {
          raf = window.requestAnimationFrame(run);
          return;
        }
        timePassed = e;
      }

      const time = secondsPassed - lastSecondPassed;
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.uniform1f(timeAttrLocation, time);
      gl.uniform1f(scrollAttrLocation, window.scrollY);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      ctx2d!.clearRect(0, 0, canvas.width, canvas.height);
      ctx2d!.drawImage(glCanvas, 0, 0);
      raf = window.requestAnimationFrame(run);
    }

    raf = window.requestAnimationFrame(run);

    const resizeObserver = new window.ResizeObserver(() => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      glCanvas.width = canvas.offsetWidth * dpr;
      glCanvas.height = canvas.offsetHeight * dpr;
      gl.uniform2f(
        resolutionAttrLocation,
        canvas.width / dpr,
        canvas.height / dpr
      );

      // Update mask texture on resize if needed
      if (svgMask && maskTexture) {
        createMaskTexture(gl, svgMask, canvas.width, canvas.height)?.then(
          texture => {
            maskTexture = texture;
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, maskTexture);
          }
        );
      }
    });

    resizeObserver.observe(canvas);

    return () => {
      window.cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      if (gl) {
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        gl.deleteProgram(glProgram);
        gl.deleteBuffer(positionsBuffer);
        if (maskTexture) gl.deleteTexture(maskTexture);
      }
    };
  }, [fragmentSource, uniforms, maxFps, svgMask]);

  return <canvas ref={canvasRef} />;
};

export default LogoDotsShader;
