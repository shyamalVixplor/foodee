import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import CodeContext from './src/context/PostCodeContext';

const App_Register = () => {
  return (
    <CodeContext>
      <App />
    </CodeContext>
  );
};

AppRegistry.registerComponent(appName, () => App_Register);
