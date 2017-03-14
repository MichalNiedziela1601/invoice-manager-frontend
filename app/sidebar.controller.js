(function ()
{
    'use strict';
    function SidebarController($scope)
    {
        $scope.isCollapsed = true;
    }

    angular.module('app').controller('SidebarController', ['$scope', SidebarController]);

})();
