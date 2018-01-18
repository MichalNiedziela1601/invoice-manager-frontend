(function ()
{
    'use strict';
    function AppController($rootScope,$location,authManager, jwtHelper,UserDAO)
    {
        var ctrl = this;
        ctrl.isCollapse = true;
        ctrl.isCollapsed = true;
        ctrl.email = 'sunday1601@gmail.com';

        function toggleCollapsed()
        {
            ctrl.isCollapse = !ctrl.isCollapse;
            ctrl.isCollapsed = true;
        }

        function toggleCollapse()
        {
            ctrl.isCollapsed = !ctrl.isCollapsed;
            ctrl.isCollapse = true;

        }

        ctrl.toggleCollapsed = toggleCollapsed;
        ctrl.toggleCollapse = toggleCollapse;


        function getToken(){
            return ctrl.token;
        }
        $rootScope.$on('$routeChangeStart', function()
        {

            if (UserDAO.isAuthenticated()) {
                ctrl.token = jwtHelper.decodeToken(UserDAO.getToken());
            }
            ctrl.isAuth = authManager.isAuthenticated();

        });
        function logout() {
            UserDAO.logout();
            $location.path('/');

        }

        ctrl.getToken = getToken;
        ctrl.logout = logout;
    }

    angular.module('app').controller('AppController', ['$rootScope','$location','authManager','jwtHelper','UserDAO',AppController]);

})();
