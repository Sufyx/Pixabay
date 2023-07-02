/**
 * Image Displayer
 * Asaf Gilboa
 * 30/06/2023
 */



require("dotenv").config();
const API_KEY = process.env.API_KEY;



async function getImagesByTag(req, res) {
    try {
        const fetchString = req.body;
        const response = await fetch(fetchString);
        const data = await response.json();
        res.send(data.hits);
    } catch (error) {
        console.error("getImagesByTag error: ", error.message);
        res.status(500).send(error);
    }
}


async function getRandomImages(req, res) {
    let randomImages = [];
    try {
        const flip = (Math.floor(Math.random() * 2) + 1) - 1;
        const orientation = flip ? "horizontal" : "vertical";
        for (let i = 0; i < 5; i++) {
            const category = getRandomCategory();
            const page = Math.floor(Math.random() * 30) + 1;
            const fetchString = 
                `https://pixabay.com/api/?key=${API_KEY}&category=${category}&per_page=5&page=${page}&orientation=${orientation}&safesearch=true`;
            const response = await fetch(fetchString);
            const data = await response.json();
            let images = [...arrayShuffle(data.hits)];
            randomImages = randomImages.concat(images);
        }
        randomImages = arrayShuffle(randomImages).slice(0, 20);
        res.send(randomImages);
    } catch (error) {
        console.error("getRandomImages error: ", error.message);
        res.status(500).send(error);
    }
}


function getRandomCategory() {
    const imageCategories = [
        "backgrounds", "fashion", "nature", "science", "education",
        "feelings", "health", "people", "religion", "places", "animals",
        "industry", "computer", "food", "sports", "transportation",
        "travel", "buildings", "business", "music"
    ];
    const randomIndex = Math.floor(Math.random() * imageCategories.length);
    const randomCategory = imageCategories[randomIndex];
    return randomCategory;
}


function arrayShuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


module.exports = {
    getImagesByTag, getRandomImages
};
