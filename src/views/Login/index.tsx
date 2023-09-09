import React, { FC, useEffect, useState, useContext } from "react";
import { View, Image } from "react-native";
import { useTheme, TextInput, Button, Text, Snackbar } from 'react-native-paper';
import { Container, Row, Col } from 'react-native-flex-grid';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { loginAccount } from "../../actions/account.actions";
import { AppLocationContext } from '../../context/appLocationContext';

import { styles } from "../../theme/styles";

const Login: FC = () => {

    const theme = useTheme();
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    const coord = useContext(AppLocationContext);

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordVisible, setPasswordVisible] = useState<boolean>(true);
    const [hasError, setHasError] = React.useState(false);

    const onToggleSnackBar = () => setHasError(!hasError);
    const onDismissSnackBar = () => setHasError(false);
    const handelPasswordVisibility = () => setPasswordVisible(!passwordVisible);

    const handleLogin = async () => {
        console.log('handleLogin: ');
        let data = await loginAccount(coord, email, password);
        console.log('data', data);

        if (data !== 9001) {

        } else {
            onToggleSnackBar();
        }

        // navigation.navigate('TabNavigation', { screen: 'Home' });
    }

    return (
        <View style={styles.wrapper}>
            <View style={{ flex: 1.5, width: '100%' }}>
                <Image source={require(`../../assets/images/logo_blue.png`)} style={styles.xs_image} />
            </View>
            <View style={[styles.container_curved, { backgroundColor: theme.colors.primary }]}>

                <Text style={[styles.text_white_heading, { paddingTop: 20 }]} variant="headlineSmall">Log into your account.</Text>
                <Container fluid>
                    <Row>
                        <Col style={{ marginBottom: 15, marginTop: 20 }} xs="12">
                            <TextInput
                                autoCapitalize="none"
                                keyboardType="email-address"
                                mode='outlined'
                                placeholder="Email"
                                value={email}
                                onChangeText={(text) => setEmail(text)}
                                outlineColor={theme.colors.onPrimary}
                                activeOutlineColor={theme.colors.onPrimary}
                                outlineStyle={{ backgroundColor: theme.colors.onPrimary, borderRadius: 15 }}
                                left={<TextInput.Icon icon="account-outline" />}
                            />
                        </Col>
                        <Col style={{ marginBottom: 45 }} xs="12">
                            <TextInput
                                mode='outlined'
                                placeholder="Password"
                                value={password}
                                onChangeText={(text) => setPassword(text)}
                                secureTextEntry={passwordVisible}
                                outlineColor={theme.colors.onPrimary}
                                activeOutlineColor={theme.colors.onPrimary}
                                outlineStyle={{ backgroundColor: theme.colors.onPrimary, borderRadius: 15 }}
                                left={<TextInput.Icon icon="lock-outline" />}
                                right={<TextInput.Icon icon="eye-outline" onPress={() => handelPasswordVisibility()} />}
                            />
                        </Col>
                        <Col style={{ marginBottom: 15 }} xs="12">
                            <Button uppercase={true} buttonColor={theme.colors.tertiary} textColor={theme.colors.onTertiary} style={{ marginBottom: 15 }} mode="contained" onPress={() => handleLogin()}>
                                Login
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </View>
            <Snackbar
                style={{ backgroundColor: theme.colors.onPrimary }}
                visible={hasError}
                onDismiss={onDismissSnackBar}
                action={{ label: 'Login ?', onPress: () => navigation.navigate('Sign Up') }}>
                User Doens't Exists
            </Snackbar>
        </View>
    );
};

export default Login;