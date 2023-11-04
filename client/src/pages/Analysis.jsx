import { useEffect, useState } from 'react';
import axios from 'axios';
import Chart from '../components/Chart';
import '../css/Analysis.css'
import Navbar from '../components/Navbar2'


const fieldIds = [1, 2];

const fetchData = async (fieldId) => {
  const response = await axios.get(
    `https://blynk.cloud/external/api/get?token=WfQITWPhO1JeF3zrRGXvt09vi14Ekms-&v${port}v6`
  );
  return response.data;
};

const initialFieldData = fieldIds.reduce((acc, fieldId) => {
  acc[`field${fieldId}Data`] = [];
  acc[`field${fieldId}Id`] = [];
  return acc;
}, {});

const HomePage = () => {
  const [fieldData, setFieldData] = useState(initialFieldData);

  useEffect(() => {
    const fetchingData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));

      for (const fieldId of fieldIds) {
        const response = await fetchData(fieldId);
        const fieldValues = response.map((item) =>
          item[`field${fieldId}`].trim()
        );
        const fieldIdValues = response.map((item) => item.entry_id);

        setFieldData((prevData) => ({
          ...prevData,
          [`field${fieldId}Data`]: fieldValues,
          [`field${fieldId}Id`]: fieldIdValues
        }));
      }
    };

    fetchingData();
  }, [fieldData]);

  return (
    <>
      <div className='analyze'>
        <Navbar />
        <div className="m-8 mt-3 grid grid-cols-2" style={{ marginTop: '15vh' }}>
          {fieldIds.map((fieldId) => (
            <Chart
              key={fieldId}
              fieldId={fieldData[`field${fieldId}Id`]}
              fieldData={fieldData[`field${fieldId}Data`]}
              fieldName={
                fieldId === 1
                  ? 'Temperature Sensor 1'
                  : fieldId === 2
                    ? 'Temperature Sensor 2'
                    : ''
              }
              fieldColor={
                fieldId === 1
                  ? 'green'
                  : fieldId === 2
                    ? 'aqua'
                    : fieldId === 3
                      ? 'brown'
                      : ''
              }
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default HomePage;
