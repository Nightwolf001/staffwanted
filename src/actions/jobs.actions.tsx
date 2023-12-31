import axios from 'axios';
import { API_BASE } from "@env";
import axiosInstance from '../services/interceptor.service';

export const fetchAllJobs = async (filters : any) => {
    try {
        console.log('fetchAllJobs filters', filters);
        const { data } = await axiosInstance.get(`${API_BASE}/jobs/filterd/${filters.id}?search=${filters.search}&job_roles=${filters.job_roles}&experience=${filters.experience}&preferred_hours=${filters.preferred_hours}&salary=${filters.salary}&lat=${filters.coord.lat}&lng=${filters.coord.lng}&distance=${filters.distance}&metric=${filters.metric}`);
        console.log('fetchAllJobs data', data);
        return data;
    } catch (ex) {
        console.log('fetchAllJobs ex', JSON.stringify(ex));
    }
}

export const fetchJobRoles = async () => {
    try {
        const { data } = await axios.get(`${API_BASE}/job-roles`);
        return data;
    } catch (ex) {
        console.log('fetchJobRoles ex', JSON.stringify(ex));
    }
}

export const fetchPreviousExperiences = async () => {
    try {
        const { data } = await axios.get(`${API_BASE}/experiences`);
        return data;
    } catch (ex) {
        console.log('fetchPreviousExperiences ex', JSON.stringify(ex));
    }
}

export const fetchPreferredHours = async () => {
    try {
        const { data } = await axios.get(`${API_BASE}/preferred-hours`);
        return data;
    } catch (ex) {
        console.log('fetchPreferredHours ex', JSON.stringify(ex));
    }
}

export const handleJobBookmark = async (user_id: number, job_id: number, bookmarked: boolean) => {
    try {
        
        const { data } = await axiosInstance.post(
            `${API_BASE}/employee-job-match/upsert`, {
                user_id: user_id,
                job_id: job_id,
                bookmarked: bookmarked
        }, {
            headers: { 'Content-Type': 'application/json' }
        }
        );
        
        return data;
    } catch (ex) {
        console.log('fetchJobRoles ex', JSON.stringify(ex));
    }
}

export const handleJobApplication = async (user_id: number, job_id: number, applied: boolean, application_status: string) => {
    try {

        const { data } = await axiosInstance.post(
            `${API_BASE}/employee-job-match/upsert`, 
            {
                user_id: user_id,
                job_id: job_id,
                applied: applied,
                application_status: application_status
            }
        );

        return data;
    } catch (ex) {
        console.log('handleJobApplication ex', JSON.stringify(ex));
    }
}

export const fetchJobMatches = async (id: number) => {
    try {
        const { data } = await axiosInstance.get(`${API_BASE}/employee-job-matches/${id}`);
        return data;
    } catch (ex) {
        console.log('fetchJobRoles ex', JSON.stringify(ex));
    }
}

export const fetchJobStatus = async (user_id: number, job_id : number) => {
    try {
        const { data } = await axiosInstance.get(`${API_BASE}/employee-job-matches/application-status/${job_id}/${user_id}`);
        console.log('fetchJobStatus data', data);
        return data;
    } catch (ex) {
        console.log('fetchJobRoles ex', JSON.stringify(ex));
    }
}




