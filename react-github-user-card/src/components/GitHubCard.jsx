import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import axios from 'axios';
import GridLoader from 'react-spinners/GridLoader';
import Box from 'mineral-ui/Box';
import Card from 'mineral-ui/Card';
import CardImage from 'mineral-ui/Card/CardImage';
import CardBlock from 'mineral-ui/Card/CardBlock';
import CardTitle from 'mineral-ui/Card/CardTitle';

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
    };
  }

  componentDidMount() {
    this.getUser();
  }

  componentDidUpdate(prevProps) {
    const { userName } = this.props;

    if (prevProps.userName !== userName) {
      this.getUser();
    }
  }

  getUser = async () => {
    this.setState({
      loading: true,
    });
    try {
      const { userName } = this.props;

      const response = await axios.get(`https://api.github.com/users/${userName}`);
      this.setState({
        user: response.data,
      });

      if (response.data.followers.length > 0) {
        this.getFollowers();
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
      this.setState({
        followers: response.data,
      });
    } catch (error) {
      this.setState({
        error,
      });
    }
  };

  render() {
    const {
      loading, error, user, followers,
    } = this.state;
    const { searchUser } = this.props;

    if (loading) {
      return (
        <GridLoader
          loading={loading}
          color="#005fa3"
        />
      );
    }

    return error && error.message.includes('403') ? <h2>API Limit Exceeded</h2> : (
      <Box width={460}>
        <Card>
          <CardImage src={user.avatar_url} alt={`Avatar for ${user.name} `} />

          {user.name ? <CardTitle subtitle={user.login}>{user.name}</CardTitle>
            : <CardTitle>{user.login}</CardTitle>}

          <CardBlock>
            <List>
              <li>{user.location}</li>
              <li>{user.html_url}</li>
              <li>{`Followers: ${user.followers}`}</li>
              <li>{`Following: ${user.following}`}</li>
              <li>{user.bio}</li>
            </List>
            {followers.length > 0
              ? [
                <h3>Followers</h3>,
                followers.map((follower) => (
                  <FollowerCard key={follower.id} follower={follower} searchUser={searchUser} />
                )),
              ]
              : <div />}
          </CardBlock>
        </Card>
      </Box>
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
};

GitHubCard.defaultProps = {
  user: {},
};

export default GitHubCard;
