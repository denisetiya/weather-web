import request from "../components/getData";
import { useState, useEffect } from "react";
import noon from "../assets/clear.jpg";
import rain from "../assets/rain.jpeg";
import night from "../assets/night.jpg";
import sunrise from "../assets/sunrise.jpg";
import overcast from "../assets/overcast.jpg";
import Current from "../components/current";
import snow from "../assets/snow.jpg";
import snow2 from "../assets/snow2.jpg";
import fog from "../assets/fog.jpg";
import cloud from "../assets/cloud.jpg";
import thunder from "../assets/thunder.jpg";
import { useAppContext } from '../utils/context'; 
import MapData from "../components/mapData";

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



    const {code, setCode, day, setDay} = useAppContext();
    const [location, setLocation] = useState<string | null>(null);
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
                setCode(weatherData.current.condition.code);
                setDay(weatherData.current.is_day);
                
            }
        } catch (error) {
            console.error('Error fetching weather:', error);
        }
    };

    useEffect(() => {
        if (location) {
            fetchWeather(location);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    useEffect(() => {
        const updateBackground = () => {

            if (data) {

                if (code === 1009 || code === 1063 || code === 1072) {
                    setBgSelected(5); // overcast background
                } else if (code === 1066 || code === 1069) {
                    setBgSelected(6); // snow background
                } else if (code === 1114 || code === 1117 || code === 1198 || code === 1204 || code === 1207 ||
                    code === 1066 || // Patchy snow possible
                    code === 1069 || // Patchy sleet possible
                    code === 1072 || // Patchy freezing drizzle possible
                    code === 1168 || // Freezing drizzle
                    code === 1171 || // Heavy freezing drizzle
                    code === 1210 || // Patchy light snow
                    code === 1213 || // Light snow
                    code === 1216 || // Patchy moderate snow
                    code === 1219 || // Moderate snow
                    code === 1222 || // Patchy heavy snow
                    code === 1225 || // Heavy snow
                    code === 1237 || // Ice pellets
                    code === 1255 || // Light snow showers
                    code === 1258 || // Moderate or heavy snow showers
                    code === 1261 || // Light showers of ice pellets
                    code === 1264    // Moderate or heavy showers of ice pellets
                ) {
                    setBgSelected(7);
                } else if (code === 1030 || code === 1135 ||
                    code === 1147 // Freezing fog
                ) {
                    setBgSelected(8); // fog background
                } else if (code === 1087 || // Thundery outbreaks possible
                    code === 1273 || // Patchy light rain with thunder
                    code === 1276 || // Moderate or heavy rain with thunder
                    code === 1279 || // Patchy light snow with thunder
                    code === 1282    // Moderate or heavy snow with thunder
                   ) {
               setBgSelected(10); // thunder background
                } else if (code === 1180 || // Patchy light rain
                    code === 1183 || // Light rain
                    code === 1186 || // Moderate rain at times
                    code === 1189 || // Moderate rain
                    code === 1192 || // Heavy rain at times
                    code === 1195 || // Heavy rain
                    code === 1240 || // Light rain shower
                    code === 1243 || // Moderate or heavy rain shower
                    code === 1246    // Torrential rain shower
                   ) {
               setBgSelected(4); // rain background 
           } else if (day === 0 && (code === 1000 || code == 1003 || code == 1006)) {
               setBgSelected(2); // clear background
           } else if (day === 1 && (code === 1000 || code == 1003 || code == 1006)) {
               setBgSelected(1); // clear background
           }
           
           


            }
        };
  
        updateBackground();
    }, [data, code, day]);

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
            case 5:
                return overcast;
            case 6:
                return snow;
            case 7:
                return snow2;
            case 8:
                return fog;
            case 9:
                return cloud;
            case 10:
                return thunder;
            default:
                return sunrise;

        }
    };






    return (
        <div
            style={{ backgroundImage: `url(${backgroundImage()})` }}
            className="h-screen w-full bg-cover bg-center transition-all duration-700"
        >
            <div className="overlay absolute inset-0  bg-black opacity-30 "></div>
            <div className="flex justify-center items-center h-full flex-col mx-80">
                <div className="w-full bg-white bg-opacity-30 border border-white border-opacity-20 p-8 rounded-3xl backdrop-blur-md bg-cover">
                    <Current data={data} />
                </div>

                <div className="flex items-center w-full mt-5 gap-6">
                    <div className="w-20 h-96 bg-white bg-opacity-30 border border-white border-opacity-20 p-8 rounded-2xl backdrop-blur-md"></div>
                    <div className="flex flex-col  w-[85%] gap-5">
                        <div className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 p-8 rounded-2xl backdrop-blur-md">
                        </div>
                        <div className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 p-8 rounded-2xl backdrop-blur-md"></div>
                    </div>
                    <div className="w-80 h-96 bg-white bg-opacity-10 border border-white border-opacity-20  rounded-3xl backdrop-blur-md">
                        <MapData lon={data ? data?.location.lon : 0} lat={data ? data?.location.lat : 0}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
