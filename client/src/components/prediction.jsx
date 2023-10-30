import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Toast } from 'react-bootstrap';
import '../css/prediction.css';

import { IgrRadialGaugeModule } from 'igniteui-react-gauges';
import { IgrRadialGauge, IgrRadialGaugeRange } from 'igniteui-react-gauges';

IgrRadialGaugeModule.register();

function WaterQualityAnalysis() {
  const [temp1, setTemp1] = useState(0);
  const [temp2, setTemp2] = useState(0);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch('https://blynk.cloud/external/api/get?token=WfQITWPhO1JeF3zrRGXvt09vi14Ekms-&v5')
      .then((response) => response.json())
      .then((data) => {
        setTemp1(data);
        checkIsWaterDrinkable(data);
      });

    fetch('https://blynk.cloud/external/api/get?token=WfQITWPhO1JeF3zrRGXvt09vi14Ekms-&v6')
      .then((response) => response.json())
      .then((data) => {
        setTemp2(data);
        checkIsWaterDrinkable(data);
      });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const checkIsWaterDrinkable = (temperatureValue) => {
    if (temperatureValue > 6.50 && temperatureValue < 8.50) {
      setShowAlert(false);
    } else {
      setShowAlert(true);
    }
  };

  return (
    <div className="container ml-19">
      <div className={showAlert ? "not-drinkable" : "drinkable"}>
        <h1 className="text-center">Temperature Analysis</h1>
        {showAlert ? (
          <p className="water">Water is not good for Shrimps</p>
        ) : (
          <p className="water">Water is good for Shrimps</p>
        )}
      </div>
      <div className='flex'>
        <div className="gauge-container">
          <IgrRadialGauge height="400px" width="400px" value={temp1} interval={5} minimumValue={0} maximumValue={100}>
            <IgrRadialGaugeRange key="range1" startValue={0} endValue={30} brush="red" />
            <IgrRadialGaugeRange key="range2" startValue={30} endValue={60} brush="yellow" />
            <IgrRadialGaugeRange key="range3" startValue={60} endValue={100} brush="green" />
          </IgrRadialGauge>
          <h2 className='font-bold text-2xl'>Temperature Sensor 1 Value: {temp1}</h2>
        </div>
        <div className="gauge-container">
          <IgrRadialGauge height="400px" width="400px" value={temp2} interval={5} minimumValue={0} maximumValue={100}>
            <IgrRadialGaugeRange key="range1" startValue={0} endValue={30} brush="red" />
            <IgrRadialGaugeRange key="range2" startValue={30} endValue={60} brush="yellow" />
            <IgrRadialGaugeRange key="range3" startValue={60} endValue={100} brush="green" />
          </IgrRadialGauge>
          <h2 className='font-bold text-2xl'>Temperature Sensor 2 Value: {temp2}</h2>
        </div>
      </div>
      {showAlert && (
        <Toast
          style={{ marginLeft: '72vw', marginTop: '-8vh', backgroundColor: 'rgb(255, 49, 49)', color: 'white' }}
          onClose={() => setShowAlert(false)}
          show={showAlert}
          delay={2000}
          autohide
        >
          <Toast.Header>
            <strong className="mr-auto">Alert</strong>
          </Toast.Header>
          <Toast.Body>Water is not good for Shrimps. Please take necessary action.</Toast.Body>
        </Toast>
      )}
    </div>
  );
}

export default WaterQualityAnalysis;