// import axios from "axios";
// const token=localStorage.getItem("access_token")
// console.log("your stored access token is",token)


//   const BaseApi = axios.create({
//   baseURL: "http://192.168.1.69:8000",
//   headers: {
//     "Content-Type": "application/json",
//     "access-token": token,
//   },
// });

// export default BaseApi;
import axios from 'axios';

// Create an Axios instance
const BaseApi = axios.create({
  baseURL: "http://10.21.34.197:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to update the token dynamically
BaseApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers['access-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default BaseApi;
