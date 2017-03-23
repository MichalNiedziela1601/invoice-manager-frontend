(function ()
{
    'use strict';
    function AppController()
    {
        var ctrl = this;
        ctrl.isCollapse = true;
        ctrl.isCollapsed = true;

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
    }

    angular.module('app').controller('AppController', [AppController]);

})();
