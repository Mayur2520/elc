angular.module('MyApp')
    .controller('EntityController', ['$scope', '$rootScope', '$http', '$route', '$location', '$window', '$timeout', 'Upload', 'Entity', 'Authenticate', '$filter', function ($scope, $rootScope, $http, $route, $location, $window, $timeout, Upload, Entity, Authenticate, $filter) {


        var socket = io.connect('http://103.252.7.5:8092');


        
        $scope.dateOptionsFilters = {
            changeYear: true,
            changeMonth: true,
            yearRange: '1971:-0',
        };


        $scope.model = {
            selected: {}
        };

        function paginationSetting(totalRecord)
        {
            if(totalRecord < 50)
            totalRecord = totalRecord + 50;
            $scope.totlaCount = totalRecord;
            $scope.maxSize = 10;
            $scope.bigTotalItems = $scope.totlaCount;
            $scope.bigCurrentPage = 1;
        }


        $scope.getUserList = function()
        {
            Authenticate.getUserList().query().$promise.then(function (response) {
                     if(!response.status)
                        $scope.UsersList = response.UsersList;
                });      
        };

        $scope.getContactList = function (status) {
            Entity.getContactList().query({}).$promise.then(function (response) {
                if (!response.status)
                    $scope.contactsList = response.contactsList;
                if (status) {
                    $scope.editContact($scope.contactsList[0])
                }
                if($scope.contactsList.length > 0)
                    paginationSetting($scope.contactsList[0].totalcontacts);
            });
        }

        $scope.AddNewContact = function () {
            Entity.AddNewContact().query({}).$promise.then(function (response) {
                if (response.status == 0)
                    $scope.getContactList('newEntry');
            });
        }

        // gets the template to ng-include for a table row / item
        $scope.getTemplate = function (contact) {
            if (contact.id === $scope.model.selected.id) return 'edit';
            else return 'display';
        };

        $scope.editContact = function (contact) {
            $scope.model.selected = angular.copy(contact);
        };



        $scope.saveContact = function (idx) {

            Entity.saveContact().save($scope.contactsList[idx]).$promise.then(function (response) {
                Swal({
                    type: response.type,
                    title: response.title,
                    text: response.message,
                }).then(function () {
                    if (response.status == 0) {
                        $scope.reset();
                        $scope.getContactList();
                    }
                })
            });

        };

        $scope.deleteContactDetails = function (id) {

            Swal({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then(function (result) {
                if (result.value) {
                    Entity.deleteContactDetails().query({
                        id: id
                    }).$promise.then(function (response) {
                        Swal({
                            type: response.type,
                            title: response.title,
                            text: response.message,
                        }).then(function () {
                            $scope.getContactList();
                        })
                    });
                }
            });
        };


        $scope.reset = function () {
            $scope.isEdit = false;
            $scope.model.selected = {};
        };


        $scope.SelectedFileForUpload = null;

        $scope.UploadFile = function (files) {
            $scope.$apply(function () { //I have used $scope.$apply because I will call this function from File input type control which is not supported 2 way binding
                $scope.Message = "";
                $scope.SelectedFileForUpload = files[0];
            })
            $scope.ReadExcelData();
        }

        $scope.ReadExcelData = function () {
            $scope.showspinner = true;
            var file = $scope.SelectedFileForUpload;
            if (file) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var data = e.target.result;
                    //XLSX from js-xlsx library , which I will add in page view page
                    var workbook = XLSX.read(data, {
                        type: 'binary'
                    });
                    $scope.sheetName = workbook.SheetNames;
                    $scope.showspinner = false;
                    $scope.$apply();
                }
                reader.onerror = function (ex) {
                    console.log(ex);
                }

                reader.readAsBinaryString(file);
            }
        }

        $scope.CustomersFields = [{
                field: 'name',
                title: "Name"
            },
            {
                field: 'gender',
                title: "Gender"
            },
            {
                field: 'mobile1',
                title: "Mobile No."
            },
            {
                field: 'mobile2',
                title: "Alt. Mobile No."
            },
            {
                field: 'email',
                title: "Email"
            },
        ]


        $scope.nearestContcatFields = [{
                field: 'listno',
                title: "Yadi No."
            },
            {
                field: 'indexno',
                title: "SR. No."
            },
            {
                field: 'rctno',
                title: "RCT.No."
            },
            {
                field: 'name',
                title: "Name"
            },
            {
                field: 'gender',
                title: "Gender"
            },
            {
                field: 'email',
                title: "Email"
            },
            {
                field: 'mobile1',
                title: "Mobile No."
            },
            {
                field: 'mobile2',
                title: "Alt. Mobile No."
            },
            {
                field: 'dob',
                title: "Date of Birth"
            },
            {
                field: 'address',
                title: "Address"
            },
            {
                field: 'building',
                title: "Building Name"
            },
        ]

        var alphabetsCars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        $scope.getdataFromSheet = function (sheetName) {
            var file = $scope.SelectedFileForUpload;
            if (file) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var data = e.target.result;
                    //XLSX from js-xlsx library , which I will add in page view page
                    var workbook = XLSX.read(data, {
                        type: 'binary'
                    });
                    var excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                    if (excelData.length > 0) {
                        $scope.ExcelFields = [];
                        $scope.Fileds = Object.keys(excelData[0]);
                        $scope.Fileds.map(function (value) {
                            $scope.ExcelFields.push({
                                field: value,
                                title: alphabetsCars[value]
                            });
                        });

                        //   $scope.ImporProductsDetails(excelData);
                    } else {
                        $scope.Message = "No data found";
                    }
                }
                reader.onerror = function (ex) {
                    console.log(ex);
                }

                reader.readAsBinaryString(file);
            }
        }

        $scope.setSettingBehavior = function (behavior) {
            $scope.settingBehavior = behavior;
        }

        $scope.setColumnForField = function (fieldObj) {


            $scope.CustomersFields.map(function (custvalue) {

                var recordExist = $filter('filter')($scope.ExcelFields, custvalue.excelField)
                console.log(recordExist)
                if (recordExist.length > 0)
                    recordExist[0].disabled = true;
            });

            
        }

        $scope.resetSelection = function () {
            angular.element("input[type='file']").val(null);
            $(".custom-file-input").siblings(".custom-file-label").removeClass("selected").html("Choose file");
        }

        $scope.startImporting = function (excelData) {
            if ($scope.settingBehavior == 'default') {
                Entity.ImportContactDetails().save(excelData).$promise.then(function (response) {
                    Swal({
                        type: response.type,
                        title: response.title,
                        text: response.message,
                    }).then(function () {
                        if (response.status == 0) {

                        } else {
                            $scope.resetSelection();
                            $('#myModalImportContacts').modal('hide');
                            $scope.startImport  = false;
                            $scope.getContactList();
                        }
                    });
                });
            } else {
                Entity.ImportContactDetailsCustomeSetting().save({
                    excelDate: excelData,
                    setting: $scope.CustomersFields
                }).$promise.then(function (response) {
                    Swal({
                        type: response.type,
                        title: response.title,
                        text: response.message,
                    }).then(function () {
                        if (response.status == 0) {

                        } else {
                            $scope.resetSelection();
                            $('#ModalImportProductsDetails').modal('hide');
                            $scope.getProductList();
                        }
                    });
                });
            }
        }

        $scope.ImportContactData = function () {

            $scope.startImport  = true;

            var file = $scope.SelectedFileForUpload;
            if (file) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var data = e.target.result;
                    //XLSX from js-xlsx library , which I will add in page view page
                    var workbook = XLSX.read(data, {
                        type: 'binary'
                    });
                    var sheetName = workbook.SheetNames[0];
                    var excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                    if (excelData.length > 0) {
                        $scope.startImporting(excelData);
                    } else {
                        $scope.Message = "No data found";
                    }
                }
                reader.onerror = function (ex) {
                    console.log(ex);
                }

                reader.readAsBinaryString(file);
            }


        }

        $scope.FilterResult = function (filter) {
            if ((filter.field == undefined || filter.field == "") && (filter.searchinput == undefined || filter.searchinput == "")) {

            } else {
                Entity.FilterResult().save(filter).$promise.then(function (response) {
                    if (!response.status)
                        $scope.contactsList = response.contactsList;
                        if($scope.contactsList.length > 0)
                        paginationSetting($scope.contactsList[0].totalcontacts);
                });
            }
        }


        $scope.getContactListFromPagination = function(value)
        {   
            if($scope.filter)         
            {
                if (($scope.filter.field == undefined || $scope.filter.field == "") && ($scope.filter.searchinput == undefined || $scope.filter.searchinput == "")) {
                    var query = {skip:value}
                }
                else
                {
                    var query = {skip:value, filter:$scope.filter}
                }
            }
            else
            {
                var query = {skip:value}
            }


            if(value == ($scope.totlaCount/50))
            {
                query.islast = true;
            }

            Entity.getContactListPagination().save(query).$promise.then(function (response) {
                if (!response.status)
                    $scope.contactsList = response.contactsList;
            });
        }


        // NEAREST CONTACTS


        $scope.getVoterContactList = function (status,sort) {
            if(sort == undefined || sort == null || sort == '')
            {
                sort = 'ASC'
            }
            Entity.getVoterContactList().query({sort:sort}).$promise.then(function (response) {
                if (!response.status)
                    $scope.voterContactsList = response.voterContactsList;
                if (status) {
                    $scope.editContact($scope.voterContactsList[0])
                }
                $scope.isEdit = false;
                if($scope.voterContactsList.length > 0)
                paginationSetting($scope.voterContactsList[0].totalcontacts);

            });
        }


         $scope.getVoterContactListPagination = function(value)
        {            

            if($scope.filter)         
            {
                if (($scope.filter.field == undefined || $scope.filter.field == "") && ($scope.filter.searchinput == undefined || $scope.filter.searchinput == "")) {
                    var query = {skip:value}
                }
                else
                {
                    var query = {skip:value, filter:$scope.filter}
                }
            }
            else
            {
                var query = {skip:value}
            }


            if(value == ($scope.totlaCount/50))
            {
                query.islast = true;
            }

            Entity.getVoterContactListPagination().save(query).$promise.then(function (response) {
                if (!response.status)
                $scope.voterContactsList = response.voterContactsList;
            });            
        }

        $scope.FilterNearestResult = function (filter) {
            if ((filter.field == undefined || filter.field == "") && (filter.searchinput == undefined || filter.searchinput == "")) {

            } else {
                Entity.FilterNearestResult().save(filter).$promise.then(function (response) {
                    if (!response.status)
                        $scope.voterContactsList = response.voterContactsList;
                        if($scope.voterContactsList.length > 0)
                        paginationSetting($scope.voterContactsList[0].totalcontacts);
                });
            }
        }





        $scope.startImportingContacts = function (excelData) {
            if ($scope.settingBehavior == 'default') {
                Entity.ImportContactDetails().save(excelData).$promise.then(function (response) {
                    Swal({
                        type: response.type,
                        title: response.title,
                        text: response.message,
                    }).then(function () {
                        if (response.status == 0) {

                        } else {
                            $scope.resetSelection();
                            $('#myModalImportContacts').modal('hide');
                            $scope.startImport  = false;
                            $scope.getContactList();
                        }
                    });
                });
            } else {
                Entity.ImportContactDetailsCustomeSetting().save({
                    excelDate: excelData,
                    setting: $scope.CustomersFields
                }).$promise.then(function (response) {
                    Swal({
                        type: response.type,
                        title: response.title,
                        text: response.message,
                    }).then(function () {
                        if (response.status == 0) {

                        } else {
                            $scope.resetSelection();
                            $('#myModalImportContacts').modal('hide');
                            $scope.getContactList();
                        }
                    });
                });
            }
        }

        $scope.startImportingVoterContacts = function (excelData) {
            if ($scope.settingBehavior == 'default') {
                Entity.ImportVoterContactDetails().save(excelData).$promise.then(function (response) {
                    Swal({
                        type: response.type,
                        title: response.title,
                        text: response.message,
                    }).then(function () {
                        if (response.status == 0) {

                        } else {
                            $scope.resetSelection();
                            $('#myModalImportVoterContacts').modal('hide');
                            $scope.startImport  = false;
                            $scope.getVoterContactList();
                        }
                    });
                });
            } else {
                Entity.ImportVoterContactDetailsCustomeSetting().save({
                    excelDate: excelData,
                    setting: $scope.CustomersFields
                }).$promise.then(function (response) {
                    Swal({
                        type: response.type,
                        title: response.title,
                        text: response.message,
                    }).then(function () {
                        if (response.status == 0) {

                        } else {
                            $scope.resetSelection();
                            $('#myModalImportVoterContacts').modal('hide');
                            $scope.getVoterContactList();
                        }
                    });
                });
            }
        }

        $scope.ImportContactData = function () {

            $scope.startImport  = true;

            var file = $scope.SelectedFileForUpload;
            if (file) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var data = e.target.result;
                    //XLSX from js-xlsx library , which I will add in page view page
                    var workbook = XLSX.read(data, {
                        type: 'binary'
                    });
                    var sheetName = workbook.SheetNames[0];
                    var excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                    if (excelData.length > 0) {
                        $scope.startImportingContacts(excelData);
                    } else {
                        $scope.Message = "No data found";
                    }
                }
                reader.onerror = function (ex) {
                    console.log(ex);
                }

                reader.readAsBinaryString(file);
            }


        }


        $scope.ImportVoterContactData = function () {

            $scope.startImport  = true;

            var file = $scope.SelectedFileForUpload;
            if (file) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var data = e.target.result;
                    //XLSX from js-xlsx library , which I will add in page view page
                    var workbook = XLSX.read(data, {
                        type: 'binary'
                    });
                    var sheetName = workbook.SheetNames[0];
                    var excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                    if (excelData.length > 0) {
                        $scope.startImportingVoterContacts(excelData);
                    } else {
                        $scope.Message = "No data found";
                    }
                }
                reader.onerror = function (ex) {
                    console.log(ex);
                }

                reader.readAsBinaryString(file);
            }


        }





        $scope.AddNewVoterContact = function () {
            Entity.AddNewVoterContact().query({}).$promise.then(function (response) {
                if (response.status == 0)
                    $scope.getVoterContactList('newEntry','DESC');
            });
        }

        $scope.CopyContacttoNearest = function (contactData) {
            Entity.CopyContacttoNearest().save(contactData).$promise.then(function (response) {
                Swal({
                    type: response.type,
                    title: response.title,
                    text: response.message,
                }).then(function () {
                    if (response.status == 0) {
                        // $scope.reset();
                        // $scope.getVoterContactList();
                    }
                })
            });

        };


        $scope.saveVoterContact = function (idx) {

            Entity.saveVoterContact().save($scope.voterContactsList[idx]).$promise.then(function (response) {
                Swal({
                    type: response.type,
                    title: response.title,
                    text: response.message,
                }).then(function () {
                    if (response.status == 0) {
                        $scope.reset();
                        $scope.getVoterContactList('','ASC');
                    }
                })
            });

        };
        $scope.deleteVoterContactDetails = function (id) {

            Swal({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then(function (result) {
                if (result.value) {
                    Entity.deleteVoterContactDetails().query({
                        id: id
                    }).$promise.then(function (response) {
                        Swal({
                            type: response.type,
                            title: response.title,
                            text: response.message,
                        }).then(function () {
                            $scope.getVoterContactList('','ASC');
                        })
                    });
                }
            });
        };
        $scope.isEdit = false;
        $scope.editVoterContact = function (contact) {
            $scope.isEdit = true;
            $scope.model.selected = angular.copy(contact);
            $scope.getListRecord();
        };

        $scope.FamilyGroup = [];
        $scope.CheckEntry = function(data)
        {
            if($scope.FamilyGroup.length <= 0)
            {
                $scope.FamilyGroup.push(data)
            }
            else
            {
                var recordExist = $scope.FamilyGroup.filter(function(value){
                    return value.id == data.id
                });

                if(recordExist.length > 0)
                {
                    $scope.FamilyGroup.splice( $scope.FamilyGroup.indexOf(recordExist[0]), 1);
                }
                else
                {
                    $scope.FamilyGroup.push(data)
                }
            }
        }

        $scope.ConfirmToFamily = function()
        {
            if($scope.ConfirmFamily && $scope.ConfirmFamily.length > 0)
            {
                $scope.FamilyGroup.map(function(value){
                    $scope.ConfirmFamily.push(value);
                });
            }
            else
            $scope.ConfirmFamily = angular.copy($scope.FamilyGroup);
        }

        $scope.RemoveFromFamily = function(familyrcd)
        {
            if(familyrcd.id)
            {
                Entity.RemoveFromFamily().query({memberid:familyrcd.id}).$promise.then(function (response) {
                    if (response.status == 0)
                        {
                            $scope.ConfirmFamily.splice( $scope.ConfirmFamily.indexOf(familyrcd), 1);
                        }
                }); 
            }
            else
            $scope.ConfirmFamily.splice( $scope.ConfirmFamily.indexOf(familyrcd), 1);
        }

        $scope.CreateFamily = function()
        {
            Entity.CreateFamily().save($scope.ConfirmFamily).$promise.then(function (response) {
                Swal({
                    type: response.type,
                    title: response.title,
                    text: response.message,
                }).then(function () {
                    if (response.status == 0) {
                        $scope.ConfirmFamily = [];
                        $scope.FamilyGroup = [];
                        $('#myModalCreateFamily').modal('hide');
                        $scope.getVoterContactList('','ASC');
                    }
                })
            });
        }

        $scope.ShowFamilyDetails = function(familyid)
        {
            if(familyid && familyid > 0)
            {
                Entity.ShowFamilyDetails().query({familyid:familyid}).$promise.then(function (response) {
                    if (response.status == 0)
                        {
                            $scope.ConfirmFamily = response.familyDetails;
                            $('#myModalCreateFamily').modal('show');
                        }
                }); 
            }
            else
            {
                Swal({
                    type: 'error',
                    title: '',
                    text: 'No family members available',
                }).then(function () {
                });
            }
        }

        $scope.allocateUserForList = function(userdetails)
        {
            if($scope.ListusersAllocation && $scope.ListusersAllocation.length > 0)
            $scope.ListusersAllocation.push({name:userdetails.name,userid:userdetails.id})
                else
                {
                    $scope.ListusersAllocation = [];
                    $scope.ListusersAllocation.push({name:userdetails.name,userid:userdetails.id})
                }

                $scope.selecteduser = undefined;
        }


        $scope.getListRecord = function()
        {
            Entity.getListRecord().query().$promise.then(function (response) {
                     if(!response.status)
                        $scope.listNosList = response.listNosList;
                });      
        };

        $scope.SaveListDetails = function()
        {
            $scope.ListDetails[0].userAllocation = $scope.ListusersAllocation;

            Entity.SaveListDetails().save($scope.ListDetails[0]).$promise.then(function (response) {
                Swal({
                    type: response.type,
                    title: response.title,
                    text: response.message,
                }).then(function () {
                    if (response.status == 0) {
                        $scope.getListRecord();
                    }
                })
            });    
        }

/*         $scope.getListDetails = function(data)
        {
            $scope.ListDetails = [];
            $scope.ListDetails[0] = angular.copy(data)
        } */
       
        $scope.getListRecordDetails = function(listid)
        {
            Entity.getListRecordDetails().query({listid:listid}).$promise.then(function (response) {
                if(response.status == 0)
                   {
                     $scope.ListDetails = response.listrecordDetails;
                     $scope.ListusersAllocation = [];
                     $scope.ListDetails.map(function(value){
                        $scope.ListusersAllocation.push({name:value.name,userid:value.userid})
                     });
                    
                   }
           });      
            
        }

        $scope.getBirthdaysList = function(listid)
        {
            Entity.getBirthdaysList().query().$promise.then(function (response) {
                if(response.status == 0)
                   {
                     $scope.birthdaysList = response.dashboardValues;
                   }
           });      
            
        }
       

    }]);