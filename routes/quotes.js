const express = require('express');
const router = express.Router();
const fs = require('fs');
const gitaShloks = require("./../public/shlokas/gitashloks.json");
const sanskritSlogan = require('./../public/shlokas/shloksvalid');
const vidurNitiShloks = require('./../public/shlokas/shloksvalid');
const chanakyaShloks = require('./../public/shlokas/shloksvalid');


const TextToSVG = require('text-to-svg');
const textToSVG = TextToSVG.loadSync();

const indexNo = Math.floor(Math.random() * (chanakyaShloks["Chanakya Slokas"].length - 1) + 1);
// Check if the data is already cached in Redis
    data = chanakyaShloks["Chanakya Slokas"][indexNo];
    // Store the fetched data in Redis cache
const respo = data.sloka;

const attributes = { fill: 'red', stroke: 'black' };
const options = { x: 0, y: 0, fontSize: 72, anchor: 'top', attributes: attributes };

const svg = textToSVG.getSVG(respo, options);
fs.writeFileSync("test.txt",svg)
console.log(svg)

router.get("/svg", (req, res) => {
    try {
        res.setHeader('Content-Type', 'image/svg+xml');
        res.sendFile('./index.svg');
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
})


module.exports = router;