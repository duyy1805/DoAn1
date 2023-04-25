import { useRoutes } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { theme } from './theme';
import { routes } from './routes';sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss

const App = () => {
  const content = useRoutes(routes);

  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {content}
      </ThemeProvider>
  );
};

export default App;
