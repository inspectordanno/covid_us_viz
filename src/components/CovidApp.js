import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchStateNyt, fetchCountyNyt } from '../util/dataFetches';
import UsMap from './UsMap';
import DataPoints from './DataPoints';

const CovidApp = () => {
  const [covidData, setCovidData] = useState();

  const width = screen.width * .8;
  const height = screen.height * .88;

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

  const countyFrequences = useSelector(state => state.countyFrequences);
  const skyBbox = useSelector(state => state.skyBbox);

  return covidData
  ?
  (
    <div className="CovidApp">
      <UsMap 
        stateData={covidData.state} 
        countyData={covidData.county} 
        width={width} height={height} />
      <DataPoints 
        countyData={covidData.county} 
        skyBbox={skyBbox} 
        width={width} 
        height={height} />
    </div>
  )
  :
  null;
}

export default CovidApp;