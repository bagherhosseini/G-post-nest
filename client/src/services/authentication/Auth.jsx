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

const client = {
  baseURL: API_URL,
  withCredentials: true,
};

export const authApiService = {

  googleAuth: async (userInfo) => {
    const response = await fetch(`${client.baseURL}/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userInfo }),
      credentials: "include",
    }).then((response) => response);
    
    // client.defaults.headers = {
    //   Authorization: `Bearer ${response.accessToken}`,
    // };
    
    return response;
  },

  signUp: async (userName, userEmail, password) => {
    const response = await fetch(`${client.baseURL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName, userEmail, password }),
      credentials: "include",
    }).then((response) => response);
    
    // client.defaults.headers = {
    //   Authorization: `Bearer ${response.accessToken}`,
    // };
    
    return response;
  },

  signIn: async (email, password) => {
    const response = await fetch(`${client.baseURL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    }).then((response) => response);
    
    // client.defaults.headers = {
    //   Authorization: `Bearer ${response.accessToken}`,
    // };
    
    return response;
  },
  
  signOut: () => {
    client.defaults.headers = {
      Authorization: undefined,
    };
  },
  
  verifyEmail: async (linkToken) => {
    const response = await fetch(`${client.baseURL}/auth/verifyEmail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ linkToken }),
      credentials: "include",
    }).then((response) => response);
    
    return response;
  },

  sendMessage: async (data) => {
    const response = await fetch(`${client.baseURL}/chat/send`, {
      method: "POST",
      // headers: {
      //   'Content-Type': 'multipart/form-data',
      // },
      body: data,
      credentials: "include",
    }).then((response) => response);
    
    return response;
  },

  generateToken: async (userId) => {
    const response = await fetch(`${client.baseURL}/chat/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
      credentials: "include",
    }).then((response) => response);
    
    return response;
  },
};
