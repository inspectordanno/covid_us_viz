import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchStateNyt, fetchCountyNyt } from '../util/dataFetches';
import UsMap from './UsMap';
import DataPoints from './DataPoints';

const CovidApp = () => {
  const [covidData, setCovidData] = useState();

  const width = window.innerWidth * .75;
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


  const bbox = useSelector(state => state.bbox);

  return covidData
  ?
  (
    <div className="CovidApp">
      <UsMap 
        stateData={covidData.state} 
        countyData={covidData.county} 
        width={width} 
        height={height} />
      <DataPoints 
        countyData={covidData.county} 
        bbox={bbox} 
        width={width} 
        height={height} />
    </div>
  )
  :
  null;
}

export default CovidApp;