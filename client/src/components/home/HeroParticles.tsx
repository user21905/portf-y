import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine";
import type { ISourceOptions } from "@tsparticles/engine";
import styles from "./HeroParticles.module.css";

export function HeroParticles() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine);
    }).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const options: ISourceOptions = useMemo(
    () => ({
      fullScreen: false,
      background: { color: { value: "transparent" } },
      fpsLimit: 60,
      interactivity: {
        events: {
          onHover: { enable: true, mode: "grab" },
        },
        modes: {
          grab: {
            distance: 120,
            links: { opacity: 0.35 },
          },
        },
      },
      particles: {
        color: { value: "#2DD4BF" },
        links: {
          color: "#2DD4BF",
          distance: 120,
          enable: true,
          opacity: 0.08,
          width: 1,
        },
        move: {
          enable: true,
          speed: { min: 0.25, max: 0.85 },
          direction: "none",
          random: true,
        },
        number: {
          value: 42,
          density: { enable: true, width: 1000, height: 800 },
        },
        opacity: { value: { min: 0.12, max: 0.45 } },
        shape: { type: "circle" },
        size: { value: { min: 1, max: 2.2 } },
      },
      detectRetina: true,
    }),
    []
  );

  if (!ready) {
    return <div className={styles.fallback} aria-hidden="true" />;
  }

  return (
    <Particles id="hero-particles" className={styles.particles} options={options} />
  );
}
