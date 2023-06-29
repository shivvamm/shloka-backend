var express = require('express');
var router = express.Router();
const vidurNitiShloks = require('./../public/shlokas/shloksvalid')

/* GET Single  Random  Vidur Niti Slokas */
router.get('/slogan/random', (req, res,) => {
  try {
    const indexNo = Math.floor(Math.random() * (vidurNitiShloks["Vidur Niti Slokas"].length - 1) + 1);
    const data = vidurNitiShloks["Vidur Niti Slokas"][indexNo];
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
router.get('/slogan', (req, res) => {
  let { page, limit } = req.query;
  try {
    if (!page) page = 1;
    if (!limit) limit = 10;
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
router.get('/all', (req, res) => {
  try {
    const data = vidurNitiShloks["Vidur Niti Slokas"];
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
