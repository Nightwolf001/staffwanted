import * as React from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, Platform } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Not Authenticated Screens
import Login from './views/Login';
import SignUp from './views/SignUp';
import Welcome from './views/Welcome';
import Landing from './views/Landing';
import CreateProfile from './views/CreateProfile';

// Authenticated Screens
import Home from "./views/Home";
import Inbox from "./views/Inbox";
import Jobs from "./views/Jobs";
import Profile from "./views/Profile";



const HomeStack = createNativeStackNavigator();
const HomeStackScreens = () => (
    <HomeStack.Navigator>
        <HomeStack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
        />
    </HomeStack.Navigator>
);

const InboxStack = createNativeStackNavigator();
const InboxStackScreens = () => (
    <InboxStack.Navigator>
        <InboxStack.Screen
            name="Inbox"
            component={Inbox}
            options={{ headerShown: false }}
        />
    </InboxStack.Navigator>
);

const JobsStack = createNativeStackNavigator();
const JobsStackScreens = () => (
    <JobsStack.Navigator>
        <JobsStack.Screen
            name="Jobs"
            component={Jobs}
            options={{ headerShown: false }}
        />
    </JobsStack.Navigator>
);

const ProfileStack = createNativeStackNavigator();
const ProfileStackScreens = () => (
    <ProfileStack.Navigator>
        <ProfileStack.Screen
            name="Profile"
            component={Profile}
            options={{ headerShown: false }}
        />
    </ProfileStack.Navigator>
);

const AppTabs = createBottomTabNavigator();
const AppTabsScreens = () => (
    <AppTabs.Navigator
        screenOptions={{
            tabBarShowLabel: false,
            tabBarStyle: {
                position: Platform.OS === 'ios' ? "absolute" : "absolute",
                bottom: Platform.OS === 'ios' ? 25 : 10,
                left: 20,
                right: 20,
                elevation: 0,
                backgroundColor: '#ffffff',
                borderRadius: 15,
                height: 70,
                ...styles.shadow
            }
        }}
    >
        <AppTabs.Screen
            name="HomeTab"
            component={HomeStackScreens}
            options={{
                title: 'Home',
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <View style={{ alignItems: 'center', justifyContent: 'center', top: Platform.OS === 'ios' ? 15 : 0 }}>
                        <Text>Home</Text>
                    </View>
                ),
            }}
        />

        <AppTabs.Screen
            name="InboxTab"
            component={InboxStackScreens}
            options={{
                title: 'Inbox',
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <View style={{ alignItems: 'center', justifyContent: 'center', top: Platform.OS === 'ios' ? 15 : 0 }}>
                        <Text>Inbox</Text>
                    </View>
                ),
            }}
        />

        <AppTabs.Screen
            name="JobsTab"
            component={JobsStackScreens}
            options={{
                title: 'Shortlisted Jobs',
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <View style={{ alignItems: 'center', justifyContent: 'center', top: Platform.OS === 'ios' ? 15 : 0 }}>
                        <Text>Jobs</Text>
                    </View>
                ),
            }}
        />

        <AppTabs.Screen
            name="ProfileTab"
            component={ProfileStackScreens}
            options={{
                title: 'Profile',
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <View style={{ alignItems: 'center', justifyContent: 'center', top: Platform.OS === 'ios' ? 15 : 0 }}>
                        <Text>Profile</Text>
                    </View>
                ),
            }}
        />

    </AppTabs.Navigator>
);


const Stack = createNativeStackNavigator();
const AppContainer = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Landing">
                <Stack.Screen
                    name="Landing"
                    component={Landing}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Welcome"
                    component={Welcome}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="SignUp"
                    component={SignUp}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="CreateProfile"
                    component={CreateProfile}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="TabNavigation"
                    component={AppTabsScreens}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppContainer;

const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        // elevation: 5
    },
    tabBadge: {
        position: 'absolute',
        top: -5,
        right: -10,
        backgroundColor: 'red',
        borderRadius: 16,
        paddingHorizontal: 6,
        paddingVertical: 2,
        zIndex: 2,
    },
    tabBadgeText: {
        color: '#000',
        fontSize: 11,
        fontWeight: '600',
    },
});