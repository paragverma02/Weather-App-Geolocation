import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./App.css"; // Import your custom CSS

function WeatherApp() {
  const [position, setPosition] = useState([0, 0]);
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiKey = "e99d12a18fc26152b90869dec08a3b51";

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
        fetchWeather(latitude, longitude);
      },
      (err) => {
        setError("Could not get your location.");
        setLoading(false);
      }
    );
  }, []);

  const fetchWeather = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      );
      const data = await response.json();
      setWeather(data);
      setLoading(false);
    } catch (error) {
      setError("Unable to fetch weather data.");
      setLoading(false);
    }
  };

  const handleCitySearch = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
      );
      const data = await response.json();
      setWeather(data);
      setPosition([data.coord.lat, data.coord.lon]);
      setLoading(false);
    } catch (error) {
      setError("City not found.");
      setLoading(false);
    }
  };

  const customMarker = new L.Icon({
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
  });

  return (
    <div className="App">
      <h1>Weather App with Map Integration</h1>

      <form onSubmit={handleCitySearch}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Search for a city"
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading weather data...</p>}
      {error && <p>{error}</p>}

      {!loading && weather && (
        <>
          <div className="content-container">
            <div className="weather-info">
              <h2>Weather in {weather.name}</h2>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
              />
              <p>{weather.weather[0].description}</p>
              <p>Temperature: {weather.main.temp}°C</p>
              <p>Humidity: {weather.main.humidity}%</p>
              <p>Wind Speed: {weather.wind.speed} m/s</p>
            </div>

            <div className="map-container">
              <MapContainer
                center={position}
                zoom={13}
                style={{ height: "400px", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={position} icon={customMarker}>
                  <Popup>
                    Weather at {weather.name}: {weather.main.temp}°C,{" "}
                    {weather.weather[0].description}.
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default WeatherApp;
