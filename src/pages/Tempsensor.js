import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import {format} from 'date-fns';
import "./tempsensor.css";

const TempSensor = () => {
    const [tempReading, setTempReading] = useState(0);
    const [options, setOptions] = useState({});
    const [series, setSeries] = useState([]);

    useEffect(() => {
        fetch("https://api.thingspeak.com/channels/2289856/feeds.json").then((res) => res.json())
        .then((resJson) => {
          setOptions({
            chart: {
              id: "basic-bar"
            },
            xaxis: {
              categories: resJson.feeds.map((value) => { return ( format(new Date(value.created_at), 'p, dd/mm/yyyy') )})
            }
          });
  
          setSeries([{
            name: "Temp",
            data: resJson.feeds.map(value => value.field1) 
          }]);
            
          setTempReading(resJson.feeds[resJson.feeds.length - 1].field1);
        }).catch((error) => {
          console.log(error);
        });
      }, []);

    return (<>
    <div className="container">
        <div className="row">
            <h2 className="heading-temp-sensor text-center">Temp Sensor</h2>
            <p className="text-center temp-reading"> <b>Temp Reading: </b> {tempReading} degree.</p>
        </div>
        
        { tempReading > 0 ? <>
            <div className="text-center row temp-detail-indicator">
                {tempReading > 0 && tempReading <= 98.6 ? <p className="temp-type-text normal">Normal Temperature</p> : <></>}
                {tempReading > 98.6 && tempReading <= 104 ? <p className="temp-type-text moderate">Moderate Fever</p>: <></>}
                {tempReading > 104 ? <p className="temp-type-text high">High Fever</p>: <></>}
            </div>
        </> : <></>}

        <div className="container">
        <Chart className="row d-flex justify-content-center" 
               options={options}
               series={series}
               type="line"
               width="90%" />
        </div>
    </div>
    </>)
}

export default TempSensor;