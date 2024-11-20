import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.timeout = 10000;

export default axios;
