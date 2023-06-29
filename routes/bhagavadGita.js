var express = require('express');
var router = express.Router();
const gitaShloks = require("./../public/shlokas/gitashloks.json")

/* GET Bhagavad_gita shoka by chapter no and verse  */
router.get('/shloka', (req, res) => {
  const { chapter, verse } = req.query;
  if (!chapter || !verse) {
    return res.status(400).send({
      success: false,
      message: "Please provide Chapter and Verse"
    });
  }
  try {
    if (chapter > 18 || chapter < 1) {
      return res.status(400).send({
        success: false,
        message: "Please provide a Valid Chapter and Verse"
      });
    }
    else if (verse < 1 || verse > gitaShloks[chapter].length) {
      return res.status(400).send({
        success: false,
        message: "Please provide a Valid  Verse"
      });
    }
    else {
      const data = gitaShloks[chapter][verse];
      data["Chapter"] = chapter;
      return res.status(200).send(data);
    }
  }
  catch (e) {
    console.log(e)
    return res.status(500).send({
      success: false,
      message: "Internal Server Error"
    })
  }
});

router.get('/all', (req, res) => {
  let { chapter, page, limit } = req.query;
  if (!chapter || chapter < 1 || chapter > 18) {
    return res.status(400).send({
      success: false,
      message: "Please provide a Valid Chapter"
    })
  }
  try {
    if (!page) page = 1;
    if (!limit) limit = 10;
    const temp = gitaShloks[chapter];
    const chapterNo = {
      "chapter": chapter
    }
    const starIndex = (page - 1) * limit + 1;
    const endIndex = page * limit;
    const logicalPage = temp.length / 10;
    const logicalLimit = 10;
    const data = temp.slice(starIndex - 1, endIndex)
    if (data.length == 0) {
      return res.status(500).send({
        success: false,
        message: `Please select the page in range of ${logicalPage} with limit of ${logicalLimit} or you can modify becaue the total verses in this chapter is ${temp.length}`
      })
    }
    data.unshift(chapterNo)
    return res.status(200).send(data)
  } catch (e) {
    console.log(e)
    return res.status(500).send({
      success: false,
      message: "Internal Server Error"
    })
  }
})

router.get('/random', (req, res) => {
  try {
    let chapter = Math.floor(Math.random() * (18 - 1) + 1);
    let verse = Math.floor(Math.random() * (gitaShloks[chapter].length - 1) + 1);
    const data = gitaShloks[chapter][verse];
    data["Chapter"] = chapter;
    return res.status(200).send(data);
  } catch (e) {
    console.log(e)
    return res.status(500).send({
      success: false,
      message: "Internal Server Error"
    })
  }
})

router.get('/random/by', (req, res) => {
  const { chapter } = req.query;
  if (!chapter) {
    return res.status(400).send({
      success: false,
      message: "Please provide Chapter"
    })
  }
  try {
    if (chapter < 1 || chapter > 18) {
      return res.status(400).send({
        success: false,
        message: "Please provide a Valid Chapter"
      })
    }
    else {
      const verse = Math.floor(Math.random() * (gitaShloks[chapter].length - 1) + 1);
      const data = gitaShloks[chapter][verse];
      data["Chapter"] = chapter;
      return res.status(200).send(data);
    }
  } catch (e) {
    console.log(e)
    return res.status(500).send({
      success: false,
      message: "Internal Server Error"
    })
  }
})

module.exports = router;
