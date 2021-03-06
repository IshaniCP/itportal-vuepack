import Vue from 'vue';
import router from 'router';

import store from 'store';

import config from 'config/rest'

var auth = {
    authBaseUrl: config.url,

    user: {
        authenticated: false,
        profile: null
    },

    getAuthUrl: (base, url) => {
        return (base + url);
    },

    signup(_user) {
        let _url = this.getAuthUrl(this.authBaseUrl, 'auth/signup');

        Vue.axios.post(
            _url, _user
        ).then(res => {
            let _data = (res.data);
            if (_data.signedUp == true) {
                store.dispatch('showMessage', _data.message)
                localStorage.setItem('token', res.data.token);
                setTimeout(function() {
                    Vue.auth.login(_user)
                }, 1000)
            } else {
                store.dispatch('showMessage', _data.message)

            }

        }).catch(function(err) {
            console.log(err);
            store.dispatch('showMessage', err.response.data.flashMessage || err.response.data)
        });
    },
    confirm(_token) {
        let _url = this.getAuthUrl(this.authBaseUrl, 'auth/confirm');
        let _token_data = {
            email: this.getUserEmail(),
            token: _token
        }

        // console.log('_token_data', _token_data);

        Vue.axios.post(
            _url, _token_data
        ).then(res => {
            let _data = (res.data);
            if (_data.user.emailConfirmed == true) {
                store.dispatch('showMessage', _data.message)
                localStorage.setItem('token', res.data.token);
                setTimeout(function() {
                    router.push({
                        name: 'Auth_select_dashboard'
                    })
                }, 1000)
            } else {
                store.dispatch('showMessage', _data.message)

            }

        }).catch(function(err) {
            console.log(err);
            store.dispatch('showMessage', err.response.data.flashMessage || err.response.data)
        });
    },
    resendConfirmation() {
        let _url = this.getAuthUrl(this.authBaseUrl, 'auth/resendconfirmation');
        let _token_data = {
            email: this.getUserEmail(),
        }

        console.log('_token_data', _token_data);

        Vue.axios.post(
            _url, _token_data
        ).then(res => {
            let _data = (res.data);
            if (_data.confirmed == true) {
                store.dispatch('showMessage', _data.message)
                localStorage.setItem('token', res.data.token);
                setTimeout(function() {
                    router.push({
                        name: 'Auth_select_dashboard'
                    })
                }, 1000)
            } else {
                store.dispatch('showMessage', _data.flashMessage || 'Confirmation sent. Please check your email')

            }

        }).catch(function(err) {
            console.log(err);
            store.dispatch('showMessage', err.response.data.flashMessage || err.response.data)
            if (err.response.data.signedIn == false) {
                setTimeout(function() {
                    Vue.auth.logout();
                }, 1000)
            }
        });
    },
    login(_user) {
        let _url = this.getAuthUrl(this.authBaseUrl, 'auth/login');

        Vue.axios.post(
            _url, {
                email: _user.email,
                password: _user.password
            }
        ).then(res => {
            console.log(res.data);
            let __user = res.data.user;
            let _token = res.data.token;
            localStorage.setItem('user', JSON.stringify(__user));
            localStorage.setItem('token', _token);

            store.commit('LOGIN');
            store.dispatch('showMessage', 'Successfully signed in.')
            store.commit('CHANGE_USER', __user);
            router.push({
                name: 'Auth_select_dashboard'
            })
        }).catch((msg) => {

            store.dispatch('showMessage', 'Couldn\'t authorize you. Please check.')
        });
    },
    refreshToken(_user) {
        let _url = this.getAuthUrl(this.authBaseUrl, 'auth/refreshtoken');

        Vue.axios.post(
            _url
        ).then(res => {
            console.log('token updated', res.data);
            let _token = res.data.token;
            localStorage.setItem('user', JSON.stringify(__user));
            localStorage.setItem('token', _token);

        }).catch((msg) => {
            store.dispatch('showMessage', 'Failed to refresh your token. Signing you out.')
            setTimeout(function() {
                Vue.auth.logout();
            }, 1000);
        });
    },

    getToken() {
        return localStorage.getItem('token');
    },
    getUser() {
        return JSON.parse(localStorage.getItem('user'));
    },
    setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
        store.commit('CHANGE_USER', user);

    },
    getRoles() {
        let _user = this.getUser();
        let _roles = _user.role;

        return _roles;
    },
    getUserEmail() {
        let _user = this.getUser();

        return _user.email;
    },

    logout() {

        let _url = this.getAuthUrl(this.authBaseUrl, 'auth/logout');

        Vue.axios.post(_url).then(res => {
            console.log(res.data);

            localStorage.removeItem('user');
            localStorage.removeItem('token');

            store.commit('LOGOUT')
            router.push({
                name: 'Home'
            })


            store.dispatch('showMessage', 'Logged out successfully')

        }).catch(() => {
            store.dispatch('showMessage', 'Something went wrong in signing you out.')
        });
    },

    loggedIn() {
        let _loggedIn = !!localStorage.getItem('token') && !!localStorage.getItem('user');
        return _loggedIn;
    },

}

export default auth;