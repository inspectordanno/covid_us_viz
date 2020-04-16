import React, { useEffect, useState } from 'react';
import { fetchCountyNyt, fetchStateNyt } from '../util/dataFetches';
import UsMap from './UsMap';
import DataPoints from './DataPoints';

const CovidApp = () => {
  const [stateData, setStateData] = useState();
  const [countyData, setCountyData] = useState();

  const width = window.innerWidth * .8;
  const height = window.innerHeight;

  //fetches data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const stateRes = await fetchStateNyt();
        const countyRes = await fetchCountyNyt();
        setStateData(stateRes);
        setCountyData(countyRes);
      } catch (e) {
        console.error(e);
      } 
    }
    fetchData();
  }, []);

  return stateData && countyData
  ?
  (
    <div className="CovidApp">
      <div className="map_container">
        <UsMap stateData={stateData} countyData={countyData} width={width} height={height}/>
        <DataPoints width={width} height={height} />
      </div>
    </div>
  )
  :
  null;
}

export default CovidApp;