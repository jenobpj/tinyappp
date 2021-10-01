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
function findByEmailId(emailexample,usersDB){
  for(let userKey in usersDB){
    const person=usersDB[userKey];
    if(person.email === emailexample){
      return person
    }
  }
  return false;
}
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

module.exports={generateRandomString,findByEmailId,userForUrls};