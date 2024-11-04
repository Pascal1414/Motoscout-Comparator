
// Get current route
const currentRoute = window.location.pathname;

const regex = /\/s(\/|$)/;
if (regex.test(currentRoute)) {
    // get the following tag with the type: <script type="application/ld+json" >
    const script = document.querySelector('script[type="application/ld+json"]');
    // get the content of the script tag
    const scriptContent = JSON.parse(script.textContent);
    console.log("scriptContent", scriptContent);

    const items = scriptContent.mainEntity.offers.itemListElement;
    console.log("items", items);

    const html = getHTML(items);
    // add "<link rel="stylesheet" href="path/to/your/charts.min.css">" to header
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/charts.css/dist/charts.min.css';
    document.head.appendChild(link);

    // Append content to the body
    const body = document.querySelector('body');
    body.innerHTML = html;

} else {
    console.log('This is not a valid route');
}


function getHTML(items) {
    // Normalize the data to a 0-1 range for chart display
    function normalizeData(data, key) {
        const values = data.map(item => item[key]);
        const min = Math.min(...values);
        const max = Math.max(...values);
        return data.map(item => (item[key] - min) / (max - min));
    }

    const normalizedPrices = normalizeData(items, 'price');
    const normalizedKms = normalizeData(items, 'km');

    // Generate the table rows for each item
    const rows = items.map((item, index) => {
        return `
      <tr>
        <td style="--start: ${normalizedKms[index]}; --end: ${normalizedKms[index] + 0.01};">
          <span class="data">${item.km} km</span>
        </td>
        <td style="--start: 0; --end: ${normalizedPrices[index]};">
          <span class="data">$${(item.price / 1000).toFixed(1)}K</span>
        </td>
      </tr>
    `;
    }).join('');

    // Return the full HTML structure
    return `
    <div class="chart-container">
      <div id="my-chart">
        <table class="charts-css line show-heading show-primary-axis show-data-axes">
          <caption>Price vs Kilometer Chart</caption>
          <!-- Table headers for labels -->
          <tr>
            <th scope="col">Kilometers (in %)</th>
            <th scope="col">Price (in %)</th>
          </tr>
          ${rows}
        </table>
      </div>
    </div>
  `;
}
