import * as React from 'react';
import { Image, StyleSheet, View, Text, Platform } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Not Authenticated Screens
import Login from './views/Login';
import SignUp from './views/SignUp';
import Welcome from './views/Welcome';
import Landing from './views/Landing';
import CreateProfile from './views/CreateProfile';
import CreateProfileVideo from './views/CreateProfileVideo';

// Authenticated Screens
import Home from "./views/Home";
import Inbox from "./views/Inbox";
import Jobs from "./views/Jobs";
import Job from "./views/Job";
import Profile from "./views/Profile";
import Employer from "./views/Employer";

import { Employer as EmployerType, Job as JobType, RootStackParamList } from './types';

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
                        <Image source={require('./assets/icons/home.png')} resizeMode='contain' style={{ width: 25, height: 25, tintColor: focused ? '#004A8F' : '#96C4E2' }}></Image>
                        <Text style={{ color: focused ? '#004A8F' : '#96C4E2', fontSize: 12, fontWeight: "400" }}>Home</Text>
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
                        <Image source={require('./assets/icons/inbox.png')} resizeMode='contain' style={{ width: 25, height: 25, tintColor: focused ? '#004A8F' : '#96C4E2' }}></Image>
                        <Text style={{ color: focused ? '#004A8F' : '#96C4E2', fontSize: 12, fontWeight: "400" }}>Inbox</Text>
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
                        <Image source={require('./assets/icons/job.png')} resizeMode='contain' style={{ width: 25, height: 25, tintColor: focused ? '#004A8F' : '#96C4E2' }}></Image>
                        <Text style={{ color: focused ? '#004A8F' : '#96C4E2', fontSize: 12, fontWeight: "400" }}>Shortlisted</Text>
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
                        <Image source={require('./assets/icons/profile.png')} resizeMode='contain' style={{ width: 25, height: 25, tintColor: focused ? '#004A8F' : '#96C4E2' }}></Image>
                        <Text style={{ color: focused ? '#004A8F' : '#96C4E2', fontSize: 12, fontWeight: "400"}}>Profile</Text>
                    </View>
                ),
            }}
        />

    </AppTabs.Navigator>
);


const Stack = createNativeStackNavigator<RootStackParamList>();
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
                    name="CreateProfileVideo"
                    component={CreateProfileVideo}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="TabNavigation"
                    component={AppTabsScreens}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Job"
                    component={Job}
                    initialParams={{} as JobType }
                    options={({ route }) => ({
                        title: route.params.attributes.employer.data.attributes.company_name,
                        headerBackButtonMenuEnabled: true,
                        headerBackTitleVisible: false,
                        headerTintColor: '#fff',
                        headerStyle: {
                            backgroundColor: '#004A8F',
                        },
                    })}
                />
                <Stack.Screen
                    name="Employer"
                    component={Employer}
                    initialParams={{} as EmployerType}
                    options={({ route }) => ({
                        title: route.params.attributes.company_name,
                        headerBackButtonMenuEnabled: true,
                        headerBackTitleVisible: false,
                        headerTintColor: '#fff',
                        headerStyle: {
                            backgroundColor: '#004A8F',
                        },
                    })}
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