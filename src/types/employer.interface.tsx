export interface EmployerItem {
    data: Employer;
    meta: any;
}

export interface Employer {
    id: number;
    attributes: EmployerAttributes;
}

export interface EmployerAttributes {
    company_name: string;
    company_email: string;
    company_number: string;
    company_location: string;
    coords: any;
    place_id: string;
    company_avatar_url: string;
    company_description: string;
    company_website: string;
}