'use strict';
describe('StartController', function ()
{
    var startCtrl;
    var userDaoMock;

    beforeEach(module('app'));
    beforeEach(inject(function($controller,UserDAO){
        userDaoMock = UserDAO;
        spyOn(userDaoMock,'isAuthenticated').and.returnValue(true);
        startCtrl = $controller('StartController',{UserDAO: userDaoMock});
    }));
    describe('initialization', function ()
    {
        it('should set message', function ()
        {
            expect(startCtrl.message).toBe('Invoice Managment');
        });
        it('should set isAuth', function ()
        {
            expect(startCtrl.isAuth).toBeTruthy();
        });
    });
});
