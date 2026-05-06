# Who Gets to Live Here?
### NYC Housing Affordability Explorer

An interactive web map exploring housing affordability across New York City neighborhoods.

This project compares estimated neighborhood rents with income-based affordability thresholds using the 30% affordability rule. Users can select an annual income level and click neighborhoods to see how local rents compare to what would be considered affordable.

---

## Project Purpose

Housing affordability is one of the defining urban challenges in New York City.  
This project visualizes how affordability changes geographically across neighborhoods and boroughs, helping users understand the relationship between income and housing access.

The map focuses on:
- estimated neighborhood median rent
- estimated neighborhood household income
- affordability thresholds based on selected income
- affordability gaps between rent and income

---

## Features

- Interactive Mapbox GL JS web map
- Neighborhood click popups
- Income selector dropdown
- Affordability gap calculations
- Borough-based symbology
- Reset map button
- Responsive layout for smaller screens
- Custom legends and informational panels

---

## Technologies Used

- HTML
- CSS
- JavaScript
- Mapbox GL JS
- GeoJSON
- GitHub Pages

---

## Methodology

Affordable monthly rent is calculated using the commonly used 30% affordability rule:

```text
Affordable Monthly Rent = (Annual Income × 0.30) ÷ 12
