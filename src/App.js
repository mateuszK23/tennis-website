import matches2025CSV from './data/matches-2025.csv?raw';
import matches2026CSV from './data/matches-2026.csv?raw';
import Footer from './components/Footer.js';
import { parseCSV } from './utils/csvParser.js';
import { renderStatsDiv } from './components/StatsTable.js';
import { renderMatchCard } from './components/MatchCard.js';
import { fetchSeasonWeather } from './utils/weatherFetcher.js';

export default function App() {
    const container = document.createElement('div');
    const weatherCache = {};
    const seasonData = {
        2025: parseCSV(matches2025CSV) || [],
        2026: parseCSV(matches2026CSV) || []
    };

    container.innerHTML = `
        <h1>Cardiff Open</h1>
        <div class="tabs" id="tabs"></div>
        <div id="stats" class="stats"></div>
        <div id="matches" class="matches"></div>
    `;

    const statsDiv = container.querySelector("#stats");
    const matchesDiv = container.querySelector("#matches");
    const tabsContainer = container.querySelector("#tabs");

    async function renderMatches(season) {
        matchesDiv.innerHTML = "";
        const matches = seasonData[season] || [];
        
        const matchesPresent = renderStatsDiv(matches, statsDiv);

        // load weather once per season
        if (!weatherCache[season] && matchesPresent) {
            weatherCache[season] = await fetchSeasonWeather(season, matches);
        }
        
        matches.forEach(match => {
            const weather = weatherCache[season][match.date];
            matchesDiv.innerHTML += renderMatchCard(match, weather);
        });
    }

    function initTabs() {
        const seasons = Object.keys(seasonData);
        seasons.forEach((season, index) => {
            const btn = document.createElement('button');
            btn.className = 'tab-btn' + (index === 0 ? ' active' : '');
            btn.dataset.season = season;
            btn.textContent = season;

            btn.addEventListener("click", () => {
                container.querySelector(".tab-btn.active")?.classList.remove("active");
                btn.classList.add("active");
                renderMatches(season);
            });

            tabsContainer.appendChild(btn);
        });
    }

    function init() {
        initTabs();

        // Render default active tab
        const activeTab = tabsContainer.querySelector(".tab-btn.active");
        if (activeTab) renderMatches(activeTab.dataset.season);

        const footer = Footer();
        container.appendChild(footer);
    }

    init();

    return container;
}
