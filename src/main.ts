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
  //const cursor = { active: false, x: 0, y: 0 };
  let drawing = false;
  const points: { x: number; y: number }[][] = [];

  canvas.addEventListener("mousedown", (e) => {
    drawing = true;
    // cursor.active = true;
    // cursor.x = e.offsetX;
    // cursor.y = e.offsetY;
    // ctx.beginPath();
    // ctx.moveTo(cursor.x, cursor.y);
    // ctx.lineWidth = 2;
    // ctx.strokeStyle = "black";
    // ctx.lineJoin = "round";
    // ctx.lineCap = "round";
    drawing = true;
    points.push([{ x: e.offsetX, y: e.offsetY }]);
    canvas.dispatchEvent(new Event("drawing-changed"));
  });

  canvas.addEventListener("mousemove", (e) => {
    if (drawing) {
      const curPoint = { x: e.offsetX, y: e.offsetY };
      points[points.length - 1].push(curPoint);
      //points.push({ x: cursor.x, y: cursor.y });
      canvas.dispatchEvent(new Event("drawing-changed"));
    }
  });

  canvas.addEventListener("mouseup", () => {
    //cursor.active = false;
    //ctx.closePath();
    drawing = false;
    //points.push([]);
    canvas.dispatchEvent(new Event("drawing-changed"));
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
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    points.length = 0;
    canvas.dispatchEvent(new Event("drawing-changed"));
  });

  canvas.addEventListener("drawing-changed", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const pointSet of points) {
      ctx.beginPath();
      ctx.moveTo(pointSet[0].x, pointSet[0].y);
      for (const point of pointSet) {
        ctx.lineTo(point.x, point.y);
      }
      ctx.stroke();
    }
  });
}
