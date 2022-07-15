function emailLookup(email) {
  for(let user in users) {

    if (users[user].email === email) {
      return user;
    }
  }
  return false;
}

const users = {
  asdasd : {
    id : 'asdasd',
    email: 'alkhaleelisaad@gmail.com',
    password: '123'
  },
  gggggg : {
    id : 'gggggg',
    email: 'eng.saad.najm@gmail.com',
    password: '123'
  }
};

console.log(emailLookup('alkhaleelisaad@gmail.com')) 