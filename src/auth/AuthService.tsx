import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    console.log(res)
    return res;
  },
  async (err) => {

    const originalConfig = err.config;

    if (err.response) {
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
            const rs = await axios.post("http://localhost:8080/api/oauth2/token?grant_type=refresh_token&refresh_token=" + localStorage.getItem("refreshToken"), '', {headers: {'Authorization': 'Basic aG9kbC1jbGllbnQ6c2VjcmV0'}});
            
            localStorage.setItem("accessToken", rs.data.access_token);
            localStorage.setItem("refreshToken", rs.data.refresh_token);

            return await instance(originalConfig);
            } catch (_error) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");

            return Promise.reject(_error);
        }
      }
      
      if (err.response.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    }

    return Promise.reject(err);
  }
);

export default instance;