import React, { FC, useState, useContext } from "react";
import { useDispatch } from 'react-redux';
import { View, Image, TouchableOpacity } from "react-native";
import { useTheme, TextInput, Button, Text, Snackbar } from 'react-native-paper';
import { Container, Row, Col } from 'react-native-flex-grid';

import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { createAccount } from "../../actions/account.actions";
import { setUser } from "../../redux/reducers/user.reducer";
import { AppLocationContext } from '../../context/appLocationContext';

import { styles } from "../../theme/styles";

const SignUp: FC = () => {

    const theme = useTheme();
    const dispatch = useDispatch();
    const coord = useContext(AppLocationContext);
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [passwordVisible, setPasswordVisible] = useState<boolean>(true);
    const [hasError, setHasError] = React.useState(false);

    const onToggleSnackBar = () => setHasError(!hasError);
    const onDismissSnackBar = () => setHasError(false);
    const handelPasswordVisibility = () => setPasswordVisible(!passwordVisible);

    const handleSignUp = async () => {
        setSubmitting(true);
        console.log('handleSignUp: ');
        let response = await createAccount(coord, email, password);
        setSubmitting(false);
        console.log('data', response.data);

        if (response !== 9001) {
            console.log('data.attributes', response.data.attributes);
            let user = response.data.attributes;
            user.id = response.data.id;
            dispatch(setUser(user));
            navigation.navigate('CreateProfile');
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
            <View style={[styles.container_curved, {backgroundColor: theme.colors.primary }]}>
                <Text style={[styles.text_white_heading, {paddingTop: 20}]} variant="headlineSmall">Create your account.</Text>
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
                            <Button uppercase={true} buttonColor={theme.colors.tertiary} textColor={theme.colors.onTertiary} style={{ marginBottom: 15 }} mode="contained" loading={submitting} onPress={() => handleSignUp()}>
                                Create Account
                            </Button>
                        </Col>
                    </Row>
                </Container>  
                <TouchableOpacity style={{ position: 'absolute', bottom: 20 }} onPress={() => navigation.navigate('Login')}>
                    <Text style={[styles.text_white_heading, { marginBottom: 0, textAlign: 'center'}]} variant="labelSmall">Already have a account?</Text>
                    <Text style={[styles.text_white_heading, { margin: 0, textAlign: 'center' }]} variant="labelSmall">Login</Text>
                </TouchableOpacity>              
            </View>
            <Snackbar
                style={{backgroundColor: theme.colors.onPrimary}}
                visible={hasError}
                onDismiss={onDismissSnackBar}
                action={{ label: 'Login ?', onPress: () => navigation.navigate('Login') }}>
                User Already Exists
            </Snackbar>
        </View>
    );
};

export default SignUp;