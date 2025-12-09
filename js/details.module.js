/**
 * =============================================================================
 * DETAILS.MODULE.JS - TheSportsDB Edition
 * =============================================================================
 */

import { API_BASE_URL } from './modules/api.js';
import { initHamburgerMenu, initNavigationAnimation, initSkipLink } from './modules/navigation.js';

// URL Parameters
const params = new URLSearchParams(window.location.search);
const type = params.get('type');
const id = params.get('id');
const nameFromUrl = params.get('name');

// DOM Elements
const titleEl = document.getElementById('details-title');
const subtitleEl = document.getElementById('details-subtitle');
const typeEl = document.getElementById('details-type');
const nameEl = document.getElementById('details-name');
const meta1El = document.getElementById('details-meta-1');
const meta2El = document.getElementById('details-meta-2');
const statsListEl = document.getElementById('details-stats-list');
const imageContainerEl = document.getElementById('details-image-container');

function setupInitialState() {
    if (!type || !id) {
        titleEl.textContent = 'No data available';
        subtitleEl.textContent = 'Please go back and try again.';
    } else {
        const niceType = type === 'team' ? 'Team' : 'Player';
        titleEl.textContent = `${niceType} Details`;
        typeEl.textContent = niceType;
        if (nameFromUrl) {
            nameEl.textContent = decodeURIComponent(nameFromUrl);
        }
    }
}

async function loadDetails() {
    if (!type || !id) return;

    try {
        let url = '';
        // Different endpoints for players vs teams
        if (type === 'team') {
            url = `${API_BASE_URL}lookupteam.php?id=${id}`;
        } else {
            url = `${API_BASE_URL}lookupplayer.php?id=${id}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        // TheSportsDB returns keys "teams" or "players"
        const list = (type === 'team') ? data.teams : data.players;

        if (!list || list.length === 0) {
            subtitleEl.textContent = 'No details found for this item.';
            return;
        }

        if (type === 'team') {
            fillTeamDetails(list[0]);
        } else {
            fillPlayerDetails(list[0]);
        }
        subtitleEl.textContent = 'Data provided by TheSportsDB';

    } catch (err) {
        console.error('Error loading details:', err);
        subtitleEl.textContent = 'Error loading details.';
    }
}

function fillTeamDetails(team) {
    if (!nameFromUrl && team.strTeam) {
        nameEl.textContent = team.strTeam;
    }

    typeEl.textContent = 'Team';
    titleEl.textContent = `Team: ${team.strTeam}`;

    // Team Banner/Badge
    if (team.strTeamBadge && imageContainerEl) {
        imageContainerEl.classList.remove('placeholder');
        imageContainerEl.style.backgroundImage = `url('${team.strTeamBadge}')`;
        imageContainerEl.style.backgroundSize = 'contain';
        imageContainerEl.style.backgroundRepeat = 'no-repeat';
        imageContainerEl.style.backgroundPosition = 'center';
        imageContainerEl.style.backgroundColor = 'var(--white)';
    }

    meta1El.textContent = team.strCountry ? `Country: ${team.strCountry}` : '';
    meta2El.textContent = team.intFormedYear ? `Founded: ${team.intFormedYear}` : '';

    statsListEl.innerHTML = '';
    if (team.strStadium) addStatItem(`Stadium: ${team.strStadium}`);
    if (team.strStadiumLocation) addStatItem(`Location: ${team.strStadiumLocation}`);
    if (team.intStadiumCapacity) addStatItem(`Capacity: ${team.intStadiumCapacity}`);
    
    // Use description as "Bio"
    if (team.strDescriptionEN) {
        const desc = team.strDescriptionEN.split('.')[0] + '.';
        addStatItem(`Bio: ${desc}`);
    }
}

function fillPlayerDetails(player) {
    let displayName = player.strPlayer || nameFromUrl || 'Unknown';
    
    // Calculate Age
    if (player.dateBorn) {
        const birthDate = new Date(player.dateBorn);
        const ageDifMs = Date.now() - birthDate.getTime();
        const ageDate = new Date(ageDifMs);
        const age = Math.abs(ageDate.getUTCFullYear() - 1970);
        displayName += ` (${age} years)`;
    }

    nameEl.textContent = displayName;
    typeEl.textContent = 'Player';
    titleEl.textContent = `Player: ${player.strPlayer}`;

    // Get best available image
    const photoUrl = player.strCutout || player.strThumb || player.strRender;

    if (photoUrl && imageContainerEl) {
        imageContainerEl.classList.remove('placeholder');
        imageContainerEl.style.backgroundImage = `url('${photoUrl}')`;
        imageContainerEl.style.backgroundSize = 'contain';
        imageContainerEl.style.backgroundPosition = 'center';
        imageContainerEl.style.backgroundColor = 'transparent';
    }

    meta1El.textContent = `Team: ${player.strTeam || 'N/A'}`;
    meta2El.textContent = `Position: ${player.strPosition || 'N/A'}`;

    statsListEl.innerHTML = '';

    if (player.strNationality) addStatItem(`Nationality: ${player.strNationality}`);
    if (player.strHeight) addStatItem(`Height: ${player.strHeight}`);
    if (player.strWeight) addStatItem(`Weight: ${player.strWeight}`);
    
    // Use description as "Bio"
    if (player.strDescriptionEN) {
        const bio = player.strDescriptionEN.split('.')[0] + '.';
        addStatItem(`Bio: ${bio}`);
    }
}

function addStatItem(text) {
    const li = document.createElement('li');
    li.textContent = text;
    statsListEl.appendChild(li);
}

// Search Form Handler (Redundant but keeps file self-contained)
function initSearchForm() {
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                const val = searchInput.value.trim();
                if (val.length > 2) {
                    window.location.href = `search-results.html?search_query=${encodeURIComponent(val)}`;
                }
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initHamburgerMenu();
    initNavigationAnimation();
    initSkipLink();
    initSearchForm();
    setupInitialState();
    loadDetails();
});