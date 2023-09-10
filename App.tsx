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
import { registerTranslation } from 'react-native-paper-dates'
import { store, persistor } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { InternetConnectionProvider } from './src/context/internetConnectionContext';
import { AppLocationProvider } from './src/context/appLocationContext';

import AppContainer from "./src/navigation";

registerTranslation('en-US', {
  save: 'Save',
  selectSingle: 'Select date',
  selectMultiple: 'Select dates',
  selectRange: 'Select period',
  notAccordingToDateFormat: (inputFormat) =>
    `Date format must be ${inputFormat}`,
  mustBeHigherThan: (date) => `Must be later then ${date}`,
  mustBeLowerThan: (date) => `Must be earlier then ${date}`,
  mustBeBetween: (startDate, endDate) =>
    `Must be between ${startDate} - ${endDate}`,
  dateIsDisabled: 'Day is not allowed',
  previous: 'Previous',
  next: 'Next',
  typeInDate: 'Type in date',
  pickDateFromCalendar: 'Pick date from calendar',
  close: 'Close',
});

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
    error: "rgb(186, 26, 26)",
    onError: "rgb(255, 255, 255)",
    errorContainer: "rgb(255, 218, 214)",
    onErrorContainer: "rgb(65, 0, 2)",
    background: "rgb(255, 255, 255)",
    onBackground: "rgb(29, 27, 30)",
    surface: "rgb(255, 255, 255)",
    onSurface: "rgb(29, 27, 30)",
    surfaceVariant: "rgb(233, 223, 235)",
    onSurfaceVariant: "rgb(74, 69, 78)",
    outline: "rgb(124, 117, 126)",
    outlineVariant: "rgb(204, 196, 206)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(50, 47, 51)",
    inverseOnSurface: "rgb(245, 239, 244)",
    inversePrimary: "rgb(220, 184, 255)",
    elevation: {
      level0: "transparent",
      level1: "rgb(248, 242, 251)",
      level2: "rgb(244, 236, 248)",
      level3: "rgb(240, 231, 246)",
      level4: "rgb(239, 229, 245)",
     level5: "rgb(236, 226, 243)"
    },
    surfaceDisabled: "rgba(29, 27, 30, 0.12)",
    onSurfaceDisabled: "rgba(29, 27, 30, 0.38)",
    backdrop: "rgba(51, 47, 55, 0.4)"
  }
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
