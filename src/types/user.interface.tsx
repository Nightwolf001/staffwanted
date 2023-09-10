import { Coord } from './locations.interface';

export interface User {
    id: number;
    first_name?: string;
    last_name?: string;
    email: string;
    phone_number?: string;
    location?: string;
    previous_experience?: string;
    preferred_hours?: string;
    start_date?: string;
    end_date?: string;
    hide_profile?: boolean;
    work_description?: string;
    date_of_birth?: string;
    account_complete: boolean;
    coord: Coord;
};
