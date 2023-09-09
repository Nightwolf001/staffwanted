import React, { FC, useEffect } from "react";
import { Text, View } from "react-native";

import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { styles } from "../../theme/styles";

const Login: FC = () => {

    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    useEffect(() => {
        console.log('Login: ');
    }, []);

    return (
        <View style={styles.wrapper}>
            <Text>Login Screen</Text>
        </View>
    );
};

export default Login;