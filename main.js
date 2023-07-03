/**
 * Image Displayer
 * Asaf Gilboa
 * 28/06/2023
 */


let requestPage = 1;
let searchText = '';
let selectedCategory = 'all';
let selectedColors = 'all';
let selectedOrientation = 'all';
let modalOpen = false;
let imagesArray = [];
let favorites = {};
const CACHE_EXPIRY = 600000;



function populateFilters() {
    const imageCategories = [
        "Backgrounds", "Fashion", "Nature", "Science", "Education",
        "Feelings", "Health", "People", "Religion", "Places", "Animals",
        "Industry", "Computer", "Food", "Sports", "Transportation",
        "Travel", "Buildings", "Business", "Music"
    ];
    const imageColors = [
        "Grayscale", "Transparent", "Red", "Orange",
        "yellow", "Green", "Turquoise", "Blue", "Lilac",
        "Pink", "White", "Gray", "Black", "Brown"
    ];
    const imageOrientations = ["Horizontal", "Vertical"];

    let dropdown = document.getElementById('categoryFilter');
    imageCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.toLowerCase();
        option.textContent = category;
        dropdown.appendChild(option);
    });
    dropdown = document.getElementById('colorsFilter');
    imageColors.forEach(color => {
        const option = document.createElement('option');
        option.value = color.toLowerCase();
        option.textContent = color;
        dropdown.appendChild(option);
    });
    dropdown = document.getElementById('orientationFilter');
    imageOrientations.forEach(orientation => {
        const option = document.createElement('option');
        option.value = orientation.toLowerCase();
        option.textContent = orientation;
        dropdown.appendChild(option);
    });
}
populateFilters()


function populateGrid(images) {
    try {
        for (i in images) {
            imagesArray.push(images[i]);
            let favorited = (images[i].id in favorites);
            const imgElement =
                `<div class="imageWrapper">
                <img src="${images[i].webformatURL}" alt="searched image" 
                onclick='imageClick(this)' 
                class="imageCard" id="image_${imagesArray.length - 1}" >
                <span class="imgTooltip" id="tooltip_${imagesArray.length - 1}">
                Tags: <br> ${images[i].tags}
                <br> - - - <br>
                User: ${images[i].user}
                <br> - - - <br>
                Likes: ${images[i].likes}
                </span>
                <span class="favBtn ${favorited ? 'favorited' : ''}" 
                    id="fav_${imagesArray.length - 1}"
                    onclick='favClick(this)'>
                    &#10084;
                </span>
            </div>`;
            document.getElementById("imageGrid").innerHTML += imgElement;
        }
    } catch (error) {
        console.error("populateGrid error: ", error.message);
    }
}


function getRandomImages() {
    try {

        const fetchString = `http://localhost:3000/images/random`;
        fetch(fetchString)
            .then((response) => response.json())
            .then((data) => {
                document.getElementById("imageGrid").innerHTML = '';
                populateGrid(data);
            });
    } catch (error) {
        console.error("getRandomImages error: ", error.message);
    }
}
getRandomImages();


function fetchImagesByTags() {
    try {
        const searchParams = {
            searchText: searchText,
            selectedCategory: selectedCategory,
            selectedColors: selectedColors,
            selectedOrientation: selectedOrientation,
            requestPage: requestPage
        }
        const fetchString =
            `http://localhost:3000/images/`;
        fetch(fetchString, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(searchParams),
        }).then((response) => response.json())
            .then((data) => {
                if (data.length < 20) {
                    document.getElementById("moreImagesBtn").style.display = "none";
                    if (data.length === 0) {
                        if (requestPage === 1) {
                            const noResMessage =
                                `<span class='noResMessage'>No Results found</span>`;
                            document.getElementById("message").style.display = "block";
                            document.getElementById("message").innerHTML = noResMessage;
                        }
                        return;
                    }
                }
                console.log("res: ", data);
                addToCache(data);
                populateGrid(data);
                requestPage++;
            });
    } catch (error) {
        console.error("fetchImagesByTags error: ", error.message);
    }
}


document.getElementById('moreImagesBtn').addEventListener('click', fetchImagesByTags);
document.getElementById('imageSearchClick').addEventListener('click', imageSearchClick);
function imageSearchClick(e) {
    e.preventDefault();
    searchText = document.getElementById("imageSearchBox").value.replace(/\s/g, '+');
    selectedCategory = document.getElementById("categoryFilter").value;
    selectedColors = document.getElementById('colorsFilter').value;
    selectedOrientation = document.getElementById('orientationFilter').value;
    if (!searchText && (selectedCategory === 'all')) {
        // getRandomImages();
        return;
    };
    document.getElementById("message").style.display = "none";
    document.getElementById("message").innerHTML = '';
    document.getElementById("imageGrid").innerHTML = '';
    document.getElementById("moreImagesBtn").style.display = "none";
    document.getElementById('showFavorites').innerHTML = "Favorites";
    imagesArray = [];
    requestPage = 1;
    const cacheData = getFromCache();
    if (cacheData) {
        populateGrid(cacheData);
    } else {
        fetchImagesByTags();
    }
    document.getElementById("moreImagesBtn").style.display = "block";
}


