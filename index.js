import {renderImdbIDArray, render, isOnMainPage} from './utils.js'
const form = document.getElementById("movie-search")

if(isOnMainPage){
    form.addEventListener("submit", function(e){
        e.preventDefault()
        renderImdbIDArray() 
    }) 
}else {
    render()
}

