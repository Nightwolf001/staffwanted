import { Job, JobsMatch } from "./jobs.interface";

export type RootStackParamList = {
    Landing: undefined;
    Welcome: undefined;
    Login: undefined;
    SignUp: undefined;
    CreateProfile: undefined;
    CreateProfileVideo: undefined;
    TabNavigation: undefined;
    Job: { job: Job };
};