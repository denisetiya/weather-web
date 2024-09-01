import { useEffect, useState } from 'react';
import request from '../components/getData';
import { IWeather } from '../pages/home';
import { MapPin, ThermometerSimple, DropHalfBottom, Wind, ThermometerCold, ThermometerHot } from '@phosphor-icons/react';
import { useAppContext } from '../utils/context';
import { format, parse } from 'date-fns';

interface CurrentProps {
    data: IWeather | null;
}

const Current: React.FC<CurrentProps> = ({ data}) => {
    const {setCode,setDay} = useAppContext();
    const [current, setCurrent] = useState<IWeather | null>(data);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentTemp, setCurrentTemp] = useState<number | null>(null);
    const [timeNow, setTimeNow] = useState<string | null>(null);

    useEffect(() => {
        if (data) {
            setCurrent(data);
            setCurrentTemp(data.current.feelslike_c);
            setTimeNow(data.location.localtime);
        }
    }, [data]);


    const thermologoHandler = () => {
        if (currentTemp) {
            if (currentTemp < 10) {
                return <ThermometerCold size={37} fill='#0ab6ff' accentHeight={currentTemp}/>;
            } else if (currentTemp >= 10 && currentTemp < 30) {
                return <ThermometerSimple size={37} accentHeight={currentTemp}/>;
            } else if (currentTemp >= 30) {
                return <ThermometerHot size={37} fill='#eb5f02' accentHeight={currentTemp}/>;
            } else {
                return <ThermometerSimple size={37} />;
            }
        }
    };

    const searchHandler = async (query: string) => {
        if (!query.trim()) return; // Prevent search with empty query

        setLoading(true);
        setError(null);

        const url = `${import.meta.env.VITE_API_URL}current.json`;
        const apiKey = import.meta.env.VITE_API_KEY;

        try {
            const response = await request({
                url: `${url}?q=${query}&key=${apiKey}`,
                method: 'GET',
            });

            if (response) {
                const weatherData: IWeather = response as IWeather;
                setCurrent(weatherData);
                setCurrentTemp(weatherData.current.feelslike_c);
                setSearchQuery(query); // Update the search query
                setCode(weatherData.current.condition.code);
                setDay(weatherData.current.is_day);
                setTimeNow(weatherData.location.localtime);
            }

        } catch (error) {
            setError('Error fetching weather data. Please try again.');
            console.error('Error fetching weather data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatedTime = () => {
        if (timeNow) {
            const date = parse(timeNow, 'yyyy-MM-dd HH:mm', new Date());
            const formattedDate = format(date, "EEEE | dd MMMM yyyy");
            const formattedTime = format(date, "HH:mm");
            
            // Gabungkan dengan newline manual
            return (<div className='flex flex-col'>
                <div>
                    {formattedDate}
                </div>
                <div>
                    {formattedTime} {current?.location?.tz_id}
                </div>
            </div>)
        }
    };

    return (
        <div className="text-white">
            <div className="flex justify-between items-center mb-4">

                <div className='flex items-center gap-2'>

                    <MapPin size={37} />
                    <div className='flex flex-col'>
                        <p className="text-xl font-bold">
                            {loading ? 'Loading...' : current?.location?.name || 'City not found'}
                        </p>
                        <p className="text-md font-bold">
                            {loading ? 'Loading...' : current?.location?.region || 'City not found'} - {loading ? 'Loading...' : current?.location?.country || 'Country not found'}
                        </p>
                    </div>
                </div>
                <div >
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') searchHandler(searchQuery);
                        }}
                        className="text-xl bg-transparent border-b border-white focus:outline-none  placeholder:text-white transition-colors duration-300"
                        placeholder="Search City... "
                    />
                </div>

            </div>
            {error && <p className=" text-center mb-4">Sorry we can't find the city you're looking for {searchQuery}</p>}
            <hr className="border-white mb-4" />
            <div className="text-5xl font-bold flex justify-between items-center">
                <div>
                    <p className="text-3xl">{current ? current.current.condition.text : 'Loading...'}</p>
                    <div className='flex gap-3'>
                        <p className="flex gap-1 items-center">
                            <DropHalfBottom size={15} />
                            <div className='text-sm'>
                                {current ? current.current.humidity : 'Loading...'}%
                            </div>
                        </p>
                        <div className='flex gap-1 items-center'>
                            <Wind size={15} />
                            <p className='text-sm'>{current ? current.current.wind_mph : 'Loading...'} m/h</p>
                        </div>

                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="flex items-center">
                        <p className="text-4xl font-bold flex gap-1">

                            {thermologoHandler()}
                            {current ? current.current.feelslike_c : 'Loading...'}&deg;C
                        </p>
                        <a href="https://www.weatherapi.com/">
                            <img src={current?.current.condition.icon} />
                        </a>

                    </div>
                    <p className="text-sm mt-2">{formatedTime()}</p>
                </div>
            </div>
        </div>
    );
}

export default Current;
