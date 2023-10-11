import { Job, Employer } from "./";

export type RootStackParamList = {
    Landing: undefined;
    Welcome: undefined;
    Login: undefined;
    SignUp: undefined;
    CreateProfile: undefined;
    CreateProfilePersonal: undefined;
    CreateProfileCriteria: undefined;
    CreateProfileVideo: undefined;
    TabNavigation: undefined;
    Job: Job;
    Employer: Employer;
};