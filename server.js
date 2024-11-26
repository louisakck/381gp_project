const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const bodyParser = require('body-parser');
const Nutrition = require('./models/nutrition');
const passport            = require('passport');
const FacebookStrategy    = require('passport-facebook').Strategy;

//MongoDB
mongoose
  .connect("mongodb+srv://s1278244:12345678ABCabc@cluster0.dz8fx.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to mongoDB.");
  })
  .catch((e) => {
    console.log("Connection failed.");
    console.log(e);
  });

  //facebook
  var facebookAuth = {
    'clientID' : '925215255638065', // facebook App ID
    'clientSecret' : 'e42f547031fac5a651fdaf563d175bfd', // facebook App Secret
    'callbackURL' : 'https://three81project-27.onrender.com/auth/facebook/callback'
  };
  
  passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});
 
passport.use(new FacebookStrategy(facebookAuth,
  (token, refreshToken, profile, done) => {
      const user = {
          id: profile.id,
          name: profile.displayName,
          type: profile.provider // Facebook
      };
      return done(null, user);
  }
));
  //---------

app.set('view engine', 'ejs');
const SECRETKEY = 'hello_381_group_Project';

const users = new Array(
  { name: 'admin', password: 'Iamadmin' },
  { name: 'userabc', password: 'abc' }
);

app.set('view engine', 'ejs');

app.use(session({
  secret: 'hello_381_group_Project', // Replace with a strong secret
  resave: false,
  saveUninitialized: true,
}));
//-----------
app.use(passport.initialize());
app.use(passport.session());

//----------//

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//----------
app.get("/auth/facebook", passport.authenticate("facebook", { scope : "email" }));
app.get("/auth/facebook/callback",
    passport.authenticate("facebook", {failureRedirect: "/"}),
  async (req, res) => {
    //Successful authentication
    req.session.authenticated = true;
    req.session.username = req.user.name;
    try {
      const docs = await Nutrition.find({});
      res.status(200).render('homepage.ejs', { 
          username: req.session.username, 
          list: docs || [], 
          name: '' 
      });
  } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
  }
  });
//----------//

app.get("/", (req, res) => {
  console.log(req.session);
  if (!req.session.authenticated) {
    res.render('login.ejs');
  } else {
    Nutrition.find({}, (err, docs) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(docs, req.session.username);
      console.log(docs);
      res.status(200).render('homepage.ejs', { username: req.session.username, list: docs || [], name: '' });
    });
  }
});

app.get('/login', (req, res) => {
  res.status(200).render('login', {});
});

//Check User
app.post('/login', (req, res) => {
  users.forEach((user) => {
    if (user.name == req.body.name && user.password == req.body.password) {
      req.session.authenticated = true;
      req.session.username = req.body.name;	 	
    }
  });
  res.redirect('/');
});

//Logout and clear the session 
//app.get('/logout', (req, res) => {
  //req.session = null;
  //req.session.authenticated = false;
  //res.redirect('/');
//});

app.get('/logout', (req, res) => {
  req.logout((err) => {
    req.session.destroy((err) => {
      res.redirect('/');
    });
  });
});

// Search
app.post('/search', (req, res) => {
    const { name } = req.body;
    const query = { name: { $regex: name, $options: 'i' } };
    Nutrition.find(query, (err, docs) => {
      if (err) {
        console.log(err)
        return
      }
      console.log(docs);
      if (docs.length) {
        res.status(200).render('homepage.ejs', { username: req.session.username, list: docs || [], name });
      } else {
        res.status(200).render('homepage.ejs', { username: req.session.username, list: docs || [], name });
      }
    })
});

// View detail
app.get('/detail/:id', (req, res) => {
  const { id } = req.params
  if (id) {
    Nutrition.findOne({ id }, function (err, docs) {
      if (err) {
        console.log(err)
        return
      }
      console.log(docs);
      res.status(200).render('detail', { docs });
    })
  }
})

// Insert or Update
app.get('/change', (req, res) => {
    const { id } = req.query
    if (id) {
      Nutrition.findOne({ id }, function (err, docs) {
        if (err) {
          console.log(err)
          return
        }
        console.log(docs);
        res.status(200).render('change', { docs });
      })
    } else {
      const id = new Date().getTime()
      res.status(200).render('change', { docs: { id } });
    }
  })
  
app.post('/nutrition-change', (req, res) => {
  const { id, name, calories, protein, total_fat, sodium } = req.body
  const e = new Nutrition({
    id, name, calories, protein, total_fat, sodium
  })
  Nutrition.findOne({ id }, function (err, docs) {
    if (err) {
      console.log(err)
      return
    }
    console.log(docs);
    if (docs) {
      Nutrition.updateOne({ id }, { name, calories, protein, total_fat, sodium }, (err, docs2) => {
        if (err) {
          console.log(err)
          return
        }
        console.log('update' + docs2)
      })
    } else {
      e.save((err, docs) => {
        if (err) {
          console.log(err)
          return
        }
        console.log('add' + docs)
      })
    }
    res.redirect('/');
  })
});

// Delete
app.get('/delete/:id', (req, res) => {
  const { id } = req.params
  console.log(id);
  Nutrition.deleteOne({ id }, (err) => {
    if (err) {
      console.log(err)
      return
    }
    console.log('Deleted')
  })
  res.redirect('/');
});

app.get('/readme', (req, res) => {
  res.status(200).render('readme', {});
});

//RestfulAPI
//curl -X GET http://localhost:8080/api/list
app.get('/api/list', (req, res) => {
  Nutrition.find({}, (err, docs) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(docs);
    res.send(docs);
  });
});

//curl -X POST -H "Content-Type: application/json" --data '{"name": "french fries" , "calories": "300", "protein": "10", "total_fat": "50", "sodium": "200"}' localhost:8080/api/create
app.post('/api/create', (req, res) => {
  const {name, calories, protein, total_fat, sodium} = req.body
  const id = new Date().getTime()
  const e = new Nutrition({
    id, name, calories, protein, total_fat, sodium
  })
  e.save((err, docs) => {
    if (err) {
      res.send(err);
    }
    console.log('add' + docs)
    res.send({ message : "Successfully post a new Food. ID="+id });
  })
});
//curl -X PUT -H "Content-Type: application/json" --data '{"name": "french fries" , "calories": "300", "protein": "10", "total_fat": "50", "sodium": "200"}' localhost:8080/api/update/1669038102188
app.put('/api/update/:id', (req, res) => {
  const { id } = req.params
  const { name, calories, protein, total_fat, sodium } = req.body
  Nutrition.updateOne({ id }, { name, calories, protein, total_fat, sodium }, (err, docs) => {
    if (err) {
      res.send({message : "Update fail" });
      res.send(err);
    }
    console.log('update' + docs)
    res.send({ message : "Successfully post a new Food."});
  })
});

//curl -X DELETE http://localhost:8080/api/delete/1669049735130
app.delete('/api/delete/:id', (req, res) => {
   const { id } = req.params
   console.log(id);
   Nutrition.deleteOne({ id }, (err) => {
    if (err) {
      res.send(err);
    }
    res.send({ message : "Nutrition deleted."});
   })
});


// ERROR handling
//If user input invalid link
app.get("/*", (req, res) => {
  res.status(404);
  res.send("Not allow");
});

app.listen(8080, () => {
  console.log("server running on port 8080");
});