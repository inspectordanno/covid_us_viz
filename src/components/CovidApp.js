import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchStateNyt, fetchCountyNyt } from '../util/dataFetches';
import UsMap from './UsMap';
import DataPoints from './DataPoints';

const CovidApp = () => {
  const [covidData, setCovidData] = useState();
  const width = window.innerWidth;
  const height = window.innerHeight;
  const pointWidth = 2;

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

  const dateIndex = useSelector(state => state.dateIndex);

  return covidData && Number.isInteger(dateIndex)
  ?
  (
    <div className="CovidApp">
      <UsMap 
        stateData={covidData.state} 
        countyData={covidData.county} 
        dateIndex={dateIndex}
        pointWidth={pointWidth}
        width={width} 
        height={height} />
      {/* <DataPoints 
        countyData={covidData.county} 
        dateIndex={dateIndex}
        pointWidth={pointWidth}
        width={width} 
        height={height} /> */}
    </div>
  )
  :
  null;
}

export default CovidApp;