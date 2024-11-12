
// Get current route
const currentRoute = window.location.pathname;

const regex = /\/s(\/|$)/;
if (regex.test(currentRoute)) {
  getContent().then((resItems) => {
    const items = serializeItems(resItems)
    displayItems(items);
  });

} else {
  console.log('This is not a valid route');
}


async function getContent(pageId = 0, items = []) {
  const querry = `pagination[page] = ${pageId}`;
  const url = currentRoute + '?' + querry;

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
    const doc = parser.parseFromString(htmlText, 'text/html');

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
      url: item.url
    };
  });
}

// Function to display items in a graph (Chart.js)
function displayItems(items) {
  // Create a container div for the graph
  const container = document.createElement('div');
  container.style.margin = '20px';
  container.style.padding = '10px';
  container.style.border = '1px solid #ddd';
  container.style.backgroundColor = '#f9f9f9';
  document.body.appendChild(container);

  // Create a title for the container
  const title = document.createElement('h2');
  title.textContent = 'Motorcycle Price Comparison';
  container.appendChild(title);

  // Create a canvas element for the chart
  const canvas = document.createElement('canvas');
  canvas.id = 'myChart';
  container.appendChild(canvas);

  // Prepare data for the chart (e.g., names and prices)
  const labels = items.map(item => item.name);
  const prices = items.map(item => item.price);

  const chartJsUrl = chrome.runtime.getURL('assets/chart.js');
  (async () => {
    try {
      const ChartModule = await import(chartJsUrl);

      // Access the named export 'Chart'

      // Check if the import was successful
      console.log("Chart.js loaded as a module", Chart, chartJsUrl);

      // Create the chart
      new ChartModule.Chart(canvas, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Price Comparison',
            data: prices,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    } catch (error) {
      console.error('Error creating chart:', error);
    }
  }
  )();
}

