// POKEMON GUESSING GAME
// this version only contains pokemon up till Pokemon Sword and Shield 

// high possibilty of needing to readjust code for new pokemon

// API for getting pokemon names https://pokeapi.co/api/v2/pokemon

// variables
const imageContainer = document.querySelector('.image-container')
const pkmnName = document.querySelector('.pokemon_name')
const result = document.querySelector('.result')
const submitBtn = document.querySelector('.submit_btn')
const userScoreElement = document.querySelector('.score')
const userText = document.querySelector('.user_text')
const timeElement = document.querySelector('.time')
const tryAgainSection = document.querySelector('.try-again')
const inputContainer = document.querySelector('.input-container')
const tryAgainButton = document.querySelector('.try_again_btn')


let userGivenPokemonName;
let score = 0;


submitBtn.addEventListener('click', (e) => {
    // prevent default behaviour of form submission
    e.preventDefault()
    checkQuizResult(userGivenPokemonName)

    // gives 2 seconds before the next question is given
    setTimeout(() => {
        setToDefault()
        if (timeElement.textContent >=0){
            getRandomPokemonData()
        }
    }, 1000)
})  

tryAgainButton.addEventListener('click', (e) => {
    e.preventDefault()
    resetGame()
})

// function to get a randomPokemon
const getRandomPokemonData = () => {
        // there are 1154 objects (pokemon) in the API
    let randomPokemonID = Math.floor(Math.random() * 905)

    //call API to fetch random pokemon
    fetch(`https://pokeapi.co/api/v2/pokemon/${randomPokemonID}`)
    .then(res => res.json())
    .then(pokemonData => {
        getRandomPokemonSprite(pokemonData)
    })
}

const getRandomPokemonSprite = (pokemonData) => {
    console.log(pokemonData.name);

    // check if a pokemon sprite is available
    // if not then call another pokemon
    if (pokemonData.sprites.back_default === undefined ||
        pokemonData.sprites.back_default === null){
        getRandomPokemonData()
    }

    // array of pokemon pictures from different angles
    let pokemonSpriteArray = [
        pokemonData.sprites.back_default, pokemonData.sprites.back_shiny,
        pokemonData.sprites.front_default, pokemonData.sprites.front_shiny]
    let randomNumber = Math.floor(Math.random()  * 4)

    // randomly select sprite for given pokemon
    let pokemonSpriteLink = pokemonSpriteArray[randomNumber]
    let pokemonName = pokemonData.name
    
    let pkmnNameHyphenChecked = checkForHyphen(pokemonName)

    //show pokemon on screen
    renderPokemon(pkmnNameHyphenChecked, pokemonSpriteLink)
}

// function to check if a pokemon's name contains a hyphen
const checkForHyphen = (pokemonName) => {
    /*
        check if there is a hyphen in a pokemon's name and remove it
        unless the pokemon is porygon-z
    */ 
        if(pokemonName.indexOf("-") !== -1 && pokemonName !== 'porygon-z' 
            && pokemonName !== 'ho-oh' && !(pokemonName.includes('mo-o'))
            && pokemonName !== 'mr-mime'){
            let index = pokemonName.indexOf("-")
            if (pokemonName.includes("tapu")){
                let firstName = pokemonName.slice(0, index)
                let lastName = pokemonName.slice(index+1, pokemonName.length)
                pokemonName = `${firstName} ${lastName}`
            }

            else{
                pokemonName = pokemonName.slice(0, index)
            }             
        } 
        return pokemonName
}


// function to show pokemon 
const renderPokemon = (pokemonName, pokemonSpriteLink) => {
    imageContainer.innerHTML = `<img src="${pokemonSpriteLink}" 
        alt="" class="pokemon_image">
        <h2>What is the name of this Pokemon?</h2>`
    userGivenPokemonName = pokemonName
}

// function to check if user has input the correct pokemon name 
const checkQuizResult = (pokemonName) =>{
    pkmnName.innerHTML= `The pokemon's name is <span class 
        = "pokemon_name_bold">${pokemonName}</span>`
    if (userText.value.toUpperCase() === pokemonName.toUpperCase()){
        result.style.color = "green"
        result.innerHTML = "<br>Congratulations, you guessed correctly"
        score++
        userScoreElement.textContent = score
    }
    else{
        result.style.color = "red"
        result.innerHTML = "<br>aww, try again"    
    }
}

/**
 * function to set all altered elements to default state
 * this function is called after the program display's if 
 * the user's input is right or wrong
 */ 
const setToDefault = () => {
    userText.value = ""
    result.textContent = ""
    pkmnName.textContent = ""
}

const onTimer = (time) =>{
    getRandomPokemonData()
    const timingFunc = setInterval(() => {
        if (time > 0){
            time--
            timeElement.textContent = `${time}`
            if (time <=10){
                timeElement.style.color = 'red'
            }
        }
        else{
            imageContainer.innerHTML = `<img src="missingNo.png" 
                alt="" class="pokemon_image">
                <h2>A wild MissingNo has Appeared</h2>`
            timeElement.textContent = "GAME OVER"
            tryAgainSection.style.visibility = "visible"
            inputContainer.style.visibility = "hidden"
            userScoreElement.style.color = 'gold'
            clearInterval(timingFunc);
        }
    }, 1000);
}

// function to reset the game
const resetGame = () =>{
    userScoreElement.style.color = 'black'
    timeElement.textContent = "60"
    onTimer(60)
    score = 0
    userScoreElement.textContent = score
    inputContainer.style.visibility = "visible"
    tryAgainSection.style.visibility = "hidden"
    userText.value = ""
}

onTimer(timeElement.textContent)


