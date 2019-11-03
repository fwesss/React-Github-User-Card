import React from 'react';
import PropTypes from 'prop-types';
import Card from 'mineral-ui/Card';
import CardTitle from 'mineral-ui/Card/CardTitle';
import Avatar from 'mineral-ui/Avatar/Avatar';
import CardBlock from 'mineral-ui/Card/CardBlock';
import { Box } from 'mineral-ui';

class FollowerCard extends React.Component {
  handleClick = () => {
    const { follower, searchUser } = this.props;

    searchUser(follower.login);
  };

  render() {
    const { follower } = this.props;

    const avatar = (
      <Avatar>
        <img src={follower.avatar_url} alt={`Avatar for ${follower.login}`} />
      </Avatar>
    );

    return (
      <Box marginVertical="1rem">
        <Card onClick={this.handleClick}>
          <CardTitle
            subtitle={follower.html_url}
            avatar={avatar}
          >
            {follower.login}
          </CardTitle>
          <CardBlock>{`Repos: ${follower.repos_url}`}</CardBlock>
        </Card>
      </Box>
    );
  }
}

FollowerCard.propTypes = {
  follower: PropTypes.shape({
    avatar_url: PropTypes.string,
    login: PropTypes.string,
    html_url: PropTypes.string,
    repos_url: PropTypes.string,
  }).isRequired,
  searchUser: PropTypes.func.isRequired,
};

export default FollowerCard;
