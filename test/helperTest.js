const { assert } = require('chai');

const { findByEmailId} = require('../helper');

const testUsers = {
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
};

describe('findByEmailId', function() {
  it('should return a user with valid email', function() {
    const user = findByEmailId("user@example.com", testUsers)
    const expectedOutput = "userRandomID";
    assert.equal(user.id,expectedOutput)
  });
  it('shoudl return undefined if the email is not valid',function(){
    const user =findByEmailId("facebook@com",testUsers);
    const expectedOutput= undefined;
    assert.equal(user,expectedOutput)
  });
});