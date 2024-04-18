import React from 'react';
import { UserProvider } from './components/UserContext'; 
import AppContent from './AppContent'; // Import AppContent from its own file
import { NavigationContainer } from '@react-navigation/native';
import { theme } from './components/themeComponent';

const App = () => {

  const orangeTheme = {
    ...theme,
    colors: {
      ...theme.colors,
      text: 'orange', 
    },
  };

  return (
    <UserProvider>
      <NavigationContainer theme={orangeTheme}>
      <AppContent />
      </NavigationContainer>
    </UserProvider>
  );
};

export default App;
