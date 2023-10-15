import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Toast } from 'react-bootstrap';
import '../css/prediction.css';
// import 'bootstrap/dist/css/bootstrap.min.css';


function WaterQualityAnalysis() {
  const [phValue, setPhValue] = useState(0);
  const [tdsValue, setTDSValue] = useState(0);
  const [turbidityValue, setTurbidityValue] = useState(0);
  const [isWaterDrinkable, setIsWaterDrinkable] = useState(true);
  const [showAlert, setShowAlert] = useState(false); // State to control toast visibility

  useEffect(() => {
    // Fetch initial data from APIs
    fetchData();
  }, []);

  const fetchData = () => {
    // Sample function to fetch data from APIs
    fetch('https://environment-monitoring.onrender.com/fields-data/1')
      .then((response) => response.json())
      .then((data) => {
        const latestData = data[data.length - 1];
        const initialPhValue = parseFloat(latestData.field1.trim());
        setPhValue(initialPhValue);
      });

    fetch('https://environment-monitoring.onrender.com/fields-data/2')
      .then((response) => response.json())
      .then((data) => {
        const latestData = data[data.length - 1];
        const initialTDSValue = parseFloat(latestData.field2.trim());
        setTDSValue(initialTDSValue);
      });

    fetch('https://environment-monitoring.onrender.com/fields-data/3')
      .then((response) => response.json())
      .then((data) => {
        const latestData = data[data.length - 1];
        const rawTurbidityValue = latestData.field3;

        if (rawTurbidityValue) {
          const initialTurbidityValue = parseFloat(rawTurbidityValue.trim());
          setTurbidityValue(initialTurbidityValue / 2);
        }
      });
  };

  useEffect(() => {
    // Set up an interval to periodically check for new data
    const interval = setInterval(() => {
      fetchData(); // Fetch new data and update the state
    }, 15000); // Adjust the interval as needed

    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures this effect only runs on mount

  useEffect(() => {
    // Implement real-time analysis
    let newIsWaterDrinkable = false;

    if (
      (phValue > 6.50 && phValue < 8.50) &&
      (tdsValue > 80 && tdsValue < 200) &&
      (turbidityValue > 500 && turbidityValue < 1500)
    ) {
      newIsWaterDrinkable = true;
    } else {
      newIsWaterDrinkable = false;
      // Show the toast when water is not drinkable
      setShowAlert(true);
    }
    setIsWaterDrinkable(newIsWaterDrinkable);
  }, [phValue, tdsValue, turbidityValue]);

  return (
    <div className="container">
      
      <div className={isWaterDrinkable ? "drinkable" : "not-drinkable"}>
        <h1>Water Quality Analysis</h1>
        {isWaterDrinkable ? (
          <p className="water">Water is drinkable</p>
        ) : (
          <p className="water">Water is not drinkable</p>
        )}
      </div>
      <div className="parameter-container">
        <p>
          <span className="par">pH Value</span> <br />
          <span className="val">{phValue}</span>
        </p>
        <p>
          <span className="par">TDS Value</span> <br />
          <span className="val">{tdsValue}</span>
        </p>
        <p>
          <span className="par">Turbidity Value</span> <br />
          <span className="val">{turbidityValue}</span>
        </p>
      </div>
      {showAlert && (
        <Toast
        style={{marginLeft:'72vw',marginTop:'-8vh', backgroundColor:'rgb(255, 49, 49)',color:'white'}}
          onClose={() => setShowAlert(false)}
          show={showAlert}
          delay={2000} // Auto-dismiss the toast after 5 seconds
          autohide
        >
          <Toast.Header>
            <strong className="mr-auto">Alert</strong>
          </Toast.Header>
          <Toast.Body>Water is not drinkable. Please take necessary action.</Toast.Body>
        </Toast>
      )}
    </div>
  );
}

export default WaterQualityAnalysis;
