import React, { FC, useEffect } from "react";
import { Text, View, Image } from "react-native";

import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { styles } from "../../theme/styles";

const Landing: FC = () => {

    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    useEffect(() => {
        console.log('Landing: ');

        setTimeout(() => {
            // navigation.navigate('TabNavigation', { screen: 'Home' });
            navigation.navigate('Welcome');
        }, 5000);
    }, []);

    return (
        <View style={styles.wrapper}>
            <Image source={require(`../../assets/splash/splash.png`)} style={styles.splash_image} />
        </View>
    );
};

export default Landing;