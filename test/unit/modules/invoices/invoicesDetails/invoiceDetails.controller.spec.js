'use strict';
describe('InvoiceDetailsController', function ()
{
    var InvoiceDetailsDAOMock;
    var $routeParamsMock;
    var invoiceDetailCtrl;
    var invoiceMock;
    var baseTime;
    var form;
    var invoiceDaoMock;

    beforeEach(module('app'));
    beforeEach(inject(function ($controller, $routeParams, InvoiceDAO)
    {
        $routeParamsMock = $routeParams;
        invoiceDaoMock = InvoiceDAO;
        invoiceMock = {
            'id': 9,
            'year': 2017,
            'month': 5,
            'number': 4,
            'invoiceNr': 'FV 2017/5/4',
            'type': 'sell',
            'createDate': '2017-05-16T00:00:00.000Z',
            'executionEndDate': '2017-05-16T00:00:00.000Z',
            'nettoValue': '1259.01',
            'bruttoValue': '1384.14',
            'status': 'unpaid',
            'url': 'https://drive.google.com/file/d/0BwdQNJT2vJhNQU9jT09laFltdDQ/view?usp=drivesdk',
            'companyDealer': 2,
            'companyRecipent': 10,
            'personDealer': null,
            'personRecipent': null,
            'googleYearFolderId': '0BwdQNJT2vJhNekhWZVY5c1JLRkE',
            'googleMonthFolderId': '0BwdQNJT2vJhNQVhLY3hqcEFyV2M',
            'description': null,
            'products': {
                '0': {
                    'editMode': false,
                    'name': 'IT service',
                    'amount': 1,
                    'unit': 'szt',
                    'netto': 345.45,
                    'vat': 23,
                    'brutto': 424.9
                },
                '1': {
                    'editMode': false,
                    'name': 'Prod 2',
                    'amount': 2,
                    'unit': 'szt',
                    'netto': 456.78,
                    'vat': 5,
                    'brutto': 959.24
                }
            },
            'paymentMethod': 'bank transfer',
            'advance': '1000.00',
            'fileId': '0BwdQNJT2vJhNQU9jT09laFltdDQ',
            'currency': 'PLN',
            'language': 'pl'
        };

        $routeParamsMock.id = 1;
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

        InvoiceDetailsDAOMock = jasmine.createSpyObj('InvoiceDetailsDAO', ['query', 'update', 'changeStatus']);
        InvoiceDetailsDAOMock.query.and.callFake(function ()
        {
            return successfulPromise(invoiceMock);
        });

        invoiceDetailCtrl =
                $controller('InvoiceDetailsController', {$routeParams: $routeParamsMock, InvoiceDetailsDAO: InvoiceDetailsDAOMock, InvoiceDAO: invoiceDaoMock});
    }));

    describe('initialization', function ()
    {

        it('should set message', function ()
        {
            expect(invoiceDetailCtrl.message).toEqual('Details Invoice');
        });
        it('should set id from routeParams', function ()
        {
            expect(invoiceDetailCtrl.id).toEqual(1);
        });
        it('should call InvoiceDetailsDAO.query', function ()
        {
            expect(InvoiceDetailsDAOMock.query).toBeDefined();
            expect(InvoiceDetailsDAOMock.query).toHaveBeenCalled();
        });
        it('should call InvoiceDetailsDAO.query with id', function ()
        {
            expect(InvoiceDetailsDAOMock.query).toHaveBeenCalledWith({id: 1});
        });
        it('should set invoiceDetalis', function ()
        {
            expect(invoiceDetailCtrl.details).toBe(invoiceMock);
        });

        describe('createDatePicker', function ()
        {
            it('should set new date', function ()
            {
                expect(invoiceDetailCtrl.createDatePicker.date).toEqual(new Date(invoiceDetailCtrl.details.createDate));
            });
            it('should set createDatePicker.opened property', function ()
            {
                expect(invoiceDetailCtrl.createDatePicker.opened).toEqual(false);
            });
            it('should set createDatePicker.options.formatYear property', function ()
            {
                expect(invoiceDetailCtrl.createDatePicker.options.formatYear).toEqual('yy');
            });
            it('should set createDatePicker.options.maxDate property', function ()
            {
                baseTime = new Date();
                jasmine.clock().mockDate(baseTime);
                expect(invoiceDetailCtrl.createDatePicker.options.maxDate).toEqual(baseTime);
            });
            it('should set createDatePicker.options.maxDate property', function ()
            {
                expect(invoiceDetailCtrl.createDatePicker.options.startingDay).toEqual(1);
            });
            it('should change createDatePicker.opened property boolean value', function ()
            {
                invoiceDetailCtrl.createDatePicker.open();
                expect(invoiceDetailCtrl.createDatePicker.opened).toEqual(true);
            });
        });
        describe('executionDatePicker', function ()
        {
            it('should set new date', function ()
            {
                expect(invoiceDetailCtrl.executionDatePicker.date).toEqual(new Date(invoiceDetailCtrl.details.executionEndDate));
            });
            it('should set executionDatePicker.opened property', function ()
            {
                expect(invoiceDetailCtrl.executionDatePicker.opened).toEqual(false);
            });
            it('should set executionDatePicker.options.formatYear property', function ()
            {
                expect(invoiceDetailCtrl.executionDatePicker.options.formatYear).toEqual('yy');
            });
            it('should set executionDatePicker.options.maxDate property', function ()
            {
                expect(invoiceDetailCtrl.executionDatePicker.options.startingDay).toEqual(1);
            });
            it('should change executionDatePicker.opened property boolean value', function ()
            {
                invoiceDetailCtrl.executionDatePicker.open();
                expect(invoiceDetailCtrl.executionDatePicker.opened).toEqual(true);
            });
        });
    });

    describe('getDetails', function ()
    {
        describe('when type is sell', function ()
        {
            describe('when companyRecipent is not null', function ()
            {
                beforeEach(function ()
                {
                    invoiceMock = {
                        type: 'sell',
                        'companyDealer': 2,
                        'companyRecipent': 10,
                        'personDealer': null,
                        'personRecipent': null

                    };
                    InvoiceDetailsDAOMock.query.and.callFake(function ()
                    {
                        return successfulPromise(invoiceMock);
                    });
                    invoiceDetailCtrl.getDetails();
                });
                it('should set contractorType to company', function ()
                {
                    expect(invoiceDetailCtrl.details.contractorType).toEqual('company');

                });
            });

            describe('when companyRecipent is null', function ()
            {
                beforeEach(function ()
                {
                    invoiceMock = {
                        'type': 'sell',
                        'companyDealer': 2,
                        'companyRecipent': null,
                        'personDealer': null,
                        'personRecipent': 10

                    };
                    InvoiceDetailsDAOMock.query.and.callFake(function ()
                    {
                        return successfulPromise(invoiceMock);
                    });
                    invoiceDetailCtrl.getDetails();
                });
                it('should set contractorType to company', function ()
                {
                    expect(invoiceDetailCtrl.details.contractorType).toEqual('person');

                });
            });
        });
        describe('when type is buy', function ()
        {
            describe('when companyDealer is not null', function ()
            {
                beforeEach(function ()
                {
                    invoiceMock = {
                        type: 'buy',
                        'companyDealer': 2,
                        'companyRecipent': 10,
                        'personDealer': null,
                        'personRecipent': null

                    };
                    InvoiceDetailsDAOMock.query.and.callFake(function ()
                    {
                        return successfulPromise(invoiceMock);
                    });
                    invoiceDetailCtrl.getDetails();
                });
                it('should set contractorType to company', function ()
                {
                    expect(invoiceDetailCtrl.details.contractorType).toEqual('company');

                });
            });

            describe('when companyDealer is null', function ()
            {
                beforeEach(function ()
                {
                    invoiceMock = {
                        'type': 'buy',
                        'companyDealer': null,
                        'companyRecipent': 2,
                        'personDealer': 10,
                        'personRecipent': null

                    };
                    InvoiceDetailsDAOMock.query.and.callFake(function ()
                    {
                        return successfulPromise(invoiceMock);
                    });
                    invoiceDetailCtrl.getDetails();
                });
                it('should set contractorType to company', function ()
                {
                    expect(invoiceDetailCtrl.details.contractorType).toEqual('person');

                });
            });
        });
    });

    describe('calculateNettoBrutto', function ()
    {
        describe('when product has amount', function ()
        {
            beforeEach(function ()
            {

                invoiceDetailCtrl.details.products[0] = {name: 'Product 1', netto: 345.45, vat: 23, amount: 1, brutto: 424.9};
                invoiceDetailCtrl.details.products[1] = {name: 'Product 2', netto: 456.78, vat: 5, amount: 2, brutto: 959.24};
                invoiceDetailCtrl.calculateNettoBrutto();
            });
            it('should set netto', function ()
            {
                expect(invoiceDetailCtrl.details.nettoValue).toEqual(1259.01);
            });
            it('should set brutto', function ()
            {
                expect(invoiceDetailCtrl.details.bruttoValue).toEqual(1384.14);
            });
        });

        describe('when product don\'t have amount', function ()
        {
            beforeEach(function ()
            {
                invoiceDetailCtrl.details.products[0] = {name: 'Product 1', netto: 345.45, vat: 23, brutto: 345.45};
                invoiceDetailCtrl.details.products[1] = {name: 'Product 2', netto: 456.78, vat: 5, brutto: 456.78};
                invoiceDetailCtrl.calculateNettoBrutto();
            });
            it('should set netto', function ()
            {
                expect(invoiceDetailCtrl.details.nettoValue).toEqual(802.23);
            });
            it('should set brutto', function ()
            {
                expect(invoiceDetailCtrl.details.bruttoValue).toEqual(802.23);
            });
        });

    });

    describe('showEdit', function ()
    {
        beforeEach(function ()
        {
            invoiceDetailCtrl.showEdit();
        });
        it('should set showEditInvoice', function ()
        {
            expect(invoiceDetailCtrl.showEditInvoice).toBeTruthy();
        });
        it('should set showDetailsInvoice', function ()
        {
            expect(invoiceDetailCtrl.showDetailsInvoice).toBeFalsy();
        });
    });

    describe('getInvoiceNumber', function ()
    {

        describe('when find number', function ()
        {
            beforeEach(function ()
            {
                invoiceDetailCtrl.createDatePicker.date = new Date('2012,2,2');
                invoiceDetailCtrl.getInvoiceNumber();
            });
            it('should set invoiceNumber with new number', function ()
            {
                expect(invoiceDetailCtrl.details.invoiceNr).toEqual('FV 2012/2/3');
            });
        });
        describe('when not find number', function ()
        {
            beforeEach(function ()
            {
                invoiceDetailCtrl.createDatePicker.date = new Date('2013,4,3');
                invoiceDetailCtrl.getInvoiceNumber();
            });
            it('should set invoiceNumber with new number', function ()
            {
                expect(invoiceDetailCtrl.details.invoiceNr).toEqual('FV 2013/4/1');
            });
        });

        describe('when throw error', function ()
        {
            beforeEach(function ()
            {
                invoiceDetailCtrl.createDatePicker.date = new Date('2017,6,3');
                spyOn(console, 'log');
                invoiceDetailCtrl.getInvoiceNumber();
            });
            it('should call console.log', function ()
            {
                expect(console.log).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe('editInvoice', function ()
    {
        describe('when success', function ()
        {
            beforeEach(function ()
            {
                form = {
                    $valid: true
                };
                InvoiceDetailsDAOMock.update.and.callFake(function ()
                {
                    return successfulPromise();
                });
                invoiceDetailCtrl.editInvoice(form);
            });
            it('should call update', function ()
            {
                expect(InvoiceDetailsDAOMock.update).toHaveBeenCalled();
            });
            it('should call query', function ()
            {
                expect(InvoiceDetailsDAOMock.query).toHaveBeenCalled();
            });
        });
        describe('when error', function ()
        {
            beforeEach(function ()
            {
                form = {
                    $valid: true
                };
                InvoiceDetailsDAOMock.update.and.callFake(function ()
                {
                    return unsuccessfulPromise({data: 'Something bad happens'});
                });
                invoiceDetailCtrl.editInvoice(form);
            });
            it('should set errorMessage', function ()
            {
                expect(invoiceDetailCtrl.errorMessage).toEqual('Something bad happens');
            });
            it('should set formInvalidAlert', function ()
            {
                expect(invoiceDetailCtrl.formInvalidAlert).toBeTruthy();
            });
        });

        describe('when no products', function ()
        {
            beforeEach(function ()
            {
                form = {
                    $valid: true
                };
                invoiceDetailCtrl.details = {
                    createDate: '2017-04-23',
                    executionEndDate: '2017-04-30',
                    type: 'sell',
                    'companyDealer': 2,
                    'companyRecipent': {id: 10},
                    'personDealer': null,
                    'personRecipent': null,
                    products: {}
                };

                invoiceDetailCtrl.editInvoice(form);
            });
            it('should set productNotChoosen to true', function ()
            {
                expect(invoiceDetailCtrl.productNotChoosen).toBeTruthy();
            });
        });

        describe('when type is sell', function ()
        {
            describe('when contractorType is company', function ()
            {
                beforeEach(function ()
                {
                    form = {
                        $valid: true
                    };
                    invoiceDetailCtrl.details.contractorType = 'company';
                    InvoiceDetailsDAOMock.update.and.callFake(function ()
                    {
                        return successfulPromise();
                    });
                    invoiceDetailCtrl.editInvoice(form);
                });
                it('should set changeNumber to true', function ()
                {
                    expect(invoiceDetailCtrl.changeNumber).toBe(true);
                });
                it('should set showLoader to false', function ()
                {
                    expect(invoiceDetailCtrl.showLoader).toBeFalsy();
                });
                it('should set showBox to false', function ()
                {
                    expect(invoiceDetailCtrl.showBox).toBeFalsy();
                });
            });

            describe('when contractorType is person', function ()
            {
                beforeEach(function ()
                {
                    form = {
                        $valid: true
                    };
                    invoiceDetailCtrl.details.contractorType = 'person';
                    InvoiceDetailsDAOMock.update.and.callFake(function ()
                    {
                        return successfulPromise();
                    });
                    invoiceDetailCtrl.editInvoice(form);
                });
                it('should set changeNumber to true', function ()
                {
                    expect(invoiceDetailCtrl.changeNumber).toBe(true);
                });
                it('should set showLoader to false', function ()
                {
                    expect(invoiceDetailCtrl.showLoader).toBeFalsy();
                });
                it('should set showBox to false', function ()
                {
                    expect(invoiceDetailCtrl.showBox).toBeFalsy();
                });
            });
        });
        describe('when type is buy', function ()
        {
            describe('when contractorType is company', function ()
            {
                beforeEach(function ()
                {
                    form = {
                        $valid: true
                    };
                    invoiceDetailCtrl.details.type = 'buy';
                    invoiceDetailCtrl.details.contractorType = 'company';
                    InvoiceDetailsDAOMock.update.and.callFake(function ()
                    {
                        return successfulPromise();
                    });
                    invoiceDetailCtrl.editInvoice(form);
                });
                it('should set changeNumber to true', function ()
                {
                    expect(invoiceDetailCtrl.changeNumber).toBe(true);
                });
                it('should set showLoader to false', function ()
                {
                    expect(invoiceDetailCtrl.showLoader).toBeFalsy();
                });
                it('should set showBox to false', function ()
                {
                    expect(invoiceDetailCtrl.showBox).toBeFalsy();
                });
            });

            describe('when contractorType is person', function ()
            {
                beforeEach(function ()
                {
                    form = {
                        $valid: true
                    };
                    invoiceDetailCtrl.details.type = 'buy';
                    invoiceDetailCtrl.details.contractorType = 'person';
                    InvoiceDetailsDAOMock.update.and.callFake(function ()
                    {
                        return successfulPromise();
                    });
                    invoiceDetailCtrl.editInvoice(form);
                });
                it('should set changeNumber to true', function ()
                {
                    expect(invoiceDetailCtrl.changeNumber).toBe(true);
                });
                it('should set showLoader to false', function ()
                {
                    expect(invoiceDetailCtrl.showLoader).toBeFalsy();
                });
                it('should set showBox to false', function ()
                {
                    expect(invoiceDetailCtrl.showBox).toBeFalsy();
                });
            });
        });


    });

    describe('closeFormInvalidAlert', function ()
    {
        beforeEach(function ()
        {
            invoiceDetailCtrl.closeFormInvalidAlert();
        });
        it('should set formInvalidAlert to false', function ()
        {
            expect(invoiceDetailCtrl.formInvalidAlert).toBeFalsy();
        });
    });

    describe('closeProductNotChoosen', function ()
    {
        beforeEach(function ()
        {
            invoiceDetailCtrl.closeProductNotChoosen();
        });
        it('should set productNotChoosen', function ()
        {
            expect(invoiceDetailCtrl.productNotChoosen).toBeFalsy();
        });
    });

    describe('changeStatus', function ()
    {
        describe('when status is unpaid', function ()
        {
            beforeEach(function ()
            {
                invoiceMock.status = 'unpaid';
                InvoiceDetailsDAOMock.changeStatus.and.callFake(function ()
                {
                    return successfulPromise();
                });
                invoiceDetailCtrl.changeStatus();
            });
            it('should call changeStatus', function ()
            {
                expect(InvoiceDetailsDAOMock.changeStatus).toHaveBeenCalledTimes(1);
            });
            it('should called changeStatus with parameters', function ()
            {
                expect(InvoiceDetailsDAOMock.changeStatus).toHaveBeenCalledWith(invoiceDetailCtrl.id, 'paid');
            });
            it('should call query', function ()
            {
                expect(InvoiceDetailsDAOMock.query).toHaveBeenCalled();
            });
        });

        describe('when status is paid', function ()
        {
            beforeEach(function ()
            {
                invoiceMock.status = 'paid';
                InvoiceDetailsDAOMock.changeStatus.and.callFake(function ()
                {
                    return successfulPromise();
                });
                invoiceDetailCtrl.changeStatus();
            });
            it('should call changeStatus', function ()
            {
                expect(InvoiceDetailsDAOMock.changeStatus).toHaveBeenCalledTimes(1);
            });
            it('should called changeStatus with parameters', function ()
            {
                expect(InvoiceDetailsDAOMock.changeStatus).toHaveBeenCalledWith(invoiceDetailCtrl.id, 'unpaid');
            });
            it('should call query', function ()
            {
                expect(InvoiceDetailsDAOMock.query).toHaveBeenCalled();
            });
        });

        describe('when something wrong', function ()
        {
            beforeEach(function ()
            {
                spyOn(console, 'error');
                InvoiceDetailsDAOMock.changeStatus.and.callFake(function ()
                {
                    return unsuccessfulPromise();
                });
                invoiceDetailCtrl.changeStatus();
            });
            it('should call console,error', function ()
            {
                expect(console.error).toHaveBeenCalled();
            });
        });

        describe('toggleContractorChange', function ()
        {
            beforeEach(function ()
            {
                invoiceDetailCtrl.contractorChange = false;
                invoiceDetailCtrl.toggleContractorChange();
            });
            it('should set contractorChange to true', function ()
            {
                expect(invoiceDetailCtrl.contractorChange).toBeTruthy();
            });
        });
    });

    describe('checkAdvanced', function ()
    {
        describe('when advance is bigger then bruttoValue', function ()
        {
            beforeEach(function ()
            {
                invoiceDetailCtrl.details = {
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
                spyOn(form, '$setValidity');

                invoiceDetailCtrl.details.advance = 5212;
                invoiceDetailCtrl.checkAdvanced(form);
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
                expect(form.$setValidity).toHaveBeenCalledWith('advance', false);
            });
        });

        describe('when advance isn\'t bigger then bruttoValue', function ()
        {
            beforeEach(function ()
            {
                invoiceDetailCtrl.details = {
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
                spyOn(form, '$setValidity');

                invoiceDetailCtrl.details.advance = 400;
                invoiceDetailCtrl.checkAdvanced(form);
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
                expect(form.$setValidity).toHaveBeenCalledWith('advance', true);
            });
        });
    });

    describe('toggleChangeNumber', function ()
    {
        beforeEach(function ()
        {
            invoiceDetailCtrl.changeNumber = false;
            invoiceDetailCtrl.toogleChangeNumber();
        });
        it('should set changeNumber to oposite', function ()
        {
            expect(invoiceDetailCtrl.changeNumber).toBeTruthy();
        });
    });


});
