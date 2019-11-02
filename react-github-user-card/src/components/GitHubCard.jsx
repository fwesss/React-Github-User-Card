import React from 'react';
import styled from '@emotion/styled';
import axios from 'axios';
import GridLoader from 'react-spinners/GridLoader';
import Box from 'mineral-ui/Box';
import Card, { CardBlock, CardImage, CardTitle } from 'mineral-ui/Card';

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
    };
  }

  componentDidMount() {
    this.getUser();
  }

  getUser = async () => {
    try {
      const response = await axios.get('https://api.github.com/users/fwesss');
      this.setState({
        loading: false,
        user: response.data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { loading, user } = this.state;

    return loading ? <GridLoader loading={loading} color="#005fa3" /> : (
      <Box width={460}>
        <Card>
          <CardImage src={user.avatar_url} alt={`${user.name} avatar`} />
          <CardTitle subtitle={user.login}>{user.name}</CardTitle>
          <CardBlock>
            <List>
              <li>{user.location}</li>
              <li>{user.html_url}</li>
              <li>{`Followers: ${user.followers}`}</li>
              <li>{`Following: ${user.following}`}</li>
              <li>{user.bio}</li>
            </List>
          </CardBlock>
        </Card>
      </Box>
    );
  }
}

export default GitHubCard;
