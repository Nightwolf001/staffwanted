import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const Stack = createNativeStackNavigator();

const AppContainer = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppContainer;