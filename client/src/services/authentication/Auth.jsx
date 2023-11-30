import axios from 'axios';

// export default function googleAuth(userInfo) {
//     return fetch('http://localhost:5050/auth/google', {
//         method: 'POST',
//         body: JSON.stringify({ userInfo }),
//         credentials: "include",
//         headers: {
//         'Content-Type': 'application/json'
//         }
//     });
// }

export const API_URL = process.env.REACT_APP_API_URL;

const axiosClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const authApiService = {
  googleAuth: async (userInfo) => {
    try {
      const response = await axiosClient.post('/auth/google', { userInfo });
      const data = response.data;
      axiosClient.defaults.headers = {
        Authorization: `Bearer ${data.access_token}`,
      };
      return response;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },

  signUp: async (name, email, password) => {
    try {
      const response = await axiosClient.post('/auth/signUp', { name, email, password });
      console.log(response);
      const data = response.data;
      axiosClient.defaults.headers = {
        Authorization: `Bearer ${data.access_token}`,
      };
      return response;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },

  signIn: async (email, password) => {
    try {
      const response = await axiosClient.post('/auth/signIn', { email, password });
      const data = response.data;
      axiosClient.defaults.headers = {
        Authorization: `Bearer ${data.access_token}`,
      };

      console.log(data.access_token);
      return response;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },

  signOut: () => {
    axiosClient.defaults.headers = {
      Authorization: undefined,
    };
  },

  verifyEmail: async (linkToken) => {
    try {
      const response = await axiosClient.post('/auth/verifyEmail', { linkToken });
      return response;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },

  sendMessage: async (data) => {
    try {
      const response = await axiosClient.post('/chat/send', data);
      return response;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },

  generateToken: async (userId) => {
    try {
      const response = await axiosClient.post('/chat/token', { userId });
      return response;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },
};
