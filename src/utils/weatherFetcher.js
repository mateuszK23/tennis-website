    export async function fetchSeasonWeather(season, matches) {
        const dates = [...new Set(matches.map(m => m.date))];

        const start = dates[0];
        const end = dates[dates.length - 1];

        const lat = 51.4816;
        const lon = -3.1791;

        const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${start}&end_date=${end}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Europe%2FLondon`;

        const res = await fetch(url);
        const data = await res.json();

        const cache = {};

        data.daily.time.forEach((day, i) => {
            cache[day] = {
                code: data.daily.weather_code[i],
                max: data.daily.temperature_2m_max[i],
                min: data.daily.temperature_2m_min[i],
            };
            console.log(`weather for ${day}`, cache[day]);
        });

        return cache;
    }