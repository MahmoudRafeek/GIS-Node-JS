const express = require("express");
const mongoose = require("mongoose");
const NodeGeocoder = require("node-geocoder");
const dotenv = require("dotenv");
const axios = require("axios");
const countriesRouter = require("./countryRoutes"); // استيراد الراوتر الخاص بالدول
const dbConnection = require("./config/database");

dbConnection();
dotenv.config();
let apiKey = process.env.GOOGLE_MAPS_API_KEY;
const options = {
  provider: "google",
  apiKey: "YOUR_API_KEY_HERE",
};
const googleMapClient = require("@google/maps").createClient({
  key: process.env.GOOGLE_MAPS_API_KEY,
});
let app = express();
app.use(express.json());

// Root route just returns "Hello"
app.get("", (req, res) => {
  return res.json("Hello");
});

// Route for geocoding using POST method
app.get("/ge-coding", (req, res) => {
  googleMapClient.geocode(
    { address: "Al-Arish, North Sinai, Egypt" },
    function (err, response) {
      if (!err) {
        console.log(response.json.results);
        res.json(response.json.results);
      } else {
        // Handle error here
        console.error(err);
        res.status(500).json({ error: "An error occurred" });
      }
    }
  );
});
app.get("/restaurant", async (req, res, next) => {
  try {
    const city = "Al-Arish";
    const category = "restaurant";
    const near_to = "Qesm Thaleth Al Arish";
    const { data } = await axios.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${category}+${city}+${near_to}&type=restaurant&key=${apiKey}`
    );
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// استخدام الراوتر الخاص بالدول عندما يتم الوصول إلى المسار "/countries"
app.use("/countries", countriesRouter);

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
