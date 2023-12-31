import React, { FC, useEffect, useContext } from "react";
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { View, Image } from "react-native";

import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AuthContext } from "../../context/authContext";

import { styles } from "../../theme/styles";

const Landing: FC = () => {

    const { is_authenticated, is_loading } = useContext(AuthContext);
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const user = useSelector((state: RootState) => state.userSlice.user);

    useEffect(() => {
        console.log('Landing: ');
        console.log('user redux', user);
        console.log('is_authenticated', is_authenticated);
        setTimeout(() => {
            // if(is_authenticated === true) {
                if (user.user_logged_in === true) {
                    if (user.account_complete === true) {
                        navigation.navigate('TabNavigation', { screen: 'Home' });
                    } else if (user.account_complete === false) {
                        navigation.navigate('CreateProfilePersonal');
                    }
                } else if (user.user_logged_in === false) {
                    navigation.navigate('Login');
                } else {
                    navigation.navigate('Welcome');
                }
            // } 

            
        }, 5000);
    }, []);

    return (
        <View style={styles.wrapper}>
            <Image source={require(`../../assets/splash/splash.png`)} style={styles.splash_image} />
        </View>
    );
};

export default Landing;