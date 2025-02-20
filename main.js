let currentRoute = undefined;
let search = undefined;

removeExistingConatiner();

const injectHTML = `
  <div id="chart-container">
    <div class="flex-horizontal-container">
      <button id="load-button">Generate Chart</button>
      <p id="pagination-display"></p>
    </div>
    <div id="diagram-container">
    </div>
  </div>
`;

const container = document.createElement("div");
container.innerHTML = injectHTML;

// Append the container to the body
const ul = document.querySelector("[role=list]");
ul.parentNode.insertBefore(container, ul);

const diagramContainer = document.getElementById("diagram-container");

// Add onclick event to the button
const loadButton = document.getElementById("load-button");

loadButton.onclick = () => {
  // Get current route
  currentRoute = window.location.pathname;
  search = window.location.search;

  removeDiagram();

  const regex = /\/s(\/|$)/;
  if (regex.test(currentRoute)) {
    disableButton();
    getContent().then((resItems) => {
      const items = serializeItems(resItems);
      displayItems(items);
      enableButton();
    });
  } else {
    console.log("This is not a valid route");
  }
};

function disableButton() {
  loadButton.disabled = true;
}

function enableButton() {
  loadButton.disabled = false;
}

function removeDiagram() {
  diagramContainer.childNodes.forEach((child) => {
    diagramContainer.removeChild(child);
  });
}

function removeExistingConatiner() {
  const existingContainer = document.getElementById("chart-container");
  if (existingContainer) {
    existingContainer.remove();
  }
}

/**
 * @param {number} pageNumber  pageNumber is id + 1
 */
function displayPaginationNumber(pageNumber) {
  const diagramContainer = document.getElementById("pagination-display");
  diagramContainer.textContent = `Crawling page: ${pageNumber}`;
}

function displayPaginationFinished(finalPageNumber) {
  const diagramContainer = document.getElementById("pagination-display");
  diagramContainer.textContent = `Finished crawling. ${finalPageNumber} pages found.`;
}

async function getContent(pageId = 0, items = []) {
  const querry = `pagination[page] = ${pageId}`;

  let url = "";
  if (search) url = currentRoute + search + "&" + querry;
  else url = currentRoute + "?" + querry;

  displayPaginationNumber(pageId + 1);

  try {
    // Fetch url
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Error fetching page ${pageId}: ${response.status}`);
      return items;
    }

    const htmlText = await response.text();
    // Parse the HTML string into a DOM object
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html");

    // get the following tag with the type: <script type="application/ld+json" >
    const script = doc.querySelector('script[type="application/ld+json"]');
    if (!script) {
      console.error(`Script tag not found on page ${pageId}`);
      return items;
    }

    // get the content of the script tag
    const scriptContent = JSON.parse(script.textContent);

    const currItems = scriptContent.mainEntity.offers.itemListElement;

    if (!currItems || currItems.length === 0) {
      // pageId + 1 minus the last page -> pageId +-0
      displayPaginationFinished(pageId);
      return items;
    }

    // Continue fetching the next page
    return await getContent(pageId + 1, items.concat(currItems));
  } catch (error) {
    console.error(`Error processing page ${pageId}: ${error.message}`);
    return items;
  }
}

function serializeItems(items) {
  return items.map((item) => {
    return {
      name: item.name,
      price: item.offers.price,
      year: null,
      km: item.offers.itemOffered.mileageFromOdometer.value,
      url: item.url,
    };
  });
}

// Function to display items in a graph (Chart.js)
function displayItems(items) {
  // Create a container div for the graph
  const container = document.createElement("div");
  container.style.padding = "10px";
  container.style.border = "1px solid #ddd";
  container.style.width = "70%";
  container.style.margin = "3px 0 10px 0";

  diagramContainer.appendChild(container);

  // Create a title for the container
  const title = document.createElement("h2");
  title.textContent = "Motorcycle Price Comparison";
  container.appendChild(title);

  // Create a subtitle that displays the number of items
  const subtitle = document.createElement("h3");
  subtitle.textContent = `Found ${items.length} motorcycles`;
  container.appendChild(subtitle);

  // Create a canvas element for the chart
  const canvas = document.createElement("canvas");
  canvas.id = "myChart";
  container.appendChild(canvas);

  const xyValues = items.map((item, index) => {
    return { x: item.km, y: item.price, label: item.name };
  });

  const links = items.map((item) => item.url);

  const chartJsUrl = chrome.runtime.getURL("assets/chart.js");
  (async () => {
    try {
      await import(chartJsUrl);

      // Create the chart
      new Chart(canvas, {
        type: "scatter",
        data: {
          datasets: [
            {
              label: "Motorcycle Listings",
              pointRadius: 4,
              pointBackgroundColor: "rgba(0,0,255,1)",
              data: xyValues,
            },
          ],
        },
        options: {
          onClick: (event, elements) => {
            // Check if a data point was clicked
            if (elements.length > 0) {
              const index = elements[0].index;
              const link = links[index];

              if (link) {
                // Open the link in a new tab
                window.open(link, "_blank");
              }
            }
          },
          responsive: true,
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  return context.raw.label;
                },
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Km",
              },
            },
            y: {
              title: {
                display: true,
                text: "Price",
              },
            },
          },
        },
      });
    } catch (error) {
      console.error("Error creating chart:", error);
    }
  })();
}
