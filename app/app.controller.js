(function ()
{
    'use strict';
    function AppController()
    {
        var ctrl = this;
        ctrl.isCollapsed = true;

        function toggleCollapse()
        {
            ctrl.isCollapsed = !ctrl.isCollapsed;
        }

        ctrl.toggleCollapse = toggleCollapse;
    }

    angular.module('app').controller('AppController', [AppController]);

})();
