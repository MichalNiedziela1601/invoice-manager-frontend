describe('AuthDAO', function ()
{
    'use strict';

    var httpBackend;
    var window;
    var userDAOMock;
    var token;
    var response;
    var jwtHelperMock;

    beforeEach(module('app'));
    beforeEach(inject(function (UserDAO, $window, $httpBackend,jwtHelper)
    {
        httpBackend = $httpBackend;
        userDAOMock = UserDAO;
        window = $window;
        jwtHelperMock = jwtHelper;
    }));

    describe('login', function ()
    {
        it('should return token', function ()
        {
            httpBackend.expectPOST('/api/user/auth')
                    .respond(200,
                            {
                                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.' +
                                'TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ'
                            });
            userDAOMock.login({email: 'test@test'}).then(function (data)
            {

                expect(data.token).toEqual('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.' +
                        'TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ');
            });
            httpBackend.flush();
        });
    });

    describe('registration', function ()
    {
        it('should return success', function ()
        {
            httpBackend.expectPOST('/api/user/registration').respond(200,{data: 'register'});
            userDAOMock.registration({email: 'test@test'}).then(function(data){
                expect(data.data).toEqual('register');
            });
            httpBackend.flush();
        });
    });

    describe('getUserInfo', function ()
    {
        beforeEach(function ()
        {
            response = {id: 1, email: 'test@test', companyId: 2};
        });
        it('should return user info', function ()
        {
            httpBackend.expectGET('/api/user/auth').respond(200,{data: response});
            userDAOMock.getUserInfo().then(function (data)
            {
                expect(data.data).toEqual({id: 1, email: 'test@test', companyId: 2});
            });

            httpBackend.flush();
        });
    });

    describe('logout', function ()
    {
        beforeEach(function ()
        {
            token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.' +
                    'TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ';
            window.sessionStorage.setItem('token',token);
        });
        it('should delete token', function ()
        {
            userDAOMock.logout();
            expect(window.sessionStorage.getItem('token')).toBeNull();
        });
    });

    describe('getToken', function ()
    {
        beforeEach(function ()
        {
            token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.' +
                    'TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ';
            window.sessionStorage.setItem('token',token);
        });
        it('should return token', function ()
        {
            token = jwtHelperMock.decodeToken(userDAOMock.getToken());
            expect(token.name).toEqual('John Doe');
        });
    });

    describe('isAuthenticated', function ()
    {
        describe('when token exist', function ()
        {
            beforeEach(function ()
            {
                token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.' +
                        'TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ';
                window.sessionStorage.setItem('token',token);
            });
            it('should return true', function ()
            {
                response = userDAOMock.isAuthenticated();
                expect(response).toBeTruthy();
            });
        });
        describe('when token not exist', function ()
        {
            beforeEach(function ()
            {
                userDAOMock.logout();
            });
            it('should return false', function ()
            {
                expect(userDAOMock.isAuthenticated()).toBeFalsy();
            });
        });

    });

    describe('updateAddress', function ()
    {
        it('should update address', function ()
        {
            httpBackend.expectPUT('/api/user/address').respond(200,{data: 'Address update'});
            userDAOMock.updateAddress({street: 'Street'}).then(function(data){
                expect(data.data).toEqual('Address update');
            });
            httpBackend.flush();
        });
    });

    describe('updateAddress', function ()
    {
        it('should update address', function ()
        {
            httpBackend.expectPUT('/api/user/account').respond(200,{data: 'Account update'});
            userDAOMock.updateAccount({account: '456589674567986546'}).then(function(data){
                expect(data.data).toEqual('Account update');
            });
            httpBackend.flush();
        });
    });

    describe('addNewUser', function ()
    {
        it('should add new user', function ()
        {
            httpBackend.expectPOST('/api/user/newUser').respond(200,{data: 'User added'});
            userDAOMock.addNewUser({email: 'user@mail.com'},2).then(function(data){
                expect(data.data).toEqual('User added');
            });
            httpBackend.flush();
        });
    });
});
