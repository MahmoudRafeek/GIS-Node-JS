const express = require("express");
const Country = require("./countryModel"); // استيراد موديل الدول
const router = express.Router();

// POST route لإضافة دولة جديدة
router.post("/", async (req, res) => {
  try {
    // const { name, capital, population, continent, location } = req.body;

    const newCountry = await Country.create(req.body);
    res.status(201).json({
      status: "success",
      data: newCountry,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET route للحصول على كل الدول
router.get("/", async (req, res) => {
  try {
    const countries = await Country.find();
    res.json({ count: countries.length, countries: countries });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/nearby", async (req, res) => {
  let maxDistance = req.query.maxDistance || 500000;
  const { longitude, latitude } = req.query;

  try {
    // استعلام MongoDB للبحث عن المناطق القريبة
    const result = await Country.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: parseInt(maxDistance), // تحويل القيمة إلى رقم صحيح
        },
      },
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = router;
