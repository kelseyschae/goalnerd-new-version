/**
 * =============================================================================
 * API CONFIGURATION MODULE - TheSportsDB Edition
 * =============================================================================
 * * This module contains all API settings for TheSportsDB.
 * TheSportsDB uses a simple URL structure where the API Key is part of the path.
 * * Base URL Format: https://www.thesportsdb.com/api/v1/json/{API_KEY}/
 */

// TheSportsDB free API key for testing is "123"
// (If you buy a real key later, just change this number)
export const API_KEY = '123';

// Base URL for TheSportsDB (Version 1, JSON format)
export const API_BASE_URL = `https://www.thesportsdb.com/api/v1/json/${API_KEY}/`;

// TheSportsDB does not require headers for the free tier
export const HEADERS = {};

// Season format is usually "2023-2024" for this database
export const SEASON = '2023-2024';

/**
 * Fetch data from TheSportsDB
 * @param {string} endpoint - e.g. 'searchplayers.php?p=Messi'
 */
export async function fetchFromAPI(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API fetch error:', error);
        throw error;
    }
}