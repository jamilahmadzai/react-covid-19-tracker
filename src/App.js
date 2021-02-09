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
import Table from "./Table";
import { sortData } from "./sort";
import LineGraph from "./LineGraph";

const countriesList = "https://disease.sh/v3/covid-19/countries";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => setCountryInfo(data));
  }, []);

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
          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
        });
    };
    getCountries();
  }, []);

  const changeCountry = async (e) => {
    const countryCode = e.target.value;
    console.log(countryCode);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
      });
  };

  console.log(countryInfo);

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
          <InfoBox
            title="Coronavirus Cases"
            cases={countryInfo.todayCases}
            total={`${countryInfo.cases} Total`}
          />
          <InfoBox
            title="Recovered"
            cases={countryInfo.todayRecovered}
            total={`${countryInfo.recovered} Total`}
          />
          <InfoBox
            title="Deaths"
            cases={countryInfo.todayDeaths}
            total={`${countryInfo.deaths} Total`}
          />
        </div>
        <Map />
      </div>
      <Card className="app_right">
        <CardContent>
          <h2>Live Cases by Countries</h2>
          <Table countries={tableData} />
          <h2>Worldwide New Cases</h2>
          <LineGraph />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
