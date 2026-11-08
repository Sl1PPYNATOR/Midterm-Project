$(document).ready(function() {
    const $weatherTemp = $("#weatherTemp");
    const $weatherDesc = $("#weatherDescription");
    if ($weatherTemp.length === 0) return;

    //coordinates for munich (imaginary garge location)
    const latitude = 48.1351;
    const longitude = 11.5820;
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`;

    $.ajax({
        url: apiUrl,
        method: "GET",
        success: function(data) {
            if (data && data.current) {
                const temp = Math.round(data.current.temperature_2m);
                const weatherCode = data.current.weather_code;
                const weatherInfo = getWeatherDescription(weatherCode);

                let garageAdvice = "Ideal conditions for garage work.";

                if (weatherInfo.text.includes("Rain") || weatherInfo.text.includes("Drizzle")) {
                    garageAdvice = "Great day for indoor wrenching.";
                } else if (weatherInfo.text.includes("Snow")) {
                    garageAdvice = "Snowy outside, perfect time for deep bay maintenance.";
                } else if (weatherInfo.text.includes("Thunderstorm")) {
                    garageAdvice = "Stormy weather, secure the shop doors!";
                } else if (weatherInfo.text.includes("Fog")) {
                    garageAdvice = "Low visibility outside, take it easy on test drives.";
                } else if (temp < 10) {
                    garageAdvice = "Chilly garage, turn on the heater!";
                } else if (temp > 30) {
                    garageAdvice = "Hot day in the shop, stay hydrated!";
                }

                $weatherTemp.html(`${temp}°C`);
                $weatherDesc.html(`<i class="${weatherInfo.icon} me-1"></i> ${weatherInfo.text} – ${garageAdvice}`);
            } else {
                $weatherDesc.text("Weather data currently unavailable.");
                $weatherTemp.html("--");
            }
        },
        error: function() {
            $weatherDesc.text("Could not connect to weather service.");
            $weatherTemp.html("--");
        }
    });

    //function to map weather codes to readable text
    function getWeatherDescription(code) {
        switch (code) {
            case 0:
                return { text: "Clear Sky", icon: "fa-solid fa-sun text-warning" };
            case 1:
            case 2:
            case 3:
                return { text: "Partly Cloudy", icon: "fa-solid fa-cloud-sun text-secondary" };
            case 45:
            case 48:
                thu = { text: "Foggy", icon: "fa-solid fa-smog text-secondary" };
                return thu;
            case 51:
            case 53:
            case 55:
            case 56:
            case 57:
                return { text: "Drizzle", icon: "fa-solid fa-cloud-rain text-primary" };
            case 61:
            case 63:
            case 65:
                return { text: "Rainy", icon: "fa-solid fa-cloud-showers-heavy text-primary" };
            case 71:
            case 73:
            case 75:
                return { text: "Snowing", icon: "fa-solid fa-snowflake text-info" };
            case 95:
            case 96:
            case 99:
                return { text: "Thunderstorm", icon: "fa-solid fa-bolt text-warning" };
            default:
                return { text: "Fair Weather", icon: "fa-solid fa-cloud text-secondary" };
        }
    }
});