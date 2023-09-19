
import React, { useEffect, useState } from "react";
import { useTheme, Text } from 'react-native-paper';
import moment from 'moment';

const GreetingsText = () => {

    const theme = useTheme();
    const [greetingsText, setGreetingsText] = useState('');

    useEffect(() => {
        handelGreetings();
    }, []);

    const handelGreetings = () => {
        let currentHour = parseInt(moment().format('HH'), 10); // Convert the currentHour variable to a number
        if (currentHour >= 3 && currentHour < 12) {
            setGreetingsText('Good Morning!');
        } else if (currentHour >= 12 && currentHour < 17) {
            setGreetingsText('Good Afternoon!');
        } else if (currentHour >= 17 && currentHour < 22) {
            setGreetingsText('Good Evening!');
        } else if (currentHour >= 22 || currentHour < 3) { // Use the || operator instead of && to handle the case where currentHour is less than 3
            setGreetingsText('Good Night!');
        }
    }

    return (
        <Text style={[{ marginBottom: 0, color: theme.colors.onPrimary }]} variant="headlineSmall">{greetingsText}</Text>
    );
};

export default GreetingsText;