import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import axios from 'axios';
import GridLoader from 'react-spinners/GridLoader';
import Box from 'mineral-ui/Box';
import Flex from 'mineral-ui/Flex';
import Text from 'mineral-ui/Text';
import Card from 'mineral-ui/Card';
import CardImage from 'mineral-ui/Card/CardImage';
import CardBlock from 'mineral-ui/Card/CardBlock';
import CardTitle from 'mineral-ui/Card/CardTitle';
import GitHubCalendar from 'react-github-calendar';
import ReactTooltip from 'react-tooltip';

import FollowerCard from './FollowerCard';

const List = styled('ul')({
  listStyle: 'none',
  paddingLeft: 0,
});

class GitHubCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      user: {},
      followers: [],
      error: null,
      apiTimeRemaining: 0,
    };
  }

  componentDidMount() {
    this.getUser();
  }

  componentDidUpdate(prevProps, prevState) {
    const { userName } = this.props;
    const { error } = this.state;

    if (prevProps.userName !== userName) {
      this.getUser();
    }

    if (prevState.error !== error && error.message.includes('403')) {
      this.timer(error.response.headers['x-ratelimit-reset'] * 1000);
    }
  }

  getUser = async () => {
    this.setState({
      loading: true,
    });

    try {
      const { userName } = this.props;

      const response = await axios.get(`https://api.github.com/users/${userName}`);
      console.log(`API calls remaining this hour: ${response.headers['x-ratelimit-remaining']}`);

      this.setState({
        user: response.data,
      });

      if (response.data.followers > 0) {
        this.getFollowers();
      } else {
        this.setState({
          followers: [],
        });
      }
    } catch (error) {
      this.setState({
        error,
      });
    } finally {
      this.setState({
        loading: false,
      });
    }
  };

  getFollowers = async () => {
    try {
      const { userName } = this.props;

      const response = await axios.get(`https://api.github.com/users/${userName}/followers`);
      console.log(`API calls remaining this hour: ${response.headers['x-ratelimit-remaining']}`);

      this.setState({
        followers: response.data,
      });
    } catch (error) {
      this.setState({
        error,
      });
    }
  };

  timer = (resetTime) => {
    let timeRemaining = (new Date(resetTime) - Date.now()) / 1000;

    setInterval(() => {
      timeRemaining -= 1;
      this.setState({
        apiTimeRemaining: timeRemaining,
      });
    }, 1000);
  };

  render() {
    const {
      loading, error, user, followers, apiTimeRemaining,
    } = this.state;
    const { searchUser, theme } = this.props;

    if (loading) {
      return (
        <GridLoader
          loading={loading}
          color={theme.color_theme_60}
        />
      );
    }

    return error && error.message.includes('403') ? (
      <Box>
        <Text as="h2">API Limit Exceeded</Text>
        {apiTimeRemaining > 0 ? <Text as="p">{`Rate limit will reset in ${Math.floor(apiTimeRemaining / 60)} minutes and ${Math.floor(apiTimeRemaining % 60)} seconds.`}</Text>
          : <Text as="p">Ready to refresh</Text>}
      </Box>
    ) : (
      <Flex id="card" direction="column" alignItems="center" width={960}>
        <GitHubCalendar
          username={user.login}
          color={theme.color_theme_60}
        >
          <ReactTooltip delayShow={50} html />
        </GitHubCalendar>

        <Box width={460} marginVertical="3rem">
          <Card>
            <CardImage src={user.avatar_url} alt={`Avatar for ${user.name} `} />

            {user.name ? <CardTitle subtitle={user.login}>{user.name}</CardTitle>
              : <CardTitle>{user.login}</CardTitle>}

            <CardBlock>
              <List>
                <Text as="li">{user.location}</Text>
                <Text as="li">{user.html_url}</Text>
                <Text as="li">{`Followers: ${user.followers}`}</Text>
                <Text as="li">{`Following: ${user.following}`}</Text>
                <Text as="li">{user.bio}</Text>
              </List>

              {followers.length > 0
                ? (
                  <Box>
                    <Text as="h3">Followers</Text>
                    {followers.map((follower) => (
                      <FollowerCard key={follower.id} follower={follower} searchUser={searchUser} />
                    ))}
                  </Box>
                )
                : <div />}
            </CardBlock>
          </Card>
        </Box>
      </Flex>
    );
  }
}

GitHubCard.propTypes = {
  userName: PropTypes.string.isRequired,
  user: PropTypes.shape({
    avatar_url: PropTypes.string,
    name: PropTypes.string,
    login: PropTypes.string,
    location: PropTypes.string,
    html_url: PropTypes.string,
    followers: PropTypes.number,
    following: PropTypes.number,
    bio: PropTypes.string,
  }),
  searchUser: PropTypes.func.isRequired,
  theme: PropTypes.shape({
    color_theme_60: PropTypes.string,
  }).isRequired,
};

GitHubCard.defaultProps = {
  user: {},
};

export default GitHubCard;
