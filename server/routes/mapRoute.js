const express = require('express');
const { addName, mapInfo, addMap} = require('../controllers/mapController');
const router = express.Router();


router.post('/addName',addName)
router.post('/getMapInfo',mapInfo)
router.post("/addMap", addMap)

module.exports = router