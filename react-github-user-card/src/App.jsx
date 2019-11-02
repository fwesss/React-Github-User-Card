import React, { StrictMode } from 'react';
import { ThemeProvider } from 'mineral-ui/themes';
import Flex from 'mineral-ui/Flex';

import GitHubCard from './components/GitHubCard';

const App = () => (
  <ThemeProvider>
    <StrictMode>
      <Flex direction="column" alignItems="center">
        <GitHubCard />
      </Flex>
    </StrictMode>
  </ThemeProvider>
);

export default App;
