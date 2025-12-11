/**
 * =============================================================================
 * MAIN.JS - "No Limits" Version (All Games)
 * =============================================================================
 */

import { API_BASE_URL } from './modules/api.js';
import { initHamburgerMenu, initNavigationAnimation, initSkipLink } from './modules/navigation.js';

// League IDs in TheSportsDB
const LEAGUES = [
    { id: '4335', name: '🇪🇸 La Liga' },
    { id: '4328', name: '🇬🇧 Premier League' },
    { id: '4332', name: '🇮🇹 Serie A' },
    { id: '4331', name: '🇩🇪 Bundesliga' },
    { id: '4344', name: '🇵🇹 Primeira Liga' }
];

// --- Search Form Logic ---
function initSearchForm() {
    const searchForm = document.getElementById('search-form');
    if (!searchForm) return;

    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const searchInput = document.getElementById('search-input');
        if (!searchInput) return;

        const val = searchInput.value.trim();
        if (val.length > 2) {
            window.location.href = `search-results.html?search_query=${encodeURIComponent(val)}`;
        } else {
            alert('Please enter at least 3 characters.');
        }
    });
}

// --- Games Logic (All Upcoming Games) ---
async function fetchUpcomingGames() {
    const gamesContainer = document.getElementById('games-container');
    // Find the section title to update the counter
    const sectionTitle = document.querySelector('.section-title'); 
    
    if (!gamesContainer) return;

    gamesContainer.innerHTML = '<p style="text-align:center; width:100%;">Loading ALL matches...</p>';

    try {
        // 1. Request data from all 5 leagues simultaneously
        const promises = LEAGUES.map(league => 
            fetch(`${API_BASE_URL}eventsnextleague.php?id=${league.id}`)
                .then(res => res.json())
                .then(data => {
                    // Log to see if API returns data
                    console.log(`League ${league.name}:`, data.events ? data.events.length : 0, 'matches found.');
                    return { leagueName: league.name, events: data.events || [] };
                })
                .catch(err => {
                    console.error(`Error loading ${league.name}:`, err);
                    return { leagueName: league.name, events: [] };
                })
        );

        // 2. Wait for all responses
        const results = await Promise.all(promises);

        // 3. Merge all results into one single array
        let allMatches = [];
        results.forEach(result => {
            // Add the league name to each event object
            const matchesWithLeague = result.events.map(event => ({ ...event, leagueName: result.leagueName }));
            allMatches = allMatches.concat(matchesWithLeague);
        });

        console.log("Total matches found:", allMatches.length);

        // If matches found, update the title with the count
        if (allMatches.length > 0 && sectionTitle && sectionTitle.textContent.includes("Today's Games")) {
            sectionTitle.textContent = `Upcoming Matches`;
        }

        // 4. Sort strictly by Date and Time
        allMatches.sort((a, b) => {
            const dateA = new Date(`${a.dateEvent}T${a.strTime || '00:00:00'}`);
            const dateB = new Date(`${b.dateEvent}T${b.strTime || '00:00:00'}`);
            return dateA - dateB;
        });

        // 5. NO LIMITS (We display everything we found)
        const matchesToShow = allMatches;

        // 6. Generate HTML
        if (matchesToShow.length > 0) {
            gamesContainer.innerHTML = matchesToShow.map(match => {
                // Format time (remove seconds if present)
                const time = match.strTime ? match.strTime.slice(0, 5) : 'TBD';
                
                return `
                <div class="game-card animate__animated animate__fadeIn">
                    <div class="game-header">
                        <span class="league-badge">${match.leagueName}</span>
                        <span class="game-date">${match.dateEvent}</span>
                    </div>
                    <div class="teams-versus">
                        <div class="team-home">
                            <span class="team-name">${match.strHomeTeam}</span>
                        </div>
                        <div class="vs-badge">${time}</div>
                        <div class="team-away">
                            <span class="team-name">${match.strAwayTeam}</span>
                        </div>
                    </div>
                </div>
                `;
            }).join('');
        } else {
            gamesContainer.innerHTML = '<p style="text-align:center;">No upcoming matches found in the API.</p>';
        }

    } catch (error) {
        console.error('General Error:', error);
        gamesContainer.innerHTML = '<p style="text-align:center; color:red;">Error loading matches.</p>';
    }
}

// --- Spotlight Player Logic (Real Madrid) ---
async function fetchSpotlightPlayer() {
    const spotlightContainer = document.getElementById('spotlight-player');
    if (!spotlightContainer) return;

    // Real Madrid ID: 133738
    const teamId = 133738; 

    try {
        const response = await fetch(`${API_BASE_URL}lookup_all_players.php?id=${teamId}`);
        const data = await response.json();
        const players = data.player; 

        if (players && players.length > 0) {
            const randomIndex = Math.floor(Math.random() * players.length);
            const randomPlayer = players[randomIndex];

            const photo = randomPlayer.strThumb || randomPlayer.strCutout || randomPlayer.strRender || 'https://www.thesportsdb.com/images/media/player/thumb/def_player.png';
            
            let age = 'N/A';
            if (randomPlayer.dateBorn) {
                const bday = new Date(randomPlayer.dateBorn);
                age = Math.abs(new Date(Date.now() - bday.getTime()).getUTCFullYear() - 1970);
            }

            spotlightContainer.innerHTML = `
                <article class="card spotlight-card-item" 
                         tabindex="0"
                         role="button"
                         data-player-id="${randomPlayer.idPlayer}"
                         data-player-name="${randomPlayer.strPlayer}">
                    <div class="card-image" 
                         style="background-image: url('${photo}'); 
                                background-size: cover; 
                                background-position: top center;
                                height: 200px;">
                    </div>
                    <div class="card-content">
                        <p class="card-label">Spotlight Player</p>
                        <h3 class="card-title">${randomPlayer.strPlayer}</h3>
                        <p>${randomPlayer.strTeam || 'Real Madrid'} • ${age} years</p>
                    </div>
                </article>
            `;

            // Make the card clickable
            const card = spotlightContainer.querySelector('.card');
            if (card) {
                card.style.cursor = 'pointer';
                const link = `details.html?type=player&id=${randomPlayer.idPlayer}&name=${encodeURIComponent(randomPlayer.strPlayer)}`;
                
                card.addEventListener('click', () => window.location.href = link);
                card.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        window.location.href = link;
                    }
                });
            }

        } else {
            spotlightContainer.innerHTML = '<p>No spotlight player available.</p>';
        }
    } catch (error) {
        console.error('Error fetching spotlight player:', error);
        spotlightContainer.innerHTML = '<p style="color: red;">Error loading spotlight player.</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initHamburgerMenu();
    initNavigationAnimation();
    initSkipLink();
    initSearchForm();
    
    // Execute data loading functions
    fetchSpotlightPlayer();
    fetchUpcomingGames();
});


// -------------------------------------
// DARK MODE TOGGLE 
// -------------------------------------
const themeToggle = document.getElementById("theme-toggle");

function applyTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.checked = true;
  } else {
    document.body.classList.remove("dark-mode");
    themeToggle.checked = false;
  }
}

// Load saved preference
applyTheme(localStorage.getItem("theme") || "light");

// Toggle listener
themeToggle.addEventListener("change", () => {
  const theme = themeToggle.checked ? "dark" : "light";
  localStorage.setItem("theme", theme);
  applyTheme(theme);
});
