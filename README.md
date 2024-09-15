

# 🌦️ Weather Watcher - A Real-time Weather App

**Weather Watcher** is a sleek and modern web application that helps you stay updated with the latest weather information, wherever you are. Using this app, you can:
- Check current weather conditions in your location.
- Search for weather details in any city worldwide.
- Monitor real-time weather changes on the map.
- Get weather predictions to help you plan ahead.

Built with **React** and **TypeScript** for reliability, **Vite** for fast development, and **TailwindCSS** for modern styling. Powered by [WeatherAPI](https://www.weatherapi.com/docs/) to bring you accurate and up-to-date weather data.

## 🚀 Features

- **Current Location Weather**: Get real-time weather updates based on your location.
- **Search for Weather**: Easily search and find weather in any city.
- **Interactive Weather Map**: Monitor weather changes using a live weather map.
- **Weather Forecast**: Get detailed forecasts so you can plan for the day, week, or even longer.

## 📸 Screenshots
![Weather App Screenshot](https://drive.google.com/uc?export=view&id=12ZzPbpwj81YaJeATwhrQd3o-ujrLTfr1)


## 🛠️ Tech Stack

- **Framework**: [React](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/) for lightning-fast development and builds.
- **Styling**: [TailwindCSS](https://tailwindcss.com/) for responsive, modern UI design.
- **Weather Data**: [WeatherAPI](https://www.weatherapi.com/) for accurate weather forecasts and real-time data.

## 🎨 UI Design
The UI is designed using **TailwindCSS**, ensuring a mobile-first, responsive design. Components are reusable and easy to customize.

## 🌐 API Integration

This app uses the powerful [WeatherAPI](https://www.weatherapi.com/) to fetch real-time weather data. To get started, you will need an API key from WeatherAPI. You can sign up for free and get your key [here](https://www.weatherapi.com/signup.aspx).

## ⚙️ Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14+)
- **npm** or **pnpm**

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/weather-watcher.git
cd weather-watcher
```

2. Install the dependencies:

```bash
npm install
# or
pnpm install
```

3. Set up your `.env` file with your WeatherAPI key:

```bash
VITE_WEATHER_API_KEY=your_weather_api_key
```

4. Run the development server:

```bash
npm run dev
# or
pnpm dev
```

Your app will be running at `http://localhost:3000`.

## 📁 Project Structure

```bash
.
├── public/             # Public assets
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── App.tsx         # Main app entry
│   └── index.tsx       # Entry point for React
├── .env                # API keys and environment variables
├── tailwind.config.js  # TailwindCSS configuration
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite configuration
└── package.json        # Project dependencies and scripts
```

## 🔮 Future Improvements (maybe)

- Add user authentication for personalized weather tracking.
- Implement notifications for severe weather alerts.
- Support for multiple languages and units (°C/°F).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Feel free to contribute or open an issue if you find a bug! 😊