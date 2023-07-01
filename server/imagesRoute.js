/**
 * Image Displayer
 * Asaf Gilboa
 * 30/06/2023
 */

const express = require('express');
const router = express.Router();

const { getImagesByTag, getRandomImages } = require("./imagesController");


router.get("/:searchText/:requestPage", getImagesByTag);
router.get("/random", getRandomImages);


module.exports = router;
