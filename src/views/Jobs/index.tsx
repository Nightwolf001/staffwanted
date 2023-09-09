import React, { FC, useEffect } from "react";
import { Text, View } from "react-native";

import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { styles } from "../../theme/styles";

const Jobs: FC = () => {

    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    useEffect(() => {
        console.log('Jobs: ');
    }, []);

    return (
        <View style={styles.wrapper}>
            <Text>Jobs Screen</Text>
        </View>
    );
};

export default Jobs;