(function(){
    'use strict';

     function ContractorDetailsController($routeParams, CompanyDAO, Person){
        var ctrl = this;
         ctrl.id = $routeParams.id;
         ctrl.type = $routeParams.type;
         if('company' === ctrl.type){
             CompanyDAO.getById(ctrl.id).then(function(result){
                 ctrl.contractor = result;
             })
                     .catch(function(error){
                         console.error(error);
                     });
         } else if ('person' === ctrl.type){
             Person.getById(ctrl.id).then(function(result){
                 ctrl.contractor = result;
             })
                     .catch(function(error) {
                         console.error(error);
                     });
         }


    }
    angular.module('app')
        .controller('ContractorDetailsController', ['$routeParams','CompanyDAO','Person',ContractorDetailsController]);


})();
