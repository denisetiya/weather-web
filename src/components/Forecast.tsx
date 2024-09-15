

import { useEffect, useState } from 'react';
import { IForecastData ,Hour} from '../utils/Interface';
import { useAppContext } from '../utils/context';
import request from '../utils/getData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Forecast = () => {
   const { lat, lon } = useAppContext();
   const [data, setData] = useState<IForecastData | null>(null);
   const [numDataPoints, setNumDataPoints] = useState<number>(10);

   useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth < 786) {
            setNumDataPoints(4);
        } else {
            setNumDataPoints(10);
        }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call initially to set the correct number of data points

    return () => {
        window.removeEventListener('resize', handleResize);
    };
}, [])

   useEffect(() => {
       const fetchWeather = async () => {
           const url = `${import.meta.env.VITE_API_URL}forecast.json`;
           const apiKey = import.meta.env.VITE_API_KEY;
           try {
               const response = await request({
                   url: `${url}?key=${apiKey}&q=${lat},${lon}`,
                   method: 'GET',
               });
               if (response) {
                   const forecastData: IForecastData = response as IForecastData;
                   setData(forecastData);
               }
           } catch (error) {
               console.error('Error fetching weather:', error);
           }
       };

       fetchWeather();
   }, [lat, lon]);

   const getCurrentHourIndex = (hours: Hour[]) => {
       const currentTime = new Date();
       const currentHour = currentTime.getHours();
       return hours.findIndex(hour => new Date(hour.time).getHours() === currentHour);
   };

   return (
       <div className='flex gap-1'>
           {data ? 
               (() => {
                   const hours = data.forecast.forecastday[0].hour;
                   const currentHourIndex = getCurrentHourIndex(hours);
                   const startIndex = Math.max(currentHourIndex - 1, 0);
                   const endIndex = Math.min(currentHourIndex + numDataPoints, hours.length - 1);
                   const displayHours = hours.slice(startIndex, endIndex + 1);

                   const chartData = displayHours.map(hour => ({
                       time: hour.time.split(' ')[1],
                       temperature: hour.temp_c,
                       humidity: hour.humidity,
                       windSpeed: hour.wind_kph,
                       icon: hour.condition.icon, 
                   }));

                   return (
                       <div>
                        <div className='flex justify-center'>
                           <ResponsiveContainer width="100%" height={300}>
                               <LineChart data={chartData} >
                                   <CartesianGrid strokeDasharray="3 3" stroke='#adadad'/>
                                   <XAxis dataKey="time" stroke='#FFFFFF'/>
                                   <YAxis stroke='#FFFFFF' />
                                   <Tooltip />
                                   <Legend />
                                   <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
                                   <Line type="monotone" dataKey="humidity" stroke="#82ca9d" />
                                   <Line type="monotone" dataKey="windSpeed" stroke="#ffc658" />
                               </LineChart>
                           </ResponsiveContainer>
                        </div>
                           <div className="weather-icons flex gap-2 justify-center items-center ">
                               {chartData.map((hour, index) => (
                                   <div key={index} className="weather-icon">
                                       <img src={hour.icon} alt="weather icon" />
                                       <p className='text-white'>{hour.time}</p>
                                   </div>
                               ))}
                           </div>
                       </div>
                   );
               })() :
               <p>Loading...</p>
           }
       </div>
   );
};

export default Forecast;