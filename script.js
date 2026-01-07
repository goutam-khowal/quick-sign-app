// // ===== DOM ELEMENTS =====
// const colorPicker = document.getElementById("penColorPicker");
// const canvasColor = document.getElementById("bgColorPicker");
// const canvas = document.getElementById("signatureCanvas");
// const clearButton = document.getElementById("clearBtn");
// const saveButton = document.getElementById("saveBtn");
// const retrieveButton = document.getElementById("retrieveBtn");

// const penSize = document.getElementById("penSize");
// const ctx = canvas.getContext("2d");

// // ===== DRAWING STATE =====
// let lastX;
// let lastY;
// let isDrawing = false;

// // ===== EVENT LISTENERS =====

// // Change pen color
// colorPicker.addEventListener("change", (e) => {
//   ctx.strokeStyle = e.target.value;
// });

// // Handle mouse down - start drawing
// canvas.addEventListener("mousedown", (e) => {
//   isDrawing = true;
//   lastX = e.offsetX;
//   lastY = e.offsetY;
// });

// // Handle mouse move - draw line
// canvas.addEventListener("mousemove", (e) => {
//   if (isDrawing) {
//     ctx.beginPath();
//     ctx.moveTo(lastX, lastY);
//     ctx.lineTo(e.offsetX, e.offsetY);
//     ctx.stroke();

//     lastX = e.offsetX;
//     lastY = e.offsetY;
//   }
// });

// // Handle mouse up - stop drawing
// canvas.addEventListener("mouseup", () => {
//   isDrawing = false;
// });

// // Change canvas background color
// canvasColor.addEventListener("change", (e) => {
//   ctx.fillStyle = e.target.value;
//   ctx.fillRect(0, 0, 700, 400);
// });

// // Change pen size
// penSize.addEventListener("change", (e) => {
//   ctx.lineWidth = e.target.value;
// });

// // Clear canvas
// clearButton.addEventListener("click", () => {
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
// });

// // Save canvas to localStorage and download
// saveButton.addEventListener("click", () => {
//   localStorage.setItem("canvasSignature", canvas.toDataURL());
//   let link = document.createElement("a");
//   link.href = canvas.toDataURL();
//   link.download = "my-canvas.png";
//   link.click();
// });

// // Retrieve and restore last saved signature
// retrieveButton.addEventListener("click", () => {
//   const savedCanvas = localStorage.getItem("canvasSignature");
//   if (savedCanvas) {
//     let img = new Image();
//     img.src = savedCanvas;
//     ctx.drawImage(img, 0, 0);
//   }
// });
// ===== DOM ELEMENTS =====
const colorPicker = document.getElementById("penColorPicker");
const canvasColor = document.getElementById("bgColorPicker");
const canvas = document.getElementById("signatureCanvas");
const clearButton = document.getElementById("clearBtn");
const saveButton = document.getElementById("saveBtn");
const retrieveButton = document.getElementById("retrieveBtn");

const penSize = document.getElementById("penSize");
const ctx = canvas.getContext("2d");

// ===== CANVAS RESIZE FUNCTION =====
function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  ctx.fillStyle = "#ffffff"; // Default white background
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Initialize canvas size and add resize listener
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// ===== HELPER: Get accurate mouse position =====
function getMousePos(canvas, e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (e.clientX - rect.left) * (canvas.width / rect.width),
    y: (e.clientY - rect.top) * (canvas.height / rect.height),
  };
}

// ===== DRAWING STATE =====
let lastX;
let lastY;
let isDrawing = false;

// ===== EVENT LISTENERS =====

// Change pen color
colorPicker.addEventListener("change", (e) => {
  ctx.strokeStyle = e.target.value;
});

// Change canvas background color (with image preservation)
canvasColor.addEventListener("change", (e) => {
  ctx.fillStyle = e.target.value;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
});

// Change pen size (with live preview)
penSize.addEventListener("change", (e) => {
  ctx.lineWidth = e.target.value;
  document.getElementById("penSizeValue").textContent = e.target.value;
});

// Handle mouse down - start drawing
canvas.addEventListener("mousedown", (e) => {
  const pos = getMousePos(canvas, e);
  isDrawing = true;
  lastX = pos.x;
  lastY = pos.y;
});

// Handle mouse move - draw line
canvas.addEventListener("mousemove", (e) => {
  if (isDrawing) {
    const pos = getMousePos(canvas, e);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastX = pos.x;
    lastY = pos.y;
  }
});

// Handle mouse up/end - stop drawing
canvas.addEventListener("mouseup", () => {
  isDrawing = false;
});
canvas.addEventListener("mouseout", () => {
  isDrawing = false;
});

// Clear canvas
clearButton.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
});

// Save canvas to localStorage and download
saveButton.addEventListener("click", () => {
  localStorage.setItem("canvasSignature", canvas.toDataURL());
  const link = document.createElement("a");
  link.href = canvas.toDataURL();
  link.download = "my-signature.png";
  link.click();
});

// Retrieve and restore last saved signature
retrieveButton.addEventListener("click", () => {
  const savedCanvas = localStorage.getItem("canvasSignature");
  if (savedCanvas) {
    const img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    img.src = savedCanvas;
  }
});
