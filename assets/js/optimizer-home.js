(function () {
  "use strict";

  const home = document.querySelector(".neuro-home");
  const canvas = document.getElementById("neuro-canvas");
  const startButton = document.getElementById("optimize-button");
  const hero = document.querySelector(".neuro-hero");
  const sequenceButtons = Array.from(document.querySelectorAll("[data-sequence-jump]"));
  if (!home || !canvas || !startButton || !hero) return;

  const ctx = canvas.getContext("2d");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const status = document.getElementById("neuro-status");
  const topStatus = document.getElementById("neuro-status-top");
  const scoreDisplay = document.getElementById("neuro-score");
  const timerDisplay = document.getElementById("neuro-timer");
  const instructions = document.getElementById("neuro-game-instructions");
  const gameDuration = 30000;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let time = 0;
  let scrollPhase = 0;
  let sequenceMode = 0;
  let nodes = [];
  let links = [];
  let gameState = "idle";
  let startedAt = 0;
  let score = 0;
  let combo = 0;
  let lastConnectionAt = 0;
  let selectedNode = null;
  let keyboardNode = 0;
  let hoveredNode = null;
  let nextSpawnAt = 0;

  function brainRadius(angle) {
    const side = Math.cos(angle);
    const vertical = Math.sin(angle);
    const hemisphere = 0.88 + 0.08 * Math.cos(angle * 2);
    const lobeTexture = 1 + 0.055 * Math.sin(angle * 5) + 0.035 * Math.cos(angle * 7);
    const lowerTaper = vertical > 0 ? 1 - vertical * 0.12 : 1;
    const centerNotch = Math.abs(side) < 0.16 && vertical < -0.45 ? 0.88 : 1;
    return hemisphere * lobeTexture * lowerTaper * centerNotch;
  }

  function pointInBrain(nx, ny) {
    const y = ny + 0.02;
    const angle = Math.atan2(y, nx);
    const boundary = brainRadius(angle);
    const radial = Math.sqrt((nx * nx) / (1.02 * 1.02) + (y * y) / (0.84 * 0.84));
    return radial < boundary && !(Math.abs(nx) < 0.035 && y < -0.55);
  }

  function createNetwork() {
    nodes = [];
    const desired = Math.max(40, Math.min(68, Math.floor(width / 9)));
    let attempts = 0;

    while (nodes.length < desired && attempts < desired * 80) {
      attempts += 1;
      const nx = Math.random() * 2 - 1;
      const ny = Math.random() * 1.7 - 0.82;
      if (!pointInBrain(nx, ny)) continue;
      nodes.push({
        nx,
        ny,
        radius: 2.1 + Math.random() * 1.3,
        pulse: Math.random() * Math.PI * 2,
        rate: 0.7 + Math.random() * 1.2,
        activeFrom: 0,
        activeUntil: Infinity
      });
    }

    links = [];
    nodes.forEach((node, index) => {
      const nearest = nodes
        .map((candidate, candidateIndex) => ({
          candidateIndex,
          distance: Math.hypot(node.nx - candidate.nx, node.ny - candidate.ny)
        }))
        .filter((item) => item.candidateIndex !== index)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3);

      nearest.forEach((item) => {
        const a = Math.min(index, item.candidateIndex);
        const b = Math.max(index, item.candidateIndex);
        if (!links.some((link) => link.a === a && link.b === b)) {
          links.push({ a, b, connected: false, flashAt: 0 });
        }
      });
    });
    selectedNode = null;
    keyboardNode = 0;
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const previousConnections = links.filter((link) => link.connected).length;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!nodes.length || gameState !== "running") {
      createNetwork();
    } else if (previousConnections) {
      selectedNode = null;
    }
  }

  function project(node) {
    const scale = Math.min(width * 0.41, height * 0.44);
    return {
      x: width / 2 + node.nx * scale,
      y: height / 2 + node.ny * scale
    };
  }

  function traceBrainOutline(cx, cy, scale) {
    ctx.beginPath();
    const steps = 180;
    for (let index = 0; index <= steps; index += 1) {
      const angle = -Math.PI + (index / steps) * Math.PI * 2;
      const radius = brainRadius(angle);
      const x = cx + Math.cos(angle) * scale * radius;
      const y = cy + Math.sin(angle) * scale * 0.84 * radius;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  }

  function isNodeActive(index, now) {
    return gameState === "idle" || (nodes[index].activeFrom <= now && nodes[index].activeUntil > now);
  }

  function spawnNeuronWave(now, openingBurst) {
    const activeOrIncomingCount = nodes.filter((node) => node.activeUntil > now).length;
    const targetCount = width < 520 ? 7 : 10;
    if (!openingBurst && activeOrIncomingCount >= targetCount) {
      nextSpawnAt = now + 280 + Math.random() * 260;
      return;
    }

    const candidates = links
      .filter((link) =>
        !link.connected &&
        (nodes[link.a].activeUntil <= now || nodes[link.b].activeUntil <= now)
      )
      .map((link) => ({ link, order: Math.random() }))
      .sort((a, b) => a.order - b.order);
    const pairsToSpawn = openingBurst ? 2 : (Math.random() < 0.22 ? 2 : 1);
    let spawned = 0;

    for (const candidate of candidates) {
      if (spawned >= pairsToSpawn) break;
      const lifetime = 2200 + Math.random() * 1800;
      const pairOffset = spawned * (170 + Math.random() * 100);
      const endpoints = Math.random() < 0.18
        ? [
            { index: candidate.link.a, delay: pairOffset },
            { index: candidate.link.b, delay: pairOffset }
          ]
        : [
            { index: candidate.link.a, delay: pairOffset },
            { index: candidate.link.b, delay: pairOffset + 110 + Math.random() * 170 }
          ];

      endpoints.forEach(({ index, delay }) => {
        if (nodes[index].activeUntil <= now) {
          nodes[index].activeFrom = now + delay;
          nodes[index].activeUntil = nodes[index].activeFrom + lifetime;
        } else {
          nodes[index].activeUntil = Math.max(nodes[index].activeUntil, now + delay + lifetime);
        }
      });
      spawned += 1;
    }
    nextSpawnAt = now + (openingBurst ? 360 : 420) + Math.random() * 320;
  }

  function updateTemporaryNeurons(now) {
    if (gameState !== "running") return;
    if (selectedNode !== null && !isNodeActive(selectedNode, now)) {
      selectedNode = null;
      combo = 0;
      instructions.textContent = "That neuron faded. Catch another pulse.";
      status.textContent = "Signal lost // choose a new neuron";
    }
    if (now >= nextSpawnAt) spawnNeuronWave(now, false);
  }

  function isAvailableTarget(index, now) {
    if (selectedNode === null || selectedNode === index) return false;
    if (!isNodeActive(index, now) || !isNodeActive(selectedNode, now)) return false;
    return links.some((link) =>
      !link.connected &&
      ((link.a === selectedNode && link.b === index) || (link.b === selectedNode && link.a === index))
    );
  }

  function drawFrame(now) {
    updateTemporaryNeurons(now);
    ctx.clearRect(0, 0, width, height);
    const cx = width / 2;
    const cy = height / 2;
    const scale = Math.min(width * 0.41, height * 0.44);
    const active = gameState === "running";
    const pulse = 1 + Math.sin(time * 1.4) * (active ? 0.012 : 0.006);

    const glow = ctx.createRadialGradient(cx, cy, scale * 0.05, cx, cy, scale * 1.25);
    glow.addColorStop(0, active ? "rgba(100, 245, 229, .16)" : "rgba(99, 142, 255, .1)");
    glow.addColorStop(0.55, "rgba(85, 94, 224, .045)");
    glow.addColorStop(1, "rgba(5, 8, 22, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(pulse, pulse);
    ctx.translate(-cx, -cy);

    traceBrainOutline(cx, cy, scale);
    ctx.strokeStyle = active ? "rgba(100, 245, 229, .72)" : "rgba(112, 168, 255, .48)";
    ctx.lineWidth = active ? 1.4 : 1;
    ctx.shadowColor = active ? "rgba(100, 245, 229, .62)" : "rgba(112, 168, 255, .3)";
    ctx.shadowBlur = active ? 14 : 8;
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.beginPath();
    ctx.moveTo(cx, cy - scale * 0.78);
    ctx.bezierCurveTo(cx - scale * 0.035, cy - scale * 0.34, cx + scale * 0.03, cy + scale * 0.2, cx, cy + scale * 0.7);
    ctx.strokeStyle = "rgba(169, 139, 255, .25)";
    ctx.setLineDash([4, 7]);
    ctx.stroke();
    ctx.setLineDash([]);

    links.forEach((link) => {
      const a = project(nodes[link.a]);
      const b = project(nodes[link.b]);
      const flash = Math.max(0, 1 - (now - link.flashAt) / 650);
      const endpointsVisible = isNodeActive(link.a, now) && isNodeActive(link.b, now);
      if (!link.connected && !endpointsVisible) return;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      if (link.connected) {
        ctx.strokeStyle = `rgba(100, 245, 229, ${0.68 + flash * 0.32})`;
        ctx.lineWidth = 1.4 + flash * 2.2;
        ctx.shadowColor = "rgba(100, 245, 229, .75)";
        ctx.shadowBlur = 7 + flash * 12;
      } else {
        ctx.strokeStyle = "rgba(112, 168, 255, .11)";
        ctx.lineWidth = 0.65;
        ctx.shadowBlur = 0;
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    });

    nodes.forEach((node, index) => {
      if (!isNodeActive(index, now)) return;
      const position = project(node);
      const flicker = 0.5 + Math.sin(time * node.rate * 2 + node.pulse) * 0.2;
      const selected = selectedNode === index;
      const target = isAvailableTarget(index, now);
      const keyboardFocused = document.activeElement === canvas && keyboardNode === index;
      const hovered = hoveredNode === index;
      const lifetime = Math.max(1, node.activeUntil - node.activeFrom);
      const lifeElapsed = gameState === "running"
        ? Math.max(0, Math.min(1, (now - node.activeFrom) / lifetime))
        : 1;
      const lifeRemaining = gameState === "running"
        ? Math.max(0, Math.min(1, (node.activeUntil - now) / lifetime))
        : 1;
      const visibility = Math.min(1, lifeElapsed * 7, lifeRemaining * 3.5);
      ctx.globalAlpha = visibility;

      if (gameState === "running") {
        ctx.beginPath();
        ctx.arc(position.x, position.y, target ? 10 : 8, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * lifeRemaining);
        ctx.strokeStyle = lifeRemaining < 0.28
          ? "rgba(255, 111, 145, .9)"
          : "rgba(100, 245, 229, .42)";
        ctx.lineWidth = 1.3;
        ctx.stroke();
      }

      if (selected || target || keyboardFocused || hovered) {
        ctx.beginPath();
        ctx.arc(position.x, position.y, selected ? 11 : 8, 0, Math.PI * 2);
        ctx.strokeStyle = selected
          ? "rgba(169, 139, 255, .95)"
          : target
            ? "rgba(100, 245, 229, .7)"
            : "rgba(255, 255, 255, .5)";
        ctx.lineWidth = selected ? 2 : 1;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(position.x, position.y, node.radius * (target ? 1.45 : 1), 0, Math.PI * 2);
      ctx.fillStyle = selected
        ? "rgba(169, 139, 255, 1)"
        : target
          ? `rgba(100, 245, 229, ${0.78 + flicker * 0.2})`
          : `rgba(100, 245, 229, ${flicker})`;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    ctx.restore();
    time += (active ? 1.3 : 0.42) * 0.018;
    updateTimer(now);
    if (!reducedMotion || active) requestAnimationFrame(drawFrame);
  }

  function updateTimer(now) {
    if (gameState !== "running") return;
    const remaining = Math.max(0, gameDuration - (now - startedAt));
    timerDisplay.textContent = (remaining / 1000).toFixed(1).padStart(4, "0");
    timerDisplay.classList.toggle("is-warning", remaining <= 7000);
    if (remaining <= 0) endGame();
  }

  function setScore(nextScore) {
    score = nextScore;
    scoreDisplay.textContent = String(score).padStart(3, "0");
  }

  function startGame() {
    const now = performance.now();
    links.forEach((link) => {
      link.connected = false;
      link.flashAt = 0;
    });
    nodes.forEach((node) => {
      node.activeFrom = 0;
      node.activeUntil = 0;
    });
    gameState = "running";
    startedAt = now;
    combo = 0;
    lastConnectionAt = 0;
    selectedNode = null;
    hoveredNode = null;
    nextSpawnAt = now;
    spawnNeuronWave(now, true);
    setScore(0);
    timerDisplay.textContent = "30.0";
    timerDisplay.classList.remove("is-warning");
    startButton.classList.add("is-optimized");
    home.classList.add("is-optimized");
    startButton.querySelector(".optimize-button-label").textContent = "RESTART";
    startButton.querySelector(".optimize-button-hint").textContent = "RESET THE NETWORK";
    instructions.textContent = "Catch a neuron, then its glowing neighbor—before either fades.";
    status.textContent = "Game active // neurons are temporary";
    topStatus.textContent = "PLAYING";
    canvas.focus();
    if (reducedMotion) requestAnimationFrame(drawFrame);
  }

  function endGame() {
    if (gameState !== "running") return;
    gameState = "ended";
    selectedNode = null;
    timerDisplay.textContent = "00.0";
    timerDisplay.classList.remove("is-warning");
    startButton.classList.remove("is-optimized");
    startButton.querySelector(".optimize-button-label").textContent = "PLAY AGAIN";
    startButton.querySelector(".optimize-button-hint").textContent = "BEAT YOUR SCORE";
    instructions.textContent = `Time! You formed ${links.filter((link) => link.connected).length} synapses.`;
    status.textContent = `Final score ${score} // select play again`;
    topStatus.textContent = "COMPLETE";
  }

  function findLink(a, b) {
    return links.find((link) =>
      (link.a === a && link.b === b) || (link.a === b && link.b === a)
    );
  }

  function selectNeuron(index) {
    if (gameState !== "running") {
      status.textContent = "Start the game before selecting neurons";
      return;
    }
    const now = performance.now();
    if (!isNodeActive(index, now)) {
      instructions.textContent = "Too late—that neuron already faded.";
      return;
    }
    if (selectedNode !== null && !isNodeActive(selectedNode, now)) {
      selectedNode = index;
      combo = 0;
      instructions.textContent = "The first neuron faded. This pulse is your new start.";
      return;
    }
    keyboardNode = index;
    if (selectedNode === null) {
      selectedNode = index;
      instructions.textContent = "Caught. Connect its glowing neighbor before the ring empties.";
      return;
    }
    if (selectedNode === index) {
      selectedNode = null;
      instructions.textContent = "Selection cleared. Choose a neuron.";
      return;
    }

    const link = findLink(selectedNode, index);
    if (!link || link.connected) {
      combo = 0;
      selectedNode = index;
      instructions.textContent = link ? "That synapse is already active. Try another." : "Too far apart. Follow the glowing targets.";
      return;
    }

    combo = now - lastConnectionAt < 2000 ? combo + 1 : 1;
    lastConnectionAt = now;
    link.connected = true;
    link.flashAt = now;
    setScore(score + 10 + Math.min(combo - 1, 5) * 2);
    nodes[link.a].activeUntil = Math.min(nodes[link.a].activeUntil, now + 320);
    nodes[link.b].activeUntil = Math.min(nodes[link.b].activeUntil, now + 320);
    selectedNode = null;
    nextSpawnAt = Math.min(nextSpawnAt, now + 180);
    instructions.textContent = combo > 1 ? `${combo}x chain! Catch the next pulse.` : "Synapse formed. Catch the next pulse.";
    status.textContent = `Score ${score} // ${links.filter((item) => item.connected).length} synapses active`;
    if (navigator.vibrate) navigator.vibrate(18);
  }

  function closestNode(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    let closest = null;
    let closestDistance = 22;
    nodes.forEach((node, index) => {
      if (!isNodeActive(index, performance.now())) return;
      const point = project(node);
      const distance = Math.hypot(point.x - x, point.y - y);
      if (distance < closestDistance) {
        closest = index;
        closestDistance = distance;
      }
    });
    return closest;
  }

  canvas.addEventListener("pointerdown", (event) => {
    const index = closestNode(event.clientX, event.clientY);
    if (index !== null) selectNeuron(index);
  });

  canvas.addEventListener("pointermove", (event) => {
    hoveredNode = closestNode(event.clientX, event.clientY);
    canvas.classList.toggle("is-targeting", hoveredNode !== null);
  });

  canvas.addEventListener("pointerleave", () => {
    hoveredNode = null;
    canvas.classList.remove("is-targeting");
  });

  canvas.addEventListener("keydown", (event) => {
    if (!["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Enter", " "].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "Enter" || event.key === " ") {
      selectNeuron(keyboardNode);
      return;
    }
    const direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
    const activeNodes = nodes
      .map((node, index) => index)
      .filter((index) => isNodeActive(index, performance.now()));
    if (!activeNodes.length) return;
    const currentPosition = activeNodes.indexOf(keyboardNode);
    keyboardNode = activeNodes[
      (Math.max(0, currentPosition) + direction + activeNodes.length) % activeNodes.length
    ];
    instructions.textContent = `Neuron ${keyboardNode + 1} selected by keyboard. Press Enter to choose it.`;
  });

  startButton.addEventListener("click", startGame);

  sequenceButtons.forEach((sequenceButton) => {
    sequenceButton.addEventListener("click", () => {
      const index = Number(sequenceButton.dataset.sequenceJump);
      if (window.innerWidth <= 980) {
        sequenceMode = index;
        updateSequence();
        return;
      }
      const range = Math.max(1, hero.offsetHeight - window.innerHeight);
      window.scrollTo({
        top: hero.offsetTop + range * (index / 2),
        behavior: reducedMotion ? "auto" : "smooth"
      });
    });
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  }, { threshold: 0.12 });
  document.querySelectorAll("[data-neuro-reveal]").forEach((element) => revealObserver.observe(element));

  function updateSequence() {
    home.dataset.sequence = String(sequenceMode);
    sequenceButtons.forEach((sequenceButton, index) => {
      sequenceButton.classList.toggle("is-active", index === sequenceMode);
      sequenceButton.setAttribute("aria-current", index === sequenceMode ? "step" : "false");
    });
    if (gameState === "idle") {
      topStatus.textContent = sequenceMode === 0 ? "STABLE" : sequenceMode === 1 ? "MAPPING" : "READY";
    }
  }

  function onScroll() {
    if (window.innerWidth <= 980) return;
    const range = Math.max(1, hero.offsetHeight - window.innerHeight);
    scrollPhase = Math.max(0, Math.min(1, (window.scrollY - hero.offsetTop) / range));
    const nextSequence = scrollPhase < 0.31 ? 0 : scrollPhase < 0.68 ? 1 : 2;
    if (nextSequence !== sequenceMode) {
      sequenceMode = nextSequence;
      updateSequence();
    }
    home.style.setProperty("--scroll-phase", scrollPhase.toFixed(3));
  }

  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  resize();
  onScroll();
  requestAnimationFrame(drawFrame);
})();
