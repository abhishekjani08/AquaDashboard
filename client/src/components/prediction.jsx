import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Chart from 'chart.js/auto';
import { Toast } from 'react-bootstrap';
import '../css/prediction.css';
import logo from '../images/logo.png';
import { IgrRadialGaugeModule } from 'igniteui-react-gauges';
import { IgrRadialGauge, IgrRadialGaugeRange } from 'igniteui-react-gauges';

IgrRadialGaugeModule.register();

function WaterQualityAnalysis() {
  const [temp1, setTemp1] = useState(0);
  const [temp2, setTemp2] = useState(0);
  const [showAlert, setShowAlert] = useState(false);

  const [button1State, setButton1State] = useState(0);
  const [button2State, setButton2State] = useState(0);

  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const containerClasses = `flex h-screen bg-gray-800 ${isSideMenuOpen ? 'overflow-hidden' : ''}`;
  const [isOpen, setIsOpen] = useState(false);

  const toggleButton1 = () => {
    const newState = button1State === 0 ? 1 : 0;
    setButton1State(newState);
    updateButtonState(1, newState);
  };

  const toggleButton2 = () => {
    const newState = button2State === 0 ? 1 : 0;
    setButton2State(newState);
    updateButtonState(2, newState);
  };

  const updateButtonState = (buttonNumber, newState) => {
    const token = 'WfQITWPhO1JeF3zrRGXvt09vi14Ekms-';

    fetch(`https://blynk.cloud/external/api/update?token=${token}&v${buttonNumber}=${newState}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(`Button ${buttonNumber} state updated to ${newState}`);
      })
      .catch((error) => {
        console.error(`Error updating button state for Button ${buttonNumber}: ${error}`);
      });
  };

  let myChart;

  const fetchData = async () => {
    try {
      const response1 = await fetch('https://blynk.cloud/external/api/get?token=WfQITWPhO1JeF3zrRGXvt09vi14Ekms-&v5');
      const response2 = await fetch('https://blynk.cloud/external/api/get?token=WfQITWPhO1JeF3zrRGXvt09vi14Ekms-&v6');

      const data1 = await response1.json();
      const data2 = await response2.json();

      setTemp1(data1);
      setTemp2(data2);

      console.log("Temp Sensor 1 Data: ", data1);
      console.log("Temp Sensor 2 Data: ", data2);

      updateChart(data1, data2);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // let myChart; // Define myChart outside so it's accessible globally

  const updateChart = (data1, data2) => {
    const ctx = document.getElementById('myChart').getContext('2d');
    const maxDataPoints = 15;
  
    if (myChart) {
      // If chart exists, update the data
      if (myChart.data.labels.length >= maxDataPoints) {
        myChart.data.labels.shift(); // Remove the first label
        myChart.data.datasets.forEach(dataset => {
          dataset.data.shift(); // Remove the first data point from each dataset
        });
      }
      myChart.data.labels.push(new Date().toLocaleTimeString());
      myChart.data.datasets[0].data.push(data1);
      myChart.data.datasets[1].data.push(data2);
      myChart.update();
    } else {
      // If chart does not exist, create it with initial data
      myChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [new Date().toLocaleTimeString()],
          datasets: [{
            label: 'Temperature Sensor 1',
            data: [data1],
            fill: false,
            borderColor: 'rgba(255, 26, 104, 1)',
            backgroundColor: 'rgba(255, 26, 104, 0.2)',
            borderWidth: 1
          }, {
            label: 'Temperature Sensor 2',
            data: [data2],
            fill: false,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              min: 20,
              max: 40,
            }
          },
          animation: {
            duration: 0 // No animation to make the update instant
          }
        }
      });
    }
  };
  
  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 2000); // Fetch data every 10 seconds
  
    return () => clearInterval(interval);
  }, []);
  

  const checkIsWaterDrinkable = (temperatureValue) => {
    if (temperatureValue > 25 && temperatureValue < 32) {
      setShowAlert(false);
    } else {
      setShowAlert(true);
    }
  };
  return (
    <>
      {/* <div className="container ml-19"> */}
      {/* <div className={showAlert ? "not-drinkable" : "drinkable"}>
        <h1 className="text-center">Temperature Analysis</h1>
        {showAlert ? (
          <p className="water">Water is not good for Shrimps</p>
        ) : (
          <p className="water">Water is good for Shrimps</p>
        )}
      </div> */}
      <div className={containerClasses}>
        {/* SideBar */}
        <aside className='z-20 flex-shrink-0 hidden w-60 pl-2 overflow-y-auto bg-gray-800 md:block'>
          <div>
            <div className="text-white">
              <div className="flex p-2 bg-gray-800">
                <div className="flex py-3 px-2 items-center">
                  {/* <p className="text-2xl text-green-500 font-semibold">AS</p> */}
                  <p className="ml-2 font-semibold italic">DASHBOARD</p>
                </div>
              </div>
              <div className="flex justify-center">
                <div>
                  <img src={logo} alt="img" className='hidden h-24 w-24 rounded-full sm:block object-cover mr-2 border-4 border-green-400' />
                  <p className="font-bold text-base text-gray-400 pt-2 text-center w-24">AquaShrimp</p>
                </div>
              </div>
              <div>
                <ul className="mt-6 leading-10">
                  <li className="relative px-2 py-1">
                    <a className="inline-flex items-center w-full text-sm font-semibold text-white transition-colors duration-150 cursor-pointer hover:text-green-500"
                      href=" #">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span className="ml-4">DASHBOARD</span>
                    </a>
                  </li>
                </ul>
                {/* <li className="relative px-2 py-1">
                    <div
                      className="inline-flex items-center justify-between w-full text-base font-semibold transition-colors duration-150 text-gray-500 hover:text-yellow-400 cursor-pointer"
                      onClick={toggleDropdown}
                    >
                      <span className="inline-flex items-center text-sm font-semibold text-white hover:text-green-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20"
                          />
                        </svg>
                        <span className="ml-4">ITEM</span>
                      </span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 text-white w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 text-white w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>

                    {isOpen && (
                      <div>
                        <ul className="p-2 mt-2 space-y-2 overflow-hidden text-sm font-medium rounded-md shadow-inner bg-green-400" aria-label="submenu">
                          <li className="px-2 py-1 text-white transition-colors duration-150">
                            <div className="px-1 hover:text-gray-800 hover:bg-gray-100 rounded-md">
                              <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                <a href="#" className="w-full ml-2 text-sm font-semibold text-white hover:text-gray-800">
                                  Item 1
                                </a>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    )}
                  </li> */}
                {/* </ul> */}
              </div>
            </div>
          </div>
        </aside>
        <div className="flex flex-col flex-1 w-full overflow-y-auto">
          <header className="z-40 py-4  bg-gray-800  ">
            <div className="flex items-center justify-between h-8 px-6 mx-auto">
              {/* <button className="p-1 mr-5 -ml-1 rounded-md md:hidden focus:outline-none focus:shadow-outline-purple"
                aria-label="Menu">
                <x-heroicon-o-menu className="w-6 h-6 text-white" />
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </button> */}

              <div className="flex justify-center  mt-2 mr-4">
                <div className="relative flex w-full flex-wrap items-stretch mb-3">
                  <input type="search" placeholder="Search"
                    className="form-input px-3 py-2 placeholder-gray-400 text-gray-700 relative bg-white rounded-lg text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full pr-10" />
                  <span
                    className="z-10 h-full leading-snug font-normal  text-center text-gray-400 absolute bg-transparent rounded text-base items-center justify-center w-8 right-0 pr-3 py-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 -mt-1" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </header>


          <main className="">
            <div className="grid mb-4 pb-10 px-8 mx-4 rounded-3xl bg-gray-100 border-4 border-green-400">
              <div className="grid grid-cols-12 gap-6">
                <div className="grid grid-cols-12 col-span-12 gap-6 xxl:col-span-9">
                  <div className="col-span-12 mt-8">
                    <div className="flex items-center h-10 intro-y">
                      <h2 className="mr-5 text-lg font-medium truncate">Dashboard of our IOT System</h2>
                    </div>
                    <div className="grid grid-cols-12 gap-6 mt-5">
                      <a className="transform  hover:scale-105 transition duration-300 shadow-xl rounded-lg col-span-12 sm:col-span-6 xl:col-span-3 intro-y bg-white"
                        href="#">
                        <div className="p-5">
                          <div className="flex justify-between">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-blue-400" fill="none" viewBox="0 0 12 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2a2 2 0 00-2 2v12a2 2 0 001 1.732V18a2 2 0 11-2 0v-1.268A2 2 0 007 16V4a2 2 0 114 0v12a2 2 0 001.732 1h.536A2 2 0 0015 16V4a2 2 0 00-2-2z" />
                            </svg>

                            {/* <div
                              className="bg-green-500 rounded-full h-6 px-2 flex justify-items-center text-white font-semibold text-sm">
                              <span className="flex items-center">30%</span>
                            </div> */}
                          </div>
                          <div className="ml-2 w-full flex-1">
                            <div>
                              <div className="mt-3 text-3xl font-bold leading-8">{temp1}</div>

                              <div className="mt-1 text-base text-gray-600">Temperature Sensor 1</div>
                            </div>
                          </div>
                        </div>
                      </a>
                      <a className="transform  hover:scale-105 transition duration-300 shadow-xl rounded-lg col-span-12 sm:col-span-6 xl:col-span-3 intro-y bg-white"
                        href="#">
                        <div className="p-5">
                          <div className="flex justify-between">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-blue-400" fill="none" viewBox="0 0 12 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2a2 2 0 00-2 2v12a2 2 0 001 1.732V18a2 2 0 11-2 0v-1.268A2 2 0 007 16V4a2 2 0 114 0v12a2 2 0 001.732 1h.536A2 2 0 0015 16V4a2 2 0 00-2-2z" />
                            </svg>
                            {/* <div
                              className="bg-red-500 rounded-full h-6 px-2 flex justify-items-center text-white font-semibold text-sm">
                              <span className="flex items-center">30%</span>
                            </div> */}
                          </div>
                          <div className="ml-2 w-full flex-1">
                            <div>
                              <div className="mt-3 text-3xl font-bold leading-8">{temp2}</div>

                              <div className="mt-1 text-base text-gray-600">Temperature Sensor 2</div>
                            </div>
                          </div>
                        </div>
                      </a>
                      <a className={` cursor-pointer transform hover:scale-105 transition duration-300 shadow-xl rounded-lg col-span-12 sm:col-span-6 xl:col-span-3 intro-y bg-white ${button1State === 1 ? 'bg-green-500' : 'bg-red-500'}`} onClick={toggleButton1}>
                        <div className="p-5">
                          <div className="flex justify-between">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-7 w-7">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 -7v14" />
                            </svg>

                            {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
  <rect width="18" height="10" x="1" y="5" rx="5" />
</svg> */}

                            <div className={`rounded-full h-6 px-2 flex justify-items-center text-white font-semibold text-sm ${button1State === 1 ? 'bg-blue-500' : 'bg-yellow-500'}`}>
                              <span className="flex items-center">{button1State === 1 ? 'ON' : 'OFF'}</span>
                            </div>
                          </div>
                          <div className="ml-2 w-full flex-1">
                            <div>
                              <div className="mt-1 text-4xl text-gray-600">Button 1</div>
                            </div>
                          </div>
                        </div>
                      </a>
                      <a className={` cursor-pointer transform hover:scale-105 transition duration-300 shadow-xl rounded-lg col-span-12 sm:col-span-6 xl:col-span-3 intro-y bg-white ${button2State === 1 ? 'bg-green-500' : 'bg-red-500'}`} onClick={toggleButton2}>
                        <div className="p-5">
                          <div className="flex justify-between">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-7 w-7">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 -7v14" />
                            </svg>
                            <div className={`rounded-full h-6 px-2 flex justify-items-center text-white font-semibold text-sm ${button2State === 1 ? 'bg-blue-500' : 'bg-yellow-500'}`}>
                              <span className="flex items-center">{button2State === 1 ? 'ON' : 'OFF'}</span>
                            </div>
                          </div>
                          <div className="ml-2 w-full flex-1">
                            <div>
                              <div className="mt-1 text-4xl text-gray-600">Button 2</div>
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                  <div className="col-span-12 mt-5">
                    <div className="grid gap-2 grid-cols-1 lg:grid-cols-2">
                      {/* <div className="bg-white shadow-lg p-4">
                        <IgrRadialGauge height="400px" width="400px" value={temp1} interval={5} minimumValue={0} maximumValue={100}>
                          <IgrRadialGaugeRange key="range1" startValue={0} endValue={30} brush="red" />
                          <IgrRadialGaugeRange key="range2" startValue={30} endValue={60} brush="yellow" />
                          <IgrRadialGaugeRange key="range3" startValue={60} endValue={100} brush="green" />
                        </IgrRadialGauge>
                      </div>
                      <div className="bg-white shadow-lg p-4">
                        <IgrRadialGauge height="400px" width="400px" value={temp2} interval={5} minimumValue={0} maximumValue={100}>
                          <IgrRadialGaugeRange key="range1" startValue={0} endValue={30} brush="red" />
                          <IgrRadialGaugeRange key="range2" startValue={30} endValue={60} brush="yellow" />
                          <IgrRadialGaugeRange key="range3" startValue={60} endValue={100} brush="green" />
                        </IgrRadialGauge>
                      </div> */}
                      <canvas id="myChart" width="400" height="200"></canvas>
                      <div id="chartVersion"></div>
                    </div>
                  </div>
                  {/* <div className="col-span-12 mt-5">
                    <div className="grid gap-2 grid-cols-1 lg:grid-cols-1">
                      <div className="bg-white p-4 shadow-lg rounded-lg">
                        <h1 className="font-bold text-base">Table</h1>
                        <div className="mt-4">
                          <div className="flex flex-col">
                            <div className="-my-2 overflow-x-auto">
                              <div className="py-2 align-middle inline-block min-w-full">
                                <div
                                  className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg bg-white">
                                  <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                      <tr>
                                        <th
                                          className="px-6 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                          <div className="flex cursor-pointer">
                                            <span className="mr-2">PRODUCT NAME</span>
                                          </div>
                                        </th>
                                        <th
                                          className="px-6 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                          <div className="flex cursor-pointer">
                                            <span className="mr-2">Stock</span>
                                          </div>
                                        </th>
                                        <th
                                          className="px-6 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                          <div className="flex cursor-pointer">
                                            <span className="mr-2">STATUS</span>
                                          </div>
                                        </th>
                                        <th
                                          className="px-6 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                          <div className="flex cursor-pointer">
                                            <span className="mr-2">ACTION</span>
                                          </div>
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                      <tr>
                                        <td
                                          className="px-6 py-4 whitespace-no-wrap text-sm leading-5">
                                          <p>Apple MacBook Pro 13</p>
                                          <p className="text-xs text-gray-400">PC & Laptop
                                          </p>
                                        </td>
                                        <td
                                          className="px-6 py-4 whitespace-no-wrap text-sm leading-5">
                                          <p>77</p>
                                        </td>
                                        <td
                                          className="px-6 py-4 whitespace-no-wrap text-sm leading-5">
                                          <div className="flex text-green-500">
                                            <svg xmlns="http://www.w3.org/2000/svg"
                                              className="w-5 h-5 mr-1" fill="none"
                                              viewBox="0 0 24 24"
                                              stroke="currentColor">
                                              <path strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p>Active</p>
                                          </div>
                                        </td>
                                        <td
                                          className="px-6 py-4 whitespace-no-wrap text-sm leading-5">
                                          <div className="flex space-x-4">
                                            <a href="#" className="text-blue-500 hover:text-blue-600">
                                              <svg xmlns="http://www.w3.org/2000/svg"
                                                className="w-5 h-5 mr-1"
                                                fill="none" viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth="2"
                                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                              </svg>
                                              <p>Edit</p>
                                            </a>
                                            <a href="#" className="text-red-500 hover:text-red-600">
                                              <svg xmlns="http://www.w3.org/2000/svg"
                                                className="w-5 h-5 mr-1 ml-3"
                                                fill="none" viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth="2"
                                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                              </svg>
                                              <p>Delete</p>
                                            </a>
                                          </div>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div >
      {/* </div> */}
    </>
  );
}

export default WaterQualityAnalysis;