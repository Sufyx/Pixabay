/**
 * Image Displayer
 * Asaf Gilboa
 * 30/06/2023
 */

const express = require('express');
const router = express.Router();

const { getImagesByTag } = require("./imagesController");


router.get("/:searchText/:requestPage", getImagesByTag);


module.exports = router;
