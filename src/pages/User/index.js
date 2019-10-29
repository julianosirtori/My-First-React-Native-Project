import React, { Component } from 'react';
import { TouchableNativeFeedback } from 'react-native';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  Loading,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    loading: false,
    page: 1,
    endlist: false,
    user: {},
  };

  async componentDidMount() {
    const { navigation } = this.props;
    const user = navigation.getParam('user');
    const { page } = this.state;
    this.setState({ loading: true, user });
    const response = await api.get(`/users/${user.login}/starred`, {
      params: { page },
    });

    this.setState({ stars: response.data, loading: false });
  }

  loadMore = async () => {
    const { page, user, stars, endlist } = this.state;
    if (!endlist) {
      const nextPage = page + 1;

      this.setState({ loading: true });
      const response = await api.get(`/users/${user.login}/starred`, {
        params: { page: nextPage },
      });

      if (response.data.length > 0) {
        this.setState({
          stars: [...stars, ...response.data],
          loading: false,
          page: nextPage,
        });
      } else {
        this.setState({ endlist: true, loading: false });
      }
    }
  };

  handleNavigate = repository => {
    const { navigation } = this.props;
    navigation.navigate('Repository', { repository });
  };

  render() {
    const { navigation } = this.props;
    const { stars, loading } = this.state;
    const user = navigation.getParam('user');
    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        {loading && <Loading />}
        <Stars
          onEndReachedThreshold={0.2}
          onEndReached={this.loadMore}
          data={stars}
          keyExtractor={star => String(star.id)}
          renderItem={({ item }) => (
            <TouchableNativeFeedback onPress={() => this.handleNavigate(item)}>
              <Starred>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            </TouchableNativeFeedback>
          )}
        />
      </Container>
    );
  }
}
