import axios from 'axios';
import { API_BASE } from "@env";
// /api/job - roles

export const fetchJobRoles = async () => {
    try {
        const { data } = await axios.get(`${API_BASE}/job-roles`);
        console.log('fetchJobRoles data', data);
        return data;
    } catch (ex) {
        console.log('createAccount ex', JSON.stringify(ex));
    }
}



