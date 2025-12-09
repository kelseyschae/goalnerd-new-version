/**
 * =============================================================================
 * PLAYERS.MODULE.JS - No Limits Version
 * =============================================================================
 */

import { API_BASE_URL } from './modules/api.js';
import { initHamburgerMenu, initNavigationAnimation, initSkipLink } from './modules/navigation.js';
import { createPlayerCardHTML, initCardNavigation } from './modules/cards.js';

// Search Form Logic
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

// Fetch Roster
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
            // We use forEach to get EVERY player in the list
            playersData.forEach(player => {
                allCardsHTML += createPlayerCardHTML(player);
            });

            gridContainer.innerHTML = allCardsHTML;
            initCardNavigation(gridContainer, 'player');

        } else {
            gridContainer.innerHTML = '<p style="color: red; text-align: center;">❌ Error: No players found.</p>';
        }
    } catch (error) {
        console.error('Error fetching players:', error);
        gridContainer.innerHTML = '<p style="color: red; text-align: center;">Connection error.</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initHamburgerMenu();
    initNavigationAnimation();
    initSkipLink();
    initSearchForm();
    fetchAndDisplayPlayerList();
});