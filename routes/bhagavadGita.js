var express = require('express');
var router = express.Router();
const gitaShloks = require("./../public/shlokas/gitashloks.json")
const { getDataFromCache, setDataInCache } = require('../utils/redisCache')

const svg = "../index.svg";
const generateSvg  = require("../utils/shlokToSvg");



/* GET Bhagavad_gita shoka by chapter no and verse  */
router.get('/shloka', async (req, res) => {
  const { chapter, verse } = req.query;
  if (!chapter || !verse) {
    return res.status(400).json({
      success: false,
      message: "Please provide Chapter and Verse"
    });
  }
  try {
    if (chapter > 18 || chapter < 1) {
      return res.status(400).json({
        success: false,
        message: "Please provide a Valid Chapter and Verse"
      });
    }
    else if (verse < 1 || verse > gitaShloks[chapter].length) {
      return res.status(400).json({
        success: false,
        message: "Please provide a Valid  Verse"
      });
    }
    else {
      // Check if the data is already cached in Redis
      const cacheKey = `Gita:${chapter}:${verse}`;
      let data = await getDataFromCache(cacheKey);

      if (!data) {
        data = gitaShloks[chapter][verse];
        data['Chapter'] = chapter;
              // Store the fetched data in Redis cache
      await setDataInCache(cacheKey, data, 3600);
      }

      // If not cached, fetch the data and store it in Redis cache
      



      return res.status(200).json(data);
    }
  }
  catch (e) {
    console.log(e)
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
});


router.get('/all', async (req, res) => {
  let { chapter, page, limit } = req.query;
  if (!chapter || chapter < 1 || chapter > 18) {
    return res.status(400).json({
      success: false,
      message: "Please provide a Valid Chapter"
    })
  }
  try {
    if (!page) page = 1;
    if (!limit) limit = 10;
    // Check if the data is already cached in Redis
    const cacheKey = `Gita:all:${chapter}:${page}:${limit}`
    let data = await getDataFromCache(cacheKey);

    if (!data) {
      const temp = gitaShloks[chapter];
      const chapterNo = {
        "chapter": chapter
      }
      const starIndex = parseInt((page - 1) * limit + 1);
      const endIndex = parseInt(page * limit);
      const logicalPage = parseInt(temp.length / 10);
      const logicalLimit = 10;
       data = temp.slice(starIndex - 1, endIndex)
      if (data.length == 0) {
        return res.status(500).json({
          success: false,
          message: `Please select the page in range of ${logicalPage} with limit of ${logicalLimit} or you can modify becaue the total verses in this chapter is ${temp.length}`
        })
      }
      data.unshift(chapterNo)
          // Store the fetched data in Redis cache
    await setDataInCache(cacheKey, data, 3600)
    }


    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    })
  }
})


router.get('/random', async (req, res) => {
  try {
    let chapter = Math.floor(Math.random() * (18 - 1) + 1);
    let verse = Math.floor(Math.random() * (gitaShloks[chapter].length - 1) + 1);

    // Check if the data is already cached in Redis
    const cacheKey = `Gita:random:${chapter}:${verse}`
    let data = await getDataFromCache(cacheKey);

    if (!data) {
      data = gitaShloks[chapter][verse];
    data["Chapter"] = chapter;
     // Store the fetched data in Redis cache
    await setDataInCache(cacheKey, data, 3600)
    }

    return res.status(200).json(data);
  } catch (e) {
    console.log(e)
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    })
  }
})

router.get('/random/by', async (req, res) => {
  const { chapter } = req.query;
  if (!chapter) {
    return res.status(400).json({
      success: false,
      message: "Please provide Chapter"
    })
  }
  try {
    if (chapter < 1 || chapter > 18) {
      return res.status(400).json({
        success: false,
        message: "Please provide a Valid Chapter"
      })
    }
    else {
      const verse = Math.floor(Math.random() * (gitaShloks[chapter].length - 1) + 1);
      // Check if the data is already cached in Redis
      const cacheKey = `Gita:randomBy:${chapter}:${verse}`
      let data = await getDataFromCache(cacheKey);
      if (!data) {
        data = gitaShloks[chapter][verse];
        data["Chapter"] = chapter;
  
        // Store the fetched data in Redis cache
        await setDataInCache(cacheKey, data, 3600)
      }
      
      return res.status(200).json(data);
    }
  } catch (e) {
    console.log(e)
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    })
  }
})

/* GET Bhagavad_gita random shoka svg  */
router.get("/quote",async(req,res)=>{
   try {
   let chapter = Math.floor(Math.random() * (18 - 1) + 1);
    let verse = Math.floor(Math.random() * (gitaShloks[chapter].length - 1) + 1);
    data = gitaShloks[chapter][verse];
    const page = generateSvg(data["Shloka"]).toString();
  return res.status(200).send(page);
}catch(e){
  console.log(e)
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    })
}
})

module.exports = router;
