// Mapbox access token
mapboxgl.accessToken = "pk.eyJ1IjoiZXZlc21hbm92YSIsImEiOiJjbW9tM29wdjcwY2t1MndvdnN3YngweHMwIn0.XoXg4-PC2R4YznzdebM6nA";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v11",
  center: [-73.95, 40.72],
  zoom: 9.5,
  scrollZoom: false
});

map.addControl(new mapboxgl.NavigationControl(), "top-right");

const incomeSelect = document.getElementById("income-select");
const resetButton = document.getElementById("reset-button");
const mapDescription = document.getElementById("map-description");

let neighborhoodsGeoJSON = null;
let currentPopup = null;

function getAffordableMonthlyRent(income) {
  return (income * 0.3) / 12;
}

function getNeighborhoodInfo(name, borough) {
  const fallback = boroughFallbackData[borough];
  return neighborhoodData[name] || fallback || null;
}

function getGapColor(gap) {
  if (gap === null || gap === undefined) return "#d9d9d9";
  if (gap <= 0) return "#4f8f6f";
  if (gap <= 500) return "#f3d6a2";
  if (gap <= 1000) return "#e89b83";
  if (gap <= 1500) return "#c75b5b";
  return "#6f1d1b";
}

function updateNeighborhoodAffordabilityData() {
  const selectedIncome = Number(incomeSelect.value);
  const affordableMonthlyRent = Math.round(getAffordableMonthlyRent(selectedIncome));

  neighborhoodsGeoJSON.features.forEach((feature) => {
    const name = feature.properties.neighborhood;
    const borough = feature.properties.borough;
    const data = getNeighborhoodInfo(name, borough);

    const gap = data?.median_rent
      ? data.median_rent - affordableMonthlyRent
      : null;

    feature.properties.affordability_gap = gap;
    feature.properties.gap_color = getGapColor(gap);
  });

  if (map.getSource("neighborhoods")) {
    map.getSource("neighborhoods").setData(neighborhoodsGeoJSON);
  }

  mapDescription.textContent =
    `At an annual income of $${selectedIncome.toLocaleString()}, affordable monthly rent is about $${affordableMonthlyRent.toLocaleString()} under the 30% rule. Darker areas have larger affordability gaps.`;
}

function createPopupHTML(name, borough, data, selectedIncome, affordableMonthlyRent, affordabilityGap) {
  const rentText = data?.median_rent
    ? `$${data.median_rent.toLocaleString()}`
    : "Data not available";

  const incomeText = data?.median_income
    ? `$${data.median_income.toLocaleString()}`
    : "Data not available";

  let gapClass = "gap-neutral";
  let gapIcon = "➖";
  let gapText = "Not calculated";

  if (affordabilityGap !== null) {
    if (affordabilityGap > 0) {
      gapClass = "gap-negative";
      gapIcon = "⚠️";
      gapText = `$${affordabilityGap.toLocaleString()} above affordable rent`;
    } else {
      gapClass = "gap-positive";
      gapIcon = "✅";
      gapText = `$${Math.abs(affordabilityGap).toLocaleString()} below affordable rent`;
    }
  }

  return `
    <div class="popup-card">
      <h3>${name}</h3>
      <p class="popup-borough">${borough}</p>

      <div class="gap-callout ${gapClass}">
        <span class="gap-icon">${gapIcon}</span>
        <div>
          <div class="gap-label">Affordability Gap</div>
          <div class="gap-value">${gapText}</div>
        </div>
      </div>

      <p><strong>Median 1BR rent:</strong> ${rentText}</p>
      <p><strong>Median household income:</strong> ${incomeText}</p>
      <p><strong>Affordable rent at $${selectedIncome.toLocaleString()} income:</strong> $${affordableMonthlyRent.toLocaleString()}</p>
    </div>
  `;
}

map.on("load", async () => {
  const response = await fetch("data/neighborhoods.geojson");
  neighborhoodsGeoJSON = await response.json();

  updateNeighborhoodAffordabilityData();

  map.addSource("neighborhoods", {
    type: "geojson",
    data: neighborhoodsGeoJSON
  });

  map.addLayer({
    id: "neighborhood-fill",
    type: "fill",
    source: "neighborhoods",
    paint: {
      "fill-color": ["get", "gap_color"],
      "fill-opacity": 0.78
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

  map.addLayer({
    id: "selected-neighborhood-outline",
    type: "line",
    source: "neighborhoods",
    paint: {
      "line-color": "#111111",
      "line-width": 3
    },
    filter: ["==", ["get", "neighborhood"], ""]
  });

  map.on("click", "neighborhood-fill", (event) => {
    const props = event.features[0].properties;
    const name = props.neighborhood;
    const borough = props.borough;
    const data = getNeighborhoodInfo(name, borough);

    const selectedIncome = Number(incomeSelect.value);
    const affordableMonthlyRent = Math.round(getAffordableMonthlyRent(selectedIncome));

    const affordabilityGap = data?.median_rent
      ? data.median_rent - affordableMonthlyRent
      : null;

    map.setFilter("selected-neighborhood-outline", [
      "all",
      ["==", ["get", "neighborhood"], name],
      ["==", ["get", "borough"], borough]
    ]);

    map.flyTo({
      center: event.lngLat,
      zoom: 12.5,
      speed: 0.8,
      curve: 1.2
    });

    if (currentPopup) currentPopup.remove();

    currentPopup = new mapboxgl.Popup()
      .setLngLat(event.lngLat)
      .setHTML(createPopupHTML(name, borough, data, selectedIncome, affordableMonthlyRent, affordabilityGap))
      .addTo(map);
  });

  map.on("mouseenter", "neighborhood-fill", () => {
    map.getCanvas().style.cursor = "pointer";
  });

  map.on("mouseleave", "neighborhood-fill", () => {
    map.getCanvas().style.cursor = "";
  });
});

incomeSelect.addEventListener("change", () => {
  if (!neighborhoodsGeoJSON) return;
  updateNeighborhoodAffordabilityData();

  if (currentPopup) {
    currentPopup.remove();
    currentPopup = null;
  }
});

resetButton.addEventListener("click", () => {
  map.flyTo({
    center: [-73.95, 40.72],
    zoom: 9.5
  });

  map.setFilter("selected-neighborhood-outline", ["==", ["get", "neighborhood"], ""]);

  if (currentPopup) {
    currentPopup.remove();
    currentPopup = null;
  }

  const selectedIncome = Number(incomeSelect.value);
  const affordableRent = Math.round(getAffordableMonthlyRent(selectedIncome));

  mapDescription.textContent =
    `At an annual income of $${selectedIncome.toLocaleString()}, affordable monthly rent is about $${affordableRent.toLocaleString()} under the 30% rule. Darker areas have larger affordability gaps.`;
});