function imageClick(imgElement) {
    if (modalOpen) return;
    const imgIndex = Number(imgElement.id.substring(6));
    document.getElementById("pageWrapper").addEventListener('click', handlePageClick);
    document.getElementById("imageModalUI").style.display = "flex";
    document.getElementById("modalImage").src = imgElement.src;
    // document.getElementById("modalImage").name = imgElement.id;
    document.getElementById("modalImage").name = imgIndex;
    document.getElementById("pageWrapper").style.filter = "blur(4px)";
    const favorited = (imagesArray[imgIndex].id in favorites);
    const favIcon = `<span class="favBtn favBtnModal ${favorited ? 'favorited' : ''}" 
                    id="modal_fav_${imgIndex}" onclick='favClick(this, true)'>
                        &#10084;
                    </span>`
    document.getElementById("imageModalUI").innerHTML += favIcon;
    setTimeout(() => {
        modalOpen = true;
    }, 0);
}


function favClick(favElement, fromModal = false) {
    if (modalOpen && !fromModal) return;
    const imgIndex = Number(favElement.id.substring(10));
    if (!(imagesArray[imgIndex].id in favorites)) {
        favorites[imagesArray[imgIndex].id] = imagesArray[imgIndex];
        favElement.style.color = "red";
        if (fromModal) {
            const gridImg = "fav_" + document.getElementById(`modalImage`).name;
            document.getElementById(gridImg).style.color = "red";
        }
    } else {
        delete favorites[imagesArray[imgIndex].id];
        favElement.style.color = "lightslategray";
        if (fromModal) {
            let currentModal = document.getElementById(`modalImage`).name;
            currentModal = "fav_" + currentModal;
            document.getElementById(currentModal).style.color = "lightslategray";
        }
    }
}


document.getElementById('showFavorites').addEventListener('click', showFavsClick);
function showFavsClick(e) {
    e.preventDefault();
    try {
        document.getElementById("message").style.display = "none";
        document.getElementById("message").innerHTML = '';
        document.getElementById("imageGrid").innerHTML = '';
        imagesArray = [];
        if (document.getElementById('showFavorites').innerHTML !== "Favorites") {
            backToSearch();
            return;
        }
        document.getElementById('showFavorites').innerHTML = "Back To Search";
        document.getElementById("moreImagesBtn").style.display = "none";
        if (Object.keys(favorites).length === 0) {
            const noFavMessage =
                `<span class='noResMessage'>No image favorited</span>`;
            document.getElementById("message").style.display = "block";
            document.getElementById("message").innerHTML = noFavMessage;
        } else {
            populateGrid(favorites);
        }
    } catch (error) {
        console.error("showFavsClick error: ", error.message);
    }
}


function backToSearch() {
    document.getElementById('showFavorites').innerHTML = "Favorites";
    requestPage = 1;
    if (searchText || selectedCategory !== 'all') {
        fetchImagesByTags();
        document.getElementById("moreImagesBtn").style.display = "block";
    } else {
        getRandomImages();
    }
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


function addToCache(data) {
    try {
        let cacheKey = searchText + requestPage
            + selectedCategory + selectedColors + selectedOrientation;
        cacheKey = cacheKey.replace(/\s/g, '+');
        localStorage.setItem(cacheKey, JSON.stringify(data));
        const newCacheDate = new Date();
        localStorage.setItem('cacheDate', JSON.stringify(newCacheDate));
        setTimeout(() => {
            localStorage.removeItem(cacheKey);
        }, CACHE_EXPIRY);
    } catch (error) {
        console.error("addToCache error: ", error.message);
    }
}


function getFromCache() {
    try {
        let cacheKey = searchText + requestPage
            + selectedCategory + selectedColors + selectedOrientation;
        cacheKey = cacheKey.replace(/\s/g, '+');
        const readFromCache = JSON.parse(localStorage.getItem(cacheKey)) || null;
        return readFromCache;
    } catch (error) {
        console.error("getFromCache error: ", error.message);
    }
}


function cacheClear() {
    try {
        const cacheDate = JSON.parse(localStorage.getItem('cacheDate')) || null;
        if (!cacheDate) return;
        const timeDifference = Date.now() - (new Date(cacheDate).getTime());
        const has24HoursPassed = timeDifference >= 86400000;
        if (has24HoursPassed) {
            localStorage.clear();
            const newCacheDate = new Date();
            localStorage.setItem('cacheDate', JSON.stringify(newCacheDate));
        }
    } catch (error) {
        console.error("cacheClear error: ", error.message);
    }
}
cacheClear();


function modalSilder(element, direction) {
    const sibling = (element.parentElement).children[1];
    const imgIndex = Number(sibling.name);

    const previousFavIcon = document.getElementById(`modal_fav_${imgIndex}`);
    if (previousFavIcon) {
        previousFavIcon.remove();
    }

    let nextIndex = direction === "right" ? (imgIndex + 1) : (imgIndex - 1);
    if ((imgIndex === 0) && (direction === "left")) {
        nextIndex = imagesArray.length - 1;
    } else if ((imgIndex === imagesArray.length - 1) && (direction === "right")) {
        nextIndex = 0;
    }

    const favorited = (imagesArray[nextIndex].id in favorites);
    const favIcon = `<span class="favBtn favBtnModal ${favorited ? 'favorited' : ''}" 
                    id="modal_fav_${nextIndex}" onclick='favClick(this, true)'>
                        &#10084;
                    </span>`
    document.getElementById("imageModalUI").innerHTML += favIcon;
    document.getElementById("modalImage").src = imagesArray[nextIndex].webformatURL;
    document.getElementById("modalImage").name = nextIndex;
}
