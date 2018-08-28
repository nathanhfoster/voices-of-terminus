import axios from 'axios'
const ROOT_URL = "http://localhost:3000/"

export function createUser(values) {
    const request = axios.post('${ROOT_URL}/api/create_user/', values);
    console.log("CREATE USER");
    return {
        //type: create_user,
       // payload: request
    }
}