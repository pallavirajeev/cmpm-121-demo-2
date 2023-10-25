import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Sticker Pad";

const canvas = document.createElement("canvas");
canvas.width = 256;
canvas.height = 256;
canvas.style.border = "1px solid black"; // Thin black border
canvas.style.borderRadius = "10px"; // Rounded corners
canvas.style.boxShadow = "2px 2px 10px rgba(0, 0, 0, 0.3)"; // Drop shadow

const ctx = canvas.getContext("2d");

const commands: LineCommand[] = [];
const redoCommands: LineCommand[] = [];

let currentLineCommand: LineCommand | null = null;
let markerStyle = "thin";

let cursorCommand: {
  execute: (arg0: CanvasRenderingContext2D) => void;
} | null = null;

class CursorCommand {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  execute(ctx: CanvasRenderingContext2D) {
    const xOff = 8;
    const yOff = 16;
    ctx.font = "32px monospace";
    ctx.fillText("*", this.x - xOff, this.y + yOff);
  }
}

class LineCommand {
  points: { x: number; y: number }[];
  thickness = 1;
  constructor(x: number, y: number, thickness: number) {
    this.points = [{ x, y }];
    this.thickness = thickness;
  }
  execute(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = "black";
    ctx.lineWidth = this.thickness;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    const start = 0;
    const { x, y } = this.points[start];
    ctx.moveTo(x, y);
    for (const { x, y } of this.points) {
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  grow(x: number, y: number) {
    this.points.push({ x, y });
  }
}

canvas.addEventListener("mouseout", () => {
  cursorCommand = null;
  canvas.dispatchEvent(new Event("drawing-changed"));
});

canvas.addEventListener("mousedown", (e) => {
  currentLineCommand = new LineCommand(
    e.offsetX,
    e.offsetY,
    markerStyle === "thin" ? 1 : 5
  );
  commands.push(currentLineCommand);
  const start = 0;
  redoCommands.splice(start, redoCommands.length);
  canvas.dispatchEvent(new Event("drawing-changed"));
});

canvas.addEventListener("mousemove", (e) => {
  cursorCommand = new CursorCommand(e.offsetX, e.offsetY);
  canvas.dispatchEvent(new Event("drawing-changed"));
  const one = 1;
  if (e.buttons == one && currentLineCommand) {
    currentLineCommand.points.push({ x: e.offsetX, y: e.offsetY });
  }
});

canvas.addEventListener("mouseup", () => {
  currentLineCommand = null;
  canvas.dispatchEvent(new Event("drawing-changed"));
});

const clearButton = document.createElement("button");
clearButton.innerHTML = "Clear";
clearButton.style.padding = "7px";
clearButton.style.border = "1px solid black"; // Thin black border

const undoButton = document.createElement("button");
undoButton.innerHTML = "Undo";
undoButton.style.padding = "7px";
undoButton.style.border = "1px solid black"; // Thin black border

const redoButton = document.createElement("button");
redoButton.innerHTML = "Redo";
redoButton.style.padding = "7px";
redoButton.style.border = "1px solid black"; // Thin black border

const thinButton = document.createElement("button");
thinButton.innerHTML = "Thin";
thinButton.style.padding = "7px";
thinButton.style.border = "1px solid black"; // Thin black border

const thickButton = document.createElement("button");
thickButton.innerHTML = "Thick";
thickButton.style.padding = "7px";
thickButton.style.border = "1px solid black"; // Thin black border

document.title = gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);
app.appendChild(canvas);
app.appendChild(clearButton);
app.appendChild(undoButton);
app.appendChild(redoButton);
app.appendChild(thinButton);
app.appendChild(thickButton);

clearButton.addEventListener("click", () => {
  const start = 0;
  commands.splice(start, commands.length);
  canvas.dispatchEvent(new Event("drawing-changed"));
});

undoButton.addEventListener("click", () => {
  const len = 0;
  if (commands.length > len) {
    redoCommands.push(commands.pop()!);
    canvas.dispatchEvent(new Event("drawing-changed"));
  }
});

redoButton.addEventListener("click", () => {
  const len = 0;
  if (redoCommands.length > len) {
    commands.push(redoCommands.pop()!);
    canvas.dispatchEvent(new Event("drawing-changed"));
  }
});

thinButton.addEventListener("click", () => {
  markerStyle = "thin";
  thinButton.classList.add("selectedTool");
  thickButton.classList.remove("selectedTool");
});

thickButton.addEventListener("click", () => {
  markerStyle = "thick";
  thickButton.classList.add("selectedTool");
  thinButton.classList.remove("selectedTool");
});

if (ctx) {
  canvas.addEventListener("drawing-changed", () => {
    const x = 0;
    const y = 0;
    ctx.clearRect(x, y, canvas.width, canvas.height);
    commands.forEach((cmd) => cmd.execute(ctx));
    if (cursorCommand) {
      cursorCommand.execute(ctx);
    }
  });
}
