const express = require("express");
const app = express();
const PORT = 8080;

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.set('view engine', 'ejs');

const bcrypt = require('bcryptjs');

app.use(express.urlencoded({ extended: true }));

//global vars

const urlDatabase = {};

const defTemplateVars = {
  user: null
}

const users = {};


//GET

app.get('/login', (req,res)=>{
  res.render('login', defTemplateVars)
})

app.get('/register', (req,res)=>{
  res.render('registration', defTemplateVars)
})

app.get("/urls", (req, res) => {
  const userURl = urlsForUser(req.cookies["user_id"]);
  const templateVars = { urls: userURl, user: users[req.cookies["user_id"]] };
  if (templateVars.user) {
    res.render("urls_index", templateVars);
  } else {
    res.render('urls_index', defTemplateVars)
  }
});

app.get('/urls/new', (req, res)=>{
  let templateVars = {user: users[req.cookies["user_id"]]}
  if (templateVars.user) {
    res.render("urls_new", templateVars);
  } else {
    res.redirect('/login')
  }
})

app.get("/u/:id", (req, res) => {
  const longUrl = urlDatabase[req.params.shortURL].longURL;
  // console.log('urlDatabase', urlDatabase);
  res.redirect(longUrl);
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: users[req.cookies["user_id"]]};
  res.render("urls_show", templateVars);
});

//post

app.post('/urls/:id/delete', (req, res)=>{
  if (req.cookies['user_id'] === urlDatabase[req.params.shortURL].userID) {
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls');
  } else {
    res.status(404);
    res.send('can\'t perform this operation')
  }
});

app.post('/urls', (req, res)=>{
  const shortURL = generateRandomString(6);
  urlDatabase[shortURL] = { 
    longURL: req.body.longURL,
    userID: req.cookies['user_id'],
  } 
  res.redirect('/urls');
});  

app.post('/urls/:id/modify', (req, res)=>{
  if (req.cookies['user_id'] === urlDatabase[req.params.shortURL].userID) {
    const url = req.params.shortURL;
    const newUrl = req.body.URL;
    urlDatabase[url].longURL = newUrl;
    res.redirect('/urls');
  } else {
    res.status(404);
    res.send('can\'t perform this operation')
  }
});

app.post('/login',(req,res)=>{
  let email = req.body.email;
  let password = req.body.password;
  let user = emailLookup(email);
  if (user) {
    const passwordMatching = bcrypt.compareSync(password, users[user].password);
    if (passwordMatching) {
      res.cookie('user_id', users[user].id);
      res.redirect('/urls');
    } else {
      res.status(403);
      res.send('Invalid Password');
    }
  } else {
    res.status(403);
    res.send('invalid email please register');
  }
});

app.post('/logout',(req,res)=>{
  res.clearCookie('user_id')
  res.redirect('/urls')
});

app.post('/register', (req,res) => {
  let email = req.body.email;
  let password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  if (email === "" || password === "") {
    res.status(400);
    res.send('Invalid email or password');
  } else if (emailLookup(email)) {
    res.status(400);
    res.send('Email already exists please remember your password or try forget my password');
  }
  const id = generateRandomString(6);
  users[id] = { 
    id : id,
    email: email,
    password: hashedPassword
  }
  res.cookie('user_id', id);
  res.redirect('/urls');
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


//functions

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

function emailLookup(email) {
  for(let user in users) {
    if (users[user].email === email) {
      return user;
    } else {
      return false
    }
  }
  return false;
};

function urlsForUser(id) {
  const userURLs = {};
  for(let url in urlDatabase) {
    if(urlDatabase[url].userID === id) {
      userURLs[url] = urlDatabase[url];
    }
  }
  return userURLs;
}