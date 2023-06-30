var express = require('express');
var router = express.Router();
const vidurNitiShloks = require('./../public/shlokas/shloksvalid')
const { getDataFromCache, setDataInCache } = require('../utils/redisCache')

/* GET Single  Random  Vidur Niti Slokas */
router.get('/maxims/random', async (req, res,) => {
  try {
    const indexNo = Math.floor(Math.random() * (vidurNitiShloks["Vidur Niti Slokas"].length - 1) + 1);
    // Check if the data is already cached in Redis
    const cacheKey = `VidurNiti:random:${indexNo}`;
    const cachedData = await getDataFromCache(cacheKey);

    if (cachedData) {
      return res.status(200).send(cachedData);
    }
    const data = vidurNitiShloks["Vidur Niti Slokas"][indexNo];
    // Store the fetched data in Redis cache
    await setDataInCache(cacheKey, data, 3600);
    return res.status(200).send(data);
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error"
    })
  }
});

/* GET All  Vidur Niti Slokas with pagination  */
router.get('/maxims', async (req, res) => {
  let { page, limit } = req.query;
  try {
    if (!page) page = 1;
    if (!limit) limit = 10;
    // Check if the data is already cached in Redis
    const cacheKey = `VidurNiti:${page}:${limit}`;
    const cachedData = await getDataFromCache(cacheKey);

    if (cachedData) {
      return res.status(200).send(cachedData);
    }
    const startIndex = parseInt((page - 1) * limit + 1);
    const endIndex = parseInt(page * limit);
    const logicalPage = parseInt(vidurNitiShloks["Vidur Niti Slokas"].length / 10);
    const logicalLimit = 10;
    const data = vidurNitiShloks["Vidur Niti Slokas"].slice(startIndex, endIndex);
    if (data.length === 0) {
      return res.status(500).send({
        success: false,
        message: `Please select the page in range of ${logicalPage} with limit of ${logicalLimit} or you can modify becaue the total shloks is  is ${vidurNitiShloks["Vidur Niti Slokas"].length}`
      })
    }
    // Store the fetched data in Redis cache
    await setDataInCache(cacheKey, data, 3600);
    return res.status(200).send(data);
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error"
    })
  }
});


/* GET All Vidur Niti Slokas  */
router.get('/all', async (req, res) => {
  try {
    // Check if the data is already cached in Redis
    const cacheKey = `VidurNiti:all`;
    const cachedData = await getDataFromCache(cacheKey);

    if (cachedData) {
      return res.status(200).send(cachedData);
    }
    const data = vidurNitiShloks["Vidur Niti Slokas"];
    // Store the fetched data in Redis cache
    await setDataInCache(cacheKey, data, 3600);
    res.status(200).send(data);
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error"
    })
  }
});


module.exports = router;
