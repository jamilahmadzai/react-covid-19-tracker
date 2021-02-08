import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import InfoBox from "./InfoBox";
import Map from "./Map";

const countriesList = "https://disease.sh/v3/covid-19/countries";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");

  useEffect(() => {
    const getCountries = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => {
            return {
              name: country.country,
              value: country.countryInfo.iso3,
            };
          });
          setCountries(countries);
        });
    };
    getCountries();
  }, []);

  const changeCountry = (e) => {
    const country = e.target.value;
    console.log(country);
    setCountry(country);
  };

  return (
    <div className="app">
      <div className="app_left">
        <div className="app_header">
          <h1>Covid 19 Tracker</h1>
          <FormControl className="app_dropdown">
            <Select variant="outlined" value={country} onChange={changeCountry}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country, index) => {
                return (
                  <MenuItem key={index} value={country.value}>
                    {country.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>

        <div className="app_stats">
          <InfoBox title="Coronavirus Cases" cases="400" total="12" />
          <InfoBox title="Recovered" cases="4020" total="112" />
          <InfoBox title="Deaths" cases="40120" total="1222" />
        </div>
        <Map />
      </div>
      <Card className="app_right">
        <CardContent>
          <h2>Live Cases By Country</h2>
          <h2>New Cases</h2>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
