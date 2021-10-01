const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");//body-parser 
const cookieParser=require('cookie-parser')//cookieparser
const bcypt= require('bcryptjs');//bccrypt
const salt =bcypt.genSaltSync(10);
const cookieSession=require("cookie-session")
const {generateRandomString,findByEmailId,userForUrls,userfinds} = require('./helper')


app.set("view engine", "ejs");//set the view

app.use(cookieParser());
app.use(cookieSession({//set cookiesession;
  name:'session',
  keys:['tinyapp']
}));
app.use(bodyParser.urlencoded({extended: true}));
//**************************************************************** *****************************/
//url database //
const urlDatabase = {
  b6UTxQ: {
      longURL: "https://www.tsn.ca",
      userID: "aJ48lW"
  },
  i3BoGr: {
      longURL: "https://www.google.ca",
      userID: "aJ48lW"
  }
};
//user database//
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: bcypt.hashSync("purple-monkey-dinosaur",salt)
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: bcypt.hashSync("dishwasher-funk",salt)
  }
}
//**************************************************************** *****************************/

//showing MY urls page ////urls_index page edit and delete button created
app.get("/urls", (req, res) => {
  const newDataBase=userForUrls(req.session.user_id,urlDatabase)//call function for showing users urls
  const user=userfinds(users,req.session.user_id);
  if(user){//checks user is login or not
  const templateVars = { urls: newDataBase,user};
  res.render("urls_index", templateVars);
  return;
  }
  return res.status(401).send("You must <a href='/login'>Login</a> first")

});
//**************************************************************** *****************************/
//showing creatNew url page
app.get("/urls/new", (req, res) => {
  if(req.session.user_id){ // checking user is logedin or not
  const user=userfinds(users,req.session.user_id)
  const templateVars = { urls: urlDatabase,user};
  res.render("urls_new",templateVars);
  return;
  }
  res.status(400).send("You must <a href='/login'>Login</a> first")
});
//**************************************************************** *****************************/
//creeating new url
app.post("/urls", (req, res) => {  
  if(req.session.user_id){
  const shortURL=generateRandomString();//create shorturl
  const longURL=req.body.longURL;
  urlDatabase[shortURL]={longURL,userID:req.session.user_id};//added to database
  res.redirect(`/urls/${shortURL}`)//
  }
});
//**************************************************************** *****************************/
//direct to the urls_show will show the individual url
app.get("/urls/:shortURL", (req, res) => {
  const objectKeys=Object.keys(urlDatabase);//checking short is exist or not
  if(objectKeys.includes(req.params.shortURL)){
  const longURL= urlDatabase[req.params.shortURL].longURL;
  const user=userfinds(users,req.session.user_id)
  if (longURL === undefined) {
    res.redirect("/urls");
    return;
  }
  const templateVars = { shortURL: req.params.shortURL, longURL: longURL,user};
  res.render("urls_show", templateVars);
  return;
}
res.status(400).send('The shortUrl does not exist')
});

//**************************************************************** *****************************/
//deleting urls
app.post(`/urls/:shortURL/delete`,(req,res)=>{
  if(req.session.user_id){
  const shortURL=req.params.shortURL;
  if(urlDatabase[shortURL].userID === req.session.user_id){
  delete urlDatabase[shortURL]
  res.redirect('/urls') //Redirect to the client back to the urls_index page
  return
    }
    res.status(400).send('You are not authorized to delete')
    return;
  }
  res.status(400).send("You must <a href='/login'>Login</a> first")
})
//**************************************************************** *****************************/
//updating urls
app.post('/urls/:id',(req,res)=>{
  if(req.session.user_id){
  const shortURL=req.params.id;
  if(urlDatabase[shortURL].userID === req.session.user_id){
  const newOne=req.body.newURL;
  urlDatabase[shortURL]={longURL:newOne,userID:req.session.user_id};
  res.redirect('/urls')
  return;
  }
  return res.status(400).send('You dont have permission to edit')
  }
  res.status(400).send("You must <a href='/login'>Login</a> first")
})

//**************************************************************** *****************************/

//To the register form
app.get('/register',(req,res)=>{ 
  const templateVars = {user:null};
  res.render("register", templateVars);
})
//creating new user 
app.post('/register',(req,res)=>{ 
  const{user,email,password}=req.body;//parsing the value
  if(user === '' ||email ==='' || password === ''){
    return res.status(400).send('Sorry, you have to fill the form')

  }
  const foundPerson=findByEmailId(email,users)
  if(foundPerson){
    res.status(400).send('Sorry,that user already exists')
    return;
  }
  const userID=createUser(email,password,users);
  req.session.user_id=userID;//create cookie session
  res.redirect('/urls')  
})

//**************************************************************** *****************************/


//To the login page
app.get('/login',(req,res)=>{
  const templateVars = {user:null};
res.render('login',templateVars)

})
app.post('/login',(req,res)=>{
  const{emailId,passwordId}=req.body;

  if(emailId ==='' || passwordId === ''){
    return res.status(400).send('Sorry, you have to fill the form')
  }

  //retrieve the user from the db
  const userFound=findByEmailId(emailId,users)
  //compare the passwords
  if(userFound && bcypt.compareSync(passwordId,userFound.password)){
    //user is authenticated
    req.session.user_id=userFound.id;
    res.redirect('/urls')
    return;
  }
  //user is not authenticated
  res.status(403).send('wrong credentials')

});
//logout page
app.post('/logout',(req,res)=>{
  req.session=null;
  res.redirect('/login')
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



//function for creating user
function createUser(email,password,usersDB){
  const randomID=generateRandomString();
  usersDB[randomID]={ // creating new user
    id:randomID,
    email:email,
    password:bcypt.hashSync(password)
  }
  return randomID;
}


