# Weather Dashboard 🌤️

A web app that lets you look at the current weather in your city (using your current location) or another city,
and providing its forecast for the next five days and allowing you to add these cities to the favorites list.

## Prerequisites

Before we begin, you need to have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A free API key from [OpenWeatherMap](https://openweathermap.org/api)
  - You'll need access to the **Current Weather API** and the **One Call API 3.0**

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/raynixel/WeatherApp.git
cd WeatherApp
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up your environment variables

Create a `.env` file in the root of the project:

```bash
touch .env
```

Open it and add your OpenWeatherMap API key:

```
WEATHER_API_KEY=your_api_key_here
```

> You can get a free API key by signing up at [openweathermap.org](https://openweathermap.org/api)

### 4. Set up the data folder

The app stores favorite cities in a JSON file. Create the required file:

```bash
mkdir data
echo "[]" > data/favorites.json
```

### 5. Start the server

```bash
node server.js
```

### 6. Open the app

Go to your browser and visit:

```
http://localhost:3000
```

## Project Structure

This is how the project is structured

```
WeatherApp/
├── public/
│   ├── index.html       # Frontend UI
│   └── script.js        # Frontend logic
├── routes/
│   └── weather.js       # Backend API routes
├── data/
│   └── favorites.json   # Saved favorite cities
├── server.js            # Express server entry point
├── .env                 # Your API key (not committed to git)
└── README.md
```

## Common Errors

**"City not found" error**

- Double-check the spelling of the name of the city
- Make sure your API key is correctly set in `.env`
  **Server won't start**
- Run `npm install` to make sure that all the dependencies are installed
- Check that port 3000 isn't already in use by something else
  **Favorites not saving**
- Make sure `data/favorites.json` exists and contains `[]`
