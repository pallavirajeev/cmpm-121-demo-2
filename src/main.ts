import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Sticker Pad";

const div = document.createElement("div");
const divS = document.createElement("div");

const canvas = document.createElement("canvas");
canvas.width = 256;
canvas.height = 256;
canvas.style.border = "1px solid black"; // Thin black border
canvas.style.borderRadius = "10px"; // Rounded corners
canvas.style.boxShadow = "2px 2px 10px rgba(0, 0, 0, 0.3)"; // Drop shadow
div.append(canvas);

const ctx = canvas.getContext("2d");

const commands: (LineCommand | StickerCommand)[] = [];
const redoCommands: (LineCommand | StickerCommand)[] = [];

// const stickerCommand: { x: number; y: number; type: string }[] = [];

let sticker = "";

let currentLineCommand: LineCommand | null = null;
let markerStyle = "thin";


class ToolPreview {
  x: number;
  y: number;
  visible: boolean;

  constructor() {
    this.x = 0;
    this.y = 0;
    this.visible = false;
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.visible) {
      if (markerStyle == "sticker") {
        ctx.fillStyle = markerColor;
        ctx.fillText(sticker, this.x, this.y);
      } else {
        // ctx.strokeStyle = "black";
        ctx.strokeStyle = markerColor;
        ctx.lineWidth = markerStyle === "thin" ? 3 : 7;
        const yOffset = 0; //was -2
        ctx.beginPath();
        ctx.arc(this.x, this.y + yOffset, ctx.lineWidth / 2, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  }
}

class StickerCommand {
  x: number;
  y: number;
  stickerStr: string | null;

  constructor(x: number, y: number, stickerStr: string) {
    this.x = x;
    this.y = y;
    this.stickerStr = stickerStr;
  }

  execute(ctx: CanvasRenderingContext2D) {
    if (this.stickerStr) {
      ctx.font = "24px sans-serif";
      ctx.fillText(this.stickerStr, this.x, this.y);
    }
  }
}

const toolPreview = new ToolPreview();

class LineCommand {
  points: { x: number; y: number }[];
  thickness = 1;
  color: string;
  constructor(x: number, y: number, thickness: number, color: string) {
    this.points = [{ x, y }];
    this.thickness = thickness;
    this.color = color;
  }
  execute(ctx: CanvasRenderingContext2D) {
    // ctx.strokeStyle = "black";
    ctx.strokeStyle = this.color;
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

const stickers: { x: number; y: number; type: string }[] = [];

canvas.addEventListener("mouseout", () => {
  toolPreview.hide();
  canvas.dispatchEvent(new Event("drawing-changed"));
});

//add something to check if currentlyDrawing

canvas.addEventListener("mousedown", (e) => {
  toolPreview.hide();
  const thin = 1;
  const thick = 5;

  if (markerStyle != "sticker") {
    currentLineCommand = new LineCommand(
      e.offsetX,
      e.offsetY,
      markerStyle === "thin" ? thin : thick,
      markerColor  // Use the selected color

    );
    const start = 0;
    redoCommands.splice(start, redoCommands.length);
    commands.push(currentLineCommand);
  } else {
    commands.push(new StickerCommand(e.offsetX, e.offsetY, sticker));
  }
  canvas.dispatchEvent(new Event("drawing-changed"));
});

canvas.addEventListener("mousemove", (e) => {
  if (!currentLineCommand) {
    toolPreview.setPosition(e.offsetX, e.offsetY);
    toolPreview.show();
    //stickerPreview.clear();
    canvas.dispatchEvent(new Event("drawing-changed"));
  }

  if (e.buttons === 1 && currentLineCommand) {
    currentLineCommand.grow(e.offsetX, e.offsetY);
    canvas.dispatchEvent(new Event("drawing-changed"));
  }
});

canvas.addEventListener("mouseup", (e) => {
  if (markerStyle == "sticker") {
    const newSticker = { x: e.offsetX, y: e.offsetY, type: sticker };
    stickers.push(newSticker);
    currentLineCommand = null;
  } else {
    currentLineCommand = null;
  }
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

// const em1Button = document.createElement("button");
// em1Button.innerHTML = "😄";
// em1Button.style.padding = "7px";
// em1Button.style.border = "1px solid black"; // Thin black border
// divS.append(em1Button);

// const em2Button = document.createElement("button");
// em2Button.innerHTML = "❤️‍🔥";
// em2Button.style.padding = "7px";
// em2Button.style.border = "1px solid black"; // Thin black border
// divS.append(em2Button);

// const em3Button = document.createElement("button");
// em3Button.innerHTML = "🥗";
// em3Button.style.padding = "7px";
// em3Button.style.border = "1px solid black"; // Thin black border
// divS.append(em3Button);

const stickersData = [
  { emoji: "😄", name: "Happy Face" },
  { emoji: "❤️‍🔥", name: "Heart on Fire" },
  { emoji: "🥗", name: "Salad" }
];

stickersData.forEach((stickerData) => {
  const stickerButton = document.createElement("button");
  stickerButton.innerHTML = stickerData.emoji;
  stickerButton.style.padding = "7px";
  stickerButton.style.border = "1px solid black"; // Thin black border
  divS.append(stickerButton);

  stickerButton.addEventListener("click", () => {
    markerStyle = "sticker";
    sticker = stickerData.emoji;
    canvas.dispatchEvent(new Event("drawing-changed"));
  });
});

document.body.appendChild(divS);

//step 9:
const customStickerButton = document.createElement("button");
customStickerButton.innerHTML = "Create Custom Sticker";
customStickerButton.style.padding = "7px";
customStickerButton.style.border = "1px solid black";
divS.append(customStickerButton);

customStickerButton.addEventListener("click", () => {
  const customStickerText = prompt("Enter a string for your custom sticker: ", "🎛️");
  if (customStickerText) {
    markerStyle = "sticker";
    sticker = customStickerText;
    canvas.dispatchEvent(new Event("drawing-changed"));
  }
});

//step 10:
const exportButton = document.createElement("button");
exportButton.innerHTML = "Export";
exportButton.style.padding = "7px";
exportButton.style.border = "1px solid black";

exportButton.addEventListener("click", () => {
  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = 1024;
  exportCanvas.height = 1024;
  //set the canvas scale to be bigger at 1024x1024
  const exportCtx = exportCanvas.getContext("2d");
  if (exportCtx) {
    exportCtx.scale(4, 4);
    commands.forEach((cmd) => {
      if (cmd instanceof LineCommand || cmd instanceof StickerCommand) {
        cmd.execute(exportCtx);
      }
    });
  }
  const dataURL = exportCanvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = dataURL;
  a.download = "exported_canvas.png";
  a.click();
});

document.title = gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);
app.append(div);
app.appendChild(clearButton);
app.appendChild(undoButton);
app.appendChild(redoButton);
app.appendChild(thinButton);
app.appendChild(thickButton);
app.append(divS);
app.appendChild(exportButton);

//working on step 12:

let markerColor = "#000000"; // Default color

const colorPicker = document.createElement("input");
colorPicker.type = "color";
colorPicker.value = markerColor;
colorPicker.id = "colorPicker";
app.append(colorPicker);

colorPicker.addEventListener("input", (event) => {
  markerColor = (event.target as HTMLInputElement).value;
  canvas.dispatchEvent(new Event("drawing-changed"));
});


clearButton.addEventListener("click", () => {
  const start = 0;
  commands.splice(start, commands.length);
  stickers.length = 0; // Clear stickers
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
});

thickButton.addEventListener("click", () => {
  markerStyle = "thick";
});

// em1Button.addEventListener("click", () => {
//   markerStyle = "sticker";
//   sticker = "😄";
//   canvas.dispatchEvent(new Event("drawing-changed"));
// });

// em2Button.addEventListener("click", () => {
//   markerStyle = "sticker";
//   sticker = "❤️‍🔥";
//   canvas.dispatchEvent(new Event("drawing-changed"));
// });

// em3Button.addEventListener("click", () => {
//   markerStyle = "sticker";
//   sticker = "🥗";
//   canvas.dispatchEvent(new Event("drawing-changed"));
// });

if (ctx) {
  canvas.addEventListener("drawing-changed", () => {
    const x = 0;
    const y = 0;
    ctx.clearRect(x, y, canvas.width, canvas.height);

    commands.forEach((cmd: LineCommand | StickerCommand) => cmd.execute(ctx));

    toolPreview.draw(ctx);
  });
}
