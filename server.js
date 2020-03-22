const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');

const saltRounds = 10;

const app = express();
app.use(bodyParser.json());
app.use(cors());

const database = {
  users: [
    {
      id: '0',
      name: 'Bravo',
      email: 'bravo@gmail.com',
      password: 'meatlover',
      entries: 0,
      joined: new Date()
    },
    {
      id: '1',
      name: 'Marie',
      email: 'marie@gmail.com',
      password: 'anchovies',
      entries: 0,
      joined: new Date()
    }
  ],
  login: [
    {
      id: '1',
      email: 'bravo@gmail.com',
      hash: 'meatlover'
    }
  ]
}

app.get('/', (req, res) => {
  res.send(database.users);
});

app.post('/signin', (req, res) => {
  const { email, password } = req.body;
  let userFound = false;
  let userPasswordMatch = false;
  let index = undefined;

  // bcrypt.compare('Rhs', '$2b$10$y1.p46T24Tl90PdboSoL0e4bC5vv.l2ngfOL2vUYXKRH5sTVv55I2').then(function(result) {
  //   console.log(result);
  // });

  database.users.map((user, i) => {
    if(user.email === email) {
      userFound = true;
      if(user.password === password) {
        userPasswordMatch = true;
        index = i;
      } else {
        return res.status(404).json('Wrong Password 😟');
      }
    } 
  });

  if(userFound && userPasswordMatch) {
    return res.json(database.users[index]);
  }

  if(!userFound){
    return res.status(404).json('No such user 😕');
  }
});

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;  

  // bcrypt.hash(password, saltRounds).then(function(hash) {
  //   console.log(hash);
  // });

  database.users.push({
    id: database.users.length,
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date()
  });
  res.json(database.users[database.users.length-1]);
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let found = false;

  database.users.map((user) => {
    if(user.id === id) {
      found = true;
      return res.json(user);
    } 
  });

  if(!found){
    res.status(404).json('No such user :(');
  }
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  let found = false;

  database.users.map((user) => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });

  if(!found){
    res.status(404).json('No such user :(');
  }
});

app.listen('3001', () => {
  console.log('app is running on port 3001!');
});

/*
<concept>
               /  --> res = this is working
         /signin  --> POST = success/fail
       /register  --> POST = user
/profile/:userId  --> GET = user
          /image  --> PUT = user

... testing with postman app ...
*/