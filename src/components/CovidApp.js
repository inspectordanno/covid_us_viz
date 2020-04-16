import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCountyNyt, fetchStateNyt } from '../util/dataFetches';
import USMap from './USMap';
import DataPoints from './DataPoints';

const CovidApp = () => {
  const [stateData, setStateData] = useState();
  const [countyData, setCountyData] = useState();
  const dispatch = useDispatch();

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

  const width = window.innerWidth * .8;
  const height = window.innerHeight;

  return stateData && countyData
  ?
  (
    <div className="CovidApp">
      <USMap stateData={stateData} countyData={countyData} width={width} height={height}/>
      <DataPoints width={width} height={height} />
    </div>
  )
  :
  null;
}

export default CovidApp;