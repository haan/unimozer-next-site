import { useEffect, useMemo, useRef } from "react";

const RUNTIME_ICON_SRC = "/icon_runtime.png";
const FALLBACK_ICON_SRC = "/icon.png";
const RUNTIME_DEPTH_SRC = "/icon_depthmap_runtime.png";

const DISPLACEMENT_STRENGTH = 0.032;
const LERP_FACTOR = 0.08;
const MAX_TILT_DEG = 7;
const MAX_DPR = 2;

const VERTEX_SHADER_SOURCE = `
attribute vec2 aPosition;
attribute vec2 aTexCoord;
varying vec2 vTexCoord;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
  vTexCoord = aTexCoord;
}
`;

const FRAGMENT_SHADER_SOURCE = `
precision mediump float;
uniform sampler2D uColorTexture;
uniform sampler2D uDepthTexture;
uniform vec2 uPointer;
uniform float uStrength;
varying vec2 vTexCoord;
void main() {
  float depth = texture2D(uDepthTexture, vTexCoord).r - 0.5;
  vec2 offset = uPointer * (uStrength * depth);
  vec2 sampleUv = clamp(vTexCoord + offset, 0.0, 1.0);
  gl_FragColor = texture2D(uColorTexture, sampleUv);
}
`;

interface ShaderHandles {
  program: WebGLProgram;
  positionLocation: number;
  texCoordLocation: number;
  pointerLocation: WebGLUniformLocation;
  strengthLocation: WebGLUniformLocation;
}

function shouldAnimateLogo() {
  if (typeof window === "undefined") {
    return false;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return false;
  }

  if (window.matchMedia("(pointer: coarse)").matches) {
    return false;
  }

  if (navigator.maxTouchPoints > 0) {
    return false;
  }

  return true;
}

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) {
    return null;
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(gl: WebGLRenderingContext): ShaderHandles | null {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);

  if (!vertexShader || !fragmentShader) {
    return null;
  }

  const program = gl.createProgram();
  if (!program) {
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return null;
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }

  const positionLocation = gl.getAttribLocation(program, "aPosition");
  const texCoordLocation = gl.getAttribLocation(program, "aTexCoord");
  const pointerLocation = gl.getUniformLocation(program, "uPointer");
  const strengthLocation = gl.getUniformLocation(program, "uStrength");

  if (
    positionLocation < 0 ||
    texCoordLocation < 0 ||
    !pointerLocation ||
    !strengthLocation
  ) {
    gl.deleteProgram(program);
    return null;
  }

  return {
    program,
    positionLocation,
    texCoordLocation,
    pointerLocation,
    strengthLocation,
  };
}

function loadImage(sources: string[]) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    let sourceIndex = 0;

    const tryNextSource = () => {
      if (sourceIndex >= sources.length) {
        reject(new Error(`Failed to load image from sources: ${sources.join(", ")}`));
        return;
      }

      const source = sources[sourceIndex];
      if (!source) {
        reject(new Error("Image source list contained an invalid entry."));
        return;
      }
      sourceIndex += 1;

      const image = new Image();
      image.decoding = "async";
      image.onload = () => resolve(image);
      image.onerror = () => tryNextSource();
      image.src = source;
    };

    tryNextSource();
  });
}

function createTexture(gl: WebGLRenderingContext, image: HTMLImageElement) {
  const texture = gl.createTexture();
  if (!texture) {
    return null;
  }

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.bindTexture(gl.TEXTURE_2D, null);

  return texture;
}

function handleRuntimeImageError(event: React.SyntheticEvent<HTMLImageElement>) {
  const image = event.currentTarget;
  if (image.dataset.fallbackApplied === "true") {
    return;
  }
  image.dataset.fallbackApplied = "true";
  image.src = FALLBACK_ICON_SRC;
}

