import React, { createContext, useState, useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { AppState, AppStateStatus } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { setUser } from '../redux/reducers/user.reducer';
import { fetchUser, fetchProfile } from '../actions/account.actions';

var _ = require('lodash');

// Create the app state context
const AuthContext = createContext({
    is_authenticated: false,
    is_loading: false,
});

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const dispatch = useDispatch();
    const [token, setToken] = useState<string>('');
    const [is_loading, setIsLoading] = useState(false);
    const [is_authenticated, setIsAuthenticated] = useState(false);
    const [previousAppState, setPreviousAppState] = useState<string>('');
    const [currentAppState, setCurrentAppState] = useState<string>(AppState.currentState);

    useEffect(() => {
        console.log('AuthProvider useEffect', currentAppState, previousAppState);
        (async () => {
            const handleAppStateChange = async (nextAppState: AppStateStatus) => {
                if (currentAppState === 'background' && nextAppState === 'active') {
                    const token = await AsyncStorage.getItem('token');
                    console.log('token', token);
                    if (token) { 
                        setIsAuthenticated(true);
                        fetchLoggedInUser();
                    } else {
                        setIsAuthenticated(false);
                    }
                }
                setPreviousAppState(currentAppState);
                setCurrentAppState(nextAppState);
            };

            // Subscribe to app state changes
            const appStateSubscription = AppState.addEventListener(
                'change',
                handleAppStateChange
            );

            // Clean up the subscription when the component unmounts
            return () => {
                appStateSubscription.remove();
            };
        })();
    }, [currentAppState, previousAppState]);

    const fetchLoggedInUser = async () => {
        setIsLoading(true);
        try {
            let user = await fetchUser();
            let profile_id = user.profile_id;

            if (user.blocked) {

                dispatch(setUser({}));
                setIsAuthenticated(false);
                return;

            } else {

                let { data } = await fetchProfile(profile_id);
                let { attributes } = data;
                user = attributes
                user.id = profile_id;
                user.gender = attributes.gender.data ? attributes.gender.data.id : 0;
                user.experience = attributes.experience.data ? attributes.experience.data.id : 0;
                user.preferred_hours = attributes.preferred_hours.data.lenght !== 0 ? _.map(attributes.preferred_hours.data, 'id') : []
                user.job_roles = attributes.job_roles.data.lenght !== 0 ? _.map(attributes.job_roles.data, 'id') : []
                dispatch(setUser(user));
            }

        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{is_authenticated, is_loading}}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, AuthContext };