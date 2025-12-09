// Function to handle the search form submission
function handleSearchSubmit(event) {
    // 1. Prevent the default form submission (page refresh)
    event.preventDefault();

    // 2. Get the input element by its ID
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    // 3. Get the value, trim whitespace
    const searchTerm = searchInput.value.trim();

    // 4. Validate the input
    if (searchTerm.length > 2) {
        // 5. Safely encode the search term for the URL
        const encodedQuery = encodeURIComponent(searchTerm);

        // 6. Redirect the user to a search results page
        // Usamos 'search-results.html' como página de destino
        window.location.href = `search-results.html?search_query=${encodedQuery}`;
    } else {
        // Optional feedback for short searches
        alert('Please enter at least 3 characters to search.');
    }
}

// 7. Wait for the DOM to load and attach the event listener
document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearchSubmit);
    }
});