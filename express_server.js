const express = require("express");
const app = express();
const PORT = 8080;

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

//global vars

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {};


//GET

app.get('/register', (req,res)=>{
  res.render('registration')
})

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, user: users[req.cookies["user_id"]] };
  res.render("urls_index", templateVars);
});

app.get('/urls/new', (req, res)=>{
  let templateVars = {user: users[req.cookies["user_id"]]}
  res.render('urls_new', templateVars)
})

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id,
    longURL: urlDatabase[req.params.id], 
    user: users[req.cookies["user_id"]]};
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id]
  res.redirect(longURL);
});

//post

app.post('/urls/:id/delete', (req, res)=>{
  delete urlDatabase[req.params.id]
  res.redirect('/urls')
});

app.post('/urls', (req, res)=>{
  let shortURL = generateRandomString(6);
  urlDatabase[shortURL] = req.body.longURL
  res.redirect(`/urls/${shortURL}`)
});  

app.post('/urls/:id/modify', (req, res)=>{
  let url = req.params.id;
  let newURL = req.body.longURL;
  urlDatabase[url] = newURL
  res.redirect('/urls')
});

app.post('/login',(req,res)=>{
  // res.cookie('username', req.body.username)
  res.redirect('/urls')
});

app.post('/logout',(req,res)=>{
  res.clearCookie('user_id')
  res.redirect('/urls')
});

app.post('/register', (req,res) => {
  const id = generateRandomString(6);
  users[id] = { 
    id : id,
    email: req.body.email,
    password: req.body.password,
  }
  // console.log(req.body);
  res.cookie('user_id', id);
  console.log(users);
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