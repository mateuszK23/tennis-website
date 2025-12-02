import matches2025CSV from './data/matches-2025.csv?raw';
import matches2026CSV from './data/matches-2026.csv?raw';
import Footer from './components/Footer.js';
import { parseCSV } from './utils/csvParser.js';
import { renderStatsDiv } from './components/StatsTable.js';
import { renderMatchCard } from './components/MatchCard.js';

export default function App() {
    const container = document.createElement('div');

    container.innerHTML = `
    <h1>Tennis Match Results</h1>
    <div class="tabs">
      <button class="tab-btn active" data-season="2025">2025</button>
      <button class="tab-btn" data-season="2026">2026</button>
    </div>
    <div id="stats" class="stats"></div>
    <div id="matches" class="matches"></div>
  `;

    const statsDiv = container.querySelector("#stats");
    const matchesDiv = container.querySelector("#matches");
    const tabs = container.querySelectorAll(".tab-btn");

    const seasonData = {
        2025: parseCSV(matches2025CSV)[2025] || [],
        2026: parseCSV(matches2026CSV)[2026] || []
    };

    function renderMatches(season) {
        matchesDiv.innerHTML = "";
        const matches = seasonData[season] || [];
        renderStatsDiv(matches, statsDiv);

        matches.forEach(match => {
            matchesDiv.innerHTML += renderMatchCard(match);
        });
    }

    function init() {
        // Render default active tab
        const activeTab = container.querySelector(".tab-btn.active");
        if (activeTab) {
            renderMatches(activeTab.dataset.season);
        }

        // Add tab click handlers
        tabs.forEach(tab => {
            tab.addEventListener("click", () => {
                container.querySelector(".tab-btn.active").classList.remove("active");
                tab.classList.add("active");
                renderMatches(tab.dataset.season);
            });
        });

        const footer = Footer()
        container.appendChild(footer);
    }

    init();

    return container;
}
