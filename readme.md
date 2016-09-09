# React Native Stack Router

This is a simpler way to use [Navigator](https://facebook.github.io/react-native/docs/navigator.html) with URI driven navigation facilitating simple transfer of data between Screens.

This component provides Navigation and 2 useful utilities to provide Stack Like navigation.

## Quick start

Install:

```
npm install --save rn-stack-router
```

Add it you your application:

First let create a Screen

```javascript

import React from 'react';

import {
    Text,
    Navigator
    Platform
} from 'react-native';

import { NavigationHelper, Screen } from 'rn-stack-router';

export default class MyFirstScreen extends Screen {
    constructor(props) {
        super(props);
    }

    static screenName() {
        return 'myscreen';
    }

    static routeName() {
        return '/myscreen';
    }

    static getDefaultProps() {
        return {
            defaultAnimation: Navigator.SceneConfigs.FadeAndroid,
            useCache: false,
            props: {
                id: 'something'
            }
        };
    }

    render() {
        return (
            <Text>Hello World</Text>
        );
    }
}
```

```javascript

import React from 'react';
import {AppRegistry} from 'react-native';

import { 
    Router, 
    RouteNavigator, 
    NavigationHelper 
} from 'rn-stack-router';

import MyFirstScreen from './MyFirstScreen';

class MyApp extends React.Component {
	render() {
    return <RouteNavigator initialRouteStack={[{name: '/myscreen'}]}
                                           router={this.router}
                                              app={this} />;
  }

  get router() {
        var _router = NavigationHelper.getRouter();

        // Add Routes if empty
        if (!NavigationHelper.hasRoutes()) {
            this.addRoutes();
        }

        // Return the router
        return _router;
    }

  addRoutes() {
      var options = {};
      
      // Add our routes here
      NavigationHelper.addRoute(MyFirstScreen);
  }
}

AppRegistry.registerComponent('MyApp',  () => MyApp);
```

## RouteNavigator

This extends reacts [Navigator](https://facebook.github.io/react-native/docs/navigator.html) class.

- `app` - Application reference to pass to all managed components.
- `Router` - The composed router to use for route navigation.

## Screen

When you define an screen there are some important steps to folow:

1) Your Component must extend from Screen instead of React.Component

```javascript
export default class MyScreen extends Screen {

}
```

2) Define screenName static Method. This method will give the Screen a name

```javascript
static screenName() {
    return 'myscreen';
}
```

3) Define routeName static Method. This method will give the Screen the [route-parser](https://www.npmjs.com/package/route-parser) URI.

```javascript
static routeName() {
    return '/myscreen';
}
```

Optional  

You can define some options on the View using the getDefaultProps static method

```javascript
static getDefaultProps() {
        return {
            defaultAnimation: Navigator.SceneConfigs.FadeAndroid,
            useCache: false,
            props: {
                id: 'something'
            }
        };
    }
```

## How To Navigate

You can navigate using ```NavigationHelper```

Methods:  
- NavigationHelper.push: push the view into the Stack
- NavigationHelper.pop: Navigates back to the previous view on the Stack
- NavigationHelper.replace: Replace the current View from the Stack

Nav Object Components:

- `name` - The name or URI of the route
- `animation` - The animation to use for the transition
- `props` - Additional props to use for the controller
- `body` - The body object to pass to the controller.

Examples:

```javascript
// Go back to previous controller in route stack
NavigationHelper.pop();

// Navigate By URI
NavigationHelper.push('/myscreen/123');

// URI with Non Default Animation
NavigationHelper.push({ 
	name: '/myscreen/123',
	animation: Navigator.SceneConfigs.FadeAndroid,
	props: {
		isRed: true
	},
	body: {
		id: 'my_id'
	}
});

// Navigate By Name
NavigationHelper.push('page1');
NavigationHelper.push({ name: 'page1'});
```

## Reading Navigation Query/Body

***Important*** To receive body and query you must query them from ```componentDidMount```

You can receive URI parameters via ```this.state.query``` and the body object via ```this.state.body```.

### Credits

This Navigation component is heavily inspired on react-native-route-navigator.