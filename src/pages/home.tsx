/* eslint-disable react-hooks/exhaustive-deps */
import request from "../components/getData";
import { useState, useEffect } from "react"
import locationLogo from "../assets/location.png"
import noon from "../assets/clear.jpg"
import night from "../assets/night.jpg"
import sunrise from "../assets/sunrise.jpg"


function Home() {

    interface IWeather {
        name: string;
        weather: [{
            main: string;
            description: string;
            icon: string;
        }]
        main: {
            feels_like: number,
        }
        


    }

    const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
    const [bgSelected, setBgSelected] = useState(1);
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
                    setLocation({ lat: latitude, lon: longitude });


                },
                (err) => {
                    console.error(`Error: ${err.message}`);
                    setLocation(null);

                }
            );
        };

        fetchLocation();
    }, []);

    const fetchWeather = async (lat: number, lon: number) => {
        const url = `${import.meta.env.VITE_API_URL}/weather`;
        const apiKey = import.meta.env.VITE_API_KEY;

        try {
            const response = await request({
                url: `${url}?lat=${lat}&lon=${lon}&appid=${apiKey}`,
                method: 'GET',
            });

            if (response) {
                const weatherData: IWeather = response as IWeather;
                setData(weatherData);
            }
        } catch (error) {
            console.error('Error fetching weather:', error);
        }
    };

    useEffect(() => {
        if (location) {
            fetchWeather(location.lat, location.lon);
        }
    }, [location]);

    useEffect(() => {
        const updateBackground = () => {
            const now = new Date();
            const hours = now.getHours();


            if (hours >= 17 && hours < 18) {
                // Between 17:00 and 18:00
                setBgSelected(3);
            } else if (hours >= 6 && hours < 7) {
                // Between 06:00 and 07:00 
                setBgSelected(3); // Sunrise
            } else if (hours >= 18 || hours < 6) {
                // From 18:00 to 05:59
                setBgSelected(2); // Night
            } else {
                // From 07:00 to 16:59
                setBgSelected(1); // Noon
            }
        };

        updateBackground();
    }, []);

    const backgroundImage = () => {
        switch (bgSelected) {
            case 1:
                return noon;
            case 2:
                return night;
            case 3:
                return sunrise;
            default:
                return noon;
        }
    };

    
    function getFormattedDate() {
        const now = new Date();
    
        // Array untuk nama hari
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
        // Array untuk nama bulan
        const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
        // Mendapatkan hari dalam seminggu
        const dayName = daysOfWeek[now.getDay()];
    
        // Mendapatkan tanggal
        const dayOfMonth = now.getDate();
    
        // Mendapatkan bulan
        const monthName = monthsOfYear[now.getMonth()];
    
        // Mendapatkan tahun
        const year = now.getFullYear();
    
        return `${dayName} | ${dayOfMonth} ${monthName} ${year}`;
    }


    const kelvinToCelsius = (kelvin: number): number => {
        return kelvin - 273.15;
    };

    const temperatureInCelsius = data ? kelvinToCelsius(data.main.feels_like) : null;


    return (
        <div
            className="h-screen w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage()})` }}
        >
            <div className="flex justify-center items-center h-full flex-col mx-40">
                <div className="w-full bg-black bg-opacity-30 border border-white border-opacity-20 p-8 rounded-2xl backdrop-blur-md ">
                    <div className="flex gap-3">
                        <img src={locationLogo} alt="" className="" width={30} height={30} />
                        <p className="text-3xl text-white font-bold">{data ? data.name : 'Loading...'} </p>
                    </div>
                        <hr className="text-white w-full mt-3"/>
                    <div className="mt-10 text-5xl text-white font-bold flex justify-between">
                        <div>
                            <p>
                                {data ? data.weather[0].main : 'Loading...'}
                            </p>
                            <p className="text-lg mx-5">
                                {data ? data.weather[0].description : 'Loading...'}
                            </p>
                        </div>

                        <div className="">

                            <div className="flex items-center">
                                <p>
                                    {data ? temperatureInCelsius : 'Loading...'}&deg;C
                                </p>
                                <img src={`https://openweathermap.org/img/wn/${data?.weather[0].icon}.png`} alt="Weather icon" width={100} height={100} />
                            </div>

                            <div className="text-sm">
                                {getFormattedDate()}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center w-full mt-5 gap-6">

                    <div className="w-20 h-96 bg-white bg-opacity-10 border border-white border-opacity-20 p-8 rounded-2xl backdrop-blur-md ">

                    </div>

                    <div className="flex flex-col items-center w-[85%] gap-5">
                        <div className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 p-8 rounded-2xl backdrop-blur-md ">

                        </div>

                        <div className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 p-8 rounded-2xl backdrop-blur-md ">

                        </div>
                    </div>

                    <div className="w-80 h-96 bg-white bg-opacity-10 border border-white border-opacity-20 p-8 rounded-2xl backdrop-blur-md" >

                    </div>

                </div>
            </div>
        </div>
    )
}

export default Home
