import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchStateNyt, fetchCountyNyt } from '../util/dataFetches';
import UsMap from './UsMap';
import DataPoints from './DataPoints';

const CovidApp = () => {
  const [covidData, setCovidData] = useState();
  const [dateIndex, setDateIndex] = useState(0);
  const width = window.innerWidth;
  const height = window.innerHeight;

  //fetches data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const stateRes = await fetchStateNyt();
        const countyRes = await fetchCountyNyt();
        console.log(countyRes);
        setCovidData({ state: stateRes, county: countyRes });
      } catch (e) {
        console.error(e);
      } 
    }
    fetchData();
  }, []);

  return covidData
  ?
  (
    <div className="CovidApp">
      <UsMap 
        stateData={covidData.state} 
        countyData={covidData.county} 
        dateIndex={dateIndex}
        width={width} 
        height={height} />
      <DataPoints 
        countyData={covidData.county} 
        dateIndex={dateIndex}
        setDateIndex={setDateIndex}
        width={width} 
        height={height} />
    </div>
  )
  :
  null;
}

export default CovidApp;