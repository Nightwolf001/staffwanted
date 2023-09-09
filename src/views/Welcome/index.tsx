import React, { FC, useEffect } from "react";
import { Text, View, ImageBackground, Image } from "react-native";

import { useTheme, Button } from 'react-native-paper';

import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { styles } from "../../theme/styles";

const Welcome: FC = () => {

    const theme = useTheme();
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    useEffect(() => {
        console.log('Welcome: ');
        // navigation.navigate('TabNavigation', { screen: 'Home' });
    }, []);

    return (
        <View style={styles.wrapper}>
            <ImageBackground source={require(`../../assets/images/welcome_background.png`)} style={styles.background_image}>
                <Image source={require(`../../assets/images/logo_white.png`)} style={styles.logo} />
                <View style={styles.welcome_btn_container}>
                    <Button uppercase={true} buttonColor={theme.colors.tertiary} textColor={theme.colors.onTertiary} style={{ marginBottom: 15 }} mode="contained" onPress={() => navigation.navigate('SignUp')}>
                        Find Work
                    </Button>
                    <Button uppercase={true} buttonColor={theme.colors.tertiary} textColor={theme.colors.onTertiary} mode="contained" onPress={() => console.log('Pressed')}>
                        Find Staff
                    </Button>
                </View>
            </ImageBackground>  
        </View>
    );
};

export default Welcome;