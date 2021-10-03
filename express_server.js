const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const bcypt = require('bcryptjs');
const salt = bcypt.genSaltSync(10);
const cookieSession = require("cookie-session");
const {generateRandomString,findByEmailId,userForUrls,userfinds} = require('./helper');

//set the view
app.set("view engine", "ejs");

app.use(cookieParser());
//set cookiesession;
app.use(cookieSession({
  name:'session',
  keys:['tinyapp']
}));
app.use(bodyParser.urlencoded({extended: true}));

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
};


// /page
app.get('/',(req,res)=>{
  const user = userfinds(users,req.session.user_id);
  if (user) {
    return res.redirect('/urls');
  }
  res.redirect('/login');

});



//showing MY urls page
app.get("/urls", (req, res) => {
  //call function for showing users urls
  const newDataBase = userForUrls(req.session.user_id,urlDatabase);
  const user = userfinds(users,req.session.user_id);
  //checks user is login or not
  if (user) {
    const templateVars = { urls: newDataBase,user};
    res.render("urls_index", templateVars);
    return;
  }
  return res.status(401).send("You must <a href='/login'>Login</a> first");
});



//show create new url page
app.get("/urls/new", (req, res) => {
  const user = userfinds(users,req.session.user_id);
  // checking user is login or not
  if (user) {
    const templateVars = { urls: urlDatabase,user};
    res.render("urls_new",templateVars);
    return;
  }
  res.status(400).send("You must <a href='/login'>Login</a> first");
});



//create new url
app.post("/urls", (req, res) => {
  if (req.session.user_id) {
    const shortURL = generateRandomString();
    const longURL = req.body.longURL;
    urlDatabase[shortURL] = {longURL,userID:req.session.user_id};
    res.redirect(`/urls/${shortURL}`);
  }
});



//Redirecting to LongUrl website from url_show page by clicking shortUrl
app.get('/u/:shortURL',(req,res)=>{
  if (!urlDatabase[req.params.shortURL]) {
    return res.status(401).send('URL for the given shortURL does not exist');
  }
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});



//shows individual url
app.get("/urls/:shortURL", (req, res) => {
  const user = userfinds(users,req.session.user_id);
  if (user) {

    //If user  logged in but does not own the URL for the given ID
    if (urlDatabase[req.params.shortURL]['userID'] !== req.session.user_id) {
      return res.status(401).send('You dont own the URL for the given ID');
    }

    const objectKeys = Object.keys(urlDatabase);
    if (objectKeys.includes(req.params.shortURL)) {
      const longURL = urlDatabase[req.params.shortURL].longURL;
      if (longURL === undefined) {
        res.redirect("/urls");
        return;
      }
      const templateVars = { shortURL: req.params.shortURL, longURL: longURL,user};
      res.render("urls_show", templateVars);
      return;
    }
    return res.status(400).send('The shortUrl does not exist');
  }
  res.status(401).send("You must be logged in");
});


//deleting urls
app.post(`/urls/:shortURL/delete`,(req, res) => {
  //find the user using usefinds function
  const user = userfinds(users,req.session.user_id);
  //checks user login or not
  if (user) {
    const shortURL = req.params.shortURL;
    if (urlDatabase[shortURL].userID === req.session.user_id) {
      delete urlDatabase[shortURL];
      res.redirect('/urls');
      return;
    }
    res.status(400).send('You are not authorized to delete');
    return;
  }
  res.status(400).send("You must <a href='/login'>Login</a> first");
});


//update urls
app.post('/urls/:id',(req,res) => {
  //find user using userfinds function
  const user = userfinds(users,req.session.user_id);
  //checks user login or not
  if (user) {
    const shortURL = req.params.id;
    if (urlDatabase[shortURL].userID === req.session.user_id) {
      const newOne = req.body.newURL;
      urlDatabase[shortURL] = {longURL:newOne,userID:req.session.user_id};
      res.redirect('/urls');
      return;
    }
    return res.status(400).send('You dont have permission to edit');
  }
  res.status(400).send("You must <a href='/login'>Login</a> first");
});


/*To the register form */
app.get('/register',(req,res) => {
  const user = userfinds(users,req.session.user_id);
  if (user) {
    return res.redirect('/urls');
  }
  const templateVars = {user};
  res.render("register", templateVars);
});

/*creating new user*/
app.post('/register',(req,res) => {
  const {user,email,password} = req.body;
  if (user === '' || email === '' || password === '') {
    return res.status(400).send('Sorry, you have to fill the form');

  }
  const foundPerson = findByEmailId(email,users);
  if (foundPerson) {
    res.status(400).send('Sorry,that user already exists');
    return;
  }
  const userID = createUser(email,password,users);
  //create cookie session
  req.session.user_id = userID;
  res.redirect('/urls');
});



//To the login page
app.get('/login',(req,res) => {
  const user = userfinds(users,req.session.user_id);
  if (user) {
    return res.redirect('/urls');
  }
  const templateVars = {user};
  res.render('login',templateVars);
});


//login post request
app.post('/login',(req,res) => {
  const {emailId,passwordId} = req.body;

  if (emailId === '' || passwordId === '') {
    return res.status(400).send('Sorry, you have to fill the form');
  }

  //retrieve the user from the userdatabase
  const userFound = findByEmailId(emailId,users);
  //compare the passwords
  if (userFound && bcypt.compareSync(passwordId,userFound.password)) {
    //user is authenticated
    req.session.user_id = userFound.id;
    res.redirect('/urls');
    return;
  }
  //user is not authenticated
  res.status(403).send('wrong credentials');
});


//logout page
app.post('/logout',(req,res) => {
  req.session = null;
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



//function for creating user
function createUser(email,password,usersDB) {
  const randomID = generateRandomString();
  // creating new user
  usersDB[randomID] = {
    id:randomID,
    email:email,
    password:bcypt.hashSync(password)
  };
  return randomID;
}


