import { Coord } from './locations.interface';

export interface User {
    id: number;
    first_name?: string;
    last_name?: string;
    email: string;
    phone_number?: string;
    location?: string;
    previous_experience?: number[];
    preferred_hours?: number[];
    start_date?: string | Date;
    end_date?: string | Date;
    hide_profile?: boolean;
    work_description?: string;
    date_of_birth?: string | Date;
    account_complete: boolean;
    coord: Coord;
    gender?: number[];
    job_roles?: number[];
};

// previous-experiences
export interface GenderList {
    data: GenderItem[]
    meta: any
}

export interface GenderItem {
    data: Gender
    meta: any
}

export interface Gender {
    id: number;
    attributes: GenderAttributes;
}

export interface GenderAttributes {
    name: string;
}