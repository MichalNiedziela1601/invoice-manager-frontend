describe('Person', function ()
{
    'use strict';

    var personDAO;
    var httpBackend;
    var response;

    function setAddress(address){
        return address.street + ' '+address.buildNr +''+ (address.flatNr ? '/'+address.flatNr : '') + ' '+address.postCode + ' '+address.city;
    }

    function setName(firstName, lastName)
    {
        return lastName + ' ' + firstName;
    }

    beforeEach(module('app'));
    beforeEach(inject(function(Person,$httpBackend){
        response = { fistName: 'John', lastName: 'Smith', id: 1};
        personDAO = Person;
        httpBackend = $httpBackend;
    }));

    describe('findByName', function ()
    {
        it('should return person', function ()
        {
            httpBackend.expectGET('/api/person/findByName?lastName=Smith').respond(200,{data: response});
            personDAO.findByName('Smith').then(function(data){
                httpBackend.flush();
                expect(data.data).toEqual({ fistName: 'John', lastName: 'Smith'});
            });

        });
    });

    describe('getById', function ()
    {
        it('should return person', function ()
        {
            httpBackend.expectGET('/api/person/1').respond(200,{data: response});
            personDAO.getById(1).then(function (data)
            {
                expect(data.data).toEqual(response);
            });
            httpBackend.flush();
        });
    });

    describe('addPerson', function ()
    {
        it('should add person end return message', function ()
        {
            httpBackend.expectPOST('/api/person').respond(200,{data: 'Person added'});
            personDAO.addPerson({firstName: 'John', lastName: 'Doe'}).then(function (data)
            {
                expect(data.data).toEqual('Person added');
            });
            httpBackend.flush();
        });
    });

    describe('findShortcut', function ()
    {
        describe('when find shortcut', function ()
        {
            it('should return id of result', function ()
            {
                response = {id: 2};
                httpBackend.expectGET('/api/person/shortcut?shortcut=MELEX').respond(200, {data: response});
                personDAO.findShortcut({shortcut: 'MELEX'}).then(function (data)
                {
                    httpBackend.flush();
                    expect(data.data.id).toBe(2);
                });

            });
        });
        describe('when not found shortcut', function ()
        {
            it('should return empty array', function ()
            {
                response = [];
                httpBackend.expectGET('/api/person/shortcut?shortcut=JAN').respond(200, response);
                personDAO.findShortcut({shortcut: 'JAN'}).then(function (data)
                {
                    httpBackend.flush();
                    expect(data).toEqual();
                });

            });

        });
    });

    describe('findByNip', function ()
    {
        it('should return person when find by nip', function ()
        {
            response.nip = 1234567890;
            httpBackend.expect('/api/person/nip?nip=1234567890').respond(200,{data: response});
            personDAO.findByNip(1234567890).then(function (data)
            {
                httpBackend.flush();
                expect(data.data).toEqual(response);
            });
        });
    });

    describe('getPersons', function ()
    {
        beforeEach(function ()
        {
            response = [
                {
                    firstName: 'John',
                    lastName: 'Smith',
                    address: {street: 'Spokojna', buildNr: '45', flatNr: '4', postCode: '33-100', city: 'Tarnów', country: 'Poland', countryCode: 'PL'}
                },
                {
                    firstName: 'John',
                    lastName: 'Doe',
                    address: {street: 'Krakowska', buildNr: '4', postCode: '33-100', city: 'Tarnów', country: 'Poland', countryCode: 'GB'}
                }
            ];
        });
        it('should return persons', function ()
        {
            httpBackend.expectGET('/api/person').respond(200,response);
            personDAO.getPersons().then(function (data)
            {
                for(var i = 0; i < 2; i++){
                    response[i].address = setAddress(response[i].address);
                    response[i].name = setName(response[i].firstName, response[i].lastName);
                    expect(data[i].address).toEqual(response[i].address);
                }
            });
            httpBackend.flush();
        });
    });

    describe('updatePErson', function ()
    {
        it('should update person', function ()
        {
            httpBackend.expectPUT('/api/person').respond(200,{data: 'Person update'});
            personDAO.updatePerson(response).then(function(data){
                expect(data.data).toEqual('Person update');
            });
            httpBackend.flush();
        });
    });

});
