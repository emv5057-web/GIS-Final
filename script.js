// Add your Mapbox access token here
mapboxgl.accessToken = "Ypk.eyJ1IjoiZXZlc21hbm92YSIsImEiOiJjbW9tM29wdjcwY2t1MndvdnN3YngweHMwIn0.XoXg4-PC2R4YznzdebM6nA";

// Create the map
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v11",
  center: [-73.95, 40.72],
  zoom: 9.5,
  scrollZoom: false
});

map.addSource("neighborhoods", {
  type: "geojson",
  data: "neighborhoods.geojson"
});


// Income selector and reset button
const incomeSelect = document.getElementById("income-select");
const resetButton = document.getElementById("reset-button");
const mapDescription = document.getElementById("map-description");

// Basic affordability rule: monthly rent should be no more than 30% of income
function getAffordableMonthlyRent(income) {
  return (income * 0.3) / 12;
}

// Color Manhattan neighborhoods based on selected income
function getAffordabilityColorExpression(income) {
  const affordableRent = getAffordableMonthlyRent(income);

  return [
    "case",
    ["<=", ["get", "median_rent"], affordableRent],
    "#2e8b57", // affordable
    "#d95f5f"  // not affordable
  ];
}
map.on("click", "neighborhood-fill", (event) => {
  const props = event.features[0].properties;

  new mapboxgl.Popup()
    .setLngLat(event.lngLat)
    .setHTML(`
      <h3>${props.neighborhood}</h3>
      <p><strong>Borough:</strong> ${props.borough}</p>
      <p><strong>Median rent:</strong> Add rent data here</p>
      <p><strong>Median income:</strong> Add income data here</p>
    `)
    .addTo(map);
});


map.addLayer({
  id: "neighborhood-fill",
  type: "fill",
  source: "neighborhoods",
  paint: {
    "fill-color": "#d95f5f",
    "fill-opacity": 0.55
  }
});

map.addLayer({
  id: "neighborhood-outline",
  type: "line",
  source: "neighborhoods",
  paint: {
    "line-color": "#ffffff",
    "line-width": 1
  }
});

// Load data and map layers
map.on("load", () => {
  // Borough-level data
  map.addSource("boroughs", {
    type: "geojson",
    data: "data/boroughs.geojson"
  });

  map.addLayer({
    id: "borough-fill",
    type: "fill",
    source: "boroughs",
    paint: {
      "fill-color": [
        "interpolate",
        ["linear"],
        ["get", "median_rent"],
        1500, "#f6d6c9",
        2500, "#e89b83",
        3500, "#b94a48",
        4500, "#6f1d1b"
      ],
      "fill-opacity": 0.75
    }
  });

  map.addLayer({
    id: "borough-outline",
    type: "line",
    source: "boroughs",
    paint: {
      "line-color": "#ffffff",
      "line-width": 1.5
    }
  });

  // Manhattan neighborhood-level data
  map.addSource("manhattan-neighborhoods", {
    type: "geojson",
    data: "data/manhattan-neighborhoods.geojson"
  });

  map.addLayer({
    id: "manhattan-fill",
    type: "fill",
    source: "manhattan-neighborhoods",
    layout: {
      visibility: "none"
    },
    paint: {
      "fill-color": getAffordabilityColorExpression(Number(incomeSelect.value)),
      "fill-opacity": 0.75
    }
  });

  map.addLayer({
    id: "manhattan-outline",
    type: "line",
    source: "manhattan-neighborhoods",
    layout: {
      visibility: "none"
    },
    paint: {
      "line-color": "#ffffff",
      "line-width": 1
    }
  });

  // Borough popup
  map.on("click", "borough-fill", (event) => {
    const props = event.features[0].properties;

    new mapboxgl.Popup()
      .setLngLat(event.lngLat)
      .setHTML(`
        <h3>${props.borough}</h3>
        <p><strong>Estimated median rent:</strong> $${Number(props.median_rent).toLocaleString()}</p>
        <p>${props.borough === "Manhattan" ? "Click Manhattan to zoom into neighborhood affordability." : "Try clicking Manhattan for the neighborhood view."}</p>
      `)
      .addTo(map);

    if (props.borough === "Manhattan") {
      showManhattanView();
    }
  });

  // Manhattan neighborhood popup
  map.on("click", "manhattan-fill", (event) => {
    const props = event.features[0].properties;
    const selectedIncome = Number(incomeSelect.value);
    const affordableRent = getAffordableMonthlyRent(selectedIncome);
    const isAffordable = Number(props.median_rent) <= affordableRent;

    new mapboxgl.Popup()
      .setLngLat(event.lngLat)
      .setHTML(`
        <h3>${props.neighborhood}</h3>
        <p><strong>Estimated median rent:</strong> $${Number(props.median_rent).toLocaleString()}</p>
        <p><strong>Affordable rent at $${selectedIncome.toLocaleString()} income:</strong> $${Math.round(affordableRent).toLocaleString()}</p>
        <p><strong>Status:</strong> ${isAffordable ? "Affordable" : "Not affordable"}</p>
      `)
      .addTo(map);
  });

  // Change cursor on hover
  map.on("mouseenter", "borough-fill", () => {
    map.getCanvas().style.cursor = "pointer";
  });

  map.on("mouseleave", "borough-fill", () => {
    map.getCanvas().style.cursor = "";
  });

  map.on("mouseenter", "manhattan-fill", () => {
    map.getCanvas().style.cursor = "pointer";
  });

  map.on("mouseleave", "manhattan-fill", () => {
    map.getCanvas().style.cursor = "";
  });
});

// Switch from borough view to Manhattan neighborhood view
function showManhattanView() {
  map.flyTo({
    center: [-73.97, 40.78],
    zoom: 11
  });

  map.setLayoutProperty("borough-fill", "visibility", "none");
  map.setLayoutProperty("borough-outline", "visibility", "none");

  map.setLayoutProperty("manhattan-fill", "visibility", "visible");
  map.setLayoutProperty("manhattan-outline", "visibility", "visible");

  mapDescription.textContent =
    "Now viewing Manhattan neighborhoods. Change the income level to see which areas are affordable under the 30% rule.";
}

// Reset back to full NYC borough view
function resetToBoroughView() {
  map.flyTo({
    center: [-73.95, 40.72],
    zoom: 9.5
  });

  map.setLayoutProperty("borough-fill", "visibility", "visible");
  map.setLayoutProperty("borough-outline", "visibility", "visible");

  map.setLayoutProperty("manhattan-fill", "visibility", "none");
  map.setLayoutProperty("manhattan-outline", "visibility", "none");

  mapDescription.textContent =
    "The map begins with NYC boroughs colored by estimated median rent.";
}

// Update affordability colors when income changes
incomeSelect.addEventListener("change", () => {
  const selectedIncome = Number(incomeSelect.value);

  if (map.getLayer("manhattan-fill")) {
    map.setPaintProperty(
      "manhattan-fill",
      "fill-color",
      getAffordabilityColorExpression(selectedIncome)
    );
  }
});

// Reset button
resetButton.addEventListener("click", resetToBoroughView);