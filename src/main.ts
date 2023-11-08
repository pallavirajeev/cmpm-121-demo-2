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

//working on step 12:
// const colorPicker = document.getElementById("colorPicker");
// let markerColor = colorPicker.value;

// colorPicker.addEventListener('input', (event) => {
//   markerColor = event.target.value;
// });

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
        ctx.fillText(sticker, this.x, this.y);
      } else {
        ctx.strokeStyle = "black";
        ctx.lineWidth = markerStyle === "thin" ? 1 : 5;
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

  // setPosition(x: number, y: number) {
  //   this.x = x;
  //   this.y = y;
  // }

  // setSticker(type: string | null) {
  //   this.type = type;
  // }

  // clear() {
  //   this.type = null;
  // }

  execute(ctx: CanvasRenderingContext2D) {
    if (this.stickerStr) {
      ctx.font = "24px sans-serif";
      ctx.fillText(this.stickerStr, this.x, this.y);
    }
  }
}

const toolPreview = new ToolPreview();
// const stickerPreview = new StickerPreview();

class LineCommand {
  points: { x: number; y: number }[];
  thickness = 1;
  constructor(x: number, y: number, thickness: number) {
    this.points = [{ x, y }];
    this.thickness = thickness;
  }
  execute(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = "black";
    // ctx.strokeStyle = markerColor;
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
  //}
  grow(x: number, y: number) {
    this.points.push({ x, y });
  }
}

const stickers: { x: number; y: number; type: string }[] = [];

canvas.addEventListener("mouseout", () => {
  toolPreview.hide();
  // stickerPreview.clear();
  canvas.dispatchEvent(new Event("drawing-changed"));
});

//add something to check if currentlyDrawing

canvas.addEventListener("mousedown", (e) => {
  toolPreview.hide();
  const thin = 1;
  const thick = 5;
  // currentLineCommand = new LineCommand(
  //   e.offsetX,
  //   e.offsetY,
  //   markerStyle === "thin" ? thin : thick
  // );
  // let currentLineCommand: LineCommand | StickerCommand;
  if (markerStyle != "sticker") {
    currentLineCommand = new LineCommand(
      e.offsetX,
      e.offsetY,
      markerStyle === "thin" ? thin : thick
    );
    const start = 0;
    redoCommands.splice(start, redoCommands.length);
    commands.push(currentLineCommand);
  } else {
    commands.push(new StickerCommand(e.offsetX, e.offsetY, sticker));
  }
  canvas.dispatchEvent(new Event("drawing-changed"));
});

canvas.addEventListener(
  "mousemove",
  (e) => {
    // if (markerStyle === "sticker") {
    //   stickerPreview.setPosition(e.offsetX, e.offsetY);
    //   stickerPreview.setSticker(sticker);
    //   canvas.dispatchEvent(new Event("drawing-changed"));
    // }

    // if (markerStyle === "sticker") {
    //   stickerPreview.setPosition(e.offsetX, e.offsetY);
    //   stickerPreview.setSticker(sticker);
    //   canvas.dispatchEvent(new Event("drawing-changed"));
    //   } else {
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
  }
  //}
);

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

const em1Button = document.createElement("button");
em1Button.innerHTML = "😄";
em1Button.style.padding = "7px";
em1Button.style.border = "1px solid black"; // Thin black border
divS.append(em1Button);

const em2Button = document.createElement("button");
em2Button.innerHTML = "❤️‍🔥";
em2Button.style.padding = "7px";
em2Button.style.border = "1px solid black"; // Thin black border
divS.append(em2Button);

const em3Button = document.createElement("button");
em3Button.innerHTML = "🥗";
em3Button.style.padding = "7px";
em3Button.style.border = "1px solid black"; // Thin black border
divS.append(em3Button);

//step 9:
// const customStickerButton = document.createElement("button");
// customStickerButton.innerHTML = "Create Custom Sticker";
// customStickerButton.style.padding = "7px";
// customStickerButton.style.border = "1px solid black";
// divS.append(customStickerButton);

// customStickerButton.addEventListener("click", () => {
//   const customStickerText = prompt("Enter a string for your custom sticker: ", "🎛️");
//   if (customStickerText) {
//     markerStyle = "sticker";
//     sticker = customStickerText;
//     canvas.dispatchEvent(new Event("drawing-changed"));
//   }
// });

//step 10:
// const exportButton = document.createElement("button");
// exportButton.innerHTML = "Export";
// exportButton.style.padding = "7px";
// exportButton.style.border = "1px solid black";

// exportButton.addEventListener("click", () => {
//   const exportCanvas = document.createElement("canvas");
//   exportCanvas.width = 1024;
//   exportCanvas.height = 1024;
//   //set the canvas scale to be bigger at 1024x1024
//   const exportCtx = exportCanvas.getContext("2d");
//   if (exportCtx) {
//     exportCtx.scale(4, 4);
//     commands.forEach((cmd) => {
//       if (cmd instanceof LineCommand || cmd instanceof StickerCommand) {
//         cmd.execute(exportCtx);
//       }
//     });
//   }
//   const dataURL = exportCanvas.toDataURL("image/png");
//   const a = document.createElement("a");
//   a.href = dataURL;
//   a.download = "exported_canvas.png";
//   a.click();
// });

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
//app.appendChild(exportButton);

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
  // if (stickers.length > len) {
  //   stickerCommand.push(stickers.pop()!);
  //   canvas.dispatchEvent(new Event("drawing-changed"));
  // }
});

redoButton.addEventListener("click", () => {
  const len = 0;
  if (redoCommands.length > len) {
    commands.push(redoCommands.pop()!);
    canvas.dispatchEvent(new Event("drawing-changed"));
  }
  // if (stickerCommand.length > len) {
  //   stickers.push(stickerCommand.pop()!);
  //   canvas.dispatchEvent(new Event("drawing-changed"));
  // }
});

thinButton.addEventListener("click", () => {
  markerStyle = "thin";
});

thickButton.addEventListener("click", () => {
  markerStyle = "thick";
});

em1Button.addEventListener("click", () => {
  markerStyle = "sticker";
  sticker = "😄";
  canvas.dispatchEvent(new Event("drawing-changed"));
});

em2Button.addEventListener("click", () => {
  markerStyle = "sticker";
  sticker = "❤️‍🔥";
  canvas.dispatchEvent(new Event("drawing-changed"));
});

em3Button.addEventListener("click", () => {
  markerStyle = "sticker";
  sticker = "🥗";
  canvas.dispatchEvent(new Event("drawing-changed"));
});

if (ctx) {
  canvas.addEventListener("drawing-changed", () => {
    const x = 0;
    const y = 0;
    ctx.clearRect(x, y, canvas.width, canvas.height);

    commands.forEach((cmd: LineCommand | StickerCommand) => cmd.execute(ctx));

    // stickers.forEach((sticker) => {
    //   ctx.fillText(sticker.type, sticker.x, sticker.y);
    // });
    toolPreview.draw(ctx);
    // stickerPreview.draw(ctx);
  });
}
