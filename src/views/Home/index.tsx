import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Text, View } from "react-native";
import { Button } from 'react-native-paper';

import * as Sentry from '@sentry/react-native';

import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { fetchProfile } from "../../actions/account.actions";
import { styles } from "../../theme/styles";

const Home: FC = () => {

    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const user = useSelector((state: RootState) => state.userSlice.user);
    
    useEffect(() => {
        (async () => {
            console.log('Home: ', user);
        })()
    }, []);

    return (
        <View style={styles.wrapper}>
            <Text>Home Screen</Text>
            <Button  onPress={() => { Sentry.captureException(new Error('First error')) }} >
                Test Sentry
            </Button>    
        </View>
    );
};

export default Home;