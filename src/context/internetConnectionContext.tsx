import React, { createContext, useEffect, useState } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

interface InternetConnectionContextType {
    isDeviceConnected: boolean | null;
    updateConnectionState: () => Promise<void>;
}

const InternetConnectionContext = createContext<InternetConnectionContextType>({
    isDeviceConnected: true,
    updateConnectionState: async () => {},
});

const InternetConnectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isDeviceConnected, setIsConnected] = useState<boolean | null>(true);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
            setIsConnected(state.isConnected);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const updateConnectionState = async () => {
        NetInfo.refresh().then((state: NetInfoState) => {
            setIsConnected(state.isConnected);
        });
    };

    return (
        <InternetConnectionContext.Provider value={{ isDeviceConnected, updateConnectionState }}>
            {children}
        </InternetConnectionContext.Provider>
    );
};

export { InternetConnectionProvider, InternetConnectionContext };