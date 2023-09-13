import axios from 'axios';
import moment from 'moment';

import { Coord, User } from '../types';
import {API_BASE} from "@env";

export const createAccount = async (coord: Coord, email: string, password: string) => {
    console.log('createAccount', coord, email);
    try {

        const {data} = await axios.post(
            `${API_BASE}/employees/signup`, 
            {
                email: email,
                password: password,
                coord: coord
            },
            {
                headers: { 'Content-Type': 'application/json' }
            }
            
        );
        
        console.log('createAccount response', data);
        return data;

    } catch (ex) {
        console.log('createAccount ex', JSON.stringify(ex));
    }
}

export const createProfile = async (user: User) => {
    console.log('createProfile', user);
    try {

        const { data } = await axios.put(
            `${API_BASE}/employees/${user.id}`, {
                data: {
                id: user.id,
                first_name : user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone_number: user.phone_number,
                location : user.location,
                previous_experience: user.previous_experience,
                preferred_hours: user.preferred_hours,
                start_date: user.start_date ? user.start_date : null,
                end_date: user.end_date ? user.end_date : null,
                hide_profile: user.hide_profile,
                work_description: user.work_description,
                date_of_birth: user.date_of_birth ? user.date_of_birth : null,
                account_complete: user.account_complete,
                coord: user.coord,
                gender: user.gender,
                job_roles: user.job_roles,
                video_id : user.video_id ? user.video_id : null,
                avatar_id : user.avatar_id ? user.avatar_id : null
            }
            }, {
            headers: { 'Content-Type': 'application/json' }
        }
        );

        console.log('createProfile response', data);
        return data;

    } catch (ex) {
        console.log('createProfile ex', ex);
    }
}

export const uploadFile = async (name : string, type: string, uri : string) => {
    console.log('uploadFile');
    try {

        let formData = new FormData()
        formData.append("files", {
            name: name,
            type: type,
            uri: uri
        });

        console.log(formData)
        const { data } = await axios.post(`${API_BASE}/upload`, formData ,{headers: { 'Content-Type': 'multipart/form-data' }});
        console.log('uploadFile response', data);
        return data;

    } catch (ex) {
        console.log('uploadFile ex', JSON.stringify(ex));
    }
}

export const loginAccount = async (coord: Coord, email: string, password: string) => {
    console.log('loginAccount', coord, email);
    try {

        const { data } = await axios.post(
            `${API_BASE}/employees/signup`,
            {
                email: email,
                password: password,
                coord: coord
            },
            {
                headers: { 'Content-Type': 'application/json' }
            }

        );

        console.log('loginAccount response', data);
        return data;

    } catch (ex) {
        console.log('loginAccount ex', JSON.stringify(ex));
    }
}

export const fetchGenders = async () => {
    console.log('fetchGenders data');
    try {
        const { data } = await axios.get(`${API_BASE}/genders`);
        console.log('fetchGenders data', data);
        return data;
    } catch (ex) {
        console.log('fetchGenders ex', JSON.stringify(ex));
    }
}

