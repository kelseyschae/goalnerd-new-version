// js/details.js

// TheSportsDB Free Key
const API_KEY = "123";
const API_BASE_URL = `https://www.thesportsdb.com/api/v1/json/${API_KEY}/`;

// --- Read URL parameters
const params = new URLSearchParams(window.location.search);
const type = params.get('type'); // "team" or "player"
const id = params.get('id');     // numeric API id
const nameFromUrl = params.get('name'); 

// --- DOM elements
const titleEl = document.getElementById('details-title');
const subtitleEl = document.getElementById('details-subtitle');
const typeEl = document.getElementById('details-type');
const nameEl = document.getElementById('details-name');
const meta1El = document.getElementById('details-meta-1');
const meta2El = document.getElementById('details-meta-2');
const statsListEl = document.getElementById('details-stats-list');
const imageContainerEl = document.getElementById('details-image-container');

// --- Initial state
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

async function loadDetails() {
    if (!type || !id) return;

    try {
        let url = '';
        if (type === 'team') {
            url = `${API_BASE_URL}lookupteam.php?id=${id}`;
        } else {
            url = `${API_BASE_URL}lookupplayer.php?id=${id}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        // TheSportsDB returns { "teams": [...] } or { "players": [...] }
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

// --- Fill TEAM details ---
function fillTeamDetails(team) {
    if (!nameFromUrl && team.strTeam) {
        nameEl.textContent = team.strTeam;
    }

    typeEl.textContent = 'Team';
    titleEl.textContent = `Team: ${team.strTeam}`;

    // Image / Banner
    if (team.strTeamBadge && imageContainerEl) {
        imageContainerEl.classList.remove('placeholder');
        imageContainerEl.style.backgroundImage = `url('${team.strTeamBadge}')`;
        imageContainerEl.style.backgroundSize = 'contain';
        imageContainerEl.style.backgroundRepeat = 'no-repeat';
        imageContainerEl.style.backgroundPosition = 'center';
        imageContainerEl.style.backgroundColor = 'var(--white)';
    }

    // Meta info
    meta1El.textContent = team.strCountry ? `Country: ${team.strCountry}` : '';
    meta2El.textContent = team.intFormedYear ? `Founded: ${team.intFormedYear}` : '';

    // Stats / extra info
    statsListEl.innerHTML = '';

    if (team.strStadium) addStatItem(`Stadium: ${team.strStadium}`);
    if (team.strStadiumLocation) addStatItem(`Location: ${team.strStadiumLocation}`);
    if (team.intStadiumCapacity) addStatItem(`Capacity: ${team.intStadiumCapacity}`);
    
    // Description (Bio)
    if (team.strDescriptionEN) {
        // Take just the first sentence or two to keep it clean
        const bio = team.strDescriptionEN.split('.')[0] + '.';
        addStatItem(`Bio: ${bio}`);
    }
}

// --- Fill PLAYER details ---
function fillPlayerDetails(player) {
    let displayName = player.strPlayer || nameFromUrl || 'Unknown player';
    
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

    // Player image (Prefer Cutout, then Thumb, then Render)
    const photoUrl = player.strCutout || player.strThumb || player.strRender;

    if (photoUrl && imageContainerEl) {
        imageContainerEl.classList.remove('placeholder');
        imageContainerEl.style.backgroundImage = `url('${photoUrl}')`;
        imageContainerEl.style.backgroundSize = 'contain';
        imageContainerEl.style.backgroundPosition = 'center';
        imageContainerEl.style.backgroundColor = 'transparent';
    }

    // Meta info
    meta1El.textContent = `Team: ${player.strTeam || 'N/A'}`;
    meta2El.textContent = `Position: ${player.strPosition || 'N/A'}`;

    // Stats
    statsListEl.innerHTML = '';

    if (player.strNationality) addStatItem(`Nationality: ${player.strNationality}`);
    if (player.strHeight) addStatItem(`Height: ${player.strHeight}`);
    if (player.strWeight) addStatItem(`Weight: ${player.strWeight}`);
    
    // Description (Bio)
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

// Init
document.addEventListener('DOMContentLoaded', () => {
    loadDetails();
    if (typeof initHamburgerMenu === 'function') initHamburgerMenu();
    if (typeof initNavigationAnimation === 'function') initNavigationAnimation();
});

// Hamburger Menu (In case it's not in a separate file)
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

function initNavigationAnimation() {
    const navLinksElements = document.querySelectorAll('.nav-link');
    navLinksElements.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetUrl = link.getAttribute('href');
            link.classList.add('animate__animated', 'animate__rollOut');
            link.addEventListener('animationend', () => {
                window.location.href = targetUrl;
            }, { once: true });
        });
    });
}