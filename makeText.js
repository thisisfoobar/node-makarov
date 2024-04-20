/** Command-line tool to generate Markov text. */

const fs = require("fs");
const process = require("process");
const axios = require("axios");
const { MarkovMachine } = require("./markov");
const { stripHtml } =  require("string-strip-html");

/** determin if output should be console or file */
function writeFile(text, out) {
  if (out) {
    fs.appendFile(out, `${text}\n`, "utf8", function (err) {
      if (err) {
        console.error(`Couldn't write ${out}: ${err}`);
        process.exit(1);
      }
    });
  } else {
    console.log(text);
  }
}

function cat(path, out) {
  fs.readFile(path, "utf8", function (err, data) {
    if (err) {
      console.error(`Error reading ${path}:`, err);
      process.exit(1);
    } else {
      let mm = new MarkovMachine(data);
      let newText = mm.makeText()
      writeFile(newText, out);
    }
  });
}

async function webCat(url, out) {
  try {
    const response = await axios.get(url);
    let strippedHTML = stripHtml(response.data).result;
    let mm = new MarkovMachine(strippedHTML);
    let newText = mm.makeText()
    writeFile(newText, out);
  } catch (err) {
    console.error(`Error fetching ${url}`, err);
    process.exit(1);
  }
}

let path;
let out;

function webOrFile() {
  if (path.slice(0, 4) === "http") {
    webCat(path, out);
  } else {
    cat(path, out);
  }
}

if (process.argv[2] === "--out") {
  out = process.argv[3];
  for (let i = 4; i < process.argv.length; i += 1) {
    path = process.argv[i];
    webOrFile();
  }
} else {
  for (let i = 2; i < process.argv.length; i += 1) {
    path = process.argv[i];
    webOrFile();
  }
}
