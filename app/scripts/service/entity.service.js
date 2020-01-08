angular.module('MyApp')
  .factory('Entity', ['$resource', function ($resource) {

    return{

        getContactList: function()
        {
            return $resource('/api/getContactList/',
                {}, { 'query': { method: 'GET',isArray:false } });
        },
        getContactListPagination: function()
        {
            return $resource('/api/getContactListPagination/',
                {}, { 'save': { method: 'POST',isArray:false } });
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

        FilterResult: function()
        {
          return $resource('/api/FilterResult',
          {}, { 'save': { method: 'POST',isArray:false } });
        },

        // NEAREST CONTACTS

        getVoterContactList: function()
        {
            return $resource('/api/getVoterContactList/',
                {}, { 'query': { method: 'GET',isArray:false } });
        },
        AddNewVoterContact: function()
        {
            return $resource('/api/AddNewVoterContact/',
                {}, { 'query': { method: 'GET',isArray:false } });
        },
        deleteVoterContactDetails: function()
        {
            return $resource('/api/deleteVoterContactDetails/:id',
                {}, { 'query': { method: 'GET',isArray:false } });
        },
        saveVoterContact: function()
        {
          return $resource('/api/saveVoterContact',
          {}, { 'save': { method: 'POST',isArray:false } });
        },

        ImportVoterContactDetails: function()
        {
          return $resource('/api/ImportVoterContactDetails',
          {}, { 'save': { method: 'POST',isArray:false } });
        },

        ImportVoterContactDetailsCustomeSetting: function()
        {
          return $resource('/api/ImportVoterContactDetailsCustomeSetting',
          {}, { 'save': { method: 'POST',isArray:false } });
        },

        FilterNearestResult: function()
        {
          return $resource('/api/FilterNearestResult',
          {}, { 'save': { method: 'POST',isArray:false } });
        },
        
        getVoterContactListPagination: function()
        {
            return $resource('/api/getVoterContactListPagination/',
                {}, { 'save': { method: 'POST',isArray:false } });
        },

        CopyContacttoNearest: function()
        {
            return $resource('/api/CopyContacttoNearest/',
                {}, { 'save': { method: 'POST',isArray:false } });
        },
    }
  }]);