import { EmployerItem } from "./employer.interface";
import { Coord } from "./locations.interface";
export interface JobsList {
    data: Job[]
    meta: any
}

export interface JobsShortlist {
    data: JobsMatch[]
    meta: any
}

export interface JobsMatch {
    id: number;
    attributes: JobsMatchesAttributes;
}

export interface JobsMatchJob {
    data: Job;   
}

export interface JobsMatchesAttributes {
    bookmarked: boolean;
    applied: boolean;
    application_status: string;
    status_description: string;
    job: JobsMatchJob;
}

export interface Job {
    id: number;
    attributes: JobAttributes;
}

export interface JobAttributes {
    title: string;
    description: string;
    location: string;
    coord: Coord;
    place_id: string;
    job_avatar_uri: string;
    job_roles: JobRolesList;
    preferred_hours: PreferredHoursList;
    experience: ExperienceItem;
    employer: EmployerItem;
    bookmarked: boolean;
    salary_value: string;
    salary_type: string;
    salary_currency: string;
}

// job-roles
export interface JobRolesList {
    data: JobRoles[]
    meta: any
}

export interface JobRoles {
    id: number;
    attributes: JobRolesAttributes;
}

export interface JobRolesAttributes {
    role: string;
}

// preferred-hours
export interface PreferredHoursList {
    data: PreferredHours[]
    meta: any
}

export interface PreferredHours {
    id: number;
    attributes: PreferredHoursAttributes;
}

export interface PreferredHoursAttributes {
    name: string;
}

// previous-experiences
export interface ExperienceItem {
    data: Experience;
    meta: any;
}

export interface Experience {
    id: number;
    attributes: ExperiencesAttributes;
}

export interface ExperiencesAttributes {
    name: string;
}
