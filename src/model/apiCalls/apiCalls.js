/* eslint-disable no-useless-catch */
import axios from 'axios';
import envConfig from '../../env/env.json';

export const fetchNews = async ({ count }) => {
  try {
    const response = await axios.get(`${envConfig.NODE_SERVER_URL}/fetchNews`, {
      params: { count },
    });
    // console.error('Success fetching news:', response.data);
    return response.data;
    // Assuming the response data is the desired data
  } catch (error) {
    // console.error('Error fetching news:', error);
    throw error; // Rethrowing the error or handling it as needed
  }
};
