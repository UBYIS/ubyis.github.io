// Element references
const linkTable = document.getElementById("linkies-body");
const backButton = document.getElementById("backbutton");
const forwardButton = document.getElementById("forwardbutton");
const pageNumber = document.getElementById("pagenumber");

// Number formatting
const formatObject = new Intl.NumberFormat("en-US");

let sitesJSON;

// Utility Functions
const genRandHex = (size) =>
  [...Array(size)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");

const genRandInt = (length) => Math.floor(Math.random() * length);


function shiftText(text, n) {
  n = n % text.length;
  return text.slice(n) + text.slice(0, n);
}

function invisObfuscate(str) {
  const invisibleChars = ["\u200B", "\u200C", "\u200D", "\u2060"];
  return str
    .split("")
    .map((char) => {
      let modifiedChar = char;
      if (Math.random() < 0.3) {
        modifiedChar +=
          invisibleChars[Math.floor(Math.random() * invisibleChars.length)];
      }
      if (Math.random() < 0.2) {
        modifiedChar = `<span>${genRandHex(4)}</span>` + modifiedChar;
      }
      return modifiedChar;
    })
    .join("");
}

// Event Handlers
function handleRedirect(event) {
  event.preventDefault();
  const hrefChunks = event.target.href.split("/");
  const id = Number(hrefChunks[hrefChunks.length - 3]);
  console.log(sitesJSON[id]);
  window.open(atob(sitesJSON[id]["u"]), "_blank");
}

// Main Function to Fetch and Display Sites
async function getSites() {
  // Get current page number from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const linksPage = Number(urlParams.get("page")) || 1;
  pageNumber.innerText = linksPage;

  // Fetch and decode site data
  const edgeAPIResponse = await fetch(`/edge-api/getSites?page=${linksPage}`);
  const edgeAPIText = await edgeAPIResponse.text();
  const [shiftedText, shiftValue] = edgeAPIText.split(":");
  const unshiftedText = shiftText(shiftedText, Number(shiftValue) * -1);
  sitesJSON = JSON.parse(atob(unshiftedText));

  // Update navigation buttons
  if (linksPage === 1) {
    backButton.classList.add("page-button-hidden");
  } else {
    backButton.href = `/linkies?page=${linksPage - 1}`;
  }

  if (sitesJSON.length > 80) {
    forwardButton.href = `/linkies?page=${linksPage + 1}`;
  } else {
    forwardButton.classList.add("page-button-hidden");
  }

  // Populate table with site data
  sitesJSON.slice(0, 80).forEach((site, i) => {
    const url = atob(site["u"]);
    const requests = site["r"];
    const status = site["s"];

    const statusText =
      status === 0 ? "linkey-offline" :
      status === 2 ? "linkey-unknown" :
      "linkey-online";

    // Create table row
    const tableRow = document.createElement("tr");

    // Rank column
    const rankColumn = document.createElement("td");
    rankColumn.innerText = i + 80 * (linksPage - 1) + 1;
    tableRow.appendChild(rankColumn);

    // Link column
    const linkColumn = document.createElement("td");
    const link = document.createElement("a");
    link.href = `/${genRandInt(79)}/${i}/${genRandInt(79)}/${genRandInt(79)}`;
    link.innerHTML = invisObfuscate(url);
    link.draggable = false;
    link.target = "_blank";
    link.classList.add(statusText);
    link.addEventListener("click", handleRedirect);
    linkColumn.appendChild(link);
    tableRow.appendChild(linkColumn);

    // Requests column
    const requestsColumn = document.createElement("td");
    requestsColumn.innerText = formatObject.format(requests);
    tableRow.appendChild(requestsColumn);

    // Append row to table
    linkTable.appendChild(tableRow);
  });
}

document.addEventListener("DOMContentLoaded", getSites);