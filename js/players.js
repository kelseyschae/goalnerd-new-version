// js/players.js

const API_KEY = "123";
const API_BASE_URL = `https://www.thesportsdb.com/api/v1/json/${API_KEY}/`;

function createPlayerCardHTML(player) {
    const teamName = player.strTeam || 'Team N/A';
    // Image Priority: Cutout -> Thumb -> Default
    const playerPhoto = player.strCutout || player.strThumb || 'https://www.thesportsdb.com/images/media/player/thumb/def_player.png';
    const playerPosition = player.strPosition || 'N/A';
    
    let playerAge = 'N/A';
    if (player.dateBorn) {
        const bday = new Date(player.dateBorn);
        playerAge = Math.abs(new Date(Date.now() - bday.getTime()).getUTCFullYear() - 1970);
    }

    return `
        <article class="card"
                 data-player-id="${player.idPlayer}"
                 data-player-name="${player.strPlayer}">
            <div class="card-image" style="background-image: url('${playerPhoto}'); 
                                           background-size: cover; 
                                           background-position: top center; 
                                           height: 160px;"> 
            </div>
            <div class="card-content">
                <p class="card-label">${teamName}</p>
                <h3 class="card-title">${player.strPlayer} (${playerAge} years)</h3>
                <p>${playerPosition}</p>
            </div>
        </article>
    `;
}

async function fetchAndDisplayPlayerList() {
    // Real Madrid ID: 133738
    const teamId = 133738;
    
    const gridContainer = document.getElementById('player-grid');
    if (!gridContainer) return;

    gridContainer.innerHTML = '<p style="text-align: center;">Loading all players...</p>';

    try {
        const url = `${API_BASE_URL}lookup_all_players.php?id=${teamId}`;
        const response = await fetch(url);
        const data = await response.json();
        const playersData = data.player; 

        if (playersData && playersData.length > 0) {
            console.log(`Found ${playersData.length} players.`); // Debug log
            
            let allCardsHTML = '';

            // --- CHANGE: NO LIMITS ---
            // Use forEach to loop through ALL players
            playersData.forEach(player => {
                allCardsHTML += createPlayerCardHTML(player);
            });

            gridContainer.innerHTML = allCardsHTML;

            // Event Delegation for clicks
            gridContainer.addEventListener('click', (event) => {
                const card = event.target.closest('.card');
                if (!card) return;

                const playerId = card.getAttribute('data-player-id');
                const playerName = card.getAttribute('data-player-name');

                if (!playerId) return;
                window.location.href = `details.html?type=player&id=${playerId}&name=${encodeURIComponent(playerName)}`;
            });

        } else {
            gridContainer.innerHTML = '<p style="color: red; text-align: center;">❌ Error: No players found.</p>';
        }
    } catch (error) {
        console.error('Error fetching players:', error);
        gridContainer.innerHTML = '<p style="color: red; text-align: center;">❌ Connection error.</p>';
    }
}

document.addEventListener('DOMContentLoaded', fetchAndDisplayPlayerList);