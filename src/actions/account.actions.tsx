import axios from 'axios';

import { API_BASE } from "@env";
import { Coord, User } from '../types';
import axiosInstance from '../services/interceptor.service';

var _ = require('lodash');


export const registerAccount = async (coord: Coord, email: string, password: string) => {
    console.log('registerAccount', coord, email);
    try {

        const { data } = await axios.post(
            `${API_BASE}/auth/local/register`,
            {   
                username: email,
                user_type: 'employee',
                email: email,
                password: password,
                coord: coord
            },
            {
                headers: { 'Content-Type': 'application/json' }
            }

        );

        console.log('registerAccount response', data);
        return data;

    } catch (ex) {
        console.log('registerAccount ex', JSON.stringify(ex));
    }
}

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
                experience: user.experience,
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

export const updateProfile = async (profile_id : number, post_data: any) => {
    console.log('updateProfile', post_data);
    try {

        const { data } = await axios.put(
            `${API_BASE}/employees/${profile_id}?populate=*`, { data: post_data},
             { headers: { 'Content-Type': 'application/json' }}
        );

        let { attributes } = data.data
        attributes.id = data.data.id
        attributes.gender = attributes.gender.data ? attributes.gender.data.id : 0;
        attributes.experience = attributes.experience.data ? attributes.experience.data.id : 0;
        attributes.preferred_hours = attributes.preferred_hours.data.lenght !== 0 ?  _.map(attributes.preferred_hours.data, 'id') : []
        attributes.job_roles = attributes.job_roles.data.lenght !== 0 ? _.map(attributes.job_roles.data, 'id') : []

        console.log('updateProfile response', data);
        return data;

    } catch (ex) {
        console.log('updateProfile ex', ex);
    }
}

export const fetchProfile = async (profile_id: Number) => {
    console.log('fetchProfile');
    try {

        const { data } = await axiosInstance.get(`${API_BASE}/employees/${profile_id}`);

        console.log('fetchProfile response', data);
        return data;

    } catch (ex) {
        console.log('fetchProfile ex', ex);
    }
}

export const fetchUser = async () => {
    console.log('fetchUser');
    try {

        const { data } = await axiosInstance.get(`${API_BASE}/users/me`);
        console.log('fetchUser response', data);
        return data;

    } catch (ex) {
        console.log('fetchUser ex', ex);
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

export const uploadAvatarFile = async (name: string, type: string, uri: string) => {
    console.log('uploadAvatarFile', name);
    try {

        let formData = new FormData()
        formData.append("files", {
            name: name,
            type: type,
            uri: uri
        });

        console.log(formData)
        const { data } = await axios.post(`${API_BASE}/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        console.log('uploadAvatarFile response', data);
        return data;

    } catch (ex) {
        console.log('uploadAvatarFile ex', JSON.stringify(ex));
    }
}

export const uploadVideoFile = async (name: string, type: string, uri: string) => {
    console.log('uploadFile');
    try {

        let formData = new FormData()
        formData.append("files", {
            name: name,
            type: type,
            uri: uri
        });

        console.log(formData)
        const { data } = await axios.post(`${API_BASE}/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
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
            `${API_BASE}/auth/local`,
            {
                identifier: email,
                password: password,
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

