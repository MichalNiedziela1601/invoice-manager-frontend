describe('AddInvoiceController', function ()
{
    'use strict';

    var addCtrl;
    var invoiceDaoMock;
    var companyDaoMock;
    var uibModal;
    var mockTestCompany;
    var mockFoundTestCompany;
    var fakeModal;
    var baseTime;
    var scope;
    var nips;


    beforeEach(module('app'));

    beforeEach(inject(function ($controller, InvoiceDAO, CompanyDAO, $uibModal, $rootScope)
    {
        invoiceDaoMock = InvoiceDAO;
        companyDaoMock = CompanyDAO;
        uibModal = $uibModal;
        scope = $rootScope.$new();
        mockTestCompany = {
            id: 1, name: 'Firma 1', nip: 1234567890, regon: 6789567, street: 'Spokojna', buildNr: 4, flatNr: 3, postCode: 33 - 100, city: 'Tarnów'
        };

        mockFoundTestCompany = {
            id: '2', name: 'Firma BUDEX', nip: 1224567890, regon: 6189567, street: 'Krakowska', buildNr: 4, flatNr: null, postCode: 33 - 120, city: 'City 1'
        };

        nips = [
            {nip: 1234567890},
            {nip: 1223456789}
        ];


        spyOn(invoiceDaoMock, 'add').and.callFake(function ()
        {
            return successfulPromise('new invoice');
        });

        spyOn(companyDaoMock, 'findByNip').and.callFake(function (booleanValue)
        {
            if (booleanValue === 1234567890) {
                return successfulPromise(mockTestCompany);
            } else if (booleanValue === 1224567890) {
                return successfulPromise(mockFoundTestCompany);
            } else {
                return unsuccessfulPromise();
            }
        });

        spyOn(companyDaoMock, 'getNips').and.callFake(function(nip){
            if(nip === 12){
                return successfulPromise(nips);
            } else if (nip === 1233){
                return successfulPromise([]);
            } else {
                return unsuccessfulPromise();
            }
        });

        fakeModal = {
            result: {
                then: function (confirmCallback, cancelCallback)
                {
                    //Store the callbacks for later when the user clicks on the OK or Cancel button of the dialog
                    this.confirmCallBack = confirmCallback;
                    this.cancelCallback = cancelCallback;
                }
            }, close: function (item)
            {
                //The user clicked OK on the modal dialog, call the stored confirm callback with the selected item
                this.result.confirmCallBack(item);
            }, dismiss: function (type)
            {
                //The user clicked cancel on the modal dialog, call the stored cancel callback
                this.result.cancelCallback(type);
            }
        };

        addCtrl = $controller('AddInvoiceController', {InvoiceDAO: invoiceDaoMock, CompanyDAO: companyDaoMock, $uibModal: uibModal, $scope: scope });

    }));


    describe('initialization', function ()
    {
        beforeEach(function ()
        {
            baseTime = new Date();
            spyOn(window, 'Date').and.callFake(function() {
                return baseTime;
            });
        });

        it('should set transactionType variable to null', function ()
        {
            expect(addCtrl.transationType).toEqual(null);
        });
        it('should set showAddInvoice variable to false', function ()
        {
            expect(addCtrl.showAddInvoice).toEqual(false);
        });
        it('should set nipContractor variable to null', function ()
        {
            expect(addCtrl.nipContractor).toEqual(null);
        });
        it('should set invoiceCompany variable to empty object', function ()
        {
            expect(addCtrl.invoiceCompany).toEqual({});
        });
        it('should set invoicePerson variable to empty object', function ()
        {
            expect(addCtrl.invoicePerson).toEqual({});
        });
        it('should set companyDetails variable to empty object', function ()
        {
            expect(addCtrl.companyDetails).toEqual(null);
        });

        it('should set mockedCompany variable to result from company dao', function ()
        {
            expect(addCtrl.mockedCompany).toEqual(mockFoundTestCompany);
        });

        describe('createDatePicker', function ()
        {
            it('should set new date', function ()
            {
                expect(addCtrl.createDatePicker.opened).toEqual(false);
            });
            it('should set createDatePicker.options.formatYear property', function ()
            {
                expect(addCtrl.createDatePicker.options.formatYear).toEqual('yy');
            });
            it('should set createDatePicker.options.maxDate property', function ()
            {
                expect(addCtrl.createDatePicker.options.maxDate).toEqual(baseTime);
            });
            it('should set createDatePicker.options.maxDate property', function ()
            {
                expect(addCtrl.createDatePicker.options.startingDay).toEqual(1);
            });
            it('should change createDatePicker.opened property boolean value', function ()
            {
                addCtrl.createDatePicker.open();
                expect(addCtrl.createDatePicker.opened).toEqual(true);
            });
        });
        describe('executionDatePicker', function ()
        {
            it('should set new date', function ()
            {
                expect(addCtrl.executionDatePicker.date).toEqual(baseTime);
            });
            it('should set executionDatePicker.opened property', function ()
            {
                expect(addCtrl.executionDatePicker.opened).toEqual(false);
            });
            it('should set executionDatePicker.options.formatYear property', function ()
            {
                expect(addCtrl.executionDatePicker.options.formatYear).toEqual('yy');
            });
            it('should set executionDatePicker.options.maxDate property', function ()
            {
                expect(addCtrl.executionDatePicker.options.startingDay).toEqual(1);
            });
            it('should change executionDatePicker.opened property boolean value', function ()
            {
                addCtrl.executionDatePicker.open();
                expect(addCtrl.executionDatePicker.opened).toEqual(true);
            });
        });
    });

    describe('addInvoiceCompany', function ()
    {
        describe('company invoicesDetails exists', function ()
        {
            beforeEach(function ()
            {
                addCtrl.companyDetails = mockTestCompany;
                addCtrl.transationType = 'test';
                addCtrl.createDatePicker.date = new Date('2000-12-15');
                addCtrl.executionDatePicker.date = new Date('2001-01-23');

                addCtrl.addInvoiceCompany();
            });
            describe('always', function ()
            {

                it('should set invoiceCompany.type to transactionType', function ()
                {
                    expect(addCtrl.invoiceCompany.type).toEqual('test');
                });
                it('should set invoiceCompany.createDate', function ()
                {
                    expect(addCtrl.invoiceCompany.createDate).toEqual('2000-12-15');
                });
                it('should set invoiceCompany.executionEndDate', function ()
                {
                    expect(addCtrl.invoiceCompany.executionEndDate).toEqual('2001-01-23');
                });
            });

            describe('checkTypeTransaction', function ()
            {
                describe('sell type', function ()
                {
                    beforeEach(function ()
                    {
                        addCtrl.companyDetails.id = 9;
                        addCtrl.mockedCompany.id = 2;
                        addCtrl.transationType = 'sell';
                        addCtrl.addInvoiceCompany();
                    });

                    it('should set companyDealer variable', function ()
                    {
                        expect(addCtrl.invoiceCompany.companyDealer).toEqual(2);
                    });
                    it('should set companyRecipent variable', function ()
                    {
                        expect(addCtrl.invoiceCompany.companyRecipent).toEqual(9);
                    });
                });
                describe('buy type', function ()
                {
                    beforeEach(function ()
                    {
                        addCtrl.companyDetails.id = 8;
                        addCtrl.mockedCompany.id = 1;
                        addCtrl.transationType = 'buy';
                        addCtrl.addInvoiceCompany();
                    });

                    it('should set companyDealer variable', function ()
                    {
                        expect(addCtrl.invoiceCompany.companyDealer).toEqual(8);
                    });
                    it('should set companyRecipent variable', function ()
                    {
                        expect(addCtrl.invoiceCompany.companyRecipent).toEqual(1);
                    });
                });

            });
        });
        describe('company invoicesDetails doesn\'t exists', function ()
        {
            beforeEach(function ()
            {
                addCtrl.companyDetails = null;
                addCtrl.addInvoiceCompany();
            });
            it('should companyNotChosen to true', function ()
            {
                expect(addCtrl.companyNotChosen).toEqual(true);
            });
        });
    });

    describe('addInvoicePerson', function ()
    {
        beforeEach(function ()
        {
            addCtrl.transationType = 'test';
            addCtrl.createDatePicker.date = new Date('2007-12-15');
            addCtrl.executionDatePicker.date = new Date('2009-01-23');
            addCtrl.addInvoicePerson();
        });
        it('should set invoicePerson.type', function ()
        {
            expect(addCtrl.invoicePerson.type).toEqual('test');
        });
        it('should set invoicePerson.createDate', function ()
        {
            expect(addCtrl.invoicePerson.createDate).toEqual('2007-12-15');
        });
        it('should set invoicePerson.type', function ()
        {
            expect(addCtrl.invoicePerson.executionEndDate).toEqual('2009-01-23');
        });
    });

    describe('findContractor', function ()
    {
        describe('contractor nip is valid', function ()
        {
            beforeEach(function ()
            {
                addCtrl.nipContractor = 1234567890;
                addCtrl.findContractor();
            });

            it('should call findByNip function', function ()
            {
                expect(companyDaoMock.findByNip).toHaveBeenCalledWith(1234567890);
            });
            it('should set showBox to false', function ()
            {
                expect(addCtrl.showBox).toEqual(true);
            });
            it('should set showAlert to false', function ()
            {
                expect(addCtrl.showAlert).toEqual(false);
            });
            it('should set showButton to false', function ()
            {
                expect(addCtrl.showButton).toEqual(false);
            });
            it('should set companyDetails to proper values from database', function ()
            {
                expect(addCtrl.companyDetails).toEqual(mockTestCompany);
            });
        });

        describe('contractor nip is invalid', function ()
        {
            beforeEach(function ()
            {
                addCtrl.nipContractor = 9999999999;
                addCtrl.findContractor();
            });

            it('should call findByNip function', function ()
            {
                expect(companyDaoMock.findByNip).toHaveBeenCalledWith(9999999999);
            });
            it('should set showBox to false', function ()
            {
                expect(addCtrl.showBox).toEqual(false);
            });
            it('should set showAlert to false', function ()
            {
                expect(addCtrl.showAlert).toEqual(true);
            });
            it('should set showButton to false', function ()
            {
                expect(addCtrl.showButton).toEqual(true);
            });
        });
    });

    describe('addCompany modal', function ()
    {
        describe('when ok', function ()
        {
            beforeEach(function ()
            {
                spyOn(uibModal, 'open').and.returnValue(fakeModal);
                var compDetails = {nip: 1234567890};
                addCtrl.openAddCompanyModal();
                addCtrl.modalInstance.close(compDetails);
            });
            it('should call findByNip function', function ()
            {
                expect(companyDaoMock.findByNip).toHaveBeenCalledWith(1234567890);
            });
            it('should set result from findByNip function to companyDetails variable', function ()
            {
                expect(addCtrl.companyDetails).toEqual(mockTestCompany);
            });
            it('should set variable showBox to true', function ()
            {
                expect(addCtrl.showBox).toEqual(true);
            });
        });
    });

    describe('findCompaniesByNip', function ()
    {
        var nipsResult;
        describe('when pass valid part of nip', function ()
        {
            beforeEach(function ()
            {
                addCtrl.findCompaniesByNip(12).then(function(result){
                    nipsResult = result;
                });
            });
            it('should call CompanyDAO.getNips', function ()
            {
                expect(companyDaoMock.getNips).toHaveBeenCalled();
            });
            it('should call CompanyDAO.getNIps with args', function ()
            {
                expect(companyDaoMock.getNips).toHaveBeenCalledWith(12);
            });
            it('should return array of nips', function ()
            {
                expect(nipsResult).toEqual(nips);
            });
        });

        describe('when not pass valid part of nip', function ()
        {
            beforeEach(function ()
            {
                addCtrl.findCompaniesByNip(1233).then(function (result)
                {
                    nipsResult = result;
                });
            });
            it('should return empty array', function ()
            {
                expect(nipsResult).toEqual([]);
            });
        });
    });

    describe('onSelect', function ()
    {
        describe('when choose nip from typehead', function ()
        {
            beforeEach(function ()
            {
                spyOn(addCtrl,'findContractor');
                scope.onSelect(nips[0]);
            });
            it('should set nipContractor', function ()
            {
                expect(addCtrl.nipContractor).toBe(nips[0].nip);
            });
            it('should call findContractor', function ()
            {
                expect(addCtrl.findContractor).toHaveBeenCalled();
            });
        });
    });
});
