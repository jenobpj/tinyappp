const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser=require('cookie-parser')

app.set("view engine", "ejs");

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


app.get("/urls", (req, res) => {
  const user=req.cookies.username;
  //console.log(user,'line 20');
  const templateVars = { urls: urlDatabase,username:user};
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const user=req.cookies.username;
  //console.log(user,'line 27')
  const templateVars = { urls: urlDatabase,username:user};
  res.render("urls_new",templateVars);
});


app.get("/urls/:shortURL", (req, res) => {
  const longURL= urlDatabase[req.params.shortURL];
  const user=req.cookies.username;
  //console.log(user,'line 36')
  if (longURL === undefined) {
    res.redirect("/urls");
    return;
  }
  const templateVars = { shortURL: req.params.shortURL, longURL: longURL,username:user};
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

app.post('/login',(req,res)=>{
  res.cookie("username",req.body.username)
  res.redirect('/urls')
})

app.post('/logout',(req,res)=>{
  const keys=Object.keys(req.cookies);
  res.clearCookie(keys);
  res.redirect('/urls')
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

function generateRandomString(){
  let randomCharacters='';
  const characters='ABCDEFGHIJKLMNOPQRSTUVWXYXabcdefghijklmnopqrstuvwxy1234567890';
  for(let i=0;i<6;i++){
    let randomNumber=Math.floor(Math.random() * 56 +1);
    randomCharacters +=characters[randomNumber]
  }
  return randomCharacters;

}