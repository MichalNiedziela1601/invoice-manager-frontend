describe('AddInvoiceController', function ()
{
    'use strict';

    var uploadCtrl;
    var invoiceDaoMock;
    var companyDaoMock;
    var uibModal;
    var mockTestCompany;
    var mockFoundTestCompany;
    var fakeModal;
    var baseTime;
    var nips;
    var form;
    var UserDAOMock;
    var UploadMock;


    beforeEach(module('app'));

    beforeEach(inject(function ($controller, InvoiceDAO, CompanyDAO, $uibModal, UserDAO,Upload)
    {
        invoiceDaoMock = InvoiceDAO;
        companyDaoMock = CompanyDAO;
        uibModal = $uibModal;
        UserDAOMock = UserDAO;
        UploadMock = Upload;
        form = {
            $valid : true,
            $setPristine: function(){}
        };
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

        spyOn(invoiceDaoMock, 'number').and.callFake(function (year, month)
        {
            var number = {};
            if (2012 === year && 2 === month) {
                number.number = 3;
                return successfulPromise(number);
            } else if (2013 === year && 4 === month) {
                number.number = 1;
                return successfulPromise(number);
            }
            else {
                return unsuccessfulPromise();
            }
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

        spyOn(UserDAO, 'getUserInfo').and.callFake(function ()
        {
            return successfulPromise(mockFoundTestCompany);
        });

        spyOn(companyDaoMock, 'getNips').and.callFake(function (nip)
        {
            if (nip === 12) {
                return successfulPromise(nips);
            } else if (nip === 1233) {
                return successfulPromise([]);
            } else {
                return unsuccessfulPromise('Error with something');
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

        baseTime = new Date();
        jasmine.clock().mockDate(baseTime);

        uploadCtrl = $controller('UploadInvoiceController', {InvoiceDAO: invoiceDaoMock, CompanyDAO: companyDaoMock, $uibModal: uibModal });

    }));


    describe('initialization', function ()
    {
        beforeEach(function ()
        {
            spyOn(window, 'Date').and.callFake(function ()
            {
                return baseTime;
            });
        });

        it('should set transactionType variable to null', function ()
        {
            expect(uploadCtrl.transationType).toEqual(null);
        });
        it('should set showAddInvoice variable to false', function ()
        {
            expect(uploadCtrl.showAddInvoice).toEqual(false);
        });
        it('should set nipContractor variable to null', function ()
        {
            expect(uploadCtrl.nipContractor).toEqual(null);
        });
        it('should set invoiceCompany variable to empty object', function ()
        {
            expect(uploadCtrl.invoiceCompany).toEqual({});
        });
        it('should set invoicePerson variable to empty object', function ()
        {
            expect(uploadCtrl.invoicePerson).toEqual({});
        });
        it('should set companyDetails variable to empty object', function ()
        {
            expect(uploadCtrl.companyDetails).toEqual(null);
        });

        it('should set mockedCompany variable to result from company dao', function ()
        {
            expect(uploadCtrl.mockedCompany).toEqual(mockFoundTestCompany);
        });

        describe('createDatePicker', function ()
        {
            it('should set new date', function ()
            {
                expect(uploadCtrl.createDatePicker.opened).toEqual(false);
            });
            it('should set createDatePicker.options.formatYear property', function ()
            {
                expect(uploadCtrl.createDatePicker.options.formatYear).toEqual('yy');
            });
            it('should set createDatePicker.options.maxDate property', function ()
            {
                expect(uploadCtrl.createDatePicker.options.maxDate).toEqual(baseTime);
            });
            it('should set createDatePicker.options.maxDate property', function ()
            {
                expect(uploadCtrl.createDatePicker.options.startingDay).toEqual(1);
            });
            it('should change createDatePicker.opened property boolean value', function ()
            {
                uploadCtrl.createDatePicker.open();
                expect(uploadCtrl.createDatePicker.opened).toEqual(true);
            });
        });
        describe('executionDatePicker', function ()
        {
            it('should set new date', function ()
            {
                expect(uploadCtrl.executionDatePicker.date).toEqual(baseTime);
            });
            it('should set executionDatePicker.opened property', function ()
            {
                expect(uploadCtrl.executionDatePicker.opened).toEqual(false);
            });
            it('should set executionDatePicker.options.formatYear property', function ()
            {
                expect(uploadCtrl.executionDatePicker.options.formatYear).toEqual('yy');
            });
            it('should set executionDatePicker.options.maxDate property', function ()
            {
                expect(uploadCtrl.executionDatePicker.options.startingDay).toEqual(1);
            });
            it('should change executionDatePicker.opened property boolean value', function ()
            {
                uploadCtrl.executionDatePicker.open();
                expect(uploadCtrl.executionDatePicker.opened).toEqual(true);
            });
        });
    });

    describe('addInvoiceCompany', function ()
    {
        describe('company invoicesDetails exists', function ()
        {
            beforeEach(function ()
            {
                uploadCtrl.companyDetails = mockTestCompany;
                uploadCtrl.transationType = 'test';
                uploadCtrl.createDatePicker.date = new Date('2000-12-15');
                uploadCtrl.executionDatePicker.date = new Date('2001-01-23');
                uploadCtrl.addInvoiceCompany(form);
            });
            describe('always', function ()
            {

                it('should set invoiceCompany.type to transactionType', function ()
                {
                    expect(uploadCtrl.invoiceCompany.type).toEqual('test');
                });
                it('should set invoiceCompany.createDate', function ()
                {
                    expect(uploadCtrl.invoiceCompany.createDate).toEqual('2000-12-15');
                });
                it('should set invoiceCompany.executionEndDate', function ()
                {
                    expect(uploadCtrl.invoiceCompany.executionEndDate).toEqual('2001-01-23');
                });
            });

            describe('checkTypeTransaction', function ()
            {
                describe('sell type', function ()
                {
                    beforeEach(function ()
                    {
                        uploadCtrl.companyDetails.id = 9;
                        uploadCtrl.mockedCompany.id = 2;
                        uploadCtrl.transationType = 'sell';

                        uploadCtrl.addInvoiceCompany(form);
                    });

                    it('should set companyDealer variable', function ()
                    {
                        expect(uploadCtrl.invoiceCompany.companyDealer).toEqual(2);
                    });
                    it('should set companyRecipent variable', function ()
                    {
                        expect(uploadCtrl.invoiceCompany.companyRecipent).toEqual(9);
                    });
                });
                describe('buy type', function ()
                {
                    beforeEach(function ()
                    {
                        uploadCtrl.companyDetails.id = 8;
                        uploadCtrl.mockedCompany.id = 1;
                        uploadCtrl.transationType = 'buy';
                        uploadCtrl.addInvoiceCompany(form);
                    });

                    it('should set companyDealer variable', function ()
                    {
                        expect(uploadCtrl.invoiceCompany.companyDealer).toEqual(8);
                    });
                    it('should set companyRecipent variable', function ()
                    {
                        expect(uploadCtrl.invoiceCompany.companyRecipent).toEqual(1);
                    });
                });

            });
        });
        describe('company invoicesDetails doesn\'t exists', function ()
        {
            beforeEach(function ()
            {
                uploadCtrl.companyDetails = null;
                uploadCtrl.addInvoiceCompany();
            });
            it('should companyNotChosen to true', function ()
            {
                expect(uploadCtrl.companyNotChosen).toEqual(true);
            });
        });
    });

    describe('addInvoicePerson', function ()
    {
        beforeEach(function ()
        {
            uploadCtrl.transationType = 'test';
            uploadCtrl.createDatePicker.date = new Date('2007-12-15');
            uploadCtrl.executionDatePicker.date = new Date('2009-01-23');
            uploadCtrl.addInvoicePerson();
        });
        it('should set invoicePerson.type', function ()
        {
            expect(uploadCtrl.invoicePerson.type).toEqual('test');
        });
        it('should set invoicePerson.createDate', function ()
        {
            expect(uploadCtrl.invoicePerson.createDate).toEqual('2007-12-15');
        });
        it('should set invoicePerson.type', function ()
        {
            expect(uploadCtrl.invoicePerson.executionEndDate).toEqual('2009-01-23');
        });
    });

    describe('findContractor', function ()
    {
        describe('contractor nip is valid', function ()
        {
            beforeEach(function ()
            {
                uploadCtrl.nipContractor = 1234567890;
                uploadCtrl.findContractor();
            });

            it('should call findByNip function', function ()
            {
                expect(companyDaoMock.findByNip).toHaveBeenCalledWith(1234567890);
            });
            it('should set showBox to false', function ()
            {
                expect(uploadCtrl.showBox).toEqual(true);
            });
            it('should set showAlert to false', function ()
            {
                expect(uploadCtrl.showAlert).toEqual(false);
            });
            it('should set showButton to false', function ()
            {
                expect(uploadCtrl.showButton).toEqual(false);
            });
            it('should set companyDetails to proper values from database', function ()
            {
                expect(uploadCtrl.companyDetails).toEqual(mockTestCompany);
            });
        });

        describe('contractor nip is invalid', function ()
        {
            beforeEach(function ()
            {
                uploadCtrl.nipContractor = 9999999999;
                uploadCtrl.findContractor();
            });

            it('should call findByNip function', function ()
            {
                expect(companyDaoMock.findByNip).toHaveBeenCalledWith(9999999999);
            });
            it('should set showBox to false', function ()
            {
                expect(uploadCtrl.showBox).toEqual(false);
            });
            it('should set showAlert to false', function ()
            {
                expect(uploadCtrl.showAlert).toEqual(true);
            });
            it('should set showButton to false', function ()
            {
                expect(uploadCtrl.showButton).toEqual(true);
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
                uploadCtrl.openAddCompanyModal();
                uploadCtrl.modalInstance.close(compDetails);
            });
            it('should call findByNip function', function ()
            {
                expect(companyDaoMock.findByNip).toHaveBeenCalledWith(1234567890);
            });
            it('should set result from findByNip function to companyDetails variable', function ()
            {
                expect(uploadCtrl.companyDetails).toEqual(mockTestCompany);
            });
            it('should set variable showBox to true', function ()
            {
                expect(uploadCtrl.showBox).toEqual(true);
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
                uploadCtrl.findCompaniesByNip(12).then(function(result){
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
                uploadCtrl.findCompaniesByNip(1233).then(function (result)
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
                spyOn(uploadCtrl,'findContractor');
                uploadCtrl.onSelect(nips[0]);
            });
            it('should set nipContractor', function ()
            {
                expect(uploadCtrl.nipContractor).toBe(nips[0].nip);
            });
            it('should call findContractor', function ()
            {
                expect(uploadCtrl.findContractor).toHaveBeenCalled();
            });
        });
    });

    describe('closeAddInvoiceSuccess', function ()
    {
        beforeEach(function ()
        {
            uploadCtrl.closeAddInvoiceSuccess();
        });
        it('should set addInvoice', function ()
        {
            expect(uploadCtrl.addInvoice).toBeFalsy();
        });
    });

    describe('closeFormInvalidAlert', function ()
    {
        it('should set formInvalidAlert', function ()
        {
            uploadCtrl.closeFormInvalidAlert();
            expect(uploadCtrl.formInvalidAlert).toBeTruthy();
        });
    });

    describe('getInvoiceNumber', function ()
    {

        describe('when find number', function ()
        {
            beforeEach(function ()
            {
                uploadCtrl.createDatePicker.date = new Date('2012,2,2');
                uploadCtrl.getInvoiceNumber();
            });
            it('should set invoiceNumber with new number', function ()
            {
                expect(uploadCtrl.invoiceCompany.invoiceNr).toEqual('FV 2012/2/3');
            });
        });
        describe('when not find number', function ()
        {
            beforeEach(function ()
            {
                uploadCtrl.createDatePicker.date = new Date('2013,4,3');
                uploadCtrl.getInvoiceNumber();
            });
            it('should set invoiceNumber with new number', function ()
            {
                expect(uploadCtrl.invoiceCompany.invoiceNr).toEqual('FV 2013/4/1');
            });
        });
    });
});
