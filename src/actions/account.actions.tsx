import axios from 'axios';
import moment from 'moment';

import { Coord } from '../types';
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

