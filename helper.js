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

module.exports={generateRandomString};