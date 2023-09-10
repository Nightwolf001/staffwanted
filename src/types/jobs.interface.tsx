
// job-roles
export interface JobRolesList {
    data: JobRolesItem[]
    meta: any
}

export interface JobRolesItem {
    data: JobRoles
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
    data: PreferredHoursItem[]
    meta: any
}

export interface PreferredHoursItem {
    data: PreferredHours
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
export interface PreviousExperiencesList {
    data: PreviousExperiencesItem[]
    meta: any
}

export interface PreviousExperiencesItem {
    data: PreviousExperiences
    meta: any
}

export interface PreviousExperiences {
    id: number;
    attributes: PreviousExperiencesAttributes;
}

export interface PreviousExperiencesAttributes {
    name: string;
}