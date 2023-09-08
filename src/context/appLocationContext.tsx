import React, { createContext, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Alert, AppState, AppStateStatus } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

import { updateSavedLocation } from '../redux/reducers/locations.reducer';
import { Coord } from '../types';

// Create the app state context
const AppLocationContext = createContext<Coord>({
    lat: '', 
    lng: '',
});

// Create the app state provider component
const AppLocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const dispatch = useDispatch();
    const [coord, setCoord] = useState<Coord>({ lat: '', lng: '' });
    const [previousAppState, setPreviousAppState] = useState<string>('');
    const [currentAppState, setCurrentAppState] = useState<string>(AppState.currentState);

    useEffect(() => {
        (async () => {
            console.log('AppLocationProvider useEffect', coord)
            if (coord.lat.length == 0 && coord.lng.length == 0) {
                await getCoords();
            }
        })();
    }, [coord]);
    
    useEffect(() => {    
        (async () => {
            const handleAppStateChange = async (nextAppState: AppStateStatus) => {
            if (currentAppState === 'background' && nextAppState === 'active') {
                await getCoords();
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

    const getCoords = async () => {
        Geolocation.getCurrentPosition(
            async (position) => {
                let { latitude, longitude } = position.coords;
                setCoord({ lat: latitude.toString(), lng: longitude.toString() });                
                dispatch(updateSavedLocation({
                    coord: { lat: latitude.toString(), lng: longitude.toString() },
                    name: 'Current Location',
                }));                
            },
            (error) => {
                Alert.alert(
                    `Opps!`,
                    `${error.message}`,
                    [
                        { text: "Retry", onPress: () => getCoords() },
                        { text: "Cancel", onPress: () => console.log("Cancel Pressed") },
                    ],
                );
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    }

    return (
        <AppLocationContext.Provider value={coord}>
            {children}
        </AppLocationContext.Provider>
    );
};

export { AppLocationProvider, AppLocationContext };