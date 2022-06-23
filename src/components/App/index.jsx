import { ThemeProvider } from 'styled-components';
import AppRoutes from '../../Routes';
import GlobalStyle from '../../styles/globalStyles';
import defaultTheme from '../../styles/themes/default';

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyle />
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
