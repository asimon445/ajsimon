/* =========================================================
   ANIMATED CONNECTOME BACKGROUND
   ========================================================= */

const canvas = document.getElementById("network-bg");
const ctx = canvas.getContext("2d");

let width;
let height;
let dpr;

let nodes = [];


/*
   NETWORK APPEARANCE

   More nodes + shorter connections makes this look more like
   a connectome and less like a generic particle animation.
*/

const NODE_COUNT_DESKTOP = 135;
const NODE_COUNT_MOBILE = 75;

const CONNECTION_DISTANCE = 135;


/*
   Extremely slow movement.

   Lower these numbers if you want the network to move
   even more slowly.
*/

const MAX_SPEED = 0.08;


/* =========================================================
   CANVAS SIZE
   ========================================================= */

function resizeCanvas() {

  width = window.innerWidth;
  height = window.innerHeight;

  dpr = window.devicePixelRatio || 1;

  canvas.width = width * dpr;
  canvas.height = height * dpr;

  canvas.style.width = width + "px";
  canvas.style.height = height + "px";

  ctx.setTransform(
    dpr,
    0,
    0,
    dpr,
    0,
    0
  );

}


/* =========================================================
   NETWORK NODE
   ========================================================= */

class Node {

  constructor(cluster = null) {

    /*
      Some nodes are generated around a local cluster center.

      This produces small subnetworks instead of a perfectly
      uniform random particle field.
    */

    if (cluster) {

      this.x =
        cluster.x +
        (Math.random() - 0.5) *
        cluster.spread;

      this.y =
        cluster.y +
        (Math.random() - 0.5) *
        cluster.spread;

    } else {

      this.x =
        Math.random() *
        width;

      this.y =
        Math.random() *
        height;

    }


    /*
      Keep node inside viewport
    */

    this.x =
      Math.max(
        0,
        Math.min(
          width,
          this.x
        )
      );

    this.y =
      Math.max(
        0,
        Math.min(
          height,
          this.y
        )
      );


    /*
      Very slow drift
    */

    this.vx =
      (Math.random() - 0.5) *
      MAX_SPEED;

    this.vy =
      (Math.random() - 0.5) *
      MAX_SPEED;


    /*
      Slight variation makes the network look more organic.
    */

    this.radius =
      0.6 +
      Math.random() *
      1.1;


    this.opacity =
      0.25 +
      Math.random() *
      0.4;

  }


  update() {

    this.x += this.vx;
    this.y += this.vy;


    /*
      Gently bounce from screen edges.
    */

    if (
      this.x <= 0 ||
      this.x >= width
    ) {

      this.vx *= -1;

    }


    if (
      this.y <= 0 ||
      this.y >= height
    ) {

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


    ctx.fillStyle =
      `rgba(235, 235, 235, ${this.opacity})`;


    ctx.fill();

  }

}


/* =========================================================
   CREATE NETWORK
   ========================================================= */

function createNetwork() {

  nodes = [];


  const nodeCount =
    width < 750
      ? NODE_COUNT_MOBILE
      : NODE_COUNT_DESKTOP;


  /*
     Create several approximate "network communities."

     These are not rigid clusters — just regions with
     slightly higher node density.
  */

  const clusters = [

    {
      x: width * 0.20,
      y: height * 0.28,
      spread: 300
    },

    {
      x: width * 0.48,
      y: height * 0.58,
      spread: 350
    },

    {
      x: width * 0.78,
      y: height * 0.32,
      spread: 300
    },

    {
      x: width * 0.77,
      y: height * 0.78,
      spread: 260
    }

  ];


  /*
     Around 70% of nodes belong to loose communities.
     The rest are distributed globally.
  */

  for (
    let i = 0;
    i < nodeCount;
    i++
  ) {

    if (
      Math.random() < 0.70
    ) {

      const cluster =
        clusters[
          Math.floor(
            Math.random() *
            clusters.length
          )
        ];


      nodes.push(
        new Node(cluster)
      );

    } else {

      nodes.push(
        new Node()
      );

    }

  }

}


/* =========================================================
   CONNECTIONS
   ========================================================= */

function drawConnections() {

  for (
    let i = 0;
    i < nodes.length;
    i++
  ) {

    for (
      let j = i + 1;
      j < nodes.length;
      j++
    ) {

      const dx =
        nodes[i].x -
        nodes[j].x;

      const dy =
        nodes[i].y -
        nodes[j].y;


      const distanceSquared =
        dx * dx +
        dy * dy;


      const maxDistanceSquared =
        CONNECTION_DISTANCE *
        CONNECTION_DISTANCE;


      /*
         Using squared distance here avoids doing
         sqrt() for every possible node pair.
      */

      if (
        distanceSquared <
        maxDistanceSquared
      ) {

        const distance =
          Math.sqrt(
            distanceSquared
          );


        /*
           Connections fade with distance.

           Nearby nodes have stronger edges.
        */

        const strength =
          1 -
          distance /
          CONNECTION_DISTANCE;


        const opacity =
          strength *
          0.16;


        ctx.beginPath();


        ctx.moveTo(
          nodes[i].x,
          nodes[i].y
        );


        ctx.lineTo(
          nodes[j].x,
          nodes[j].y
        );


        ctx.strokeStyle =
          `rgba(210, 210, 210, ${opacity})`;


        ctx.lineWidth =
          0.45 +
          strength *
          0.35;


        ctx.stroke();

      }

    }

  }

}


/* =========================================================
   OCCASIONAL LONG-RANGE CONNECTIONS
   ========================================================= */

function drawLongRangeConnections() {

  /*
     Brain networks contain long-range connections.

     Add a very small number of faint ones so the
     background feels more like a connectome.
  */

  const longConnections =
    Math.floor(
      nodes.length *
      0.07
    );


  for (
    let i = 0;
    i < longConnections;
    i++
  ) {

    const nodeA =
      nodes[
        Math.floor(
          Math.random() *
          nodes.length
        )
      ];


    const nodeB =
      nodes[
        Math.floor(
          Math.random() *
          nodes.length
        )
      ];


    if (
      nodeA === nodeB
    ) {
      continue;
    }


    ctx.beginPath();


    ctx.moveTo(
      nodeA.x,
      nodeA.y
    );


    ctx.lineTo(
      nodeB.x,
      nodeB.y
    );


    ctx.strokeStyle =
      "rgba(180, 180, 180, 0.018)";


    ctx.lineWidth =
      0.35;


    ctx.stroke();

  }

}


/* =========================================================
   ANIMATION
   ========================================================= */

function animate() {

  ctx.clearRect(
    0,
    0,
    width,
    height
  );


  /*
     Draw connections first so nodes appear on top.
  */

  drawConnections();

  drawLongRangeConnections();


  nodes.forEach(
    node => {

      node.update();
      node.draw();

    }
  );


  requestAnimationFrame(
    animate
  );

}


/* =========================================================
   INITIALIZATION
   ========================================================= */

resizeCanvas();

createNetwork();

animate();


/* =========================================================
   WINDOW RESIZE
   ========================================================= */

let resizeTimer;

window.addEventListener(
  "resize",
  () => {

    clearTimeout(
      resizeTimer
    );


    resizeTimer =
      setTimeout(
        () => {

          resizeCanvas();

          createNetwork();

        },
        150
      );

  }
);
