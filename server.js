//https://fast-wildwood-21495.herokuapp.com/
//the heroku instructions are in supplemental.
//highlights:  add a start line to the package.json.  has to be at root leve.
//use command not bash.  have a up to date git repo.  do heroku create.  do git heroku push master


// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var fs=require("fs");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Star Wars Characters (DATA)
// =============================================================
var characters = [
  {
    routeName: "yoda",
    name: "Yoda",
    role: "Jedi Master",
    age: 900,
    forcePoints: 2000
  },
  {
    routeName: "darthmaul",
    name: "Darth Maul",
    role: "Sith Lord",
    age: 200,
    forcePoints: 1200
  },
  {
    routeName: "obiwankenobi",
    name: "Obi Wan Kenobi",
    role: "Jedi Master",
    age: 55,
    forcePoints: 1350
  }
];

// Routes
// =============================================================
app.use("/", express.static(__dirname + '/public'));
//app.use("/", express.static(__dirname + '/public/js'));


// Basic route that sends the user first to the home Page
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});
//sends user to the note page
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
  });
//shows all notes
  app.get("/api/notes", function(req, res) {
    fs.readFile('./db/db.json', 'utf8',(err, data) => {
        if (err) throw err;
       // console.log(data);
        res.end(data);
      });
  });
//adds a note to the json file
  app.post("/api/notes", function(req, res) {
    fs.readFile('./db/db.json', 'utf8',(err, data) => {
        if (err) throw err;
        var oldStuff=[];
        var newStuff = req.body;
        oldStuff=JSON.parse(data);
        oldStuff.push(newStuff);
        //console.log(oldStuff);
        //console.log(`the array is now ${oldStuff.length} items long`)
        
           
        fs.writeFile ('./db/db.json',JSON.stringify(oldStuff), function (err) {
            if (err) {
                return console.log (err);
            }
            console.log ('Success!');
            });
        
        res.end(data);
      });

  });

  app.delete("/api/notes/:id", function(req, res) {
      console.log(`a delete request came in for item ${req.params.id}`);
      res.end();
  });

//garbage for reference below here:
app.get("/add", function(req, res) {
    res.sendFile(path.join(__dirname, "add.html"));
  });
// Displays all characters
app.get("/api/characters", function(req, res) {
  return res.json(characters);
 
});

// Displays a single character, or returns false
app.get("/api/characters/:character", function(req, res) {
  var chosen = req.params.character;

  console.log(chosen);

  for (var i = 0; i < characters.length; i++) {
    if (chosen === characters[i].routeName) {
      return res.json(characters[i]);
    }
  }

  return res.json(false);
});

// Create New Characters - takes in JSON input
app.post("/api/characters", function(req, res) {
  // req.body hosts is equal to the JSON post sent from the user
  // This works because of our body parsing middleware
  var newCharacter = req.body;

  // Using a RegEx Pattern to remove spaces from newCharacter
  // You can read more about RegEx Patterns later https://www.regexbuddy.com/regex.html
  newCharacter.routeName = newCharacter.name.replace(/\s+/g, "").toLowerCase();

  console.log(newCharacter);

  characters.push(newCharacter);

  res.json(newCharacter);
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
