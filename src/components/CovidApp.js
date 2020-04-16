import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchCountyNyt, fetchStateNyt } from '../util/dataFetches';
import UsMap from './UsMap';
import DataPoints from './DataPoints';

const CovidApp = () => {
  const [stateData, setStateData] = useState();
  const [countyData, setCountyData] = useState();

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

  const skyBbox = useSelector(d => d.skyBbox);

  return stateData && countyData
  ?
  (
    <div className="CovidApp">
      <UsMap stateData={stateData} countyData={countyData} />
      <DataPoints skyBbox={skyBbox} />
    </div>
  )
  :
  null;
}

export default CovidApp;