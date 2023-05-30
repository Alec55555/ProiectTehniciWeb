// Import packages
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const uuid = require("uuid");

const fs = require("fs");

// Application
const app = express();

// Middleware
app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(cors());

// Create
app.post("/plants", (req, res) => {
  const plantList = readJSONFile();
  const newPlant = req.body;
  console.log(req.body);
  newPlant.id = uuid.v4.apply();
  plantList.push(newPlant);
  writeJSONFile(plantList);
  res.status(200).send(newPlant);
});

// Read One
app.get("/plants/:id", (req, res) => {
  const plantList = readJSONFile();
  const id = req.params.id;
  let foundPlant = null;
  plantList.forEach(plant => {
    if (plant.id === id) {
        foundPlant = plant;
    }
  })
  if (foundPlant === null) {
    res.status(204).send('No plant found!');
  } else {
    res.status(200).send(foundPlant);
  }
});

// Read All
app.get("/plants", (req, res) => {
  const plantList = readJSONFile();
  if(plantList != undefined && plantList.length != 0) {
    res.status(200).send(plantList);
  } else {
    res.status(204).send('No plant found!');
  }
});

// Update
app.put("/plants/:id", (req, res) => {
  const plantList = readJSONFile();
  const id = req.params.id;
  const update = req.body;
  let plantToUpdate = null;
  for (let i = 0; i < plantList.length; i++) {
    if (plantList[i].id === id) {
        if (update.name) {
            plantList[i].name = update.name;
        }

        if (update.img) {
            plantList[i].img = update.img;
        }

        plantToUpdate = plantList[i];
        break;
    }
  }
  writeJSONFile(plantList);
  if (plantToUpdate === null) {
    res.status(204).send('No plant found!')
  } else {
    res.status(200).send(plantToUpdate);
  }
});

// Delete
app.delete("/plants/:id", (req, res) => {
  const plantList = readJSONFile();
  const id = req.params.id;
  let check = false;
  for(let i = 0; i < plantList.length; i++) {
    if(plantList[i].id === id) {
        check = true;
        plantList.splice(i, 1);
        break;
    }
  }
  writeJSONFile(plantList);
  if (check === true) {
    res.status(200).send('Plant deleted!');
  } else {
    res.status(204).send('No plant found!');
  }
});

// Reading function from db.json file
function readJSONFile() {
  return JSON.parse(fs.readFileSync("db.json"))["plants"];
}

// Writing function from db.json file
function writeJSONFile(content) {
  fs.writeFileSync(
    "db.json",
    JSON.stringify({ plants: content }, null, 4),
    "utf8",
    err => {
      if (err) {
        console.log(err);
      }
    }
  );
}

// Starting the server
app.listen("3000", () =>
  console.log("Server started at: http://localhost:3000")
);