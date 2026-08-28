"use client";

import { useEffect, useRef } from "react";

import styles from "./gareth64.module.css";

const W = 320;
const H = 200;
const PADDLE_H = 34;
const PADDLE_W = 5;
const BALL = 5;
const WIN_SCORE = 7;

interface PongProps {
  readonly muted: boolean;
  readonly reducedMotion: boolean;
}

export function Pong({ muted, reducedMotion }: PongProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mutedRef = useRef(muted);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let audio: AudioContext | null = null;
    const beep = (frequency: number, duration: number) => {
      if (mutedRef.current) return;
      audio = audio ?? new window.AudioContext();
      if (audio.state === "suspended") void audio.resume();
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      const now = audio.currentTime;
      osc.type = "square";
      osc.frequency.setValueAtTime(frequency, now);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(gain).connect(audio.destination);
      osc.start(now);
      osc.stop(now + duration);
    };

    const state = {
      playerY: H / 2,
      aiY: H / 2,
      ballX: W / 2,
      ballY: H / 2,
      vx: 0,
      vy: 0,
      playerScore: 0,
      aiScore: 0,
      serveDelay: 0.9,
      serveDir: -1,
      winner: null as "PLAYER" | "COMPUTER" | null,
      up: false,
      down: false,
      pointerY: null as number | null,
      time: 0,
    };

    const speed = reducedMotion ? 105 : 150;

    function serve(direction: number) {
      state.ballX = W / 2;
      state.ballY = H / 2;
      state.vx = speed * direction;
      state.vy = (Math.random() * 2 - 1) * speed * 0.55;
      state.serveDelay = 0.9;
    }
    serve(state.serveDir);

    function restart() {
      state.playerScore = 0;
      state.aiScore = 0;
      state.winner = null;
      serve(state.serveDir);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.code === "ArrowUp" || event.code === "KeyW") { state.up = true; event.preventDefault(); }
      if (event.code === "ArrowDown" || event.code === "KeyS") { state.down = true; event.preventDefault(); }
      if (event.code === "Space") {
        event.preventDefault();
        if (state.winner) restart();
      }
    }
    function handleKeyUp(event: KeyboardEvent) {
      if (event.code === "ArrowUp" || event.code === "KeyW") state.up = false;
      if (event.code === "ArrowDown" || event.code === "KeyS") state.down = false;
    }
    function handlePointer(event: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      state.pointerY = ((event.clientY - rect.top) / rect.height) * H;
    }
    function handlePointerDown(event: PointerEvent) {
      handlePointer(event);
      if (state.winner) restart();
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    canvas.addEventListener("pointermove", handlePointer);
    canvas.addEventListener("pointerdown", handlePointerDown);

    const clampPaddle = (y: number) => Math.max(PADDLE_H / 2, Math.min(H - PADDLE_H / 2, y));

    function step(dt: number) {
      state.time += dt;

      // Player paddle: keyboard or pointer.
      if (state.pointerY !== null) state.playerY = clampPaddle(state.pointerY);
      if (state.up) { state.playerY = clampPaddle(state.playerY - 170 * dt); state.pointerY = null; }
      if (state.down) { state.playerY = clampPaddle(state.playerY + 170 * dt); state.pointerY = null; }

      // Computer paddle: chases the ball with a speed limit and a wobble.
      const target = state.vx > 0 ? state.ballY + Math.sin(state.time * 3.1) * 14 : H / 2;
      const diff = target - state.aiY;
      const aiSpeed = 118;
      state.aiY = clampPaddle(state.aiY + Math.max(-aiSpeed * dt, Math.min(aiSpeed * dt, diff)));

      if (state.winner) return;
      if (state.serveDelay > 0) { state.serveDelay -= dt; return; }

      state.ballX += state.vx * dt;
      state.ballY += state.vy * dt;

      if (state.ballY < BALL / 2) { state.ballY = BALL / 2; state.vy = Math.abs(state.vy); beep(440, 0.04); }
      if (state.ballY > H - BALL / 2) { state.ballY = H - BALL / 2; state.vy = -Math.abs(state.vy); beep(440, 0.04); }

      const hit = (paddleY: number) => Math.abs(state.ballY - paddleY) < PADDLE_H / 2 + BALL / 2;
      // Player side (left).
      if (state.ballX < 12 + PADDLE_W && state.vx < 0 && hit(state.playerY)) {
        state.ballX = 12 + PADDLE_W;
        state.vx = Math.abs(state.vx) * 1.04;
        state.vy += ((state.ballY - state.playerY) / (PADDLE_H / 2)) * 60;
        beep(660, 0.05);
      }
      // Computer side (right).
      if (state.ballX > W - 12 - PADDLE_W && state.vx > 0 && hit(state.aiY)) {
        state.ballX = W - 12 - PADDLE_W;
        state.vx = -Math.abs(state.vx) * 1.04;
        state.vy += ((state.ballY - state.aiY) / (PADDLE_H / 2)) * 60;
        beep(660, 0.05);
      }

      if (state.ballX < -BALL) {
        state.aiScore += 1;
        beep(180, 0.25);
        if (state.aiScore >= WIN_SCORE) state.winner = "COMPUTER";
        else serve(1);
      }
      if (state.ballX > W + BALL) {
        state.playerScore += 1;
        beep(320, 0.25);
        if (state.playerScore >= WIN_SCORE) state.winner = "PLAYER";
        else serve(-1);
      }
    }

    function draw() {
      if (!ctx) return;
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, W, H);

      // Centre net.
      ctx.fillStyle = "#6c5eb5";
      for (let y = 4; y < H; y += 12) ctx.fillRect(W / 2 - 1, y, 2, 6);

      // Scores.
      ctx.fillStyle = "#a29ae0";
      ctx.font = '16px "C64 Pro Mono", monospace';
      ctx.textAlign = "center";
      ctx.fillText(String(state.playerScore), W / 2 - 34, 22);
      ctx.fillText(String(state.aiScore), W / 2 + 34, 22);

      // Paddles and ball.
      ctx.fillStyle = "#9ad284";
      ctx.fillRect(12, state.playerY - PADDLE_H / 2, PADDLE_W, PADDLE_H);
      ctx.fillStyle = "#d78f75";
      ctx.fillRect(W - 12 - PADDLE_W, state.aiY - PADDLE_H / 2, PADDLE_W, PADDLE_H);
      if (!state.winner) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(state.ballX - BALL / 2, state.ballY - BALL / 2, BALL, BALL);
      }

      if (state.winner) {
        ctx.fillStyle = state.winner === "PLAYER" ? "#9ad284" : "#d78f75";
        ctx.fillText(`${state.winner} WINS`, W / 2, H / 2 - 8);
        ctx.fillStyle = "#a29ae0";
        ctx.font = '8px "C64 Pro Mono", monospace';
        ctx.fillText("SPACE REPLAYS. ESC EJECTS.", W / 2, H / 2 + 12);
      }
    }

    let raf = 0;
    let last = performance.now();
    function frame(now: number) {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      step(dt);
      draw();
      raf = window.requestAnimationFrame(frame);
    }
    raf = window.requestAnimationFrame(frame);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      canvas.removeEventListener("pointermove", handlePointer);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      void audio?.close();
    };
  }, [reducedMotion]);

  return (
    <div className={styles.gameScreen} role="application" aria-label="Pong. Arrow keys or mouse to move, first to seven wins.">
      <canvas ref={canvasRef} width={W} height={H} />
    </div>
  );
}
