import './App.css';
import Header from "./Header.js";
import Form from "./Form.js";
import ArticleGallery from "./ArticleGallery";
import ReadList from './ReadList.js';
import Footer from './Footer.js';
import firebase from "./firebase.js";
import {useState, useEffect} from 'react';
import axios from 'axios';
import {getDatabase, onValue, ref} from 'firebase/database';
import {Routes, Route} from 'react-router-dom';

function App() {

  // Set state for the articles returned from the API call
  const [articles, setArticles] = useState (['']);

  // Set state for the users parameters, which dictate which category of article to render 
  const [userParam, setUserParam] = useState(['']);

  // Set state for when the user searches by keyword, also sets article state for rendering
  const [keyword, setKeyWord] = useState ('');

  // Set State for total number of articles saved in read list
  // const [totalArticles, setTotalArticles]=useState('');

  const [totalArticles, setTotalArticles]=useState("");

  // State that will render number of articles in newpaper icon (shopping cart)
  const [displayNumber, setDisplayNumber]= useState('');

//useEffect for when the user makes a selection triggering the paramters state to change
  useEffect(()=>{
    // This axios call will return articles based off the user's selected category
      axios({  
        url:`https://api.currentsapi.services/v1/latest-news`,
        params:{
            apiKey:`WYB2g_IF3u2aTOW2WjDYQeTFuJl84VJ04t4jq7941IFdVNfv`,
            language:'en',
            category:userParam,
            country:"ca"
        }
      })
      .then((response)=>{
      setArticles(response.data.news);
      })
     .catch(error => {
        console.log(error.response.data.error)
     })
},[userParam])


useEffect(()=>{
  if(keyword!=='')
  {
  // This axios call uses different paramters than category searching
  // This call is made by a change in the keyword state
    axios({  
      url:`https://api.currentsapi.services/v1/search`,
      params:{
        apiKey:`WYB2g_IF3u2aTOW2WjDYQeTFuJl84VJ04t4jq7941IFdVNfv`,
        language:'en',
        keywords:keyword
      
      }
    })
    .then((response)=>{
      setArticles(response.data.news);
    }) 
    .catch(error => {
      console.log(error.response.data.error)
      alert("No articles here!");
    })
   
  }
},[keyword])

useEffect(() => {
  
  const database = getDatabase(firebase)
  const dbRef = ref(database)
  

  // use the OnValue to return what objects are stored in the database currently
  onValue(dbRef, (response) => {

      //Store the response object from OnValue in a variable 
      const data=response.val();
   
      // Variable to Keep track of total amount of articles in state
      let count=0;


      // Using a for in loop:
      // push the object properties + the key property (equal to the object's firebase code)
      for(let article in data){
   
          count+=1;
       
      }
    
      // Set state for the objects stored in firebase, which will be mapped over below for rendering
    
      setTotalArticles(count)

      // props.passTotal(totalArticles);
  })

   //Pass the totalArticles state to app.js to render the current number of articles in the readlist

  
}, [displayNumber])

  


  // Function that will set the paramters state using the user's input set in state in the form component
  const getParameters = (param) =>{
    setUserParam(param);
  }


  // Function that will set the keyword state using the user's input set in state in the form component
  const getKeyWord = (search) =>{
    // Take the first character in the string and capitalize it for this keyword parameter to work
 
    let searchMod=search.toString();
    console.log(searchMod);
    setKeyWord(search);  
  }

//  State from ArticleGallery.js that tracks changes in the articles saved in read list
  const getTotalArticles = (totalA) =>{
    setDisplayNumber(totalA);
  }

  return (
    <>
    
    <Routes>
      {/* Route that renders the header, article gallery and footer */}
      <Route path ="/" element = {
        <> <Header itemsInList={totalArticles}/> 
        <Form passClick={getParameters} passWord = {getKeyWord}/> 
        <ArticleGallery article={articles} getArticleNumber={getTotalArticles}/> 
    
        <Footer/> </> }/>

      {/* Route that renders the header, readlist and footer */}
      <Route path ="/myreads" element=
        {<><Header itemsInList={totalArticles}/> 
        <ReadList/> 
       
        <Footer/></> }/> 
        
    </Routes>
      
    </>
  );
}

export default App;
