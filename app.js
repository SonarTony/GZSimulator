// app.js

// Initialize teams array
let teams = [];

// DOM Elements
const teamManagement = document.getElementById('team-management');
const playerManagement = document.getElementById('player-management');
const teamList = document.getElementById('team-list');
const playerList = document.getElementById('player-list');

// Add Team
document.getElementById('create-team').addEventListener('click', () => {
  const teamName = prompt('Enter team name:');
  if (teamName) {
    const newTeam = { name: teamName, players: [] };
    teams.push(newTeam);
    saveTeams();
    renderTeams();
  }
});

// Render Teams
function renderTeams() {
  teamList.innerHTML = '';
  teams.forEach((team, index) => {
    const li = document.createElement('li');
    li.textContent = team.name;

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => manageTeam(index));

    li.appendChild(editBtn);
    teamList.appendChild(li);
  });
}

// Manage Team (Switch to Roster View)
function manageTeam(teamIndex) {
  const team = teams[teamIndex];
  document.getElementById('team-name').textContent = team.name;
  teamManagement.style.display = 'none';
  playerManagement.style.display = 'block';
  renderPlayers(teamIndex);
}

// Render Players for a Team
function renderPlayers(teamIndex) {
  const team = teams[teamIndex];
  playerList.innerHTML = '';
  team.players.forEach((player, index) => {
    const li = document.createElement('li');
    li.textContent = `${player.name} (${player.position}) - R: ${player.ratings.R}, P: ${player.ratings.P}, X: ${player.ratings.X}, OVR: ${player.overall}`;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deletePlayer(teamIndex, index));

    li.appendChild(deleteBtn);
    playerList.appendChild(li);
  });

  document.getElementById('add-player').onclick = () => addPlayerToTeam(teamIndex);
}

// Add Player to a Team
function addPlayerToTeam(teamIndex) {
  const team = teams[teamIndex];

  const name = prompt('Enter player name:');
  if (!name) return alert('Player name is required!');

  const position = prompt('Enter player position (QB, RB, WR, OL, DL, LB, DB):');
  const validPositions = ['QB', 'RB', 'WR', 'OL', 'DL', 'LB', 'DB'];
  if (!validPositions.includes(position)) return alert('Invalid position!');

  const ratings = {
    R: parseInt(prompt('Enter R rating (0-3):'), 10),
    P: parseInt(prompt('Enter P rating (0-3):'), 10),
    X: parseInt(prompt('Enter X rating (0-3):'), 10),
  };

  if (
    isNaN(ratings.R) || ratings.R < 0 || ratings.R > 3 ||
    isNaN(ratings.P) || ratings.P < 0 || ratings.P > 3 ||
    isNaN(ratings.X) || ratings.X < 0 || ratings.X > 3
  ) {
    return alert('Ratings must be numbers between 0 and 3.');
  }

  const overall = parseInt(prompt('Enter overall rating (1-7):'), 10);
  if (isNaN(overall) || overall < 1 || overall > 7) {
    return alert('Overall rating must be between 1 and 7.');
  }

  if (team.players.length < 14) {
    team.players.push({ name, position, ratings, overall });
    saveTeams();
    renderPlayers(teamIndex);
  } else {
    alert('Maximum 14 players allowed.');
  }
}

// Delete Player
function deletePlayer(teamIndex, playerIndex) {
  teams[teamIndex].players.splice(playerIndex, 1);
  saveTeams();
  renderPlayers(teamIndex);
}

// Back to Team Management
document.getElementById('back-to-teams').addEventListener('click', () => {
  playerManagement.style.display = 'none';
  teamManagement.style.display = 'block';
});

// Save Teams to localStorage
function saveTeams() {
  localStorage.setItem('teams', JSON.stringify(teams));
}

// Load Teams from localStorage
function loadTeams() {
  const savedTeams = localStorage.getItem('teams');
  if (savedTeams) {
    teams = JSON.parse(savedTeams);
  }
}

// Initialize
loadTeams();
renderTeams();
