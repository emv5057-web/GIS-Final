// Mapbox access token
mapboxgl.accessToken = "pk.eyJ1IjoiZXZlc21hbm92YSIsImEiOiJjbW9tM29wdjcwY2t1MndvdnN3YngweHMwIn0.XoXg4-PC2R4YznzdebM6nA";

// Create the map
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v11",
  center: [-73.95, 40.72],
  zoom: 9.5,
  scrollZoom: false
});

map.addControl(new mapboxgl.NavigationControl(), "top-right");

// HTML controls
const incomeSelect = document.getElementById("income-select");
const resetButton = document.getElementById("reset-button");
const mapDescription = document.getElementById("map-description");

// Calculate affordable monthly rent using the 30% rule
function getAffordableMonthlyRent(income) {
  return (income * 0.3) / 12;
}

// Get rent/income data for each neighborhood
function getNeighborhoodInfo(name, borough) {
  const fallback = boroughFallbackData[borough];
  return neighborhoodData[name] || fallback || null;
}

// Color neighborhoods by borough
function getNeighborhoodColorExpression() {
  return [
    "case",
    ["==", ["get", "borough"], "Manhattan"], "#6f1d1b",
    ["==", ["get", "borough"], "Brooklyn"], "#b94a48",
    ["==", ["get", "borough"], "Queens"], "#e89b83",
    ["==", ["get", "borough"], "Bronx"], "#f1b6a6",
    ["==", ["get", "borough"], "Staten Island"], "#f6d6c9",
    "#dddddd"
  ];
}

// Load map data
map.on("load", () => {
  map.addSource("neighborhoods", {
    type: "geojson",
    data: "data/neighborhoods.geojson"
  });

  map.addLayer({
    id: "neighborhood-fill",
    type: "fill",
    source: "neighborhoods",
    paint: {
      "fill-color": getNeighborhoodColorExpression(),
      "fill-opacity": 0.72
    }
  });

  map.addLayer({
    id: "neighborhood-outline",
    type: "line",
    source: "neighborhoods",
    paint: {
      "line-color": "#ffffff",
      "line-width": 0.7
    }
  });

  map.on("click", "neighborhood-fill", (event) => {
    const props = event.features[0].properties;
    const name = props.neighborhood;
    const borough = props.borough;

    const data = getNeighborhoodInfo(name, borough);

    const selectedIncome = Number(incomeSelect.value);
    const affordableMonthlyRent = Math.round(getAffordableMonthlyRent(selectedIncome));

    const rentText = data?.median_rent
      ? `$${data.median_rent.toLocaleString()}`
      : "Data not available";

    const incomeText = data?.median_income
      ? `$${data.median_income.toLocaleString()}`
      : "Data not available";

    const affordabilityGap = data?.median_rent
      ? data.median_rent - affordableMonthlyRent
      : null;

    const gapText =
      affordabilityGap !== null
        ? affordabilityGap > 0
          ? `$${affordabilityGap.toLocaleString()} above affordable rent`
          : `$${Math.abs(affordabilityGap).toLocaleString()} below affordable rent`
        : "Not calculated";

    map.flyTo({
      center: event.lngLat,
      zoom: 12.5,
      speed: 0.8,
      curve: 1.2
    });

    new mapboxgl.Popup()
      .setLngLat(event.lngLat)
      .setHTML(`
        <h3>${name}</h3>
        <p><strong>Borough:</strong> ${borough}</p>
        <p><strong>Median 1BR rent:</strong> ${rentText}</p>
        <p><strong>Median household income:</strong> ${incomeText}</p>
        <p><strong>Affordable rent at $${selectedIncome.toLocaleString()} income:</strong> $${affordableMonthlyRent.toLocaleString()}</p>
        <p><strong>Affordability gap:</strong> ${gapText}</p>
      `)
      .addTo(map);
  });

  map.on("mouseenter", "neighborhood-fill", () => {
    map.getCanvas().style.cursor = "pointer";
  });

  map.on("mouseleave", "neighborhood-fill", () => {
    map.getCanvas().style.cursor = "";
  });
});

// Update map description when income changes
incomeSelect.addEventListener("change", () => {
  const selectedIncome = Number(incomeSelect.value);
  const affordableRent = Math.round(getAffordableMonthlyRent(selectedIncome));

  mapDescription.textContent = `At an annual income of $${selectedIncome.toLocaleString()}, affordable monthly rent is about $${affordableRent.toLocaleString()} under the 30% rule. Click a neighborhood to compare this with estimated rent.`;
});

// Reset map
resetButton.addEventListener("click", () => {
  map.flyTo({
    center: [-73.95, 40.72],
    zoom: 9.5
  });

  mapDescription.textContent =
    "The map shows NYC neighborhoods colored by borough. Click a neighborhood to compare estimated rent and income.";
});