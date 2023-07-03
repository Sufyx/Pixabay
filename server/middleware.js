/**
 * Image Displayer
 * Asaf Gilboa
 * 01/07/2023
 */


require("dotenv").config();
const API_KEY = process.env.API_KEY;



function createFetchString(req, res, next) {
    try {
        const searchparams = req.body;
        const { searchText, requestPage, selectedCategory, selectedColors, selectedOrientation } = searchparams;
        const categoryParam = (selectedCategory !== 'all') ? `&category=${selectedCategory}` : '';
        const colorsParam = (selectedColors !== 'all') ? `&colors=${selectedColors}` : '';
        const orientationParam = (selectedOrientation !== 'all') ? `&orientation=${selectedOrientation}` : '';
        const queryParam = searchText ? `&q=${searchText}` : '';
        const page = requestPage ? requestPage : 1;
        const fetchString =
            `https://pixabay.com/api/?key=${API_KEY}&page=${page}&safesearch=true` 
            + queryParam + categoryParam + colorsParam + orientationParam;
        req.body = fetchString;
        next();
    } catch (error) {
        console.error("createFetchString error: ", error.message);
        res.status(500).send(error);
    }
}

module.exports = { createFetchString };
