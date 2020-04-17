import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchStateNyt, fetchCountyNyt } from '../util/dataFetches';
import UsMap from './UsMap';
import DataPoints from './DataPoints';

const CovidApp = () => {
  const [covidData, setCovidData] = useState();

  //fetches data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const stateRes = await fetchStateNyt();
        const countyRes = await fetchCountyNyt();
        setCovidData({ state: stateRes, county: countyRes });
      } catch (e) {
        console.error(e);
      } 
    }
    fetchData();
  }, []);

  const skyBbox = useSelector(d => d.skyBbox);

  return covidData
  ?
  (
    <div className="CovidApp">
      <UsMap stateData={covidData.state} countyData={covidData.county} />
      <DataPoints countyData={covidData.county} skyBbox={skyBbox} />
    </div>
  )
  :
  null;
}

export default CovidApp;