export function DepthLogo() {
  const shouldAnimate = useMemo(() => shouldAnimateLogo(), []);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!shouldAnimate) {
      return;
    }

    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    const fallback = fallbackRef.current;

    if (!wrapper || !canvas || !fallback) {
      return;
    }

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: true,
    });

    if (!gl) {
      canvas.style.display = "none";
      fallback.style.display = "block";
      return;
    }

    const programHandles = createProgram(gl);
    if (!programHandles) {
      canvas.style.display = "none";
      fallback.style.display = "block";
      return;
    }

    const {
      program,
      positionLocation,
      texCoordLocation,
      pointerLocation,
      strengthLocation,
    } = programHandles;

    const positionBuffer = gl.createBuffer();
    const texCoordBuffer = gl.createBuffer();

    if (!positionBuffer || !texCoordBuffer) {
      canvas.style.display = "none";
      fallback.style.display = "block";
      gl.deleteProgram(program);
      return;
    }

    gl.useProgram(program);

    const positions = new Float32Array([
      -1, -1,
      1, -1,
      -1, 1,
      -1, 1,
      1, -1,
      1, 1,
    ]);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const texCoords = new Float32Array([
      0, 0,
      1, 0,
      0, 1,
      0, 1,
      1, 0,
      1, 1,
    ]);
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    gl.uniform1f(strengthLocation, DISPLACEMENT_STRENGTH);

    const targetPointer = { x: 0, y: 0 };
    const currentPointer = { x: 0, y: 0 };

    let colorTexture = null as WebGLTexture | null;
    let depthTexture = null as WebGLTexture | null;
    let idleResetHandle = 0;
    let animationFrame = 0;
    let loopActive = false;
    let disposed = false;

    const showFallback = (preferOriginalIcon: boolean) => {
      canvas.style.display = "none";
      fallback.style.display = "block";
      if (preferOriginalIcon && fallback.dataset.fallbackApplied !== "true") {
        fallback.dataset.fallbackApplied = "true";
        fallback.src = FALLBACK_ICON_SRC;
      }
    };

    const hideFallback = () => {
      canvas.style.display = "block";
      fallback.style.display = "none";
    };

    const setCanvasSize = () => {
      const bounds = wrapper.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const width = Math.max(1, Math.round(bounds.width * dpr));
      const height = Math.max(1, Math.round(bounds.height * dpr));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    const drawFrame = () => {
      currentPointer.x += (targetPointer.x - currentPointer.x) * LERP_FACTOR;
      currentPointer.y += (targetPointer.y - currentPointer.y) * LERP_FACTOR;

      gl.uniform2f(pointerLocation, currentPointer.x, -currentPointer.y);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      const rotateY = currentPointer.x * MAX_TILT_DEG;
      const rotateX = -currentPointer.y * MAX_TILT_DEG;
      wrapper.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(3)}deg) rotateY(${rotateY.toFixed(3)}deg)`;

      const distance =
        Math.abs(targetPointer.x - currentPointer.x) +
        Math.abs(targetPointer.y - currentPointer.y);
      const settling = Math.abs(currentPointer.x) + Math.abs(currentPointer.y);

      if (distance > 0.0008 || settling > 0.0008) {
        animationFrame = window.requestAnimationFrame(runAnimationLoop);
      } else {
        loopActive = false;
        wrapper.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
      }
    };

    const runAnimationLoop = () => {
      if (disposed) {
        return;
      }
      drawFrame();
    };

    const ensureAnimationLoop = () => {
      if (loopActive) {
        return;
      }
      loopActive = true;
      animationFrame = window.requestAnimationFrame(runAnimationLoop);
    };

    const resetPointerTarget = () => {
      targetPointer.x = 0;
      targetPointer.y = 0;
      ensureAnimationLoop();
    };

    const onPointerMove = (event: PointerEvent) => {
      targetPointer.x = ((event.clientX / window.innerWidth) * 2 - 1) * 0.55;
      targetPointer.y = ((event.clientY / window.innerHeight) * 2 - 1) * 0.55;

      window.clearTimeout(idleResetHandle);
      idleResetHandle = window.setTimeout(() => {
        resetPointerTarget();
      }, 220);

      ensureAnimationLoop();
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        resetPointerTarget();
      } else {
        ensureAnimationLoop();
      }
    };

    const onResize = () => {
      setCanvasSize();
      ensureAnimationLoop();
    };

    let resizeObserver = null as ResizeObserver | null;

    const initialize = async () => {
      try {
        const [colorImage, depthImage] = await Promise.all([
          loadImage([RUNTIME_ICON_SRC, FALLBACK_ICON_SRC]),
          loadImage([RUNTIME_DEPTH_SRC]),
        ]);

        if (disposed) {
          return;
        }

        fallback.src = colorImage.src;

        colorTexture = createTexture(gl, colorImage);
        depthTexture = createTexture(gl, depthImage);

        if (!colorTexture || !depthTexture) {
          showFallback(false);
          return;
        }

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, colorTexture);
        const colorTextureLocation = gl.getUniformLocation(program, "uColorTexture");
        if (!colorTextureLocation) {
          showFallback(false);
          return;
        }
        gl.uniform1i(colorTextureLocation, 0);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, depthTexture);
        const depthTextureLocation = gl.getUniformLocation(program, "uDepthTexture");
        if (!depthTextureLocation) {
          showFallback(false);
          return;
        }
        gl.uniform1i(depthTextureLocation, 1);

        setCanvasSize();
        hideFallback();
        ensureAnimationLoop();

        window.addEventListener("pointermove", onPointerMove, { passive: true });
        window.addEventListener("resize", onResize);
        window.addEventListener("blur", resetPointerTarget);
        document.addEventListener("visibilitychange", onVisibilityChange);

        if (typeof ResizeObserver !== "undefined") {
          resizeObserver = new ResizeObserver(() => {
            onResize();
          });
          resizeObserver.observe(wrapper);
        }
      } catch {
        showFallback(true);
      }
    };

    void initialize();

    return () => {
      disposed = true;

      window.clearTimeout(idleResetHandle);
      window.cancelAnimationFrame(animationFrame);

      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("blur", resetPointerTarget);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      resizeObserver?.disconnect();

      if (colorTexture) {
        gl.deleteTexture(colorTexture);
      }
      if (depthTexture) {
        gl.deleteTexture(depthTexture);
      }
      gl.deleteBuffer(positionBuffer);
      gl.deleteBuffer(texCoordBuffer);
      gl.deleteProgram(program);
    };
  }, [shouldAnimate]);

  if (!shouldAnimate) {
    return (
      <img
        alt="Unimozer Next turtle icon"
        className="h-56 w-56 object-contain drop-shadow-[0_14px_26px_rgba(0,0,0,0.45)] sm:h-64 sm:w-64"
        height={256}
        onError={handleRuntimeImageError}
        src={RUNTIME_ICON_SRC}
        width={256}
      />
    );
  }

  return (
    <div
      aria-label="Unimozer Next turtle icon"
      className="relative h-56 w-56 sm:h-64 sm:w-64"
      ref={wrapperRef}
      role="img"
    >
      <canvas
        aria-hidden="true"
        className="h-full w-full object-contain drop-shadow-[0_14px_26px_rgba(0,0,0,0.45)]"
        ref={canvasRef}
      />
      <img
        alt=""
        aria-hidden="true"
        className="hidden h-full w-full object-contain drop-shadow-[0_14px_26px_rgba(0,0,0,0.45)]"
        onError={handleRuntimeImageError}
        ref={fallbackRef}
        src={RUNTIME_ICON_SRC}
      />
    </div>
  );
}
