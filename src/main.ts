import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Pallavi's game";

const canvas = document.createElement("canvas");
canvas.width = 256;
canvas.height = 256;
canvas.style.border = "1px solid black"; //thin black border
canvas.style.borderRadius = "10px"; //rounded corners
canvas.style.boxShadow = "2px 2px 10px rgba(0, 0, 0, 0.3)"; //drop shadow

document.title = gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);
app.appendChild(canvas);
