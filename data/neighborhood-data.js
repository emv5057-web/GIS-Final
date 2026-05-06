const boroughFallbackData = {
  Manhattan: { median_rent: 4730, median_income: 120000 },
  Brooklyn: { median_rent: 3600, median_income: 80000 },
  Queens: { median_rent: 3000, median_income: 82000 },
  Bronx: { median_rent: 2300, median_income: 50000 },
  "Staten Island": { median_rent: 2200, median_income: 90000 }
};

const neighborhoodData = {
  // Manhattan
  "Chelsea": { median_rent: 5600, median_income: 145000 },
  "Chinatown": { median_rent: 3300, median_income: 65000 },
  "East Harlem": { median_rent: 3000, median_income: 60000 },
  "East Village": { median_rent: 4300, median_income: 105000 },
  "Financial District": { median_rent: 4700, median_income: 150000 },
  "Greenwich Village": { median_rent: 5200, median_income: 150000 },
  "Harlem": { median_rent: 3000, median_income: 70000 },
  "Hell's Kitchen": { median_rent: 4300, median_income: 115000 },
  "Inwood": { median_rent: 2600, median_income: 65000 },
  "Lower East Side": { median_rent: 3900, median_income: 85000 },
  "Midtown": { median_rent: 4500, median_income: 135000 },
  "Upper East Side": { median_rent: 4500, median_income: 150000 },
  "Upper West Side": { median_rent: 4600, median_income: 145000 },
  "Washington Heights": { median_rent: 2700, median_income: 65000 },
  "West Village": { median_rent: 5800, median_income: 175000 },

  // Brooklyn
  "Astoria": { median_rent: 3600, median_income: 85000 },
  "Bay Ridge": { median_rent: 2800, median_income: 85000 },
  "Bedford-Stuyvesant": { median_rent: 3200, median_income: 70000 },
  "Brooklyn Heights": { median_rent: 5100, median_income: 160000 },
  "Bushwick": { median_rent: 3200, median_income: 65000 },
  "Carroll Gardens": { median_rent: 4400, median_income: 140000 },
  "Clinton Hill": { median_rent: 3900, median_income: 115000 },
  "Crown Heights": { median_rent: 3000, median_income: 70000 },
  "DUMBO": { median_rent: 5600, median_income: 170000 },
  "Downtown Brooklyn": { median_rent: 4700, median_income: 120000 },
  "Flatbush": { median_rent: 2600, median_income: 65000 },
  "Fort Greene": { median_rent: 4200, median_income: 125000 },
  "Greenpoint": { median_rent: 4300, median_income: 110000 },
  "Park Slope": { median_rent: 4200, median_income: 140000 },
  "Sunset Park": { median_rent: 2600, median_income: 65000 },
  "Williamsburg": { median_rent: 4600, median_income: 125000 },

  // Queens
  "Long Island City": { median_rent: 4300, median_income: 115000 },
  "Sunnyside": { median_rent: 3000, median_income: 80000 },
  "Woodside": { median_rent: 2800, median_income: 75000 },
  "Jackson Heights": { median_rent: 2700, median_income: 70000 },
  "Elmhurst": { median_rent: 2600, median_income: 65000 },
  "Forest Hills": { median_rent: 3100, median_income: 90000 },
  "Flushing": { median_rent: 2800, median_income: 70000 },
  "Jamaica": { median_rent: 2400, median_income: 60000 },
  "Ridgewood": { median_rent: 3000, median_income: 75000 },
  "Rego Park": { median_rent: 2900, median_income: 80000 },

  // Bronx
  "Mott Haven": { median_rent: 2600, median_income: 45000 },
  "Concourse": { median_rent: 2300, median_income: 43000 },
  "Fordham": { median_rent: 2200, median_income: 40000 },
  "Kingsbridge": { median_rent: 2400, median_income: 55000 },
  "Riverdale": { median_rent: 2800, median_income: 95000 },
  "Pelham Bay": { median_rent: 2300, median_income: 65000 },
  "Throgs Neck": { median_rent: 2400, median_income: 70000 },

  // Staten Island
  "Saint George": { median_rent: 2300, median_income: 70000 },
  "Stapleton": { median_rent: 2200, median_income: 65000 },
  "Tottenville": { median_rent: 2200, median_income: 95000 }
};
