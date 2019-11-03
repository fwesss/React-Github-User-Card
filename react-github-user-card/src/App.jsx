import React, { Component, StrictMode } from 'react';
import { ThemeProvider, createTheme } from 'mineral-ui/themes';
import Flex from 'mineral-ui/Flex';

import Header from './components/Header';
import Search from './components/Search';
import GitHubCard from './components/GitHubCard';

const slate = createTheme({
  colors: { theme: 'slate' },
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: 'fwesss',
    };
  }

  searchUser = (query) => {
    this.setState({
      user: query,
    });
  };

  render() {
    const { user } = this.state;

    return (
      <ThemeProvider theme={slate}>
        <StrictMode>
          <Flex
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Header />
            <Search searchUser={this.searchUser} />
            <GitHubCard userName={user} searchUser={this.searchUser} theme={slate} />
          </Flex>
        </StrictMode>
      </ThemeProvider>
    );
  }
}

export default App;
