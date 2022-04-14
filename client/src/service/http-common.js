import axios from 'axios'

const http = axios.create({

    // baseURL: localStorage.getItem("adminURL"),
    baseURL: 'http://localhost:3000/',
    headers: {
        'Content-type': 'application/json',
    }
});
export default http
