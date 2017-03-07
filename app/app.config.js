(function ()
{
    'use strict';

    function config($locationProvider)
    {
        $locationProvider.hashPrefix('');
        $locationProvider.html5Mode({
            enabled: true, requireBase: false
        });

    }

    angular.module('app').config(config);

})();
