/* =========================================================
   ANIMATED CONNECTOME BACKGROUND
   ========================================================= */

const canvas = document.getElementById("network-bg");
const ctx = canvas.getContext("2d");

let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;

    this.vx = (Math.random() - 0.5) * 0.15;
    this.vy = (Math.random() - 0.5) * 0.15;

    this.radius = Math.random() * 1.5 + 1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x <= 0 || this.x >= canvas.width) {
      this.vx *= -1;
    }

    if (this.y <= 0 || this.y >= canvas.height) {
      this.vy *= -1;
    }
  }

  draw() {
    ctx.beginPath();

    ctx.arc(
      this.x,
      this.y,
      this.radius,
      0,
      Math.PI * 2
    );

    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.fill();
  }
}

function createParticles() {
  particles = [];

  for (let i = 0; i < 120; i++) {
    particles.push(new Particle());
  }
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {

    for (let j = i + 1; j < particles.length; j++) {

      const dx =
        particles[i].x -
        particles[j].x;

      const dy =
        particles[i].y -
        particles[j].y;

      const distance =
        Math.sqrt(dx * dx + dy * dy);

      if (distance < 150) {

        const opacity =
          (1 - distance / 150) * 0.35;

        ctx.beginPath();

        ctx.moveTo(
          particles[i].x,
          particles[i].y
        );

        ctx.lineTo(
          particles[j].x,
          particles[j].y
        );

        ctx.strokeStyle =
          `rgba(255,255,255,${opacity})`;

        ctx.lineWidth = 0.8;

        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  drawConnections();

  particles.forEach(particle => {
    particle.update();
    particle.draw();
  });

  requestAnimationFrame(animate);
}

resizeCanvas();
createParticles();
animate();

window.addEventListener("resize", () => {
  resizeCanvas();
  createParticles();
});
