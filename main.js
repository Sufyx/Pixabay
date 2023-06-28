/**
 * Image Displayer
 * Asaf Gilboa
 * 28/06/2023
 */


const API_KEY = '37958354-de46dabfdd71801db390aedd0';
// let imagesArray = [];


document.getElementById('imageSearchClick').addEventListener('click', imageSearchClick);
function imageSearchClick(e) {
    e.preventDefault();
    document.getElementById("imageGrid").innerHTML = '';
    imagesArray = [];
    const searchText = document.getElementById("imageSearchBox").value;
    const fetchString = `https://pixabay.com/api/?key=${API_KEY}&q=${searchText}&pretty=true`;
    fetch(fetchString)
    .then((response) => response.json())
    .then((data) => {
        for (let i = 0; i < data.hits.length; i++) {
            // imagesArray.push(data.hits[i].webformatURL);
            const imgElement = `<img src="${data.hits[i].webformatURL}" alt="searched image" class="imageCard">`;
            document.getElementById("imageGrid").innerHTML += imgElement;
        }
        // document.getElementById("displayedImage").src = imagesArray[0];
    });
}


function slide(direction) {
    console.log(direction);
}
