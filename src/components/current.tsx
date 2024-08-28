import { useEffect, useState } from 'react';
import request from '../components/getData';
import { IWeather } from '../pages/home';


interface CurrentProps {
    locationLogo: string;
    data: IWeather | null;
    temperatureInCelsius: number | null;
    getFormattedDate: () => string;
}

const Current: React.FC<CurrentProps> = ({ locationLogo, data, temperatureInCelsius, getFormattedDate }) => {
    const [current, setCurrent] = useState<IWeather | null>(data);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (data) {
            setCurrent(data);
        }
    }, [data]);

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
                setSearchQuery(query); // Update the search query
            }

            console.log('Weather data:', response);
        } catch (error) {
            setError('Error fetching weather data. Please try again.');
            console.error('Error fetching weather data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="text-white">
            <div className="flex justify-between items-center mb-4">

                <div className='flex items-center gap-2'>
                    
                    <img src={locationLogo} alt="Location logo" width={30} height={30} />
                    <p className="text-3xl font-bold">
                        {loading ? 'Loading...' : current?.location?.name || 'City not found'}
                    </p>
                </div>
                <div >
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') searchHandler(searchQuery);
                        }}
                        className="text-xl bg-transparent border-b border-white focus:outline-none  placeholder-gray-300 transition-colors duration-300"
                        placeholder="Search City..."
                    />
                </div>

            </div>
            {error && <p className="text-red-400 text-center mb-4">{error}</p>}
            <hr className="border-white mb-4" />
            <div className="text-5xl font-bold flex justify-between items-center">
                <div>
                    <p className="text-xl">{current ? current.current.condition.text : 'Loading...'}</p>
                    {/* <p className="text-lg mx-5">{current ? current.we0].description : 'Loading...'}</p> */}
                </div>
                <div className="flex flex-col items-center">
                    <div className="flex items-center">
                        <p className="text-4xl font-bold">
                            {temperatureInCelsius !== null ? temperatureInCelsius.toFixed(1) : 'Loading...'}&deg;C
                        </p>
                        <a href="https://www.weatherapi.com/" title="Free Weather API">
                            <img src={current?.current.condition.icon} alt="Weather data by WeatherAPI.com" />
                        </a>

                    </div>
                    <p className="text-sm mt-2">{getFormattedDate()}</p>
                </div>
            </div>
        </div>
    );
}

export default Current;
