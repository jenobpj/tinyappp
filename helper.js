const bcypt = require('bcryptjs');

//generateRandom key//
function generateRandomString(){
  let randomCharacters='';
  const characters='ABCDEFGHIJKLMNOPQRSTUVWXYXabcdefghijklmnopqrstuvwxy1234567890';
  for(let i=0;i<6;i++){
    let randomNumber=Math.floor(Math.random() * 56 +1);
    randomCharacters +=characters[randomNumber]
  }
  return randomCharacters;
}

//findByEmail function for checking emailid registered with email id or not 
function findByEmailId(emailexample,usersDB){
  for(let userKey in usersDB){
    const person=usersDB[userKey];
    if(person.email === emailexample){
      return person
    }
  }
  return false;
}

//function for showing urls
function userForUrls(id,database){
  let myUrl={};
  for(key in database){
    let usersid=database[key].userID
    if(id === usersid){
      myUrl[key]=database[key];
    }
  }
  return myUrl
}

//To find the user
function userfinds(usersDB,id){
  return usersDB[id]
}

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


module.exports={generateRandomString,findByEmailId,userForUrls,userfinds,createUser};