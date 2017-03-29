(function ()
{
    'use strict';

    function config($locationProvider, $compileProvider)
    {
        $locationProvider.hashPrefix('');
        $locationProvider.html5Mode({
            enabled: true, requireBase: false
        });
        $compileProvider.preAssignBindingsEnabled(true);


    }

    angular.module('app').config(config);

})();
