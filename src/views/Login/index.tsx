import React, { FC, useState, useContext } from "react";
import { useDispatch } from 'react-redux';

import { View, Image, TouchableOpacity } from "react-native";
import { Container, Row, Col } from 'react-native-flex-grid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme, TextInput, Button, Text, Snackbar } from 'react-native-paper';

import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { setUser } from '../../redux/reducers/user.reducer';
import { AppLocationContext } from '../../context/appLocationContext';
import { loginAccount, updateProfile } from "../../actions/account.actions";

import { styles } from "../../theme/styles";
var _ = require('lodash');

const Login: FC = () => {

    const theme = useTheme();
    const dispatch = useDispatch();
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    const coord = useContext(AppLocationContext);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [password_visible, setPasswordVisible] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [hasError, setHasError] = React.useState(false);

    const onToggleSnackBar = () => setHasError(!hasError);
    const onDismissSnackBar = () => setHasError(false);
    const handelPasswordVisibility = () => setPasswordVisible(!password_visible);

    const handleLogin = async () => {
        setSubmitting(true);
        let {user, jwt} = await loginAccount(coord, email, password);
        setSubmitting(false);

            if(user.blocked) {
                onToggleSnackBar();
                return;
            } else {
                await AsyncStorage.setItem('token', jwt);
                await AsyncStorage.setItem('user_id', JSON.stringify(user.profile_id));
                let { data } = await updateProfile(user.profile_id, {user_logged_in: true})
                let { attributes } = data;
                attributes.id = user.profile_id;
                dispatch(setUser(attributes));
                if (attributes.account_complete) {
                    navigation.navigate('TabNavigation', { screen: 'Home' });
                } else {
                    navigation.navigate('CreateProfilePersonal');
                }
            }
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
                                cursorColor={theme.colors.primary}
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
                                secureTextEntry={password_visible}
                                cursorColor={theme.colors.primary}
                                outlineColor={theme.colors.onPrimary}
                                activeOutlineColor={theme.colors.onPrimary}
                                outlineStyle={{ backgroundColor: theme.colors.onPrimary, borderRadius: 15 }}
                                left={<TextInput.Icon icon="lock-outline" />}
                                right={<TextInput.Icon icon={password_visible ? "eye-off-outline" : "eye-outline"} onPress={() => handelPasswordVisibility()} />}
                            />
                        </Col>
                        <Col style={{ marginBottom: 15 }} xs="12">
                            <Button uppercase={true} buttonColor={theme.colors.tertiary} textColor={theme.colors.onTertiary} style={{ marginBottom: 15 }} mode="contained" loading={submitting} onPress={() => handleLogin()}>
                                Login
                            </Button>
                        </Col>
                    </Row>
                </Container>
                <TouchableOpacity style={{ position: 'absolute', bottom: 20 }} onPress={() => navigation.navigate('SignUp')}>
                    <Text style={[styles.text_white_heading, { marginBottom: 0, textAlign: 'center' }]} variant="labelSmall">Dont have a account?</Text>
                    <Text style={[styles.text_white_heading, { margin: 0, textAlign: 'center' }]} variant="labelSmall">Register</Text>
                </TouchableOpacity>  
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