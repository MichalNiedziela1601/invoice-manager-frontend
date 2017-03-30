(function ()
{
    'use strict';
    function AppController($rootScope,$location,authManager, jwtHelper,AuthDAO)
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
        $rootScope.$on('$routeChangeStart', function(next, current)
        {

            if (AuthDAO.isAuthenticated()) {
                ctrl.token = jwtHelper.decodeToken(AuthDAO.getToken());
            }
            ctrl.isAuth = authManager.isAuthenticated();

        });
        function logout() {
            AuthDAO.logout();
            $location.path('/');

        }

        ctrl.getToken = getToken;
        ctrl.logout = logout;
    }

    angular.module('app').controller('AppController', ['$rootScope','$location','authManager','jwtHelper','AuthDAO',AppController]);

})();
