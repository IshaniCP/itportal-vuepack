import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import _ from 'lodash'

import Home from '../views/Home'

import Auth from '../views/Auth'
import Login from '../views/Auth/Login'
import Signup from '../views/Auth/Signup'

import Dashboard from '../views/Auth/SelectAccount'
import DashboardConfirm from '../views/Auth/ConfirmEmail'
import StudentDashboard from '../views/Student/Dashboard'
import OrganizationDashboard from '../views/Organization/Dashboard'
import StaffDashboard from '../views/Staff/Dashboard'
import AdminDashboard from '../views/Admin/Dashboard'

import StudentDashboard_Summary from '../views/Student/Components/Summary'
import StudentDashboard_Tasks from '../views/Student/Components/Tasks'
import StudentDashboard_EditProfile from '../views/Student/Components/EditProfile'
import StudentDashboard_Settings from '../views/Student/Components/Settings'


import GettingStarted from '../views/Misc/GettingStarted'
import AllStudents from '../views/Misc/AllStudents'
import AllOrganizations from '../views/Misc/AllOrganizations'

Vue.use(Router)
Vue.use(VueAxios, axios)

Vue.axios.interceptors.request.use((config) => {
    var token = Vue.auth.getToken();

    if (token) {
        config.headers['authorization'] = 'Bearer ' + token;
    }

    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    config.headers['Expires'] = '-1';
    config.headers['Cache-Control'] = "no-cache,no-store,must-revalidate,max-age=-1,private";

    return config;

});

var router = new Router({
    mode: 'history',
    root: '/',
    routes: [{
            path: '/',
            name: 'Home',
            component: Home,
        }, {
            path: '/all/students',
            component: AllStudents,
            meta: {
                auth: true
            },
            exact: true
        }, {
            path: '/all/organizations',
            component: AllOrganizations,
            meta: {
                auth: true
            },
            exact: true
        }, {
            path: '/gettingstarted',
            component: GettingStarted
        }, {
            path: '/auth',
            component: Auth,
            children: [{
                name: 'Auth_login',
                path: 'login',
                component: Login,
                meta: {
                    auth: false
                }
            }, {
                name: 'Auth_signup',
                path: 'signup',
                component: Signup,
                meta: {
                    auth: false
                }
            }, {
                path: '*',
                redirect: '/auth/login'
            }]
        },


        {
            path: '/dashboard/confirm/:token',
            component: DashboardConfirm,
            name: 'Auth_confirm_dashboard',
            meta: {
                auth: true
            },
            props: true
        },
        {
            path: '/dashboard',
            component: Dashboard,
            name: 'Auth_select_dashboard',
            meta: {
                auth: true
            },
            beforeEnter: (to, from, next) => {

                let _role = Vue.auth.getRoles();
                if(_.isArray(_role) && _role.length > 1){
                    next()
                } else {
                    if(_.isEqual(_role[0], 'STUDENT')){ next({name: 'Student_dashboard_summary'}) }
                    else if(_.isEqual(_role[0], 'COMPANY')){ next({name: 'Organization_dashboard'}) }
                    else if(_.isEqual(_role[0], 'STAFF')){ next({name: 'Staff_dashboard'}) }
                    else if(_.isEqual(_role[0], 'ADMIN')){ next({name: 'Admin_dashboard'}) }
                    else{ console.log('_role', _role); next() }
                }

            }
        }, {
            path: '/student',
            component: StudentDashboard,
            name: 'Student_dashboard',
            meta: {
                auth: true
            },
            children: [
                {name: 'Student_dashboard_summary', path: '', component: StudentDashboard_Summary },
                {name: 'Student_dashboard_tasks', path: 'tasks', component: StudentDashboard_Tasks },
                {name: 'Student_dashboard_editprofile', path: 'editprofile', component: StudentDashboard_EditProfile },
                {name: 'Student_dashboard_settings', path: 'settings', component: StudentDashboard_Settings },
            ]
        }, {
            path: '/organization',
            component: OrganizationDashboard,
            name: 'Organization_dashboard',
            meta: {
                auth: true
            }
        }, {
            path: '/staff',
            component: StaffDashboard,
            name: 'Staff_dashboard',
            meta: {
                auth: true
            }
        }, {
            path: '/admin',
            component: AdminDashboard,
            name: 'Admin_dashboard',
            meta: {
                auth: true
            }
        },

    ],
    linkActiveClass: 'active'
});

router.beforeEach((to, from, next) => {
    
    var _loggedIn = Vue.auth.loggedIn();
    var _metaAuth = to.meta.auth;

    if (_loggedIn && (_metaAuth === false)) {
        next({
            name: 'Auth_select_dashboard'
        });
    } else if (!_loggedIn && (_metaAuth === true)) {
        next({
            name: 'Auth_login'
        });
    }
    next();

})
export default router;