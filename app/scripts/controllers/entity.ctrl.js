angular.module('MyApp')
    .controller('EntityController', ['$scope', '$http', '$route', '$location', '$window', '$timeout', 'Upload', 'Entity', '$filter', function ($scope, $http, $route, $location, $window, $timeout, Upload, Entity, $filter) {


        $scope.model = {
            selected: {}
        };

        $scope.getContactList = function (status) {
            Entity.getContactList().query({}).$promise.then(function (response) {
                if (!response.status)
                    $scope.contactsList = response.contactsList;
                if (status) {
                    $scope.editContact($scope.contactsList[0])
                }
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
        {
            field: 'dob',
            title: "Date of Birth"
        },
        {
            field: 'listno',
            title: "List No."
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
            field: 'address',
            title: "Address"
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
            
           
            $scope.CustomersFields.map(function(custvalue){

                var recordExist = $filter('filter')($scope.ExcelFields,custvalue.excelField)
                console.log(recordExist)
                if(recordExist.length > 0)
                recordExist[0].disabled = true;
                });

                console.log($scope.ExcelFields)
        }

        $scope.resetSelection = function()
        {
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
                            $scope.getContactList();
                        }
                    });
                });
            } else {
                Entity.ImportContactDetailsCustomeSetting().save({excelDate:excelData, setting:$scope.CustomersFields}).$promise.then(function (response) {
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

        $scope.FilterResult = function(filter)
        {
            if((filter.field == undefined || filter.field == "") && (filter.searchinput == undefined || filter.searchinput == ""))
            {

            }
            else
            {
            Entity.FilterResult().save(filter).$promise.then(function (response) {
                if (!response.status)
                $scope.contactsList = response.contactsList;
            });
        }
        }



        // NEAREST CONTACTS


        $scope.getVoterContactList = function (status) {
            Entity.getVoterContactList().query({}).$promise.then(function (response) {
                if (!response.status)
                    $scope.voterContactsList = response.voterContactsList;
                if (status) {
                    $scope.editContact($scope.voterContactsList[0])
                }
            });
        }

        $scope.FilterNearestResult = function(filter)
        {
            if((filter.field == undefined || filter.field == "") && (filter.searchinput == undefined || filter.searchinput == ""))
            {

            }
            else
            {
            Entity.FilterNearestResult().save(filter).$promise.then(function (response) {
                if (!response.status)
                $scope.voterContactsList = response.voterContactsList;
            });
        }
        }


        $scope.AddNewVoterContact = function () {
            Entity.AddNewVoterContact().query({}).$promise.then(function (response) {
                if (response.status == 0)
                    $scope.getVoterContactList('newEntry');
            });
        }

$scope.saveVoterContact = function (idx) {

            Entity.saveVoterContact().save($scope.voterContactsList[idx]).$promise.then(function (response) {
                Swal({
                    type: response.type,
                    title: response.title,
                    text: response.message,
                }).then(function () {
                    if (response.status == 0) {
                        $scope.reset();
                        $scope.getVoterContactList();
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
                            $scope.getVoterContactList();
                        })
                    });
                }
            });
        };

        $scope.editVoterContact = function (contact) {
            $scope.model.selected = angular.copy(contact);
        };

    }]);