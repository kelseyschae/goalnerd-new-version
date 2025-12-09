/**
 * =============================================================================
 * CARDS MODULE - TheSportsDB Edition
 * =============================================================================
 * * This module handles the creation of player cards using TheSportsDB data structure.
 * It maps fields like 'strPlayer' and 'strCutout' to the card layout.
 */

/**
 * Create HTML for a player card using TheSportsDB data
 * @param {Object} player - Flat player object from TheSportsDB
 */
export function createPlayerCardHTML(player) {
    // 1. Map TheSportsDB fields to variables
    const playerName = player.strPlayer || 'Unknown';
    const teamName = player.strTeam || 'Team N/A';
    const playerPosition = player.strPosition || 'N/A';
    
    // 2. Image Priority: Cutout (Transparent) -> Thumb (Headshot) -> Render -> Default
    const playerPhoto = player.strCutout || player.strThumb || player.strRender || 'https://www.thesportsdb.com/images/media/player/thumb/def_player.png';

    // 3. Calculate Age from dateBorn (format: YYYY-MM-DD)
    let playerAge = 'N/A';
    if (player.dateBorn) {
        const birthDate = new Date(player.dateBorn);
        const ageDifMs = Date.now() - birthDate.getTime();
        const ageDate = new Date(ageDifMs); // milliseconds from epoch
        playerAge = Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    // 4. Return HTML
    return `
        <article class="card animate__animated animate__fadeIn" 
                 role="button"
                 tabindex="0"
                 data-player-id="${player.idPlayer}"
                 data-player-name="${playerName}"
                 aria-label="View details for ${playerName}">
            <div class="card-image" 
                 style="background-image: url('${playerPhoto}'); 
                        background-size: cover; 
                        background-position: top center; 
                        background-color: transparent;
                        height: 160px;"
                 role="img"
                 aria-label="Photo of ${playerName}"> 
            </div>
            <div class="card-content">
                <p class="card-label">${teamName}</p>
                <h3 class="card-title">${playerName} (${playerAge} years)</h3>
                <p>${playerPosition}</p>
            </div>
        </article>
    `;
}

/**
 * Add click and keyboard event listeners to a card container
 */
export function initCardNavigation(container, type = 'player') {
    if (!container) return;

    // Click handler
    container.addEventListener('click', (event) => {
        const card = event.target.closest('.card');
        if (!card) return;
        navigateToDetails(card, type);
    });

    // Keyboard handler (Enter/Space)
    container.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            const card = event.target.closest('.card');
            if (!card) return;
            event.preventDefault();
            navigateToDetails(card, type);
        }
    });
}

function navigateToDetails(card, type) {
    const id = card.getAttribute(`data-${type}-id`) || card.getAttribute('data-player-id');
    const name = card.getAttribute(`data-${type}-name`) || card.getAttribute('data-player-name');

    if (!id) return;
    window.location.href = `details.html?type=${type}&id=${id}&name=${encodeURIComponent(name)}`;
}