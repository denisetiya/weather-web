import request from "../components/getData";
import { useState, useEffect } from "react";
import locationLogo from "../assets/location.png";
import noon from "../assets/clear.jpg";
import rain from "../assets/rain.jpg";
import night from "../assets/night.jpg";
import sunrise from "../assets/sunrise.jpg";
import Current from "../components/current";

export interface IWeather {

    location: {
        name: string;
        region: string;
        country: string;
        lat: number;
        lon: number;
        tz_id: string;
        localtime_epoch: number;
        localtime: string;
    };
    current: {
        last_updated_epoch: number;
        last_updated: string;
        temp_c: number;
        temp_f: number;
        is_day: number;
        condition: {
            text: string;
            icon: string;
            code: number;
        };
        wind_mph: number;
        wind_kph: number;
        wind_degree: number;
        wind_dir: string;
        pressure_mb: number;
        pressure_in: number;
        precip_mm: number;
        precip_in: number;
        humidity: number;
        cloud: number;
        feelslike_c: number;
        feelslike_f: number;
        windchill_c: number;
        windchill_f: number;
        heatindex_c: number;
        heatindex_f: number;
        dewpoint_c: number;
        dewpoint_f: number;
        vis_km: number;
        vis_miles: number;
        uv: number;
        gust_mph: number;
        gust_kph: number;
    };
}
function Home() {


    

    const [location, setLocation] = useState< string | null>(null);
    const [bgSelected, setBgSelected] = useState<number>(1);
    const [data, setData] = useState<IWeather | null>(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            console.error('Geolocation is not supported by this browser.');
            return;
        }

        const fetchLocation = () => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation(latitude + ',' + longitude);
                 
                },
                (err) => {
                    console.error(`Error: ${err.message}`);
                    setLocation(null);
                }
            );
        };

        fetchLocation();
    }, []);

    const fetchWeather = async (query: string) => {
        const url = `${import.meta.env.VITE_API_URL}current.json`;
        const apiKey = import.meta.env.VITE_API_KEY;

        try {
            const response = await request({
                url: `${url}?q=${query}&key=${apiKey}`,
                method: 'GET',
            });

            if (response) {
                const weatherData: IWeather = response as IWeather;
                setData(weatherData);
            }
            console.log('Weather data:', response);
        } catch (error) {
            console.error('Error fetching weather:', error);
        }
    };

    useEffect(() => {
        if (location) {
            fetchWeather(location);
        }
    }, [location]);

    useEffect(() => {
        const updateBackground = () => {
            const now = new Date();
            const hours = now.getHours();

            if (data) {
                const mainWeather = data.current.condition.text.toLowerCase();

                if (mainWeather === 'rain' || mainWeather === 'drizzle' || mainWeather === 'thunderstorm') {
                    setBgSelected(4); // Rainy background
                } else if (hours >= 17 || hours < 6) {
                    setBgSelected(2); // Night
                } else if (hours >= 6 && hours < 7) {
                    setBgSelected(3); // Sunrise
                } else {
                    setBgSelected(1); // Noon
                }
            }
        };

        updateBackground();
    }, [data]);

    const backgroundImage = () => {
        switch (bgSelected) {
            case 1:
                return noon;
            case 2:
                return night;
            case 3:
                return sunrise;
            case 4:
                return rain;
            default:
                return noon;
        }
    };

    function getFormattedDate() {
        const now = new Date();
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const dayName = daysOfWeek[now.getDay()];
        const dayOfMonth = now.getDate();
        const monthName = monthsOfYear[now.getMonth()];
        const year = now.getFullYear();
        return `${dayName} | ${dayOfMonth} ${monthName} ${year}`;
    }



    const temperatureInCelsius = data ? data.current.feelslike_c : null;

    return (
        <div
            style={{ backgroundImage: `url(${backgroundImage()})` }}
            className="h-screen w-full bg-cover bg-center "
        >
            <div className="overlay absolute inset-0  bg-black opacity-30 "></div>
            <div className="flex justify-center items-center h-full flex-col mx-80">
                <div className="w-full bg-white bg-opacity-30 border border-white border-opacity-20 p-8 rounded-3xl backdrop-blur-md bg-cover">
                    <Current locationLogo={locationLogo} data={data} temperatureInCelsius={temperatureInCelsius} getFormattedDate={getFormattedDate} />
                </div>

                <div className="flex items-center w-full mt-5 gap-6">
                    <div className="w-20 h-96 bg-white bg-opacity-30 border border-white border-opacity-20 p-8 rounded-2xl backdrop-blur-md"></div>
                    <div className="flex flex-col  w-[85%] gap-5">
                        <div className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 p-8 rounded-2xl backdrop-blur-md"></div>
                        <div className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 p-8 rounded-2xl backdrop-blur-md"></div>
                    </div>
                    <div className="w-80 h-96 bg-white bg-opacity-10 border border-white border-opacity-20 p-8 rounded-2xl backdrop-blur-md"></div>
                </div>
            </div>
        </div>
    );
}

export default Home;
