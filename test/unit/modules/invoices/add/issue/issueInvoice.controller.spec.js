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
    var UserDAOMock;
    var productsMock;
    var modalOptions;
    var actualOptions;
    var editProduct;

    beforeEach(module('app'));

    beforeEach(inject(function ($controller, InvoiceDAO, CompanyDAO, $uibModal, UserDAO)
    {
        invoiceDaoMock = InvoiceDAO;
        companyDaoMock = CompanyDAO;
        uibModal = $uibModal;
        UserDAOMock = UserDAO;
        form = {
            $valid : true,
            $setPristine: function(){}
        };
        mockTestCompany = {
            id: 1, name: 'Firma 1', nip: 1234567890, regon: 6789567, street: 'Spokojna', buildNr: 4, flatNr: 3, postCode: 33 - 100, city: 'Tarnów'
        };

        mockFoundTestCompany = {
            id: 2, name: 'Firma BUDEX', nip: 1224567890, regon: 6189567, street: 'Krakowska', buildNr: 4, flatNr: null, postCode: 33 - 120, city: 'City 1'
        };

        nips = [
            {nip: 1234567890},
            {nip: 1224567890}
        ];

        productsMock = { name: 'Product 1', netto: 345.45, vat: 23, amount: 1, brutto: 446.78};

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

        issueCtrl = $controller('IssueInvoiceController', {InvoiceDAO: invoiceDaoMock, CompanyDAO: companyDaoMock, $uibModal: uibModal,
            UserDAO: UserDAOMock });

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
            expect(issueCtrl.transationType).toEqual('sell');
        });
        it('should set showAddInvoice variable to false', function ()
        {
            expect(issueCtrl.showAddInvoice).toEqual(false);
        });
        it('should set nipContractor variable to null', function ()
        {
            expect(issueCtrl.nipContractor).toEqual(null);
        });
        it('should set invoiceCompany variable to empty object', function ()
        {
            expect(issueCtrl.invoiceCompany).toEqual({ products: {}, status: 'nopaid', paymentMethod: 'transfer'});
        });
        it('should set invoicePerson variable to empty object', function ()
        {
            expect(issueCtrl.invoicePerson).toEqual({});
        });
        it('should set companyDetails variable to empty object', function ()
        {
            expect(issueCtrl.companyDetails).toEqual(null);
        });

        it('should set mockedCompany variable to result from company dao', function ()
        {
            expect(issueCtrl.mockedCompany).toEqual(mockFoundTestCompany);
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

    describe('addInvoiceCompany', function ()
    {
        describe('company invoicesDetails exists', function ()
        {

            beforeEach(function ()
            {

                issueCtrl.companyDetails = mockTestCompany;
                issueCtrl.createDatePicker.date = new Date('2000-12-15');
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
                        spyOn(form,'$setPristine');
                        spyOn(issueCtrl,'getInvoiceNumber');
                        spyOn(uibModal, 'open').and.returnValue(fakeModal);
                        issueCtrl.openAddEditProductModal();
                        issueCtrl.modalAddInstance.close(productsMock);
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
                        expect(issueCtrl.invoiceCompany).toEqual({products: {}, status: 'nopaid', paymentMethod: 'transfer'});
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
                        spyOn(uibModal, 'open').and.returnValue(fakeModal);
                        issueCtrl.openAddEditProductModal();
                        issueCtrl.modalAddInstance.close(productsMock);
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

    describe('findContractor', function ()
    {
        describe('contractor nip is valid', function ()
        {
            beforeEach(function ()
            {
                issueCtrl.nipContractor = 1234567890;
                issueCtrl.findContractor();
            });

            it('should call findByNip function', function ()
            {
                expect(companyDaoMock.findByNip).toHaveBeenCalledWith(1234567890);
            });
            it('should set showBox to false', function ()
            {
                expect(issueCtrl.showBox).toEqual(true);
            });
            it('should set showAlert to false', function ()
            {
                expect(issueCtrl.showAlert).toEqual(false);
            });
            it('should set showButton to false', function ()
            {
                expect(issueCtrl.showButton).toEqual(false);
            });
            it('should set companyDetails to proper values from database', function ()
            {
                expect(issueCtrl.companyDetails).toEqual(mockTestCompany);
            });
        });

        describe('contractor nip is invalid', function ()
        {
            beforeEach(function ()
            {
                issueCtrl.nipContractor = 9999999999;
                issueCtrl.findContractor();
            });

            it('should call findByNip function', function ()
            {
                expect(companyDaoMock.findByNip).toHaveBeenCalledWith(9999999999);
            });
            it('should set showBox to false', function ()
            {
                expect(issueCtrl.showBox).toEqual(false);
            });
            it('should set showAlert to false', function ()
            {
                expect(issueCtrl.showAlert).toEqual(true);
            });
            it('should set showButton to false', function ()
            {
                expect(issueCtrl.showButton).toEqual(true);
            });
        });
    });

    describe('addCompany modal', function ()
    {
        describe('when error', function ()
        {
            beforeEach(function ()
            {
                spyOn(uibModal, 'open').and.returnValue(fakeModal);
                spyOn(console,'error');
                var compDetails = {nip: 1234567890};
                issueCtrl.openAddCompanyModal('lg');
                issueCtrl.modalInstance.dismiss(compDetails);
            });
            it('should call findByNip function', function ()
            {
                expect(console.error).toHaveBeenCalled();
            });

        });
        describe('when ok', function ()
        {
            beforeEach(function ()
            {
                spyOn(uibModal, 'open').and.returnValue(fakeModal);
                var compDetails = {nip: 1234567890};
                issueCtrl.openAddCompanyModal('lg');
                issueCtrl.modalInstance.close(compDetails);
            });
            it('should call findByNip function', function ()
            {
                expect(companyDaoMock.findByNip).toHaveBeenCalledWith(1234567890);
            });
            it('should set result from findByNip function to companyDetails variable', function ()
            {
                expect(issueCtrl.companyDetails).toEqual(mockTestCompany);
            });
            it('should set variable showBox to true', function ()
            {
                expect(issueCtrl.showBox).toEqual(true);
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
                issueCtrl.findCompaniesByNip(12).then(function(result){
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
                issueCtrl.findCompaniesByNip(1233).then(function (result)
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
                spyOn(issueCtrl,'findContractor');
                issueCtrl.onSelect(nips[0]);
            });
            it('should set nipContractor', function ()
            {
                expect(issueCtrl.nipContractor).toBe(nips[0].nip);
            });
            it('should call findContractor', function ()
            {
                expect(issueCtrl.findContractor).toHaveBeenCalled();
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

    describe('openAddEditProductModal', function ()
    {
        describe('Add product', function ()
        {
            beforeEach(function ()
            {
                modalOptions = {
                    templateUrl: '/modules/invoices/add/addProductModal/addProductModal.tpl.html',
                    controller: 'AddProductModalController',
                    controllerAs: 'addProdModalCtrl',
                    backdrop: 'static',
                    resolve: {
                        product: jasmine.any(Function)
                    }
                };
                spyOn(uibModal,'open').and.callFake(function(options){
                    actualOptions = options;
                    return fakeModal;
                });
                issueCtrl.openAddEditProductModal();
                issueCtrl.modalAddInstance.close(productsMock);
            });
            it('should correctly show modal', function ()
            {
                expect(actualOptions.resolve.product()).toBe(null);
            });
            it('should set new product in invoiceCompany.products', function ()
            {
                expect(issueCtrl.invoiceCompany.products).toEqual(jasmine.objectContaining({'0':productsMock}));
            });
            it('should set nettoValue', function ()
            {
                expect(issueCtrl.invoiceCompany.nettoValue).toEqual(productsMock.netto.toString());
            });
            it('should set bruttoValue', function ()
            {
                expect(issueCtrl.invoiceCompany.bruttoValue).toEqual(productsMock.brutto.toString());
            });
        });
        describe('edit product', function ()
        {
            beforeEach(function ()
            {
                issueCtrl.invoiceCompany.products = {'0' : productsMock};
                modalOptions = {
                    templateUrl: '/modules/invoices/add/addProductModal/addProductModal.tpl.html',
                    controller: 'AddProductModalController',
                    controllerAs: 'addProdModalCtrl',
                    backdrop: 'static',
                    resolve: {
                        product: jasmine.any(Function)
                    }
                };
                spyOn(uibModal,'open').and.callFake(function(options){
                    actualOptions = options;
                    return fakeModal;
                });
                editProduct = {
                    name: productsMock.name,
                    vat: productsMock.vat,
                    netto: 456,
                    brutto: 610,
                    amount: productsMock.amount
                };
                issueCtrl.openAddEditProductModal('0');
                issueCtrl.modalEditInstance.close(editProduct);
            });
            it('should resolve product', function ()
            {
                expect(actualOptions.resolve.product()).toEqual(issueCtrl.invoiceCompany.products['0']);
            });
            it('should edit product', function ()
            {
                expect(issueCtrl.invoiceCompany.products['0']).toEqual(editProduct);
            });
        });
    });

    describe('showNewProduct', function ()
    {
        describe('when no products', function ()
        {
            it('should return false', function ()
            {
                var result = issueCtrl.showNewProduct();
                expect(result).toBeFalsy();
            });
        });
        describe('when product exists', function ()
        {
            beforeEach(function ()
            {
                issueCtrl.invoiceCompany.products['0'] = productsMock;
            });
            it('should return true', function ()
            {
                var result = issueCtrl.showNewProduct();
                expect(result).toBeTruthy();
            });

        });
    });
    describe('deleteProduct', function ()
    {
        beforeEach(function ()
        {
            issueCtrl.invoiceCompany.products['0'] = productsMock;
            issueCtrl.invoiceCompany.products['1'] = productsMock;
            issueCtrl.deleteProduct('0');
        });
        it('should delete product', function ()
        {
            expect(issueCtrl.invoiceCompany.products).toEqual({'1':productsMock});
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
});

