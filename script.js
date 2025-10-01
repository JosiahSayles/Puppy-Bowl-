/**
 * @typedef Players
 * @property {number} teamId
 * @property {number} id
 * @property {string} name
 * @property {string} breed
 * @property {string} imageUrl
 * @property {string} status
 * @property {string} team
 */

const API =
  "https://fsa-puppy-bowl.herokuapp.com/api/2508-FTB-ET-WEB-FT/players";

let players = [];
let selectedPlayer;
let teams = [];

async function getPlayers() {
  try {
    const res = await fetch(API);
    const result = await res.json();
    players = result.data.players;
    render();
  } catch (err) {
    console.log(err);
  }
}

async function getPlayer(id) {
  try {
    const res = await fetch(API + "/" + id);
    const result = await res.json();
    selectedPlayer = result.data.player;
    render();
  } catch (err) {
    console.log(err);
  }
}

async function addPlayer(player) {
  try {
    const res = await fetch(API, {
      method: "POST",
      body: JSON.stringify(player),
      headers: { "Content-type": "application/json" },
    });

    const json = await res.json();
    if (json.success) {
      await getPlayers();
    }
  } catch (err) {
    console.log(err);
  }
}

async function removePlayer(id) {
  try {
    const res = await fetch(`${API}/${id}`, {
      method: "DELETE",
    });
    if (res.status === 204) {
      selectedPlayer = null;
      await getPlayers();
    }
  } catch (err) {
    console.error(err);
  }
}

function PlayerListItem(player) {
  const li = document.createElement("li");
  li.innerHTML = `
    <a href="#selected"> <img alt="${player.name}" src="${player.imageUrl}" width=15%/> ${player.name}</a>
  
    `;
  li.addEventListener("click", () => getPlayer(player.id));
  return li;
}

function PlayerList() {
  const ul = document.createElement("ul");
  ul.classList.add("lineup");

  const $players = players.map(PlayerListItem);
  ul.replaceChildren(...$players);

  return ul;
}

function PlayerDetails() {
  if (!selectedPlayer) {
    const p = document.createElement("p");
    p.textContent = "Please selecte a player to learn more";
    return p;
  }

  const playerInfo = document.createElement("section");
  playerInfo.innerHTML = `
    <h3>${selectedPlayer.name} #${selectedPlayer.id}</h3>
    <figure>
      <img alt="${selectedPlayer.name}" src="${selectedPlayer.imageUrl}" width= 60%/>
    </figure>
    <p>${selectedPlayer.breed}</p>
    <p>${selectedPlayer.status}</p>
    <p>${selectedPlayer.teamId}</p>
    <button>Remove player</button>
    `;

  const $button = playerInfo.querySelector("button");
  $button.addEventListener("click", function () {
    removePlayer(selectedPlayer.id);
  });

  return playerInfo;
}

function NewPlayerForm() {
  const form = document.createElement("form");
  form.innerHTML = `
    <label>
     Name
     <input name= "name" required />
    </label>
    <label>
     Breed
     <input name="breed" required />
    </label>
    <label>
     Status
      <select name="status">
         <option value="field">Field</option>
         <option value="Bench">Bench</option>
      </select>
    </label>
    <label>
    ImageUrl 
    <input  name="imageUrl" required>
    </label>
    <button >Add Player</button>
    `;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const data = new FormData(form);
    addPlayer({
      name: data.get("name"),
      breed: data.get("breed"),
      status: data.get("status"),
      imageUrl: data.get("imageUrl"),
    });
  });
  return form;
}

function render() {
  const app = document.querySelector("#app");
  app.innerHTML = `
    <h1> Puppy Bowl</h1>
    <main>
         <section>
             <h2>Player Line up</h2>
             <div id="player-list"></div>
             <h3>Invite a new player</h3>
              <div id= "new-player-form"></div>
         </section> 
         <section id="selected">
             <h2>Player Details</h2>
              <div id ="player-details"></div>
         </section>
    </main>
    `;

  app.querySelector("#player-list").replaceWith(PlayerList());
  app.querySelector("#new-player-form").replaceWith(NewPlayerForm());
  app.querySelector("#player-details").replaceWith(PlayerDetails());
}

async function init() {
  await getPlayers();

  render();
}

init();
