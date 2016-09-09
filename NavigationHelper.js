'use strict';

import {
    BackAndroid,
    Platform
} from 'react-native';

import Router from './Router';

// a Global Navigation
var NavigationHelper = {
    router: new Router(),

    routes: {},

    // Internal Stack
    _stack: [],

    // Just for Android
    _backLocked: false,
    _backListener: undefined,
    // Just for Android

    getRouter() {
        return NavigationHelper.router;
    },

    addRoute(AppScreen, name) {
        if (!name) {
            name = AppScreen.screenName();
        }

        NavigationHelper.router.addRoute(name, AppScreen.routeName(), AppScreen, AppScreen.defaultProps());
    },

    hasRoutes() {
        return (Object.keys(NavigationHelper.router.URIRoutes).length > 0);
    },

    normalizeRouteName(name) {
        return name.toLowerCase();
    },

    normalizeRoute(data) {
        if (typeof (data) == 'string') {
            return data;
        } else {
            return data.name;
        }
    },

    setNavigation(nav) {
        global._nav = nav;

        // Set back listener on Android
        if (Platform.OS == 'android') {
            BackAndroid.addEventListener('hardwareBackPress', () => {
                if (!NavigationHelper.isBackLocked()) {
                    return NavigationHelper.goBack(true);
                } else {
                    NavigationHelper.lockedBackButtonPressed();
                }

                return true;
            });
        }
    },

    register(ref) {
        NavigationHelper.routes[NavigationHelper.normalizeRouteName(ref.constructor.name)] = ref;
    },

    // Events

    focusEvent() {
        try {
            var data = NavigationHelper.getCurrentRoute();

            var c_route = NavigationHelper.router.getRoute(data).route;

            NavigationHelper.routes[NavigationHelper.normalizeRouteName(c_route.name)].onFocusReceived();
        } catch (e) { }
    },

    /**
     *
     * Always over the current route before navigate
     *
     */
    blurEvent() {
        try {
            var data = NavigationHelper.getCurrentRoute();

            var c_route = NavigationHelper.router.getRoute(data).route;

            NavigationHelper.routes[NavigationHelper.normalizeRouteName(c_route.name)].onBlurReceived();
        } catch (e) { }
    },

    replace(data) {
        NavigationHelper.blurEvent();

        if (NavigationHelper._stack.length === 0) {
            NavigationHelper._stack.push(NavigationHelper.normalizeRoute(data));
        } else {
            NavigationHelper._stack.pop(); // Remove the current one
            NavigationHelper._stack.push(NavigationHelper.normalizeRoute(data)); // Insert the new one
        }

        global._nav.replace(data);

        NavigationHelper.focusEvent();
    },

    push(data) {
        // Trigger event to Current Component
        NavigationHelper.blurEvent();

        NavigationHelper._stack.push(NavigationHelper.normalizeRoute(data));
        global._nav.push(data);

        NavigationHelper.focusEvent();
    },

    pop() {
        NavigationHelper.blurEvent();

        NavigationHelper._stack.pop();
        global._nav.pop();

        NavigationHelper.focusEvent();
    },

    // Just for Android
    lockBackButton(listener) {
        NavigationHelper._backLocked = true;

        // If it's coming set the listener
        NavigationHelper.setBackButtonListener(listener);
    },

    unlockBackButton() {
        NavigationHelper._backLocked = false;
        NavigationHelper._backListener = undefined;
    },

    isBackLocked() {
        return NavigationHelper._backLocked;
    },

    setBackButtonListener(listener) {
        NavigationHelper._backListener = listener;
    },

    lockedBackButtonPressed() {
        if (NavigationHelper._backListener !== undefined) {
            NavigationHelper._backListener();
        }
    },
    // Just for Android

    getCurrentRoute() {
        var current = NavigationHelper._stack[(NavigationHelper._stack.length - 1)];

        return current;
    },

    goBack: (mustExit) => {
        if (NavigationHelper._stack.length > 1) {
            NavigationHelper.pop();
        } else if (mustExit && Platform.OS == 'android') {
            BackAndroid.exitApp();
        }

        return true;
    }
};

module.exports = NavigationHelper;
