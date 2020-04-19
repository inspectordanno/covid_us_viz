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
        console.log(stateRes);
        console.log(countyRes);
      } catch (e) {
        console.error(e);
      } 
    }
    fetchData();
  }, []);

  const skyBbox = useSelector(d => d.skyBbox);

  const day = '2020-03-01';

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
        height={height} 
        day={day} />
    </div>
  )
  :
  null;
}

export default CovidApp;