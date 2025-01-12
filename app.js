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

// Render Players
function renderPlayers(teamIndex) {
  const team = teams[teamIndex];
  playerList.innerHTML = '';
  team.players.forEach((player, index) => {
    const li = document.createElement('li');
    li.textContent = `${player.name} (${player.position}) - Rating: ${player.positionRating}, R:${player.ratings.R}, P:${player.ratings.P}, X:${player.ratings.X}`;

    // Add Edit Button
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => editPlayer(teamIndex, index));

    // Add Delete Button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deletePlayer(teamIndex, index));

    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    playerList.appendChild(li);
  });

  document.getElementById('add-player').onclick = () => addPlayerToTeam(teamIndex);
}

// Add Player
function addPlayerToTeam(teamIndex) {
  const team = teams[teamIndex];

  const name = prompt('Enter player name:');
  if (!name) return alert('Player name is required!');

  const position = prompt('Enter player position (QB, RB, WR, OL, DL, LB, DB):');
  const validPositions = ['QB', 'RB', 'WR', 'OL', 'DL', 'LB', 'DB'];
  if (!validPositions.includes(position)) return alert('Invalid position!');

  const isOffensive = ['QB', 'RB', 'WR', 'OL'].includes(position);
  const validRatings = isOffensive ? ['O1', 'O2', 'O3', 'O4', 'O5', 'O6', 'O7'] : ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'];
  const positionRating = prompt(`Enter position rating (${validRatings.join(', ')}):`);

  if (!validRatings.includes(positionRating)) {
    return alert(`Invalid rating! Choose from ${validRatings.join(', ')}`);
  }

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

  if (team.players.length < 14) {
    team.players.push({ name, position, positionRating, ratings });
    saveTeams();
    renderPlayers(teamIndex);
  } else {
    alert('Maximum 14 players allowed.');
  }
}

// Edit Player
function editPlayer(teamIndex, playerIndex) {
  const team = teams[teamIndex];
  const player = team.players[playerIndex];

  const name = prompt('Enter player name:', player.name);
  if (!name) return alert('Player name is required!');

  const position = prompt('Enter player position (QB, RB, WR, OL, DL, LB, DB):', player.position);
  const validPositions = ['QB', 'RB', 'WR', 'OL', 'DL', 'LB', 'DB'];
  if (!validPositions.includes(position)) return alert('Invalid position!');

  const isOffensive = ['QB', 'RB', 'WR', 'OL'].includes(position);
  const validRatings = isOffensive ? ['O1', 'O2', 'O3', 'O4', 'O5', 'O6', 'O7'] : ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'];
  const positionRating = prompt(`Enter position rating (${validRatings.join(', ')}):`, player.positionRating);

  if (!validRatings.includes(positionRating)) {
    return alert(`Invalid rating! Choose from ${validRatings.join(', ')}`);
  }

  const ratings = {
    R: parseInt(prompt('Enter R rating (0-3):', player.ratings.R), 10),
    P: parseInt(prompt('Enter P rating (0-3):', player.ratings.P), 10),
    X: parseInt(prompt('Enter X rating (0-3):', player.ratings.X), 10),
  };

  if (
    isNaN(ratings.R) || ratings.R < 0 || ratings.R > 3 ||
    isNaN(ratings.P) || ratings.P < 0 || ratings.P > 3 ||
    isNaN(ratings.X) || ratings.X < 0 || ratings.X > 3
  ) {
    return alert('Ratings must be numbers between 0 and 3.');
  }

  player.name = name;
  player.position = position;
  player.positionRating = positionRating;
  player.ratings = ratings;

  saveTeams();
  renderPlayers(teamIndex);
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
