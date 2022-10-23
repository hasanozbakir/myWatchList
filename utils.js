const searchPage = document.getElementById("search-page")
const inputEl = document.getElementById("input-value")
const watchListPage = document.getElementById("my-watch-list")
const isOnMainPage = document.getElementsByTagName("h1")[0].innerHTML === "Find your film"
let movies = []
let imdbIDArr = []

function renderEmptyListPage() {
    watchListPage.innerHTML = `
                <h3>Your watchlist is looking a little empty...</h3>
                <div class="change-list">
                    <button id="start-adding" onclick="document.location.href='index.html'" class="start-add-btn"></button>
                    <h4>Let’s add some movies!</h4>
                </div>`
}

async function renderImdbIDArray() {
    movies = []
    const value = inputEl.value
    const res = await fetch(`https://www.omdbapi.com/?s=${value}&type=movie&apikey=488eafd6`)
    const data = await res.json()
    const dataResponse = await data.Response  

    if(dataResponse === "True") {
        imdbIDArr = data.Search.map(item => item.imdbID)
        console.log(imdbIDArr)
        render()
    }else{
        renderTryAgain()
    } 
}

async function render() {
    let htmlEl = isOnMainPage ? searchPage: watchListPage;
    const array = isOnMainPage ? imdbIDArr: JSON.parse(localStorage.getItem("myFavs")) || [];
    if(!isOnMainPage && array.length === 0){
        renderEmptyListPage()
    }else{
        htmlEl.innerHTML = ""
        for(let id of array){
            const res = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=488eafd6`)
            const movie = await res.json()
            const { Poster, Title, imdbRating, Runtime, Genre, Plot } = movie
            let arr = JSON.parse(localStorage.getItem("myFavs")) || []
            const checkTrue = arr.indexOf(id) === -1 ? true: false;
            const checkClass = checkTrue ? "add-btn": "remove-btn";
            const checkText = checkTrue ? "Watchlist": "Remove"
            htmlEl.innerHTML +=`
                <section>
                    <img class="movie-img" src="${Poster}">
                    <div class="info">
                        <div class="movie-header">
                            <h2>${Title}</h2>
                            <div class="star">${imdbRating}</div>
                        </div>
                        <div class="info-container">
                            <p>${Runtime}</p>
                            <p>${Genre}</p>
                            <div class="change-list">
                                <button id="${id}" class="${checkClass}"></button>
                                <p>${checkText}</p>
                            </div>
                        </div>
                        <p>${Plot}</p>
                    </div>
                </section>`   
        }
    }
    addingListener()
}

function addingListener() {
    const addArray = document.getElementsByClassName('add-btn')
    for(let arr of addArray){
        arr.addEventListener("click", addToList)
    }
    
    const removeArray = document.getElementsByClassName('remove-btn')
    for(let arr of removeArray){
        arr.addEventListener("click", removeFromList)
    }
}

function renderTryAgain() {
    searchPage.innerHTML = `<div class="no-search-result">
                                <h3>Unable to find what you’re looking for. Please try another search.</h3> 
                            </div>`
}

function addToList() {
    const arr = JSON.parse(localStorage.getItem("myFavs")) || [];
    if(arr.indexOf(this.id) === -1) {
        arr.push(this.id)
        localStorage.setItem("myFavs", JSON.stringify(arr))
        render()
    }
}

function removeFromList() {
    let list = JSON.parse(localStorage.getItem("myFavs")) || []
    const arr = list.filter(item => item!=this.id)
    localStorage.setItem("myFavs", JSON.stringify(arr))
    render()
}

export {renderImdbIDArray, render, isOnMainPage}