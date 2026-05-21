// Stores the currently searched city
let currentCity = "";

async function getWeatherByLocation() {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        // Reverse geocode to get city name
        const geoRes = await fetch(`/api/weather/reverse-geocode/${latitude}/${longitude}`);
        const geoData = await geoRes.json();

        // Set the input field and fetch weather as normal
        document.getElementById("cityInput").value = geoData.city;
        getWeather();
    }, () => {
        alert("Unable to retrieve your location");
    });
}

// Event listener for the "Enter" key on the input field
document.getElementById("cityInput").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent page refresh if inside a form
        getWeather();
    }
});

// This function fetches weather data from the API
async function getWeather() {

    // Get city name from user input
    const city = document.getElementById("cityInput").value.trim();

    // Call backend API
    const response = await fetch(`/api/weather/${city}`);
    const data = await response.json();

    // If there's an error (e.g., city not found), display the error message
    if (data.error) {
    document.getElementById("weatherResult").innerHTML =
        `<p class="text-red-500">${data.error}</p>`;
    return;
    }

    currentCity = data.city;

    document.getElementById("cityInput").value = data.city;

    // This part displays the weather data dynamically
    document.getElementById("weatherResult").innerHTML = `
    <div class="bg-gray-100 rounded-xl p-4 shadow">
        <!-- City name -->
        <h2 class="text-2xl font-bold">${data.city}</h2>

        <!-- Weather description -->
        <p class="text-gray-600 capitalize">${data.description}</p>

        <!-- Weather details -->
        <div class="mt-3 space-y-1">
            <p>🌡 Temperature: <strong>${data.temperature} °C</strong></p>
            <p>💧 Humidity: ${data.humidity}%</p>
            <p>🌬 Wind: ${data.wind} m/s</p>
            <p>🌧 Precipitation: ${data.precipitation} mm</p>
            <p>☔ Chance of Rain: ${(data.rainChance ?? 0).toFixed(0)}%</p>
            <p style="color:${uvColor(data.uvIndex)}">
            ☀️ UV Index: ${data.uvIndex}
            </p>
        </div>
    </div>

    <!-- Forecast section -->
    <h3 class="text-lg font-semibold mt-6 mb-3 text-left">5-Day Forecast</h3>
    <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
        ${data.forecast.map(day => `
            <div class="bg-gray-100 rounded-xl p-3 shadow text-sm">
                <p class="font-semibold">${day.date}</p>
                <p class="text-gray-500 capitalize">${day.description}</p>
                <p>🌡 ${day.min}° / ${day.max}°C</p>
                <p>☔ ${day.rainChance}%</p>
                <p style="color:${uvColor(day.uvIndex)}">☀️ UV ${day.uvIndex}</p>
            </div>
        `).join("")}
    </div>
    `;
}

// This function returns color based on how high the UV index is.
function uvColor(uvi){
    if(uvi < 3) return "green";
    if(uvi < 6) return "orange";
    if(uvi < 8) return "red";
    return "purple";
}

// This function saves the current city to the favorites list via an API
async function saveFavorite() {

    // Don't save if no city has been searched
    if (!currentCity) {
        alert("Please search for a city first");
        return;
    }

    await fetch("/api/weather/favorite", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({city: currentCity})
});

    // Reload favorites list after saving
    loadFavorites();
}

// This function loads favorite cities from backend
async function loadFavorites() {

    const response = await fetch("/api/weather/favorites/list");
    const favorites = await response.json();
    const list = document.getElementById("favorites");

    //Clear existing list before adding new items
    list.innerHTML = "";

    // Loop through each favorite city and create a list item for it
    favorites.forEach(city => {

        const li = document.createElement("li");

        // Styling for the list item using Tailwind CSS classes
        li.className = "bg-gray-100 p-2 rounded shadow cursor-pointer hover:bg-gray-200";
         // City name (clickable)
        const span = document.createElement("span");
        span.textContent = city;
        span.className = "cursor-pointer hover:underline";
        span.onclick = () => {
            document.getElementById("cityInput").value = city;
            getWeather();
        };

        // Remove button
        const btn = document.createElement("button");
        btn.textContent = "✕";
        btn.className = "text-red-500 hover:text-red-700 font-bold ml-2";
        btn.onclick = async () => {
            await fetch(`/api/weather/favorite/${city}`, { method: "DELETE" });
            loadFavorites(); // Refresh the list
        };

        li.appendChild(span);
        li.appendChild(btn);
        list.appendChild(li);
    });
}

// Load favorites when the page first loads
loadFavorites();
