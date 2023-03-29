// DOM selector
const mainScreen =document.querySelector('.main-screen');
const pokeName = document.querySelector('.poke-name');
const pokeId = document.querySelector('.poke-id');
const pokeFrontImage = document.querySelector('.poke-front-image');
const pokeBackImage = document.querySelector('.poke-back-image');
const pokeTypeOne = document.querySelector('.poke-type-one');
const pokeTypeTwo = document.querySelector('.poke-type-two');
const pokeWeight = document.querySelector('.poke-weight');
const pokeHeight = document.querySelector('.poke-height');
const pokeListItems =document.querySelectorAll('.list-item');
const rightButton = document.querySelector('.right-button');
const leftButton = document.querySelector('.left-button');



const TYPES = [
    'normal','fighting','flying','poison',
    'ground','rock','bug','ghost',
    'steel','fire','water','grass',
    'electric','psychic','ice',
    'dragon','dark','fairy'
];


let prevUrl = null;
let nextUrl = null;

//function
const capitilize = (str) => str[0].toUpperCase() + str.substr(1);

const resetScreen = () =>{
    for(const type of TYPES){
        mainScreen.classList.remove(type);
    }
};




const fetchPokeList = url =>{
    fetch(url)
    .then(res => res.json())
    .then(data => {
      const {results,previous,next} =data;
        prevUrl=previous;
        nextUrl=next;
     for(let i=0 ;i<pokeListItems.length;i++){
      const pokeListItem = pokeListItems[i];
      const resultData =results[i];
      
  
      if(resultData){
          const { name,url } = resultData;
          const urlArray =url.split('/');
          const id =urlArray[urlArray.length - 2];
       pokeListItem.textContent=id + '. '+capitilize(name);
      }
      else{
      pokeListItem.textContent = '';
      }
     } 
    
    });
};



const fetchPokeData = id => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then(res => res.json())
    .then(data => {
   
       resetScreen();
   
       const dataTypes = data['types'];
       const dataFirstType = dataTypes[0];
       const dataSecondType = dataTypes[1];
       pokeTypeOne.textContent= capitilize(dataFirstType['type']['name']);
       if(dataSecondType){
           pokeTypeTwo.classList.remove('hide');
           pokeTypeTwo.textContent=capitilize(dataSecondType['type']['name']);
       }
       else{
           pokeTypeTwo.classList.add('hide');
       }
   
       mainScreen.classList.add(dataFirstType['type']['name']);
       mainScreen.classList.remove('hide');
       pokeName.textContent=capitilize(data['name']);
       pokeId.textContent='#' + data['id'].toString().padStart(3,'0');
       pokeWeight.textContent=data['weight'];
       pokeHeight.textContent=data['height'];
       pokeFrontImage.src=data['sprites']['front_default'] || '';
       pokeBackImage.src=data['sprites']['back_default'] || '';
    });
   
};

    const leftButtonClicked= () =>{
        if(prevUrl){
         fetchPokeList(prevUrl);
        }
     };
    const rightButtonClicked= () =>{
       if(nextUrl){
        fetchPokeList(nextUrl);
       }
    };

const handleListItemClicked = (e) => {
    if(!e.target) return;

    const listItem=e.target;
    if(!listItem.textContent) return;
    const id= listItem.textContent.split('.')[0];
    fetchPokeData(id);
  };
  


 //get data for right side of string
  
//ading events
leftButton.addEventListener('click', leftButtonClicked);
rightButton.addEventListener('click', rightButtonClicked);
for(const pokeListItem of pokeListItems){
    pokeListItem.addEventListener('click',handleListItemClicked);
}


//initialize App
fetchPokeList('https://pokeapi.co/api/v2/pokemon?offset=0&limit=20');