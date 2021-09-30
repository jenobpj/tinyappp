const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");//body-parser 
const cookieParser=require('cookie-parser')//cookieparser

app.set("view engine", "ejs");//set the view

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

//url database //
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
//user database//
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}


app.get("/urls", (req, res) => {
  const ida=req.cookies["user_id"]
  const user=users[ida]
  const templateVars = { urls: urlDatabase,user};
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const ida=req.cookies["user_id"]
  const user=users[ida]
  const templateVars = { urls: urlDatabase,user};
  res.render("urls_new",templateVars);
});


app.get("/urls/:shortURL", (req, res) => {
  const longURL= urlDatabase[req.params.shortURL];
  const ida=req.cookies["user_id"]
  const user=users[ida]
  if (longURL === undefined) {
    res.redirect("/urls");
    return;
  }
  const templateVars = { shortURL: req.params.shortURL, longURL: longURL,user};
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {  // Log the POST request body to the console
  let shortURL=generateRandomString();
  urlDatabase[shortURL]=req.body.longURL;
  res.redirect(`/urls/${shortURL}`)
});

app.post(`/urls/:shortURL/delete`,(req,res)=>{
  const shortURL=req.params.shortURL;
  delete urlDatabase[shortURL]
  res.redirect('/urls')
})

app.post('/urls/:id',(req,res)=>{
  const shortURL=req.params.id;
  const newOne=req.body.newURL;
  urlDatabase[shortURL]=newOne;
  res.redirect('/urls')
})




app.post('/logout',(req,res)=>{
  const keys=Object.keys(req.cookies);//extraceted the cookie key
  res.clearCookie(keys);//clear cookie
  res.redirect('/urls')
});


//To the register form
app.get('/register',(req,res)=>{ 
  const templateVars = {user:null};
  res.render("register", templateVars);
})
//creating new user 
app.post('/register',(req,res)=>{ 
  const{user,email,password}=req.body;//parsing the value
  if(user === '' ||email ==='' || password === ''){
    res.status(400).send('Sorry, you have to fill the form')

  }
  const foundPerson=findByEmailId(email,users)
  if(foundPerson){
    res.status(400).send('Sorry,that user already exists')
    return;
  }
  const userID=createUser(email,password,users);
  res.cookie("user_id",userID)// creating cookie
  res.redirect('/urls')  
})


//To the login page
app.get('/login',(req,res)=>{
  const templateVars = {user:null};
res.render('login',templateVars)

})
app.post('/login',(req,res)=>{
  const{emailId,passwordId}=req.body;
  //retrieve the user from the db
  const userFound=findByEmailId(emailId,users)
  //compare the passwords
  if(userFound && userFound.password === passwordId){
    //user is authenticated
    res.cookie('user_id',userFound.id)
    res.redirect('/urls')
    return;
  }
  //user is not authenticated
  res.status(403).send('wrong credentials')

});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



//generateRandom function//
function generateRandomString(){
  let randomCharacters='';
  const characters='ABCDEFGHIJKLMNOPQRSTUVWXYXabcdefghijklmnopqrstuvwxy1234567890';
  for(let i=0;i<6;i++){
    let randomNumber=Math.floor(Math.random() * 56 +1);
    randomCharacters +=characters[randomNumber]
  }
  return randomCharacters;
}
//function for creating user
function createUser(email,password,usersDB){
  const randomID=generateRandomString();
  usersDB[randomID]={ // creating new user
    id:randomID,
    email:email,
    password:password
  }
  return randomID;
}
// functio to find the user
function findByEmailId(emailexample,usersDB){
  for(let userKey in usersDB){
    const person=usersDB[userKey];
    if(person.email === emailexample){
      return person
    }
  }
  return false;
}