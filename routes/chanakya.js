var express = require('express');
var router = express.Router();
const chanakyaShloks = require('./../public/shlokas/shloksvalid')
const { getDataFromCache, setDataInCache } = require('../utils/redisCache')

/* GET Single  Random Chanakya Slokas  */
router.get('/shloka/random', async (req, res,) => {
  try {
    const indexNo = Math.floor(Math.random() * (chanakyaShloks["Chanakya Slokas"].length - 1) + 1);
    // Check if the data is already cached in Redis
    const cacheKey = `Chanakya:random:${indexNo}`;
    const cachedData = await getDataFromCache(cacheKey);

    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    const data = chanakyaShloks["Chanakya Slokas"][indexNo];
    // Store the fetched data in Redis cache
    await setDataInCache(cacheKey, data, 3600)
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    })
  }
});

/* GET All  Chanakya Slokas with pagination  */
router.get('/shloka', async (req, res) => {
  let { page, limit } = req.query;
  try {
    if (!page) page = 1;
    if (!limit) limit = 10;
    // Check if the data is already cached in Redis
    const cacheKey = `Chanakya:${page}:${limit}`;
    const cachedData = await getDataFromCache(cacheKey);

    if (cachedData) {
      return res.status(200).json(cachedData);
    }
    const startIndex = parseInt((page - 1) * limit + 1);
    const endIndex = parseInt(page * limit);
    const logicalPage = parseInt(chanakyaShloks["Chanakya Slokas"].length / 10);
    const logicalLimit = 10;
    const data = chanakyaShloks["Chanakya Slokas"].slice(startIndex, endIndex);
    if (data.length === 0) {
      return res.status(500).json({
        success: false,
        message: `Please select the page in range of ${logicalPage} with limit of ${logicalLimit} or you can modify becaue the total shloks is  is ${chanakyaShloks["Chanakya Slokas"].length}`
      })
    }

    // Store the fetched data in Redis cache
    await setDataInCache(cacheKey, data, 3600)
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    })
  }
});


/* GET All Chanakya Slokas  */
router.get('/all', async (req, res) => {
  try {
    // Check if the data is already cached in Redis
    const cacheKey = `Chanakya:all`;
    const cachedData = await getDataFromCache(cacheKey);

    if (cachedData) {
      return res.status(200).json(cachedData);
    }
    const data = chanakyaShloks["Chanakya Slokas"];
    // Store the fetched data in Redis cache
    await setDataInCache(cacheKey, data, 3600)
    res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    })
  }
});


module.exports = router;
