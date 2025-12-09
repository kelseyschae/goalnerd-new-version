/**
 * =============================================================================
 * SEARCH-RESULTS.MODULE.JS - TheSportsDB Edition
 * =============================================================================
 */

import { API_BASE_URL } from './modules/api.js';
import { initHamburgerMenu, initNavigationAnimation, initSkipLink } from './modules/navigation.js';
import { createPlayerCardHTML, initCardNavigation } from './modules/cards.js';

async function fetchSearchResults() {
    const gridContainer = document.getElementById('results-grid');
    const queryDisplay = document.getElementById('query-display');

    if (!gridContainer) return;

    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get('search_query');

    if (!searchQuery) {
        gridContainer.innerHTML = '<p style="text-align:center">No search query provided.</p>';
        return;
    }

    if (queryDisplay) queryDisplay.textContent = searchQuery;
    gridContainer.innerHTML = '<p style="text-align: center;">Searching TheSportsDB...</p>';

    try {
        // Use 'searchplayers.php' endpoint
        const url = `${API_BASE_URL}searchplayers.php?p=${encodeURIComponent(searchQuery)}`;
        const response = await fetch(url);
        const data = await response.json();
        
        // TheSportsDB returns { "player": [...] }
        const playersData = data.player;

        if (playersData && playersData.length > 0) {
            let allCardsHTML = '';
            playersData.forEach(playerItem => {
                allCardsHTML += createPlayerCardHTML(playerItem);
            });
            gridContainer.innerHTML = allCardsHTML;
            initCardNavigation(gridContainer, 'player');

        } else {
            gridContainer.innerHTML = `<p style="text-align: center;">❌ No players named "<strong>${searchQuery}</strong>" found.</p>`;
        }

    } catch (error) {
        console.error('Error:', error);
        gridContainer.innerHTML = '<p style="color: red; text-align: center;">Connection error.</p>';
    }
}

function initSearchForm() {
    const searchForm = document.getElementById('search-form');
    if (!searchForm) return;

    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const searchInput = document.getElementById('search-input');
        if (!searchInput) return;
        const searchTerm = searchInput.value.trim();
        if (searchTerm.length > 2) {
            window.location.href = `search-results.html?search_query=${encodeURIComponent(searchTerm)}`;
        } else {
            alert('Please enter at least 3 characters.');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initHamburgerMenu();
    initNavigationAnimation();
    initSkipLink();
    initSearchForm();
    fetchSearchResults();
});