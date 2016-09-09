'use strict';

import React from 'react';
import {
  InteractionManager,
  Platform
} from 'react-native';

import NavigationHelper from './NavigationHelper';

class AppScreen extends React.Component {
  constructor(props) {
    super(props);

    NavigationHelper.register(this);

    if(this.props.nav) {
        NavigationHelper.setNavigation(this.props.nav);
    }
  }

  static screenName() {
    return 'screen' + process.hrtime();
  }

  static routeURI() {
    return 'screen' + process.hrtime();
  }

  static defaultProps() {
    return {};
  }

  onFocusReceived() {}

  onBlurReceived() {}
}

module.exports = AppScreen;
