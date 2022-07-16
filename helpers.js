// helper functions --------------------------------------------------




function emailLookup(email, database) {
  for (let user in database) {
    if (database[user].email === email) {
      return user;
    }
  }
  return undefined;
}


const generateRandomString = function(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return result;
}

function urlsForUser(id, database) {
  const userURLs = {};
  for (let url in database) {
    if (database[url].userID === id) {
      userURLs[url] = database[url];
    }
  }
  return userURLs;
}


module.exports = {
  emailLookup,
  urlsForUser,
  generateRandomString,
};



































// //functions

// const generateRandomString = function(length) {
//   var result           = '';
//   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   var charactersLength = characters.length;
//   for ( var i = 0; i < length; i++ ) {
//     result += characters.charAt(Math.floor(Math.random() * 
// charactersLength));
//  }
//  return result;
// }

// function emailLookup(email, database) {
//   for (let user in database) {
//     if (database[user].email === email) {
//       return user;
//     }
//   }
//   return undefined;
// }

// function urlsForUser(id, database) {
//   const userURLs = {};
//   for (let url in database) {
//     if (database[url].userID === id) {
//       userURLs[url] = database[url];
//     }
//   }
//   return userURLs;
// }

// module.exports = {
//   generateRandomString,
//   emailLookup,
//   urlsForUser
// }