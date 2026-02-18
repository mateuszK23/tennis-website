export async function fetchSeasonWeather(season, matches) {
    const dates = [...new Set(matches.map(m => m.date).filter(Boolean))].sort();

    if (dates.length === 0) return {};

    // API expects start_date <= end_date (ascending). Ensure we send the earliest -> latest.
    const start = dates[0];
    const end = dates[dates.length - 1];

    const lat = 51.4816;
    const lon = -3.1791;

    // Include wind data in the daily request
    const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${start}&end_date=${end}&daily=weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,wind_direction_10m_dominant&timezone=Europe%2FLondon`;

    try {
        const res = await fetch(url);
        if (!res.ok) {
            const text = await res.text().catch(() => '');
            console.error('Weather fetch failed', res.status, text);
            return {};
        }

        const data = await res.json().catch(() => null);
        if (!data || !data.daily || !Array.isArray(data.daily.time)) {
            console.error('Unexpected weather response', data);
            return {};
        }

        const cache = {};
        data.daily.time.forEach((day, i) => {
            cache[day] = {
                code: data.daily.weather_code?.[i],
                max: data.daily.temperature_2m_max?.[i],
                min: data.daily.temperature_2m_min?.[i],
                windSpeed: data.daily.wind_speed_10m_max?.[i],
                windDirection: data.daily.wind_direction_10m_dominant?.[i]
            };
        });

        return cache;
    } catch (err) {
        console.error('Error fetching weather', err);
        return {};
    }
}
