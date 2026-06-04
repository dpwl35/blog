'use client';

import { useEffect, useRef } from 'react';

export default function MainEvent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const logoImg = logoRef.current!;
    const ctx = canvas.getContext('2d', { alpha: true })!;
    const dpr = window.devicePixelRatio || 1;
    const logo = canvas
      .closest('.main-event')
      ?.querySelector('.main-event-logo') as HTMLElement;

    let CELL_SIZE = 8;
    let CELL_GAP = 2;
    let CELL_STEP = CELL_SIZE + CELL_GAP;
    let isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    let CHAR_COLOR = isDark ? '#ddd' : '#1c1c1c';
    const GRID_COLOR = 'rgba(0, 0, 0, 0)';
    const ASCII_CHARS = '.：+#%@0369';
    const THRESHOLD = 0.5;
    const PUSH_RADIUS = 5;
    const PUSH_FORCE = 30;
    const SPRING = 0.025;
    const DAMPING = 0.5;

    let cols: number,
      rows: number,
      cells: any[] = [];
    let animationId: number | null = null;
    let charIntervalId: ReturnType<typeof setInterval> | null = null;
    let mouse = { col: -999, row: -999, isMoving: false };
    let idleTimer: ReturnType<typeof setTimeout> | null = null;

    function setupCanvas() {
      CELL_SIZE = window.innerWidth < 768 ? 3 : 8;
      CELL_GAP = window.innerWidth < 768 ? 1 : 2;
      CELL_STEP = CELL_SIZE + CELL_GAP;
      cols = Math.floor(canvas.offsetWidth / CELL_STEP);
      rows = Math.floor(canvas.offsetHeight / CELL_STEP);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function drawGrid() {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      ctx.fillStyle = GRID_COLOR;
      for (let row = 0; row < rows; row++)
        for (let col = 0; col < cols; col++)
          ctx.fillRect(col * CELL_STEP, row * CELL_STEP, CELL_SIZE, CELL_SIZE);
    }

    function sampleLogoIntoCells() {
      const rect = logoImg.getBoundingClientRect();
      const logoCols = Math.ceil(rect.width / CELL_STEP);
      const logoRows = Math.ceil(rect.height / CELL_STEP);
      const canvasRect = canvas.getBoundingClientRect();
      const startCol = Math.floor((rect.left - canvasRect.left) / CELL_STEP);
      const startRow = Math.floor((rect.top - canvasRect.top) / CELL_STEP);

      const sampleCanvas = document.createElement('canvas');
      sampleCanvas.width = logoCols;
      sampleCanvas.height = logoRows;
      const sampleCtx = sampleCanvas.getContext('2d')!;
      sampleCtx.fillStyle = '#fff';
      sampleCtx.fillRect(0, 0, logoCols, logoRows);
      sampleCtx.drawImage(logoImg, 0, 0, logoCols, logoRows);
      const { data } = sampleCtx.getImageData(0, 0, logoCols, logoRows);

      cells = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const inLogo =
            col >= startCol &&
            col < startCol + logoCols &&
            row >= startRow &&
            row < startRow + logoRows;
          let isLit = false,
            char = ' ';
          if (inLogo) {
            const idx = ((row - startRow) * logoCols + (col - startCol)) * 4;
            const brightness =
              (data[idx] * 0.299 +
                data[idx + 1] * 0.587 +
                data[idx + 2] * 0.114) /
              255;
            isLit = brightness < THRESHOLD;
            char = isLit
              ? ASCII_CHARS[
                  Math.min(
                    ASCII_CHARS.length - 1,
                    Math.floor(brightness * ASCII_CHARS.length),
                  )
                ]
              : ' ';
          }
          cells.push({
            col,
            row,
            char,
            isLit,
            offsetX: 0,
            offsetY: 0,
            velX: 0,
            velY: 0,
          });
        }
      }
    }
    function renderFrame() {
      ctx.font = `${CELL_SIZE + 2}px monospace`;
      ctx.textBaseline = 'top';
      ctx.textAlign = 'center';
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      ctx.fillStyle = GRID_COLOR;
      for (const { col, row } of cells)
        ctx.fillRect(col * CELL_STEP, row * CELL_STEP, CELL_SIZE, CELL_SIZE);

      ctx.fillStyle = CHAR_COLOR;
      for (const { col, row, char, isLit, offsetX, offsetY } of cells) {
        if (!isLit) continue;
        const x = (col + Math.round(offsetX)) * CELL_STEP;
        const y = (row + Math.round(offsetY)) * CELL_STEP;
        ctx.fillText(char, x + CELL_SIZE / 2, y);
      }
    }

    function init() {
      isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      CHAR_COLOR = isDark ? '#ddd' : '#1c1c1c';
      setupCanvas();
      sampleLogoIntoCells();
      drawGrid();
    }

    function updatePhysics() {
      for (const cell of cells) {
        if (!cell.isLit) continue;
        if (mouse.isMoving) {
          const dx = cell.col + cell.offsetX - mouse.col;
          const dy = cell.row + cell.offsetY - mouse.row;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < PUSH_RADIUS && dist > 0) {
            const force = (1 - dist / PUSH_RADIUS) ** 2 * PUSH_FORCE;
            cell.velX += (dx / dist) * force;
            cell.velY += (dy / dist) * force;
          }
        }
        cell.velX += -cell.offsetX * SPRING;
        cell.velY += -cell.offsetY * SPRING;
        cell.velX *= DAMPING;
        cell.velY *= DAMPING;
        cell.offsetX += cell.velX;
        cell.offsetY += cell.velY;
        if (Math.abs(cell.offsetX) < 0.01 && Math.abs(cell.velX) < 0.01)
          cell.offsetX = cell.velX = 0;
        if (Math.abs(cell.offsetY) < 0.01 && Math.abs(cell.velY) < 0.01)
          cell.offsetY = cell.velY = 0;
      }
    }

    function animationLoop() {
      updatePhysics();
      renderFrame();
      animationId = requestAnimationFrame(animationLoop);
    }

    const onMouseEnter = () => {
      logoImg.style.opacity = '0';
      charIntervalId = setInterval(() => {
        for (const cell of cells)
          if (cell.isLit)
            cell.char =
              ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)];
      }, 50);
      if (!animationId) animationLoop();
    };

    const onMouseLeave = () => {
      logoImg.style.opacity = '1';
      clearInterval(charIntervalId!);
      charIntervalId = null;
      cancelAnimationFrame(animationId!);
      animationId = null;
      cells.forEach((cell) => {
        cell.offsetX = 0;
        cell.offsetY = 0;
        cell.velX = 0;
        cell.velY = 0;
      });
      drawGrid();
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.col = (e.clientX - rect.left) / CELL_STEP;
      mouse.row = (e.clientY - rect.top) / CELL_STEP;
      mouse.isMoving = true;
      clearTimeout(idleTimer!);
      idleTimer = setTimeout(() => {
        mouse.isMoving = false;
      }, 50);
    };

    const onWindowMouseLeave = () => {
      mouse.col = mouse.row = -999;
      mouse.isMoving = false;
    };

    const onResize = () => init();

    const observer = new MutationObserver(() => {
      init();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    logo?.addEventListener('mouseenter', onMouseEnter);
    logo?.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onWindowMouseLeave);
    window.addEventListener('resize', onResize);

    if (logoImg.complete) init();
    else logoImg.addEventListener('load', init);

    return () => {
      observer.disconnect();
      logo?.removeEventListener('mouseenter', onMouseEnter);
      logo?.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onWindowMouseLeave);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationId!);
      clearInterval(charIntervalId!);
    };
  }, []);

  return (
    <section className='main-event'>
      <canvas ref={canvasRef} id='grid'></canvas>
      <div className='main-event-logo'>
        <img
          ref={logoRef}
          src='/images/main/main.svg'
          id='source'
          alt='have a good day'
        />
      </div>
    </section>
  );
}
