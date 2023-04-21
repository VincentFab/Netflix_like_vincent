import {api_key} from "./apikey"
const caroussel1 = document.getElementById("caroussel1")!
const caroussel2 = document.getElementById("caroussel2")!
const hero_banner_dom = document.getElementById("hero_banner")!

const fetcher = async (url: string) => {
    try {
        const res = await fetch(url)
        const data = await res.json()
        return data
    } catch (error) {
        console.log(error);
    }
}


async function fetcher_caroussel1() {
    try {
        // Fetch API pour récupérer les données
        const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=fr-FR&page=1`)
        const popular = await response.json()
        
        // Votre logique ici
        console.log(popular)
        
        function get_movie_titles(movieArray) {
            for (let i = 0; i < movieArray.length; i++) {
                const movie_title = movieArray[i].title;
                console.log(movie_title);
            }   
        }
        get_movie_titles(popular.results);
        function get_movie_poster(movieArray) {
            const movie_banner = movieArray[12].backdrop_path
            const banner = `https://image.tmdb.org/t/p/w780/${movie_banner}`
            const hero_banner = document.createElement('img')
            hero_banner.src = banner
            hero_banner.classList.add("hero_banner_img")
            hero_banner_dom.appendChild(hero_banner)


            console.log(movie_banner);

            for (let i = 0; i < movieArray.length; i++) {
              const movie_poster = movieArray[i].poster_path;
              const poster = `https://image.tmdb.org/t/p/w154/${movie_poster}`;
              const new_poster = document.createElement('img')
              new_poster.src = poster; 
              caroussel1.appendChild(new_poster);
            }   
            
            
            
          }
          
          get_movie_poster(popular.results);
        
    } catch (error) {
        console.log(error)
    }
}
fetcher_caroussel1()

async function fetcher_caroussel2() {
    try {
        // Fetch API pour récupérer les données
        const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${api_key}&language=fr-FR&page=1`)
        const popular = await response.json()

        // Votre logique ici
        console.log(popular)
        
        function get_movie_titles(movieArray) {
            for (let i = 0; i < movieArray.length; i++) {
                const movie_title = movieArray[i].title;
                console.log(movie_title);
            }   
        }
        get_movie_titles(popular.results);

        function get_movie_poster(movieArray) {
            
            
            
            for (let i = 0; i < movieArray.length; i++) {
              const movie_poster = movieArray[i].poster_path;
              const poster = `https://image.tmdb.org/t/p/w154/${movie_poster}`;
              const new_poster = document.createElement('img')
              new_poster.src = poster; 
              caroussel2.appendChild(new_poster);
            }   
            
            
            
          }
          
          get_movie_poster(popular.results);
        
    } catch (error) {
        console.log(error)
    }
}
fetcher_caroussel2()


const searchMovie = async (query: string) => {
    const moviesSearch = await fetcher(`https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${api_key}&language=fr-FR&page=1`)
    return moviesSearch
}

const removeSearchPage = () => {
    const domSearchPageElements = document.querySelectorAll('.search')

    domSearchPageElements.forEach(element => {
        element.remove()
    })
}

const closeSearch = () => {
    const domSearchInput = document.getElementById('searchInput') as HTMLInputElement
    const home_page = document.getElementById('searchbar')!
    domSearchInput.value = ""
    removeSearchPage()
    home_page.classList.remove('no_display')
}

const handleSearch = () => {
    const domSearchInput = document.getElementById('searchbar') as HTMLInputElement
    const home_page = document.getElementById('searchbar')!
    const search_page = document.getElementById('search_bar')!
    if (domSearchInput.value.length >= 1) {
        removeSearchPage()

        searchMovie(domSearchInput.value).then(movies => {
            home_page.classList.add("no_display")

            search_page.append(createSearchList(movies.results))

            const quitSearchBtn = document.createElement('button') as HTMLButtonElement
            quitSearchBtn.classList.add('search', 'quitSearchBtn')
            quitSearchBtn.innerText = "X"
            quitSearchBtn.addEventListener('click', closeSearch)

            const domNavbar = document.getElementById('navbarRight') as HTMLDivElement
            domNavbar.append(quitSearchBtn)
        })
    }
}

const getImage = (size: number | string, uri: string) => {
    return 'https://image.tmdb.org/t/p/' + (size === 'original' ? '' : 'w') + size + uri
}

const createSearchList = (movies) => {
    const domSearchList = document.createElement('ul') as HTMLUListElement
    domSearchList.classList.add('search', 'searchList')

    movies.forEach(movie => {
        const domMSearchListItem = document.createElement('li') as HTMLLIElement
        domMSearchListItem.classList.add('searchListItem')

        const domMovieImg = document.createElement('img') as HTMLImageElement
        domMovieImg.src = getImage(185, movie.poster_path)

        domMSearchListItem.addEventListener('click', () => moviePopup(movie.id))

        domMSearchListItem.append(domMovieImg)
        domSearchList.append(domMSearchListItem)
    });

    return domSearchList
}

const closeMoviePopup = (popup: HTMLDivElement) => {
    popup.remove()
}

// Créer une popup de film
const createMoviePopup = (movie) => {
    const domPopup = document.createElement('div') as HTMLDivElement
    domPopup.classList.add('popup')

    const popupHeader = document.createElement('div') as HTMLDivElement
    popupHeader.classList.add('popupHeader')

    const popupCloseBtn = document.createElement('button') as HTMLButtonElement
    popupCloseBtn.innerText = 'X'
    popupCloseBtn.addEventListener('click', () => closeMoviePopup(domPopup))

    const domMovieImg = document.createElement('div') as HTMLDivElement
    domMovieImg.classList.add('popupBackground')
    domMovieImg.style.backgroundImage = `url(${getImage("original", movie.backdrop_path)})`

    popupHeader.append(popupCloseBtn)
    domPopup.append(popupHeader, domMovieImg)

    return domPopup
}

// Fonction exécutée lorsque l'on clique sur une miniature de film
const moviePopup = (movieId) => {
    getMovieById(movieId).then((movie) => {
        const domBody = document.getElementById('body') as HTMLBodyElement
        const popup = createMoviePopup(movie)
        domBody.append(popup)
    })
}
