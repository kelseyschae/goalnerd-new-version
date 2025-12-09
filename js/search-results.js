// js/search-results.js

const API_KEY = "123";
const API_BASE_URL = `https://www.thesportsdb.com/api/v1/json/${API_KEY}/`;

function createPlayerCardHTML(player) {
    const teamName = player.strTeam || 'Team N/A';
    // Image priority: Cutout -> Thumb -> Render -> Default
    const playerPhoto = player.strCutout || player.strThumb || player.strRender || 'https://www.thesportsdb.com/images/media/player/thumb/def_player.png';
    const playerPosition = player.strPosition || 'N/A';
    
    // Calculate Age
    let playerAge = 'N/A';
    if (player.dateBorn) {
        const bday = new Date(player.dateBorn);
        playerAge = Math.abs(new Date(Date.now() - bday.getTime()).getUTCFullYear() - 1970);
    }

    return `
        <article class="card animate__animated animate__fadeIn" 
                 style="cursor: pointer;"
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

async function fetchSearchResults() {
    const gridContainer = document.getElementById('results-grid');
    const queryDisplay = document.getElementById('query-display');

    if (!gridContainer) return;

    // 1. Get search query
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get('search_query');

    if (!searchQuery) {
        gridContainer.innerHTML = '<p style="text-align:center">No search query provided.</p>';
        return;
    }

    if (queryDisplay) queryDisplay.textContent = searchQuery;
    gridContainer.innerHTML = '<p style="text-align: center;">Searching TheSportsDB...</p>';

    try {
        // TheSportsDB Search Endpoint
        const url = `${API_BASE_URL}searchplayers.php?p=${encodeURIComponent(searchQuery)}`;

        const response = await fetch(url);
        const data = await response.json();

        // TheSportsDB returns { "player": [...] } or null
        const playersData = data.player;

        if (playersData && playersData.length > 0) {
            let allCardsHTML = '';
            playersData.forEach(playerItem => {
                allCardsHTML += createPlayerCardHTML(playerItem);
            });
            gridContainer.innerHTML = allCardsHTML;

            // Click listener
            gridContainer.addEventListener('click', (event) => {
                const card = event.target.closest('.card');
                if (!card) return;
                const playerId = card.getAttribute('data-player-id');
                const playerName = card.getAttribute('data-player-name');
                if (playerId) {
                    window.location.href = `details.html?type=player&id=${playerId}&name=${encodeURIComponent(playerName)}`;
                }
            });

        } else {
            gridContainer.innerHTML = `<p style="text-align: center;">❌ No players named "<strong>${searchQuery}</strong>" found.</p>`;
        }

    } catch (error) {
        console.error('Error:', error);
        gridContainer.innerHTML = '<p style="color: red; text-align: center;">Connection error.</p>';
    }
}

// Menu and Animation functions included to be safe
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger-btn');
    const navLinks = document.getElementById('nav-links');
    if (!hamburger || !navLinks) return;
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isActive);
    });
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
    navLinks.addEventListener('click', (e) => { e.stopPropagation(); });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchSearchResults();
    initHamburgerMenu();
});