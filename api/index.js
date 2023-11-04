
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config(); // Ensure this comes before using process.env

const app = express();
const port = process.env.PORT || 3000;

const MONGOURI = process.env.MONGOURL;

// const MONGOURI=process.env.MONGOURL;
// Connect to MongoDB
mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const dataSchema = new mongoose.Schema({
  Temperature: {
    type: Number,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
});

const DataModel = mongoose.model('Data', dataSchema);

// Create a route to fetch data from the API and save it to MongoDB
app.get('/data', async (req, res) => {
  try {
    const response1 = await axios.get('https://blynk.cloud/external/api/get?token=WfQITWPhO1JeF3zrRGXvt09vi14Ekms-&v5');
    const data1 = response1.data;

    // Create a new object with the correct structure
    const newData1 = new DataModel({
      Temperature: data1, // Assuming 'data1' is the temperature value
      time: Date.now(), // You can adjust the time value as needed
    });

    // Save the data to MongoDB
    await newData1.save();

    const response2 = await axios.get('https://blynk.cloud/external/api/get?token=WfQITWPhO1JeF3zrRGXvt09vi14Ekms-&v6');
    const data2 = response2.data;

    // Create a new object for the second data point
    const newData2 = new DataModel({
      Temperature: data2, // Assuming 'data2' is the temperature value
      time: Date.now(), // You can adjust the time value as needed
    });

    // Save the second data point to MongoDB
    await newData2.save();

    res.status(200).json({ message: 'Data Saved to MongoDB' });
  } catch (error) {
    res.status(400).json({ message: 'Error Saving the Data' });
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server Running on Port ${port}`);
  setInterval(() => {
    axios.get('http://localhost:3000/data')
      .then(response => console.log('Data fetched and saved:', response.data))
      .catch(error => console.error('Failed to fetch and save data:', error));
  }, 10000); 
});
