
'use client';

import { useEffect, useRef } from 'react';
import { Renderer, Camera, Program, Mesh, Vec2, Color, Polyline, Transform } from 'ogl';

interface FloatingLinesProps {
  enabledWaves?: ('top' | 'middle' | 'bottom')[];
  lineCount?: number | number[];
  lineDistance?: number | number[];
  bendRadius?: number;
  bendStrength?: number;
  interactive?: boolean;
  parallax?: boolean;
}

export default function FloatingLines({
  enabledWaves = ['top', 'middle', 'bottom'],
  lineCount = [10, 15, 20],
  lineDistance = [8, 6, 4],
  bendRadius = 5.0,
  bendStrength = -0.5,
  interactive = true,
  parallax = true,
}: FloatingLinesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const vertex = /* glsl */ `
    attribute vec3 position;
    attribute vec3 next;
    attribute vec3 prev;
    attribute vec2 uv;
    attribute float side;

    uniform vec2 uResolution;
    uniform float uDPR;
    uniform float uThickness;

    vec4 getPosition() {
        vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
        vec2 nextScreen = next.xy * aspect;
        vec2 prevScreen = prev.xy * aspect;

        vec2 dir;
        if (all(equal(position.xy, prev.xy))) {
            dir = normalize(nextScreen - position.xy * aspect);
        } else if (all(equal(position.xy, next.xy))) {
            dir = normalize(position.xy * aspect - prevScreen);
        } else {
            dir = normalize(nextScreen - prevScreen);
        }

        vec2 normal = vec2(-dir.y, dir.x);
        normal *= 1.0 - pow(abs(uv.y - 0.5) * 2.0, 2.0);

        vec2 newPos = position.xy * aspect + normal * side * uThickness * uDPR;
        return vec4(newPos / aspect, 0.0, 1.0);
    }

    void main() {
        gl_Position = getPosition();
    }
  `;

  const fragment = /* glsl */ `
    uniform float uTime;
    void main() {
        gl_FragColor.rgb = vec3(0.95);
        gl_FragColor.a = 1.0;
    }
  `;

  useEffect(() => {
    const canvas = canvasRef.current!;
    const renderer = new Renderer({
      canvas,
      dpr: 2,
      alpha: true,
      premultipliedAlpha: true,
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    const camera = new Camera(gl);
    camera.position.z = 1;

    function resize() {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.perspective({
        aspect: gl.canvas.width / gl.canvas.height,
      });
    }
    window.addEventListener('resize', resize, false);
    resize();

    const scene = new Transform();

    const mouse = new Vec2();
    if (interactive) {
      document.addEventListener('mousemove', (e) => {
        mouse.set(
          (e.clientX / gl.canvas.width) * 2 - 1,
          (e.clientY / gl.canvas.height) * -2 + 1
        );
      });
    }

    const polylines: Polyline[] = [];

    const wavesConfig = {
      top: {
        count: Array.isArray(lineCount) ? lineCount[0] || 10 : lineCount,
        distance: Array.isArray(lineDistance) ? lineDistance[0] || 8 : lineDistance,
        yOffset: 0.3,
        color: new Color('#5A5A5A'),
      },
      middle: {
        count: Array.isArray(lineCount) ? lineCount[1] || 15 : lineCount,
        distance: Array.isArray(lineDistance) ? lineDistance[1] || 6 : lineDistance,
        yOffset: 0,
        color: new Color('#888888'),
      },
      bottom: {
        count: Array.isArray(lineCount) ? lineCount[2] || 20 : lineCount,
        distance: Array.isArray(lineDistance) ? lineDistance[2] || 4 : lineDistance,
        yOffset: -0.3,
        color: new Color('#C2C2C2'),
      },
    };
    
    enabledWaves.forEach((waveName) => {
        const config = wavesConfig[waveName];
        if (!config) return;

        for (let i = 0; i < config.count; i++) {
            const points: Vec2[] = [];
            for (let j = 0; j < 20; j++) {
              points.push(new Vec2());
            }

            const polyline = new Polyline(gl, {
              points,
              vertex,
              uniforms: {
                uColor: { value: config.color },
                uThickness: { value: config.distance },
              },
            });
            (polyline as any).yOffset = config.yOffset;
            (polyline as any).bendRadius = bendRadius;
            (polyline as any).bendStrength = bendStrength;
            polyline.setParent(scene);
            
            polylines.push(polyline);
        }
    });

    let requestID = requestAnimationFrame(update);
    
    function update(t: number) {
      requestID = requestAnimationFrame(update);

      polylines.forEach((polyline) => {
          const { yOffset, bendRadius, bendStrength } = polyline as any;
          const points = polyline.points as Vec2[];

          for (let i = 0; i < points.length; i++) {
              const x = (i / (points.length - 1) - 0.5) * 2;
              let y = yOffset;

              const mouseEffect = interactive ? Math.max(0, 1 - new Vec2(x, y).distance(mouse) / 0.5) : 0;
              
              const bend = Math.sin(x * bendRadius + t * 0.0005) * bendStrength;
              y += bend;
              
              const wave = Math.sin(x * 10 + t * 0.001) * 0.1;
              y += wave * mouseEffect;

              points[i].set(x, y);
          }
      });
      
      renderer.render({ scene, camera });
    }

    return () => {
      cancelAnimationFrame(requestID);
      window.removeEventListener('resize', resize);
      // Clean up OGL resources if possible, though ogl doesn't have a simple dispose method
    };
  }, [enabledWaves, lineCount, lineDistance, bendRadius, bendStrength, interactive, parallax, vertex, fragment]);

  return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />;
}
