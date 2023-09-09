/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { Provider } from 'react-redux';
import { StatusBar } from 'react-native';
import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import { store, persistor } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { InternetConnectionProvider } from './src/context/internetConnectionContext';
import { AppLocationProvider } from './src/context/appLocationContext';

import AppContainer from "./src/navigation";

const theme = {
  ...DefaultTheme,
  myOwnProperty: true,
  ...DefaultTheme.colors,
  colors: {
    primary: "rgb(36, 95, 166)",
    onPrimary: "rgb(255, 255, 255)",
    primaryContainer: "rgb(213, 227, 255)",
    onPrimaryContainer: "rgb(0, 27, 60)",
    secondary: "rgb(0, 101, 140)",
    onSecondary: "rgb(255, 255, 255)",
    secondaryContainer: "rgb(197, 231, 255)",
    onSecondaryContainer: "rgb(0, 30, 45)",
    tertiary: "rgb(255, 255, 255)",
    onTertiary: "rgb(36, 95, 166)",
    tertiaryContainer: "rgb(248, 216, 254)",
    onTertiaryContainer: "rgb(40, 19, 47)",
  },
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <StatusBar barStyle="dark-content" hidden />
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider theme={theme}>
          <InternetConnectionProvider>
            <AppLocationProvider>
              <AppContainer />
            </AppLocationProvider>
          </InternetConnectionProvider>
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
