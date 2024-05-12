import axios from 'axios';
import Cookies from 'js-cookie';

export const API_URL = process.env.REACT_APP_API_URL;

const axiosClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

axiosClient.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get("authToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function redirectToLogin() {
  Cookies.remove('authToken');
  window.location.href = '/';
}

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
      throw error;
    }
  },

  signUp: async (name, userName, email, password) => {
    const response = await axiosClient
      .post("/auth/signUp", { name, userName, email, password })
      .then((response) => {
        return response;
      });
    axiosClient.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${response.data.access_token}`;
    return response;
  },

  signIn: async (email, password) => {
    const response = await axiosClient
      .post("/auth/signIn", { email, password })
      .then((response) => {
        return response;
      });
    axiosClient.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${response.data.access_token}`;
    return response;
  },

  signOut: () => {
    redirectToLogin();
    axiosClient.defaults.headers = {
      Authorization: undefined,
    };
  },

  verifyEmail: async (linkToken) => {
    try {
      const response = await axiosClient.post('/auth/verifyEmail', { linkToken });
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export const apiService = {
  getMyFriends: async () => {
    try {
      const response = await axiosClient
        .get("/friends")
        .then((response) => {
          return response;
        });
      return response;
    } catch (error) {
      if (error.response.status === 401) {
        redirectToLogin();
      }
      throw error;
    }
  },

  getMyInfo: async () => {
    try {
      const response = await axiosClient.get('/user/myInfo');
      return response;
    } catch (error) {
      if (error.response.status === 401) {
        redirectToLogin();
      }
      throw error;
    }
  },

  getUserInfo: async (id) => {
    try {
      const response = await axiosClient.post('/user/userInfo', { id });
      return response;
    } catch (error) {
      if (error.response.status === 401) {
        redirectToLogin();
      }
      throw error;
    }
  },

  getMessages: async (friendId) => {
    try {
      const response = await axiosClient.post('/chat/messages', { friendId });
      return response;
    } catch (error) {
      if (error.response.status === 401) {
        redirectToLogin();
      }
      throw error;
    }
  },

  sendFile: async (data) => {
    try {
      const response = await axiosClient.post('/chat/file', data);
      return response;
    } catch (error) {
      if (error.response.status === 401) {
        redirectToLogin();
      }
      throw error;
    }
  },

  sendMessage: async (receiverId, messageText, messageType) => {
    try {
      const response = await axiosClient.post('/chat/message', { receiverId, messageText, messageType });
      return response;
    } catch (error) {
      if (error.response.status === 401) {
        redirectToLogin();
      }
      throw error;
    }
  },

  generateToken: async (userId) => {
    try {
      const response = await axiosClient.post('/chat/token', { userId });
      return response;
    } catch (error) {
      if (error.response.status === 401) {
        redirectToLogin();
      }
      throw error;
    }
  },

  addFriend: async (friendUserName) => {
    try {
      const response = await axiosClient.post('/friends/add', { friendUserName });
      return response;
    } catch (error) {
      if (error.response.status === 401) {
        redirectToLogin();
      }
      throw error;
    }
  },

  removeFriend: async (friendId) => {
    try {
      const response = await axiosClient.delete('/friends/remove', { data: { id: friendId } });
      return response;
    } catch (error) {
      if (error.response.status === 401) {
        redirectToLogin();
      }
      throw error;
    }
  },

  friendRequests: async (friendId) => {
    try {
      const response = await axiosClient.get('/friends/requests');
      return response;
    } catch (error) {
      if (error.response.status === 401) {
        redirectToLogin();
      }
      throw error;
    }
  },

  acceptFriend: async (reqId) => {
    try {
      const response = await axiosClient.patch('/friends/accept', { reqId });
      return response;
    } catch (error) {
      if (error.response.status === 401) {
        redirectToLogin();
      }
      throw error;
    }
  },
};
