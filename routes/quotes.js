const express = require('express');
const router = express.Router();
const gitaShloks = require("./../public/shlokas/gitashloks.json");
const sanskritSlogan = require('./../public/shlokas/shloksvalid');
const vidurNitiShloks = require('./../public/shlokas/shloksvalid');
const chanakyaShloks = require('./../public/shlokas/shloksvalid');
const { getDataFromCache, setDataInCache } = require('../utils/redisCache')


const TextToSVG = require('text-to-svg');
const textToSVG = TextToSVG.loadSync();

const chanakya = async () => {
    const indexNo = Math.floor(Math.random() * (chanakyaShloks["Chanakya Slokas"].length - 1) + 1);
    // Check if the data is already cached in Redis
    const cacheKey = `Chanakya:random:${indexNo}`;
    let data = await getDataFromCache(cacheKey);

    if (!data) {
        data = chanakyaShloks["Chanakya Slokas"][indexNo];
        // Store the fetched data in Redis cache
        await setDataInCache(cacheKey, data, 3600)
    }
    const respo = `${data.shloka}`;
    return respo;
}


router.get("/svg", (req, res) => {
    try {
        const attributes = { fill: 'red', stroke: 'black' };
        const options = { x: 0, y: 0, fontSize: 72, anchor: 'top', attributes: attributes };

        const svg = textToSVG.getSVG(chanakya, options);

        console.log(svg);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
})


module.exports = router;