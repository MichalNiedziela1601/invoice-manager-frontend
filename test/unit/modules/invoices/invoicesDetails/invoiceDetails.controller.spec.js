'use strict';
describe('InvoiceDetailsController', function ()
{
    var InvoiceDetailsDAOMock;
    var $routeParamsMock;
    var invoiceDetailCtrl;
    var invoiceMock;
    var baseTime;
    var productsMock;
    var form;

    beforeEach(module('app'));
    beforeEach(inject(function ($controller, $routeParams)
    {
        $routeParamsMock = $routeParams;
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

        InvoiceDetailsDAOMock = jasmine.createSpyObj('InvoiceDetailsDAO', ['query', 'update', 'changeStatus']);
        InvoiceDetailsDAOMock.query.and.callFake(function ()
        {
            return successfulPromise(invoiceMock);
        });

        invoiceDetailCtrl = $controller('InvoiceDetailsController', {$routeParams: $routeParamsMock, InvoiceDetailsDAO: InvoiceDetailsDAOMock});
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

    describe('editInvoice', function ()
    {
        describe('when type is sell', function ()
        {
            describe('when contractorType is company and companyRecipinet is not null', function ()
            {
                beforeEach(function ()
                {
                    invoiceMock = {
                        createDate: '2017-04-23',
                        executionEndDate: '2017-04-30',
                        type: 'sell',
                        'companyDealer': 2,
                        'companyRecipent': {id: 10},
                        'personDealer': null,
                        'personRecipent': null

                    };

                    InvoiceDetailsDAOMock.query.and.callFake(function ()
                    {
                        return successfulPromise(invoiceMock);
                    });
                    invoiceDetailCtrl.getDetails();
                    form = {
                        $valid: true
                    };
                    InvoiceDetailsDAOMock.update.and.callFake(function ()
                    {
                        return successfulPromise();
                    });
                    invoiceDetailCtrl.editInvoice(form);
                });
                it('should set companyRecipient', function ()
                {
                    expect(invoiceDetailCtrl.details.companyRecipent).toEqual(10);
                });
            });
            describe('when contractorType is company and companyRecipient is null', function ()
            {
                beforeEach(function ()
                {
                    invoiceMock = {
                        createDate: '2017-04-23',
                        executionEndDate: '2017-04-30',
                        type: 'sell',
                        'companyDealer': 2,
                        'companyRecipent': null,
                        'personDealer': null,
                        'personRecipent': {id: 10}

                    };

                    InvoiceDetailsDAOMock.query.and.callFake(function ()
                    {
                        return successfulPromise(invoiceMock);
                    });
                    invoiceDetailCtrl.getDetails();
                    form = {
                        $valid: true
                    };
                    InvoiceDetailsDAOMock.update.and.callFake(function ()
                    {
                        return successfulPromise();
                    });
                    invoiceDetailCtrl.editInvoice(form);
                });
                it('should set companyRecipient', function ()
                {
                    expect(invoiceDetailCtrl.details.personRecipent).toEqual(10);
                });
            });
        });
        describe('when type is buy', function ()
        {
            describe('when contractorType is company and companyDealer is not null', function ()
            {
                beforeEach(function ()
                {
                    invoiceMock = {
                        createDate: '2017-04-23',
                        executionEndDate: '2017-04-30',
                        type: 'buy',
                        'companyDealer': {id: 10},
                        'companyRecipent': 2 ,
                        'personDealer': null,
                        'personRecipent': null

                    };

                    InvoiceDetailsDAOMock.query.and.callFake(function ()
                    {
                        return successfulPromise(invoiceMock);
                    });
                    invoiceDetailCtrl.getDetails();
                    form = {
                        $valid: true
                    };
                    InvoiceDetailsDAOMock.update.and.callFake(function ()
                    {
                        return successfulPromise();
                    });
                    invoiceDetailCtrl.editInvoice(form);
                });
                it('should set companyRecipient', function ()
                {
                    expect(invoiceDetailCtrl.details.companyDealer).toEqual(10);
                });
            });
            describe('when contractorType is company and personDealer is null', function ()
            {
                beforeEach(function ()
                {
                    invoiceMock = {
                        createDate: '2017-04-23',
                        executionEndDate: '2017-04-30',
                        type: 'buy',
                        'companyDealer': null,
                        'companyRecipent': 2,
                        'personDealer': {id: 10},
                        'personRecipent': null

                    };

                    InvoiceDetailsDAOMock.query.and.callFake(function ()
                    {
                        return successfulPromise(invoiceMock);
                    });
                    invoiceDetailCtrl.getDetails();
                    form = {
                        $valid: true
                    };
                    InvoiceDetailsDAOMock.update.and.callFake(function ()
                    {
                        return successfulPromise();
                    });
                    invoiceDetailCtrl.editInvoice(form);
                });
                it('should set companyRecipient', function ()
                {
                    expect(invoiceDetailCtrl.details.personDealer).toEqual(10);
                });
            });
        });
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


});
