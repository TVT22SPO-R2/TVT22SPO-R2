import React from 'react';
import { UserProvider } from './components/UserContext'; 
import AppContent from './AppContent'; // Import AppContent from its own file
import { NavigationContainer } from '@react-navigation/native';
import { theme } from './components/themeComponent';

const App = () => {
  return (
    <UserProvider>
      <NavigationContainer theme={theme}>
      <AppContent />
      </NavigationContainer>
    </UserProvider>
  );
};

export default App;
