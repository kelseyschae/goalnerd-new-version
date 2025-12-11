// js/script.js

const API_KEY = "123";
const API_BASE_URL = `https://www.thesportsdb.com/api/v1/json/${API_KEY}/`;

const getCardElement = (index, selector) => {
    const cards = document.querySelectorAll('.featured .card');
    if (cards.length > index) return cards[index].querySelector(selector);
    return null;
};

const getCard = (index) => {
    const cards = document.querySelectorAll('.featured .card');
    return cards.length > index ? cards[index] : null;
};

// --- Random Team Logic ---
async function fetchRandomTeam() {
    const leagueName = "Spanish La Liga";

    try {
        // Search all teams in La Liga
        const response = await fetch(`${API_BASE_URL}search_all_teams.php?l=${encodeURIComponent(leagueName)}`);
        const data = await response.json();
        const teams = data.teams;

        if (teams && teams.length > 0) {
            const randomIndex = Math.floor(Math.random() * teams.length);
            const randomTeam = teams[randomIndex];

            const titleElement = getCardElement(0, '.card-title');
            const imageElement = getCardElement(0, '.card-image');
            const labelElement = getCardElement(0, '.card-label');
            const cardElement = getCard(0);

            if (titleElement) titleElement.textContent = randomTeam.strTeam;
            if (labelElement) labelElement.textContent = `Today's Team | ${randomTeam.strCountry || 'Spain'}`;

            if (imageElement && randomTeam.strTeamBadge) {
                imageElement.classList.remove('placeholder');
                imageElement.innerHTML = '';
                imageElement.style.backgroundImage = `url('${randomTeam.strTeamBadge}')`;
                imageElement.style.backgroundSize = 'contain';
                imageElement.style.backgroundRepeat = 'no-repeat';
                imageElement.style.backgroundPosition = 'center';
                imageElement.style.backgroundColor = 'var(--white)';
            }

            if (cardElement) {
                cardElement.style.cursor = 'pointer';
                cardElement.addEventListener('click', () => {
                    window.location.href = `details.html?type=team&id=${randomTeam.idTeam}&name=${encodeURIComponent(randomTeam.strTeam)}`;
                });
            }

        } else {
            console.error('Error: No teams found.');
        }
    } catch (error) {
        console.error('Error fetching team:', error);
    }
}

// --- Spotlight Player Logic ---
async function fetchRandomPlayerSpotlight() {
    // Barcelona ID in TheSportsDB: 133739
    const teamId = 133738; 

    try {
        const response = await fetch(`${API_BASE_URL}lookup_all_players.php?id=${teamId}`);
        const data = await response.json();
        const players = data.player;

        if (players && players.length > 0) {
            const randomIndex = Math.floor(Math.random() * players.length);
            const randomPlayer = players[randomIndex];

            const titleElement = getCardElement(1, '.card-title');
            const imageElement = getCardElement(1, '.card-image');
            const labelElement = getCardElement(1, '.card-label');
            const cardElement = getCard(1);

            let age = 'N/A';
            if (randomPlayer.dateBorn) {
                const bday = new Date(randomPlayer.dateBorn);
                age = Math.abs(new Date(Date.now() - bday.getTime()).getUTCFullYear() - 1970);
            }

            if (titleElement) titleElement.textContent = `${randomPlayer.strPlayer} (${age} years)`;
            if (labelElement) labelElement.textContent = `Spotlight Player`;

            const photo = randomPlayer.strThumb || randomPlayer.strCutout || randomPlayer.strRender;

            if (imageElement && photo) {
                imageElement.classList.remove('placeholder');
                imageElement.innerHTML = '';
                imageElement.style.backgroundImage = `url('${photo}')`;
                imageElement.style.backgroundSize = 'cover';
                imageElement.style.backgroundPosition = 'top center';
                imageElement.style.backgroundColor = 'transparent';
            }

            if (cardElement) {
                cardElement.style.cursor = 'pointer';
                cardElement.addEventListener('click', () => {
                    window.location.href = `details.html?type=player&id=${randomPlayer.idPlayer}&name=${encodeURIComponent(randomPlayer.strPlayer)}`;
                });
            }

        } else {
            console.error('Error: No players found for spotlight.');
        }
    } catch (error) {
        console.error('Error fetching player:', error);
    }
}

// --- Menu & Navigation ---
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

    navLinks.addEventListener('click', (e) => {
        e.stopPropagation();
    });
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

document.addEventListener('DOMContentLoaded', () => {
    fetchRandomTeam();
    fetchRandomPlayerSpotlight();
    initHamburgerMenu();
    initNavigationAnimation();
});

const themeToggle = document.getElementById("theme-toggle");

// Load saved theme
(function () {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggle.checked = true;
  }
})();

// Toggle theme on click
themeToggle.addEventListener("change", () => {
  if (themeToggle.checked) {
    document.body.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
});

// DARK MODE TOGGLE
const toggle = document.getElementById("darkModeToggle");

// Load saved mode
if (localStorage.getItem("dark-mode") === "enabled") {
  document.body.classList.add("dark-mode");
  toggle.checked = true;
}

// Toggle listener
toggle.addEventListener("change", () => {
  if (toggle.checked) {
    document.body.classList.add("dark-mode");
    localStorage.setItem("dark-mode", "enabled");
  } else {
    document.body.classList.remove("dark-mode");
    localStorage.setItem("dark-mode", "disabled");
  }
});
