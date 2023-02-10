const express = require('express');
const { addName, mapInfo, addMap} = require('../controllers/mapController');
const router = express.Router();


router.post('/addName',addName)
router.post('/getMapInfo',mapInfo)
router.post("/addMap", addMap)
router.get('/getAllMaps',getAllMaps)
router.post("/allGeoMapInfo",getGeoMapinfo)
router.post('/updateGeoMap',updateGeoMap)
router.delete('/deleteMap/:id',deleteMap)
router.get('/getAllCoordinateMaps',getAllCoordinateMaps)
router.delete('/deleteMapName/:id',deleteMapName)
router.get('/viewAllMaps', viewAllMaps)

module.exports = router