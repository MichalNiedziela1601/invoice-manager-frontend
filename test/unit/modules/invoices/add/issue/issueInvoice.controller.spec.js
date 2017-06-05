describe('IssueInvoiceController', function ()
{
    'use strict';
    var issueCtrl;
    var invoiceDaoMock;
    var companyDaoMock;
    var uibModal;
    var mockTestCompany;
    var mockFoundTestCompany;
    var fakeModal;
    var baseTime;
    var nips;
    var form;
    var productsMock;
    var $window;

    beforeEach(module('app'));

    beforeEach(inject(function ($controller, InvoiceDAO, CompanyDAO, $uibModal, _$window_)
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
            $setPristine: angular.noop
        };
        mockTestCompany = {
            id: 1, name: 'Firma 1', nip: 1234567890, regon: 6789567, street: 'Spokojna', buildNr: 4, flatNr: 3, postCode: 33 - 100, city: 'Tarnów'
        };


        nips = [
            {nip: 1234567890},
            {nip: 1224567890}
        ];

        productsMock = {name: 'Product 1', netto: 345.45, vat: 23, amount: 1, brutto: 446.78};

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

        baseTime = new Date();
        jasmine.clock().mockDate(baseTime);

        issueCtrl = $controller('IssueInvoiceController', {
            InvoiceDAO: invoiceDaoMock, CompanyDAO: companyDaoMock, $uibModal: uibModal,
            $window: $window
        });

    }));

    describe('closeNoCompanyAlert', function ()
    {
        beforeEach(function ()
        {
            issueCtrl.closeNoCompanyAlert();
        });
        it('should set issueCompanyNotChosen', function ()
        {
            expect(issueCtrl.issueCompanyNotChosen).toBeFalsy();
        });
    });


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
            expect(issueCtrl.transationType).toEqual('sell');
        });
        it('should set showAddInvoice variable to false', function ()
        {
            expect(issueCtrl.showAddInvoice).toEqual(false);
        });

        it('should set invoiceCompany variable to empty object', function ()
        {
            expect(issueCtrl.invoiceCompany).toEqual({products: {}, status: 'unpaid', reverseCharge: false, showAmount: false, paymentMethod: 'bank transfer'});
        });
        it('should set companyDetails variable to empty object', function ()
        {
            expect(issueCtrl.companyDetails).toEqual(null);
        });

        it('should set mockedCompany variable to result from company dao', function ()
        {
            expect(issueCtrl.mockedCompany).toEqual(mockFoundTestCompany);
        });
        it('should set issueCompanyNotChosen', function ()
        {
            expect(issueCtrl.issueCompanyNotChosen).toBeFalsy();
        });
        it('should set noResult', function ()
        {
            expect(issueCtrl.noResult).toBeFalsy();
        });
        it('should should set formInvalidAlert', function ()
        {
            expect(issueCtrl.formInvalidAlert).toBeFalsy();
        });
        it('should set formSubmitted', function ()
        {
            expect(issueCtrl.formSubmitted).toBeFalsy();
        });
        it('should set issueProductNotAdded', function ()
        {
            expect(issueCtrl.issueProductNotAdded).toBeFalsy();
        });
        it('should set payment', function ()
        {
            expect(issueCtrl.payment).toEqual([{type: 'cash'}, {type: 'bank transfer'}]);
        });
        it('should set deleteCount', function ()
        {
            expect(issueCtrl.deleteCount).toBe(0);
        });

        describe('createDatePicker', function ()
        {
            it('should set new date', function ()
            {
                expect(issueCtrl.createDatePicker.opened).toEqual(false);
            });
            it('should set createDatePicker.options.formatYear property', function ()
            {
                expect(issueCtrl.createDatePicker.options.formatYear).toEqual('yy');
            });
            it('should set createDatePicker.options.maxDate property', function ()
            {
                expect(issueCtrl.createDatePicker.options.maxDate).toEqual(baseTime);
            });
            it('should set createDatePicker.options.maxDate property', function ()
            {
                expect(issueCtrl.createDatePicker.options.startingDay).toEqual(1);
            });
            it('should change createDatePicker.opened property boolean value', function ()
            {
                issueCtrl.createDatePicker.open();
                expect(issueCtrl.createDatePicker.opened).toEqual(true);
            });
        });
        describe('executionDatePicker', function ()
        {
            it('should set new date', function ()
            {
                expect(issueCtrl.executionDatePicker.date).toEqual(baseTime);
            });
            it('should set executionDatePicker.opened property', function ()
            {
                expect(issueCtrl.executionDatePicker.opened).toEqual(false);
            });
            it('should set executionDatePicker.options.formatYear property', function ()
            {
                expect(issueCtrl.executionDatePicker.options.formatYear).toEqual('yy');
            });
            it('should set executionDatePicker.options.maxDate property', function ()
            {
                expect(issueCtrl.executionDatePicker.options.startingDay).toEqual(1);
            });
            it('should change executionDatePicker.opened property boolean value', function ()
            {
                issueCtrl.executionDatePicker.open();
                expect(issueCtrl.executionDatePicker.opened).toEqual(true);
            });
        });
    });


    describe('getInvoiceNumber', function ()
    {

        describe('when find number', function ()
        {
            beforeEach(function ()
            {
                issueCtrl.createDatePicker.date = new Date('2012,2,2');
                issueCtrl.getInvoiceNumber();
            });
            it('should set invoiceNumber with new number', function ()
            {
                expect(issueCtrl.invoiceCompany.invoiceNr).toEqual('FV 2012/2/3');
            });
        });
        describe('when not find number', function ()
        {
            beforeEach(function ()
            {
                issueCtrl.createDatePicker.date = new Date('2013,4,3');
                issueCtrl.getInvoiceNumber();
            });
            it('should set invoiceNumber with new number', function ()
            {
                expect(issueCtrl.invoiceCompany.invoiceNr).toEqual('FV 2013/4/1');
            });
        });
    });


    describe('closeAddInvoiceSuccess', function ()
    {
        beforeEach(function ()
        {
            issueCtrl.closeAddInvoiceSuccess();
        });
        it('should set addInvoice', function ()
        {
            expect(issueCtrl.addInvoice).toBeFalsy();
        });
    });

    describe('closeFormInvalidAlert', function ()
    {
        it('should set formInvalidAlert', function ()
        {
            issueCtrl.closeFormInvalidAlert();
            expect(issueCtrl.formInvalidAlert).toBeTruthy();
        });
    });

    describe('calculateNettoBrutto', function ()
    {
        describe('when product has amount', function ()
        {
            beforeEach(function ()
            {

                issueCtrl.invoiceCompany.products[0] = {name: 'Product 1', netto: 345.45, vat: 23, amount: 1, brutto: 424.9};
                issueCtrl.invoiceCompany.products[1] = {name: 'Product 2', netto: 456.78, vat: 5, amount: 2, brutto: 959.24};
                issueCtrl.calculateNettoBrutto();
            });
            it('should set netto', function ()
            {
                expect(issueCtrl.invoiceCompany.nettoValue).toEqual(1259.01);
            });
            it('should set brutto', function ()
            {
                expect(issueCtrl.invoiceCompany.bruttoValue).toEqual(1384.14);
            });
        });

        describe('when product don\'t have amount', function ()
        {
            beforeEach(function ()
            {

                issueCtrl.invoiceCompany.products[0] = {name: 'Product 1', netto: 345.45, vat: 23, brutto: 345.45};
                issueCtrl.invoiceCompany.products[1] = {name: 'Product 2', netto: 456.78, vat: 5, brutto: 456.78};
                issueCtrl.calculateNettoBrutto();
            });
            it('should set netto', function ()
            {
                expect(issueCtrl.invoiceCompany.nettoValue).toEqual(802.23);
            });
            it('should set brutto', function ()
            {
                expect(issueCtrl.invoiceCompany.bruttoValue).toEqual(802.23);
            });
        });

    });

    describe('addInvoiceCompany', function ()
    {
        describe('company invoicesDetails exists', function ()
        {

            describe('when contratorType is company', function ()
            {
                beforeEach(function ()
                {

                    issueCtrl.companyDetails = mockTestCompany;
                    issueCtrl.createDatePicker.date = new Date('2000-12-15');
                    issueCtrl.invoiceCompany.contractorType = 'company';
                    issueCtrl.executionDatePicker.date = new Date('2001-01-23');

                    issueCtrl.addInvoiceCompany(form);
                });
                describe('always', function ()
                {
                    it('should set invoiceCompany.type to transactionType', function ()
                    {
                        expect(issueCtrl.invoiceCompany.type).toEqual('sell');
                    });
                    it('should set invoiceCompany.createDate', function ()
                    {
                        expect(issueCtrl.invoiceCompany.createDate).toEqual('2000-12-15');
                    });
                    it('should set invoiceCompany.executionEndDate', function ()
                    {
                        expect(issueCtrl.invoiceCompany.executionEndDate).toEqual('2001-01-23');
                    });
                    it('should set invoiceCompany.companyDealer', function ()
                    {
                        expect(issueCtrl.invoiceCompany.companyDealer).toEqual(2);
                    });
                    it('should set invoiceCompany.companyRecipent', function ()
                    {
                        expect(issueCtrl.invoiceCompany.companyRecipent).toEqual(1);
                    });
                });

                describe('products not added', function ()
                {
                    beforeEach(function ()
                    {
                        issueCtrl.invoiceCompany.products = {};
                        issueCtrl.addInvoiceCompany(form);
                    });
                    it('should set issueProductNotAdded to true', function ()
                    {
                        expect(issueCtrl.issueProductNotAdded).toEqual(true);
                    });
                });

                describe('when add products', function ()
                {
                    describe('when invoice added', function ()
                    {
                        beforeEach(function ()
                        {
                            spyOn(invoiceDaoMock, 'issue').and.callFake(function ()
                            {
                                return successfulPromise();
                            });
                            spyOn(form, '$setPristine');
                            spyOn(issueCtrl, 'getInvoiceNumber');
                            issueCtrl.invoiceCompany.products[0] = {name: 'Product 1', netto: 345.45, vat: 23, amount: 1, brutto: 446.78};
                            issueCtrl.addInvoiceCompany(form);
                        });
                        it('should call InvoiceDAO.issue', function ()
                        {
                            expect(invoiceDaoMock.issue).toHaveBeenCalledTimes(1);
                        });
                        it('should set issueCompanyNotChosen', function ()
                        {
                            expect(issueCtrl.issueCompanyNotChosen).toBeFalsy();
                        });
                        it('should set addInvoice', function ()
                        {
                            expect(issueCtrl.addInvoice).toBeTruthy();
                        });
                        it('should set new date createDatePicker.date', function ()
                        {
                            expect(issueCtrl.createDatePicker.date).toEqual(baseTime);
                        });
                        it('should set new date executionDatePicker.date', function ()
                        {
                            expect(issueCtrl.executionDatePicker.date).toEqual(baseTime);
                        });
                        it('should call form setPristine', function ()
                        {
                            expect(form.$setPristine).toHaveBeenCalled();
                        });
                        it('should reset invoiceCompany', function ()
                        {
                            expect(issueCtrl.invoiceCompany)
                                    .toEqual({products: {}, status: 'unpaid', paymentMethod: 'bank transfer', reverseCharge: false, showAmount: false});
                        });
                        it('should call InvoiceDAO.number', function ()
                        {
                            expect(invoiceDaoMock.number).toHaveBeenCalled();
                        });
                    });
                    describe('when invoice not added', function ()
                    {
                        beforeEach(function ()
                        {
                            spyOn(invoiceDaoMock, 'issue').and.callFake(function ()
                            {
                                return unsuccessfulPromise({data: 'Unknow Error'});
                            });
                            issueCtrl.invoiceCompany.products[0] = {name: 'Product 1', netto: 345.45, vat: 23, amount: 1, brutto: 446.78};
                            issueCtrl.addInvoiceCompany(form);
                        });
                        it('should set formSubmitted', function ()
                        {
                            expect(issueCtrl.formSubmitted).toBeFalsy();
                        });
                        it('should set errorMessage', function ()
                        {
                            expect(issueCtrl.errorMessage).toEqual('Unknow Error');
                        });
                        it('should set formInvalidAlert', function ()
                        {
                            expect(issueCtrl.formInvalidAlert).toBeTruthy();
                        });
                    });
                });

            });

            describe('when contractorType is person', function ()
            {
                beforeEach(function ()
                {

                    issueCtrl.companyDetails = mockTestCompany;
                    issueCtrl.createDatePicker.date = new Date('2000-12-15');
                    issueCtrl.invoiceCompany.contractorType = 'person';
                    issueCtrl.executionDatePicker.date = new Date('2001-01-23');

                    issueCtrl.addInvoiceCompany(form);
                });
                describe('always', function ()
                {
                    it('should set invoiceCompany.type to transactionType', function ()
                    {
                        expect(issueCtrl.invoiceCompany.type).toEqual('sell');
                    });
                    it('should set invoiceCompany.createDate', function ()
                    {
                        expect(issueCtrl.invoiceCompany.createDate).toEqual('2000-12-15');
                    });
                    it('should set invoiceCompany.executionEndDate', function ()
                    {
                        expect(issueCtrl.invoiceCompany.executionEndDate).toEqual('2001-01-23');
                    });
                    it('should set invoiceCompany.companyDealer', function ()
                    {
                        expect(issueCtrl.invoiceCompany.companyDealer).toEqual(2);
                    });
                    it('should set invoiceCompany.companyRecipent', function ()
                    {
                        expect(issueCtrl.invoiceCompany.personRecipent).toEqual(1);
                    });
                });

            });

        });
        describe('company invoicesDetails doesn\'t exists', function ()
        {
            beforeEach(function ()
            {
                issueCtrl.companyDetails = null;
                issueCtrl.addInvoiceCompany(form);
            });
            it('should companyNotChosen to true', function ()
            {
                expect(issueCtrl.issueCompanyNotChosen).toEqual(true);
            });
        });


    });

    describe('closeProductNotAdded', function ()
    {
        it('should set issueProductNotAdded to false', function ()
        {
            issueCtrl.closeProductNotAdded();
            expect(issueCtrl.issueProductNotAdded).toBeFalsy();
        });
    });

    describe('checkAdvanced', function ()
    {
        describe('when advance is bigger then bruttoValue', function ()
        {
            beforeEach(function ()
            {
                issueCtrl.invoiceCompany = {
                    bruttoValue: 5000
                };
                form = {
                    advance: {
                        $error: {
                            validationError: null
                        }
                    },
                    $setValidity: angular.noop
                };
                spyOn(form,'$setValidity');

                issueCtrl.invoiceCompany.advance = 5212;
                issueCtrl.checkAdvanced(form);
            });
            it('should set validationError to true', function ()
            {
                expect(form.advance.$error.validationError).toBeTruthy();
            });
            it('should call $setValidity', function ()
            {
                expect(form.$setValidity).toHaveBeenCalledTimes(1);
            });
            it('should call $setValidity with args', function ()
            {
                expect(form.$setValidity).toHaveBeenCalledWith('advance',false);
            });
        });

        describe('when advance isn\'t bigger then bruttoValue', function ()
        {
            beforeEach(function ()
            {
                issueCtrl.invoiceCompany = {
                    bruttoValue: 5000
                };
                form = {
                    advance: {
                        $error: {
                            validationError: null
                        }
                    },
                    $setValidity: angular.noop
                };
                spyOn(form,'$setValidity');

                issueCtrl.invoiceCompany.advance = 400;
                issueCtrl.checkAdvanced(form);
            });
            it('should set validationError to true', function ()
            {
                expect(form.advance.$error.validationError).toBeFalsy();
            });
            it('should call $setValidity', function ()
            {
                expect(form.$setValidity).toHaveBeenCalledTimes(1);
            });
            it('should call $setValidity with args', function ()
            {
                expect(form.$setValidity).toHaveBeenCalledWith('advance',true);
            });
        });
    });


})
;

