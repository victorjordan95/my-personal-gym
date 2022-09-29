import { ThemeProvider } from 'styled-components';
import { useEffect, useState } from 'react';
import AppRoutes from '../../Routes';
import GlobalStyle from '../../styles/globalStyles';
import defaultTheme from '../../styles/themes/default';
import userContext from '../../contexts/userContext';
import { auth } from '../../config/firebase';
import { errorHandler } from '../../utils/errorHandler';

function App() {
  const [loggedUser, setLoggedUser] = useState({});
  const [contextValue, setContextValue] = useState({});

  const logout = async () => {
    try {
      await auth.signOut();
      setLoggedUser({});
      localStorage.removeItem('@personal-gym');
    } catch (error) {
      errorHandler(error);
    }
    window.location.href = '/';
  };

  const handleUserContext = (user) => {
    setLoggedUser(user);
  };

  const setToken = async (token) => {
    setLoggedUser({ ...loggedUser, token });
  };

  useEffect(() => {
    setContextValue({
      user: loggedUser,
      logout,
      handleUserContext,
      setToken,
    });
  }, [loggedUser]);

  useEffect(() => {
    if (!loggedUser.token) {
      const data = localStorage.getItem('@personal-gym');
      setLoggedUser(JSON.parse(data));
    }
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <userContext.Provider value={contextValue}>
        <GlobalStyle />
        <AppRoutes user={loggedUser} />
      </userContext.Provider>
    </ThemeProvider>
  );
}

export default App;
