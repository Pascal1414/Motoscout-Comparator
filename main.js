
// Get current route
const currentRoute = window.location.pathname;

const regex = /\/s(\/|$)/;
if (regex.test(currentRoute)) {
  getContent().then((resItems) => {
    const items = serializeItems(resItems)
    console.log("items", items);

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
      year: item.year,
      km: item.offers.itemOffered.mileageFromOdometer.value,
      url: item.url
    };
  });
}
