const express = require("express");
const app = express();
const PORT = 8080;

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

//constants

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


//GET

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_index", templateVars);
});

app.get('/urls/new', (req, res)=>{
  let templateVars = {username: req.cookies["username"]}
  res.render('urls_new', templateVars)
})

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id], username: req.cookies["username"]};
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
})

app.post('/urls', (req, res)=>{
  let shortURL = generateRandomString(6);
  urlDatabase[shortURL] = req.body.longURL
  res.redirect('/urls')
})  

app.post('/urls/:id/modify', (req, res)=>{
  let url = req.params.id;
  let newURL = req.body.longURL;
  urlDatabase[url] = newURL
  res.redirect('/urls')
})

app.post('/login',(req,res)=>{
  res.cookie('username', req.body.username)
  res.redirect('/urls')
})

app.post('/logout',(req,res)=>{
  res.clearCookie('username')
  res.redirect('/urls')
})



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

// // generateRandomString(6)

// app.set("view engine", "ejs");

// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };

// app.use(express.urlencoded({ extended: true }));

// app.post("/urls/login", (req, res) =>{
//   console.log('What is this' ,req.body);
// })

// app.get("/urls", (req, res) => {
//   const templateVars = { urls: urlDatabase, username: req.cookies["username"] };
//   res.render("urls_index", templateVars);
// });

// app.get("/urls/new", (req, res) => {
//   const templateVars = {username: req.cookies['username']};
//   res.render("urls_new", templateVars);
// });
// app.post("/urls", (req, res) => {
//   if (!req.body.longURL) {
//     return res.status(400).send('Need to pass longURL')
//   }
//   let shortUrl = generateRandomString(6)
//   urlDatabase[shortUrl] = req.body.longURL;
//   res.redirect(`/urls/${shortUrl}`);
// });


// app.get("/urls/:id", (req, res) => {
//   // console.log(req.params.id);
//   const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id]};
//   res.render("urls_show", templateVars);
// });

// app.get('/u/:id',(req, res) => {
//   const longURL = urlDatabase[req.params.id];
//   if (longURL) {
//     res.redirect(longURL);
//   } else {
//     res.status(404).redirect('https://http.cat/404');
//   }
// });

// app.post("/urls/:id/delete", (req, res)=> {
//   // console.log(req.params.id);
//   delete urlDatabase[req.params.id];
//   res.redirect("/urls")
// })

// app.post("/urls/:id", (req, res)=>{
//   let shortUrl = req.params.id;
//   let newLongURL = req.body.longURL;
//   urlDatabase[shortUrl] = newLongURL;
//   res.redirect("/urls")
// })
