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

        InvoiceDetailsDAOMock = jasmine.createSpyObj('InvoiceDetailsDAO', ['query','update','changeStatus']);
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
        describe('when reverse charge', function ()
        {
            beforeEach(function ()
            {
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
                            'netto': 345.45,
                            'vat': 'N/A',
                            'brutto': 345.45
                        }
                    },
                    'paymentMethod': 'bank transfer',
                    'advance': '1000.00',
                    'fileId': '0BwdQNJT2vJhNQU9jT09laFltdDQ',
                    'currency': 'PLN',
                    'language': 'pl'
                };
                InvoiceDetailsDAOMock.query.and.callFake(function ()
                {
                    return successfulPromise(invoiceMock);
                });
                invoiceDetailCtrl.getDetails();
            });
            it('should set reverseCharge', function ()
            {
                expect(invoiceDetailCtrl.reverseCharge).toBeTruthy();

            });
        });
    });

    describe('calculateBrutto', function ()
    {
        describe('when entry have vat', function ()
        {
            beforeEach(function ()
            {
                productsMock = { netto: 500, vat: 8, amount: 2};
                invoiceDetailCtrl.calculateBrutto(productsMock);
            });
            it('should set brutto', function ()
            {
                expect(productsMock.brutto).toEqual(Number((productsMock.netto * productsMock.amount * (1 + productsMock.vat/100)).toFixed(2)));
            });
        });

        describe('when entry not have vat available', function ()
        {
            describe('when no amount', function ()
            {
                beforeEach(function ()
                {
                    productsMock = { netto: 6000, vat: 'N/A'};
                    invoiceDetailCtrl.calculateBrutto(productsMock);
                });
                it('should set brutto', function ()
                {
                    expect(productsMock.brutto).toEqual(productsMock.netto);
                });
            });
            describe('when amount exists', function ()
            {
                beforeEach(function ()
                {
                    productsMock = { netto: 6000.56 , vat: 'N/A', amount: 4};
                    invoiceDetailCtrl.calculateBrutto(productsMock);
                });
                it('should set brutto', function ()
                {
                    expect(productsMock.brutto).toEqual(productsMock.netto * productsMock.amount);
                });
            });

        });
    });

    describe('deleteProduct', function ()
    {
        beforeEach(function ()
        {
            invoiceDetailCtrl.deleteProduct(0);
        });
        it('should delete product', function ()
        {
            expect(invoiceDetailCtrl.details.products).toEqual({1: invoiceMock.products[1]});
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
        describe('when success', function ()
        {
            beforeEach(function ()
            {
                form = {
                    $valid: true
                };
                InvoiceDetailsDAOMock.update.and.callFake(function(){
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
                InvoiceDetailsDAOMock.update.and.callFake(function(){
                    return unsuccessfulPromise({data:'Something bad happens'});
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
                InvoiceDetailsDAOMock.changeStatus.and.callFake(function() {
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
                expect(InvoiceDetailsDAOMock.changeStatus).toHaveBeenCalledWith(invoiceDetailCtrl.id,'paid');
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
                InvoiceDetailsDAOMock.changeStatus.and.callFake(function() {
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
                expect(InvoiceDetailsDAOMock.changeStatus).toHaveBeenCalledWith(invoiceDetailCtrl.id,'unpaid');
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
                spyOn(console,'error');
                InvoiceDetailsDAOMock.changeStatus.and.callFake(function() {
                    return unsuccessfulPromise();
                });
                invoiceDetailCtrl.changeStatus();
            });
            it('should call console,error', function ()
            {
                expect(console.error).toHaveBeenCalled();
            });
        });
    });

    describe('edit', function ()
    {
        beforeEach(function ()
        {
            invoiceDetailCtrl.edit(invoiceDetailCtrl.details.products[0]);
        });
        it('should set editMode', function ()
        {
            expect(invoiceDetailCtrl.details.products[0].editMode).toBeTruthy();
        });
        it('should copy entry to editEntry', function ()
        {
            invoiceDetailCtrl.details.products[0].editMode = false;
            expect(invoiceDetailCtrl.editEntry).toEqual(invoiceDetailCtrl.details.products[0]);
        });
        it('should set new when save', function ()
        {
            invoiceDetailCtrl.details.products[0].netto = 600;
            invoiceDetailCtrl.save(invoiceDetailCtrl.details.products[0]);
            expect(invoiceDetailCtrl.details.products[0].netto).toEqual(600);
        });
    });

    describe('cancel', function ()
    {
        describe('when add new', function ()
        {
            beforeEach(function ()
            {
                invoiceDetailCtrl.addNew();
                var editEntry = { name: 'Product 1', netto: 345.45, vat: 'N/A'};
                invoiceDetailCtrl.calculateBrutto(editEntry);
                Object.assign(invoiceDetailCtrl.details.products[2],editEntry);
                invoiceDetailCtrl.cancel(editEntry,2);
            });
            it('should delete product', function ()
            {
                expect(invoiceDetailCtrl.details.products[2]).toEqual();
            });
        });
        describe('when edit product', function ()
        {
            beforeEach(function ()
            {
                invoiceDetailCtrl.addNew();
                var editEntry = { name: 'Product 1', netto: 345.45, vat: 'N/A'};
                invoiceDetailCtrl.calculateBrutto(editEntry);
                Object.assign(invoiceDetailCtrl.details.products[0],editEntry);
                invoiceDetailCtrl.save(editEntry);
                invoiceDetailCtrl.edit(invoiceDetailCtrl.details.products[0]);

            });
            it('should set editEntry to null', function ()
            {
                invoiceDetailCtrl.cancel(invoiceDetailCtrl.details.products[0],0);
                expect(invoiceDetailCtrl.editEntry).toBeNull();
            });
        });

    });

});
