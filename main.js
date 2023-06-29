/**
 * Image Displayer
 * Asaf Gilboa
 * 28/06/2023
 */


// I'm aware this shouldn't be here, 
// for the sake of the exercise I'm avoiding using an env file for now
const API_KEY = '37958354-de46dabfdd71801db390aedd0';

let requestPage = 1;
let searchText = '';
// let imagesArray = [];


function fetchImages() {
    const fetchString = `https://pixabay.com/api/?key=${API_KEY}&q=${searchText}&page=${requestPage}&pretty=true`;
    requestPage++;
    fetch(fetchString)
        .then((response) => response.json())
        .then((data) => {
            for (let i = 0; i < data.hits.length; i++) {
                // imagesArray.push(data.hits[i].webformatURL);
                const imgElement = `<img src="${data.hits[i].webformatURL}" alt="searched image"
                onclick='imgClick(this, "${(requestPage * 20) + i}")' class="imageCard">`;
                document.getElementById("imageGrid").innerHTML += imgElement;
            }
        });
}


document.getElementById('moreImagesBtn').addEventListener('click', fetchImages);
document.getElementById('imageSearchClick').addEventListener('click', imageSearchClick);
function imageSearchClick(e) {
    e.preventDefault();
    document.getElementById("moreImagesBtn").style.display = "none";
    document.getElementById("imageGrid").innerHTML = '';
    // imagesArray = [];
    requestPage = 1;
    searchText = document.getElementById("imageSearchBox").value;
    fetchImages();
    document.getElementById("moreImagesBtn").style.display = "block";
}


function imgClick(element) {
    console.log("this) : ", element.src);
}

function slide(direction) {
    console.log(direction);
}
