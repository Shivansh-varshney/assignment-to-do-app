import React, { useEffect, useState } from "react";

const OPENCAGE_API_KEY = import.meta.env.VITE_OPEN_CAGE_API;
const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API;

function ShowWeather() {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        getCityFromCoords(latitude, longitude);
                    },
                    (err) => {
                        setError("Location access denied. Please allow location.");
                        setLoading(false);
                    }
                );
            } else {
                setError("Geolocation is not supported by this browser.");
                setLoading(false);
            }
        };

        const getCityFromCoords = (lat, lon) => {
            fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${OPENCAGE_API_KEY}`)
                .then(response => response.json())
                .then(data => {
                    const { _normalized_city, state, country } = data.results[0].components;

                    // Sending to getWeather function
                    setCity(`${_normalized_city}, ${state}, ${country}`)
                    getWeather(_normalized_city, state, country);
                })
                .catch((error) => {
                    console.log(error)
                    setError("Error fetching city name.");
                    setLoading(false);
                });
        };

        const getWeather = (cityName, stateName, countryName) => {
            fetch(`https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${cityName, stateName, countryName}&aqi=yes`)
                .then(response => response.json())
                .then(data => {
                    setWeather(data);
                    setLoading(false);
                })
                .catch(() => {
                    setError("Error fetching weather data.");
                    setLoading(false);
                });
        };

        fetchLocation();
    }, [])

    return (
        <div className="container">
            {loading && <p className="text-white">Fetching weather details...</p>}
            {error && <p className="text-danger">{error}</p>}
            {weather && (
                <div className="row p-2 text-white">
                    <div className="col-sm-6">
                        <h4>Weather Report: {city}</h4>
                        <p><b>Temperature:</b> {weather.current.temp_c}°C
                            , <b>Condition:</b> {weather.current.condition.text}
                            , <b>Humidity:</b> {weather.current.humidity}%
                            , <b>Wind Speed:</b> {weather.current.wind_kph} kph</p>
                    </div>
                    <div className="col-sm-2">
                        <img src={weather.current.condition.icon} alt="Weather Icon" />
                    </div>
                </div>
            )}
        </div>
    );
}

export default ShowWeather