import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

interface IDataProps {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'; 
    data?: object;
    header?: Record<string, string>; 
}

const request = async ({ url, method, data, header }: IDataProps): Promise<unknown> => {
    const config: AxiosRequestConfig = {
        method,
        url,
        data,
        headers: header
    };

    try {
        const response: AxiosResponse = await axios(config);
        return response.data;
    } catch (error) {
        console.error('Error in request:', error);
        throw error;
    }
};

export default request;
