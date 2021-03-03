const canvas = document.getElementById("js-frame");
const tip    = document.getElementById("js-tip");

const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 400;

// whether the frame is active
let isPresent = false;


function drawFrame(image) {
  isPresent = true;

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const margin = 5;
  const maxHeight = canvas.height - 125;

  // scale image down
  let width  = 450;
  let height = width * image.height / image.width;

  // cap the height
  if (height >= maxHeight) {
    height = maxHeight;
    width  = height * image.width / image.height;
  }

  // save these to stop repetitiveness
  let top  = canvas.height / 2 - height / 2;
  let left = canvas.width / 2 - width / 2;

  // draw outline
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(left - margin, top - margin, width + margin * 2, height + margin * 2);

  ctx.fillStyle = "#000000";
  ctx.fillRect(left - margin / 2, top - margin / 2, width + margin, height + margin);

  // draw image
  ctx.drawImage(image, left, top, width, height);

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";

  ctx.font = "32px Times new Roman";

  // 16 is half of 32
  ctx.fillText("what.", canvas.width / 2, canvas.height - top / 2 + 16);

  // draw watermark for free publicity
  const wm = "ihaveno.faith";

  ctx.font = "12px Times new Roman";
  ctx.fillStyle = "#ffffff7f"
  ctx.textAlign = "right";

  ctx.fillText(wm, canvas.width - 10, 10 + 8);
}

// copy pasting
window.addEventListener("keydown", event => {
  if (!isPresent || !event.ctrlKey || event.key !== 'c') {
    return; // wasn't CTRL + C
  }

  event.preventDefault();
  canvas.toBlob(blob => {
    let data = new ClipboardItem({ "image/png": blob });
    navigator.clipboard.write([ data ]);

    tip.innerText = "copied.";
  });
});

// allow pasting
window.addEventListener("paste", async (event) => {
  event.preventDefault();
  event.stopPropagation();

  // handle pasting
  for (let item of event.clipboardData.items) {
    // make sure it is a type of image
    if (item.type.indexOf("image") === -1) {
      continue;
    }

    // pass off to this function
    handlePaste(item.getAsFile());
    break;
  }
});

function handlePaste(file) {
  // make blob URL for the image pasted
  const url = (window.webkitURL || window.URL).createObjectURL(file);

  // create the image object
  const image = new Image();
  image.src = url;

  // call "drawFrame" function passing this (being image) as an arg
  image.onload = () => drawFrame(image);
  tip.innerText = "ctrl+c to copy.";
}
