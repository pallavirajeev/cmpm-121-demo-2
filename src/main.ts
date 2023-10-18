import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Pallavi's game";

const canvas = document.createElement("canvas");
canvas.width = 256;
canvas.height = 256;
canvas.style.border = "1px solid black"; //thin black border
canvas.style.borderRadius = "10px"; //rounded corners
canvas.style.boxShadow = "2px 2px 10px rgba(0, 0, 0, 0.3)"; //drop shadow

const ctx = canvas.getContext("2d");

if (ctx) {
  const cursor = { active: false, x: 0, y: 0 };

  canvas.addEventListener("mousedown", (e) => {
    cursor.active = true;
    cursor.x = e.offsetX;
    cursor.y = e.offsetY;
    ctx.beginPath();
    ctx.moveTo(cursor.x, cursor.y);
    ctx.lineWidth = 2; // Set the line width
    ctx.strokeStyle = "black"; // Set the line color
    ctx.lineJoin = "round"; // Set line join to round
    ctx.lineCap = "round"; // Set line cap to round
  });

  canvas.addEventListener("mousemove", (e) => {
    if (cursor.active) {
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
    }
  });

  canvas.addEventListener("mouseup", () => {
    cursor.active = false;
    ctx.closePath();
  });

  const clearButton = document.createElement("button");
  clearButton.innerHTML = "Clear";
  clearButton.style.padding = "7px";
  clearButton.style.border = "1px solid black"; //thin black border

  document.title = gameName;

  const header = document.createElement("h1");
  header.innerHTML = gameName;
  app.append(header);
  app.appendChild(canvas);
  app.appendChild(clearButton);

  clearButton.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });
}
