import axios from 'axios';
import { API_BASE } from "@env";

export const fetchJobRoles = async () => {
    try {
        const { data } = await axios.get(`${API_BASE}/job-roles`);
        // console.log('fetchJobRoles data', data);
        return data;
    } catch (ex) {
        console.log('fetchJobRoles ex', JSON.stringify(ex));
    }
}

export const fetchPreviousExperiences = async () => {
    try {
        const { data } = await axios.get(`${API_BASE}/experiences`);
        // console.log('fetchPreviousExperiences data', data);
        return data;
    } catch (ex) {
        console.log('fetchPreviousExperiences ex', JSON.stringify(ex));
    }
}

export const fetchPreferredHours = async () => {
    try {
        const { data } = await axios.get(`${API_BASE}/preferred-hours`);
        // console.log('fetchPreferredHours data', data);
        return data;
    } catch (ex) {
        console.log('fetchPreferredHours ex', JSON.stringify(ex));
    }
}



