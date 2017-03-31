(function ()
{
    'use strict';
    function StartController()
    {
        var ctrl = this;
        ctrl.message = 'Invoice Managment';


    }

    angular.module('app').controller('StartController', [StartController]);

})();
