angular.module('MyApp')
  .factory('Entity', ['$resource', function ($resource) {

    return{

        getContactList: function()
        {
            return $resource('/api/getContactList/',
                {}, { 'query': { method: 'GET',isArray:false } });
        },
        AddNewContact: function()
        {
            return $resource('/api/AddNewContact/',
                {}, { 'query': { method: 'GET',isArray:false } });
        },
        deleteContactDetails: function()
        {
            return $resource('/api/deleteContactDetails/:id',
                {}, { 'query': { method: 'GET',isArray:false } });
        },
        saveContact: function()
        {
          return $resource('/api/saveContact',
          {}, { 'save': { method: 'POST',isArray:false } });
        },

        ImportContactDetails: function()
        {
          return $resource('/api/ImportContactDetails',
          {}, { 'save': { method: 'POST',isArray:false } });
        },

        ImportContactDetailsCustomeSetting: function()
        {
          return $resource('/api/ImportContactDetailsCustomeSetting',
          {}, { 'save': { method: 'POST',isArray:false } });
        },
    }
  }]);