/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { Provider } from 'react-redux';
import { StatusBar } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { store, persistor } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';


import { InternetConnectionProvider } from './src/context/internetConnectionContext';
import { AppLocationProvider } from './src/context/appLocationContext';

import AppContainer from "./src/navigation"

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <StatusBar barStyle="dark-content" hidden />
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider>
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
