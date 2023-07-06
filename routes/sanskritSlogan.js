var express = require('express');
var router = express.Router();
const sanskritSlogan = require('./../public/shlokas/shloksvalid')
const { getDataFromCache, setDataInCache } = require('../utils/redisCache')
const TextToSVG = require('text-to-svg');
const textToSVG = TextToSVG.loadSync();

/* GET Single  Random Sanskrit Slogan  */
router.get('/slogan/random', async (req, res,) => {
  try {
    const indexNo = Math.floor(Math.random() * (sanskritSlogan["sanskrit-slogan"].length - 1) + 1);
    // Check if the data is already cached in Redis
    const cacheKey = `Slogan:random:${indexNo}`;
    let data = await getDataFromCache(cacheKey);

    if (!data) {
      data = sanskritSlogan["sanskrit-slogan"][indexNo];
      // Store the fetched data in Redis cache
      await setDataInCache(cacheKey, data, 3600)
    }

    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    })
  }
});

/* GET All  Sanskrit Slogan with pagination  */
router.get('/slogan', async (req, res) => {
  let { page, limit } = req.query;
  try {
    if (!page) page = 1;
    if (!limit) limit = 10;
    // Check if the data is already cached in Redis
    const cacheKey = `Slogan:${page}:${limit}`;
    let data = await getDataFromCache(cacheKey);

    if (!data) {
      const startIndex = parseInt((page - 1) * limit + 1);
      const endIndex = parseInt(page * limit);
      const logicalPage = parseInt(sanskritSlogan["sanskrit-slogan"].length / 10);
      const logicalLimit = 10;
      data = sanskritSlogan["sanskrit-slogan"].slice(startIndex, endIndex);
      if (data.length === 0) {
        return res.status(500).json({
          success: false,
          message: `Please select the page in range of ${logicalPage} with limit of ${logicalLimit} or you can modify becaue the total shloks is  is ${sanskritSlogan["sanskrit-slogan"].length}`
        })
      }
      // Store the fetched data in Redis cache
      await setDataInCache(cacheKey, data, 3600);
    }

    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    })
  }
});


/* GET All Sanskrit Slogan  */
router.get('/all', async (req, res) => {
  try {
    // Check if the data is already cached in Redis
    const cacheKey = `Slogan:all`;
    let data = await getDataFromCache(cacheKey);

    if (!data) {
      data = sanskritSlogan["sanskrit-slogan"];
      // Store the fetched data in Redis cache
      await setDataInCache(cacheKey, data, 3600);
    }

    res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    })
  }
});

/* GET All Sanskrit Slogan  */
router.get('/slogan/image', async (req, res) => {
  try {

    const indexNo = Math.floor(Math.random() * (sanskritSlogan["sanskrit-slogan"].length - 1) + 1);
    const slogan = sanskritSlogan["sanskrit-slogan"][indexNo];
    const cacheKey = `Slogan:image`
    let svg = await getDataFromCache(cacheKey);
    if (!svg) {
      const attributes = { fill: 'red', stroke: 'black' };
      const options = { x: 0, y: 0, fontSize: 72, anchor: 'top', attributes: attributes };

      svg = textToSVG.getSVG(slogan, options);
      await setDataInCache(cacheKey, svg, 3600);
    }

    return res.send(svg);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    })
  }
});


module.exports = router;
