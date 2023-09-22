import { Coord } from './locations.interface';

export interface User {
    id: number;
    first_name?: string;
    last_name?: string;
    email: string;
    phone_number?: string;
    location?: string;
    experience?: number[];
    preferred_hours?: number[];
    start_date?: string;
    end_date?: string;
    work_description?: string;
    date_of_birth?: string;
    account_complete: boolean;
    coord: Coord;
    gender?: number[];
    job_roles?: number[];
    video_id?: any;
    avatar_id?: any;
    hide_profile: boolean;
    profile_boosted ?: boolean;
    user_logged_in ?: boolean;
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