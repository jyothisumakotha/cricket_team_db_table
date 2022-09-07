const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;
const initializeDBServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error:${e.message}`);
    process.exit(1);
  }
};

initializeDBServer();

//GET Players API

app.get("/players/", async (request, response) => {
  const getAllPlayers = `SELECT * 
  FROM 
  cricket_team
  ORDER BY player_id;`;
  const playersArray = await db.all(getAllPlayers);
  response.send(playersArray);
});

//CREATE Player API
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayerDetails = `INSERT INTO cricket_team(player_name,jersey_number,role)
    VALUES('${playerName}',${jerseyNumber},'${role}');`;
  const dbResponse = await db.run(addPlayerDetails);
  response.send("Player Added to Team");
});

//GET player API
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayer = `SELECT *
   FROM 
   cricket_team 
   WHERE 
   player_id = ${playerId};`;
  const player = await db.get(getPlayer);
  response.send(player);
});

//UPDATE Player Details
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updatePlayerDetails = `UPDATE cricket_team SET player_name='${playerName}',jersey_number=${jerseyNumber},role='${role}'
    WHERE player_id=${playerId};`;
  await db.run(updatePlayerDetails);
  response.send("Player Details Updated");
});

//DELETE Player API
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayer = `DELETE FROM cricket_team WHERE player_id=${playerId};`;
  await db.run(deletePlayer);
  response.send("Player Removed");
});

module.exports = app;
