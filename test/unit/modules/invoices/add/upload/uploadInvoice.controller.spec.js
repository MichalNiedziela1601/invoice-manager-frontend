describe('UploadInvoiceController', function ()
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
    var UploadMock;
    var $window;

    beforeEach(module('app'));

    beforeEach(inject(function ($controller, InvoiceDAO, CompanyDAO, $uibModal, Upload, _$window_)
    {
        invoiceDaoMock = InvoiceDAO;
        companyDaoMock = CompanyDAO;
        uibModal = $uibModal;

        $window = _$window_;

        $window.sessionStorage.setItem('userInfo', angular.toJson({
            id: 2, name: 'Firma BUDEX', nip: 1224567890, regon: 6189567, street: 'Krakowska', buildNr: 4, flatNr: null, postCode: '33-120', city: 'City 1'
        }));

        mockFoundTestCompany = angular.fromJson($window.sessionStorage.getItem('userInfo'));
        form = {
            $valid: true,
            $setPristine: function ()
            {
            }
        };
        mockTestCompany = {
            id: 1, name: 'Firma 1', nip: 1234567890, regon: 6789567, street: 'Spokojna', buildNr: 4, flatNr: 3, postCode: 33 - 100, city: 'Tarnów'
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

        UploadMock = jasmine.createSpyObj('Upload', ['upload']);

        baseTime = new Date();
        jasmine.clock().mockDate(baseTime);

        uploadCtrl = $controller('UploadInvoiceController',
                {InvoiceDAO: invoiceDaoMock, CompanyDAO: companyDaoMock, $uibModal: uibModal, $window: $window, Upload: UploadMock});

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
        it('should set showAddInvoice variable to false', function ()
        {
            expect(uploadCtrl.showAddInvoice).toEqual(false);
        });
        it('should set nipContractor variable to null', function ()
        {
            expect(uploadCtrl.nipContractor).toEqual(null);
        });
        it('should set invoiceCompany variable', function ()
        {
            expect(uploadCtrl.invoiceCompany).toEqual({
                status: 'unpaid', products: {}, reverseCharge: false, paymentMethod: 'bank transfer', dealerAccountNr: null
            });
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

    describe('calculateNettoBrutto', function ()
    {
        describe('when product has amount', function ()
        {
            beforeEach(function ()
            {

                uploadCtrl.invoiceCompany.products[0] = {name: 'Product 1', netto: 345.45, vat: 23, amount: 1, brutto: 424.9};
                uploadCtrl.invoiceCompany.products[1] = {name: 'Product 2', netto: 456.78, vat: 5, amount: 2, brutto: 959.24};
                uploadCtrl.calculateNettoBrutto();
            });
            it('should set netto', function ()
            {
                expect(uploadCtrl.invoiceCompany.nettoValue).toEqual(1259.01);
            });
            it('should set brutto', function ()
            {
                expect(uploadCtrl.invoiceCompany.bruttoValue).toEqual(1384.14);
            });
        });

        describe('when product don\'t have amount', function ()
        {
            beforeEach(function ()
            {

                uploadCtrl.invoiceCompany.products[0] = {name: 'Product 1', netto: 345.45, vat: 23, brutto: 345.45};
                uploadCtrl.invoiceCompany.products[1] = {name: 'Product 2', netto: 456.78, vat: 5, brutto: 456.78};
                uploadCtrl.calculateNettoBrutto();
            });
            it('should set netto', function ()
            {
                expect(uploadCtrl.invoiceCompany.nettoValue).toEqual(802.23);
            });
            it('should set brutto', function ()
            {
                expect(uploadCtrl.invoiceCompany.bruttoValue).toEqual(802.23);
            });
        });

    });

    describe('addInvoiceCompany', function ()
    {
        describe('company invoicesDetails exists and contractorType is company', function ()
        {
            beforeEach(function ()
            {
                UploadMock.upload.and.callFake(function ()
                {
                    return successfulPromise();
                });
                uploadCtrl.invoiceCompany.dealerAccountNr = '0';
                uploadCtrl.companyDetails = mockTestCompany;
                uploadCtrl.invoiceCompany.contractorType = 'company';
                uploadCtrl.createDatePicker.date = new Date('2000-12-15');
                uploadCtrl.executionDatePicker.date = new Date('2001-01-23');

                uploadCtrl.addInvoiceCompany(form);
            });
            it('should set showLoader', function ()
            {
                expect(uploadCtrl.showLoader).toBeFalsy();
            });
            it('should set companyNotChosen', function ()
            {
                expect(uploadCtrl.companyNotChosen).toBeFalsy();
            });
            it('should set addInvoice', function ()
            {
                expect(uploadCtrl.addInvoice).toBeTruthy();
            });
            it('should set createDatePicker.date', function ()
            {
                expect(uploadCtrl.createDatePicker.date).toEqual(baseTime);
            });
            it('should set executionEndDate.date', function ()
            {
                expect(uploadCtrl.executionDatePicker.date).toEqual(baseTime);
            });
            it('should set invoiceCompany', function ()
            {
                expect(uploadCtrl.invoiceCompany).toEqual({status: 'unpaid', products: {}, reverseCharge: false, paymentMethod: 'bank transfer'});
            });
            it('should set file', function ()
            {
                expect(uploadCtrl.file).toBeNull();
            });
            it('should set formSubmitted', function ()
            {
                expect(uploadCtrl.formSubmitted).toBeFalsy();
            });
            it('should call InvoiceDAO.number', function ()
            {
                expect(invoiceDaoMock.number).toHaveBeenCalled();
            });


        });

        describe('company invoicesDetails exists and contractorType is person', function ()
        {
            beforeEach(function ()
            {
                UploadMock.upload.and.callFake(function ()
                {
                    return successfulPromise();
                });
                uploadCtrl.invoiceCompany.dealerAccountNr = '0';
                uploadCtrl.companyDetails = mockTestCompany;
                uploadCtrl.invoiceCompany.contractorType = 'person';
                uploadCtrl.createDatePicker.date = new Date('2000-12-15');
                uploadCtrl.executionDatePicker.date = new Date('2001-01-23');

                uploadCtrl.addInvoiceCompany(form);
            });
            it('should set showLoader', function ()
            {
                expect(uploadCtrl.showLoader).toBeFalsy();
            });
            it('should set companyNotChosen', function ()
            {
                expect(uploadCtrl.companyNotChosen).toBeFalsy();
            });
            it('should set addInvoice', function ()
            {
                expect(uploadCtrl.addInvoice).toBeTruthy();
            });
            it('should set createDatePicker.date', function ()
            {
                expect(uploadCtrl.createDatePicker.date).toEqual(baseTime);
            });
            it('should set executionEndDate.date', function ()
            {
                expect(uploadCtrl.executionDatePicker.date).toEqual(baseTime);
            });
            it('should set invoiceCompany', function ()
            {
                expect(uploadCtrl.invoiceCompany).toEqual({status: 'unpaid', products: {}, reverseCharge: false, paymentMethod: 'bank transfer'});
            });
            it('should set file', function ()
            {
                expect(uploadCtrl.file).toBeNull();
            });
            it('should set formSubmitted', function ()
            {
                expect(uploadCtrl.formSubmitted).toBeFalsy();
            });
            it('should call InvoiceDAO.number', function ()
            {
                expect(invoiceDaoMock.number).toHaveBeenCalled();
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

        describe('when upload throw error', function ()
        {
            beforeEach(function ()
            {
                UploadMock.upload.and.callFake(function ()
                {
                    return unsuccessfulPromise({data: 'error'});
                });
                uploadCtrl.invoiceCompany.dealerAccountNr = '0';
                uploadCtrl.companyDetails = mockTestCompany;
                uploadCtrl.createDatePicker.date = new Date('2000-12-15');
                uploadCtrl.executionDatePicker.date = new Date('2001-01-23');

                uploadCtrl.addInvoiceCompany(form);
            });
            it('should set errorMessage', function ()
            {
                expect(uploadCtrl.errorMessage).toEqual('error');
            });
            it('should set formInvalidAlert', function ()
            {
                expect(uploadCtrl.formInvalidAlert).toBeTruthy();
            });
            it('should set formSubmitted', function ()
            {
                expect(uploadCtrl.formSubmitted).toBeFalsy();
            });
        });

        describe('when dealer account not chosen', function ()
        {
            beforeEach(function ()
            {

                uploadCtrl.companyDetails = mockTestCompany;
                uploadCtrl.createDatePicker.date = new Date('2000-12-15');
                uploadCtrl.executionDatePicker.date = new Date('2001-01-23');

                uploadCtrl.addInvoiceCompany(form);
            });
            it('should set showAccountNotChosen to true', function ()
            {
                expect(uploadCtrl.showAccountNotChosen).toBeTruthy();
            });
        });
        describe('when paymentMethod is cash', function ()
        {
            beforeEach(function ()
            {
                uploadCtrl.companyDetails = mockTestCompany;
                uploadCtrl.invoiceCompany.paymentMethod = 'cash';
                UploadMock.upload.and.callFake(function ()
                {
                    return unsuccessfulPromise({data: 'error'});
                });

                uploadCtrl.addInvoiceCompany(form);
            });
            it('should set dealerAccountNr to null', function ()
            {
                expect(uploadCtrl.invoiceCompany.dealerAccountNr).toBeNull();
            });
        });
    });

    describe('closeNoCompanyAlert', function ()
    {
        beforeEach(function ()
        {
            uploadCtrl.closeNoCompanyAlert();
        });
        it('should set companyNotChose to false', function ()
        {
            expect(uploadCtrl.companyNotChosen).toBeFalsy();
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

    describe('closeAccountNotChosen', function ()
    {
        beforeEach(function ()
        {
            uploadCtrl.closeAccountNotChosen();
        });
        it('should set showAccountNotChosen to false', function ()
        {
            expect(uploadCtrl.showAccountNotChosen).toBeFalsy();
        });
    });
});
