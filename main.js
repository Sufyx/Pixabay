/**
 * Image Displayer
 * Asaf Gilboa
 * 28/06/2023
 */


let requestPage = 1;
let searchText = '';
let modalOpen = false;
let imagesArray = [];
let favorites = {};


function fetchImages() {
    const fetchString = `http://localhost:3000/images/${searchText}/${requestPage}`;
    fetch(fetchString)
        .then((response) => response.json())
        .then((data) => {
            if (data.length < 20) {
                document.getElementById("moreImagesBtn").style.display = "none";
                if (data.length === 0) {
                    if (requestPage === 1) {
                        const noResMessage =
                            `<span class='noResMessage'>No Results found</span>`;
                        document.getElementById("message").innerHTML = noResMessage;
                    }
                    return;
                }

            }
            for (let i = 0; i < data.length; i++) {
                imagesArray.push(data[i]);
                let favorited = (data[i].id in favorites);
                const imgElement =
                    `<div class="imageWrapper">
                        <img src="${data[i].webformatURL}" alt="searched image" 
                        onclick='imgClick(this)' 
                        class="imageCard" id="image_${imagesArray.length - 1}" >

                        <span class="imgTooltip" id="tooltip_${imagesArray.length - 1}">
                        Tags: <br> ${data[i].tags}
                        <br> - - - <br>
                        User: ${data[i].user}
                        <br> - - - <br>
                        Likes: ${data[i].likes}
                        </span>

                        <span class="favBtn ${favorited ? 'favorited' : ''}" 
                            id="fav_${imagesArray.length - 1}"
                            onclick='favClick(this)'>
                            &#10084;
                        </span>
                    </div>`;
                document.getElementById("imageGrid").innerHTML += imgElement;
            }
            requestPage++;
        });
}


document.getElementById('moreImagesBtn').addEventListener('click', fetchImages);
document.getElementById('imageSearchClick').addEventListener('click', imageSearchClick);
function imageSearchClick(e) {
    e.preventDefault();
    searchText = document.getElementById("imageSearchBox").value;
    if (!searchText) return;
    document.getElementById("message").innerHTML = '';
    document.getElementById("imageGrid").innerHTML = '';
    document.getElementById("moreImagesBtn").style.display = "none";
    document.getElementById('showFavorites').innerHTML = "Favorites";
    imagesArray = [];
    requestPage = 1;
    fetchImages();
    document.getElementById("moreImagesBtn").style.display = "block";
}


function imgClick(imgElement) {
    if (modalOpen) return;
    document.getElementById("pageWrapper").addEventListener('click', handlePageClick);
    document.getElementById("imageModalUI").style.display = "block";
    document.getElementById("modalImage").src = imgElement.src;
    document.getElementById("pageWrapper").style.filter = "blur(4px)";
    setTimeout(() => {
        modalOpen = true;
    }, 0);
}


function favClick(favElement) {
    if (modalOpen) return;
    const imgIndex = Number(favElement.id.substring(4));
    if (!(imagesArray[imgIndex].id in favorites)) {
        favorites[imagesArray[imgIndex].id] = imagesArray[imgIndex];
        favElement.style.color = "red";
    } else {
        delete favorites[imagesArray[imgIndex].id];
        favElement.style.color = "lightslategray";
    }
}


document.getElementById('showFavorites').addEventListener('click', showFavsClick);
function showFavsClick(e) {
    e.preventDefault();
    document.getElementById("message").innerHTML = '';
    if (document.getElementById('showFavorites').innerHTML !== "Favorites") {
        backToSearch();
        return;
    } else if (Object.keys(favorites).length === 0) {
        const noFavMessage =
            `<span class='noResMessage'>No image favorited</span>`;
        document.getElementById("message").innerHTML = noFavMessage;
    }
    document.getElementById("moreImagesBtn").style.display = "none";
    document.getElementById("imageGrid").innerHTML = '';
    imagesArray = [];
    for (const key in favorites) {
        imagesArray.push(favorites[key]);
        const imgElement =
            `<div class="imageWrapper">
                <img src="${favorites[key].webformatURL}" alt="searched image" 
                onclick='imgClick(this)' 
                class="imageCard" id="image_${imagesArray.length - 1}" >

                <span class="imgTooltip" id="tooltip_${imagesArray.length - 1}">
                Tags: <br> ${favorites[key].tags}
                <br> - - - <br>
                User: ${favorites[key].user}
                <br> - - - <br>
                Likes: ${favorites[key].likes}
                </span>

                <span class="favBtn favorited" 
                    id="fav_${imagesArray.length - 1}"
                    onclick='favClick(this)'>
                    &#10084;
                </span>
            </div>`;
        document.getElementById("imageGrid").innerHTML += imgElement;
    }
    document.getElementById('showFavorites').innerHTML = "Back To Search"
}


function backToSearch() {
    document.getElementById("imageGrid").innerHTML = '';
    document.getElementById('showFavorites').innerHTML = "Favorites";
    document.getElementById("moreImagesBtn").style.display = "block";
    imagesArray = [];
    requestPage = 1;
    if (searchText) fetchImages();
}


function handlePageClick(e) {
    if (!document.getElementById("imageModalUI").contains(e.target)) {
        closeModal();
    }
}


function closeModal() {
    if (!modalOpen) return;
    document.getElementById("pageWrapper").style.filter = "none";
    document.getElementById("imageModalUI").style.display = 'none';
    document.getElementById("pageWrapper").removeEventListener('click', handlePageClick);
    modalOpen = false;
}
