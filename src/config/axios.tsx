import axios from "axios";

const axiosReq = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`
})

export default axiosReq

