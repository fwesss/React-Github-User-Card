import React from 'react';
import PropTypes from 'prop-types';
import IconSearch from 'mineral-ui-icons/IconSearch';
import FormField from 'mineral-ui/Form/FormField';
import TextInput from 'mineral-ui/TextInput';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }

  handleChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { searchUser } = this.props;
    const { value } = this.state;

    searchUser(value);
    this.setState({
      value: '',
    });
  };

  render() {
    const { value } = this.state;
    const searchIcon = <IconSearch />;

    return (
      <form onSubmit={this.handleSubmit}>
        <FormField
          name="search"
          label="Search"
          hideLabel
          value={value}
          input={TextInput}
          onChange={this.handleChange}
          iconEnd={searchIcon}
        />
      </form>
    );
  }
}

Search.propTypes = {
  searchUser: PropTypes.func.isRequired,
};

export default Search;
