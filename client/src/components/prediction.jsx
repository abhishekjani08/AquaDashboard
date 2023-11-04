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

  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const containerClasses = `flex h-screen bg-gray-800 ${isSideMenuOpen ? 'overflow-hidden' : ''}`;
  const [isOpen, setIsOpen] = useState(false);


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

  const updateChart = (data1, data2) => {
    const ctx = document.getElementById('myChart').getContext('2d');

    if (myChart) {
      myChart.update();
    }

    const chartData = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Temperature Sensor 1',
        data: data1, // Replace with your fetched data
        backgroundColor: 'rgba(255, 26, 104, 0.2)',
        borderColor: 'rgba(255, 26, 104, 1)',
        borderWidth: 1,
      }, {
        label: 'Temperature Sensor 2',
        data: data2, // Replace with your fetched data
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      }],
    };

    const chartConfig = {
      type: 'bar',
      data: chartData,
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };


    myChart = new Chart(ctx, chartConfig);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

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
                  <p className="text-2xl text-green-500 font-semibold">AS</p>
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

              <ul className="flex items-center flex-shrink-0 space-x-6">
                {/* <li className="relative"> */}
                {/* <button
                    className="p-2 bg-white text-green-400 align-middle rounded-full hover:text-white hover:bg-green-400 focus:outline-none "
                    aria-label="Notifications" aria-haspopup="true">
                    <div className="flex items-cemter">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <span aria-hidden="true"
                      className="absolute top-0 right-0 inline-block w-3 h-3 transform translate-x-1 -translate-y-1 bg-red-600 border-2 border-white rounded-full dark:border-gray-800"></span>
                  </button> */}
                {/* <template x-if="isNotificationsMenuOpen">
                    <ul
                      className="absolute right-0 w-56 p-2 mt-2 space-y-2 text-gray-600 bg-green-400 border border-green-500 rounded-md shadow-md">
                      <li className="flex">
                        <a className="text-white inline-flex items-center justify-between w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800"
                          href="#">
                          <span>Messages</span>
                          <span
                            className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-600 bg-red-100 rounded-full dark:text-red-100 dark:bg-red-600">
                            13
                          </span>
                        </a>
                      </li>
                    </ul>
                  </template> */}
                {/* </li> */}
              </ul>
            </div>
          </header>


          <main className="">
            <div className="grid mb-4 pb-10 px-8 mx-4 rounded-3xl bg-gray-100 border-4 border-green-400">
              <div className="grid grid-cols-12 gap-6">
                <div className="grid grid-cols-12 col-span-12 gap-6 xxl:col-span-9">
                  <div className="col-span-12 mt-8">
                    <div className="flex items-center h-10 intro-y">
                      <h2 className="mr-5 text-lg font-medium truncate">Dashboard for AquaShrimp Temperature Sensor</h2>
                    </div>
                    <div className="grid grid-cols-12 gap-6 mt-5">
                      <a className="transform  hover:scale-105 transition duration-300 shadow-xl rounded-lg col-span-12 sm:col-span-6 xl:col-span-3 intro-y bg-white"
                        href="#">
                        <div className="p-5">
                          <div className="flex justify-between">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-400"
                              fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth="2"
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
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
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-yellow-400"
                              fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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
                      {/* <a className="transform  hover:scale-105 transition duration-300 shadow-xl rounded-lg col-span-12 sm:col-span-6 xl:col-span-3 intro-y bg-white"
                        href="#">
                        <div className="p-5">
                          <div className="flex justify-between">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-pink-600"
                              fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth="2"
                                d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                              <path strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth="2"
                                d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                            </svg>
                            <div
                              className="bg-yellow-500 rounded-full h-6 px-2 flex justify-items-center text-white font-semibold text-sm">
                              <span className="flex items-center">30%</span>
                            </div>
                          </div>
                          <div className="ml-2 w-full flex-1">
                            <div>
                              <div className="mt-3 text-3xl font-bold leading-8">4.510</div>

                              <div className="mt-1 text-base text-gray-600">Item Sales</div>
                            </div>
                          </div>
                        </div>
                      </a>
                      <a className="transform  hover:scale-105 transition duration-300 shadow-xl rounded-lg col-span-12 sm:col-span-6 xl:col-span-3 intro-y bg-white"
                        href="#">
                        <div className="p-5">
                          <div className="flex justify-between">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-400"
                              fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth="2"
                                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                            </svg>
                            <div
                              className="bg-blue-500 rounded-full h-6 px-2 flex justify-items-center text-white font-semibold text-sm">
                              <span className="flex items-center">30%</span>
                            </div>
                          </div>
                          <div className="ml-2 w-full flex-1">
                            <div>
                              <div className="mt-3 text-3xl font-bold leading-8">4.510</div>

                              <div className="mt-1 text-base text-gray-600">Item Sales</div>
                            </div>
                          </div>
                        </div>
                      </a> */}
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