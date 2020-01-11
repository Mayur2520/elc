var express = require('express');
var nodemailer = require('nodemailer');
var connection = require('../config/connection');
var cryptconf = require('../config/crypt.config');
var fs = require('fs');
var mailer = require('../config/mailer.config');
var env = require('../config/env');
var moment = require('moment');

module.exports = {


    getContactList: function(req, res)
    {
        if (req.decoded.success == true) {   
            connection.acquire(function(err, con){
                   
                con.query('SELECT *,(SELECT COUNT(*) - 50 FROM contacts) as totalcontacts FROM contacts ORDER BY id DESC LIMIT 50', function(err,result){
                    if(err)
                    {
                        console.log(err)
                        res.send({status:1, message:"Something went wrong"})
                    }
                    else
                    {
                        res.send({contactsList:result})
                    }
                });
                con.release();
            });
        }
    },



    getContactListPagination: function(req, res)
    {
        if (req.decoded.success == true) {   
            connection.acquire(function(err, con){
                   if(req.body.skip == 1)
                   {
                    var skiplimit = '50';
                   }else
                   {
                    var skiplimit = ((req.body.skip -1) * 50)+', 50';
                   }

                   if(req.body.filter)
                   {
                        var searchFilter = ' WHERE '+req.body.filter.field+' LIKE "%'+req.body.filter.searchinput+'%"';
                   }
                   else
                   {
                    var searchFilter = '';
                   }


                con.query('SELECT * FROM contacts '+searchFilter+' ORDER BY id DESC LIMIT '+skiplimit, function(err,result){
                    if(err)
                    {
                        console.log(err)
                        res.send({status:1, message:"Something went wrong"})
                    }
                    else
                    {
                        res.send({contactsList:result})
                    }
                });
                con.release();
            });
        }
    },

    FilterResult: function(req, res)
    {
         if (req.decoded.success == true) {   
            connection.acquire(function(err, con){
                   
                con.query('SELECT *,(SELECT COUNT(*) - 50 FROM contacts WHERE '+req.body.field+' LIKE "%'+req.body.searchinput+'%") as totalcontacts FROM contacts WHERE '+req.body.field+' LIKE "%'+req.body.searchinput+'%" ORDER BY id DESC LIMIT 500', function(err,result){
                    if(err)
                    {
                        console.log(err)
                        res.send({status:1, message:"Something went wrong"})
                    }
                    else
                    {
                        res.send({contactsList:result})
                    }
                });
                con.release();
            });
        } 
    },
    AddNewContact: function(req, res)
    {
        if (req.decoded.success == true) {   
            connection.acquire(function(err, con){
                   
                con.query('INSERT INTO contacts (createdby) values ('+req.decoded.logedinuser.id+')', function(err,result){
                    if(err)
                    {
                        res.send({status:1, message:"Something went wrong"})
                    }
                    else
                    {
                        res.send({status:0, message:"contact added", insertedid: result.insertId})
                    }
                });
                con.release();
            });
        }
    },


    ImportContactDetails: function(req, res)
    {
        if (req.decoded.success == true) {   
              
                
                var sql = 'INSERT INTO `contacts`(`name`, `gender`, `email`, `mobile1`, `mobile2`, `createdby`) VALUES ';
                
                req.body.map(function(value, index){
                    if(value[0] != undefined){value[0].replace(/[^a-zA-Z0-9]/g, '')}else{value[0] = null}
                    if(value[1] != undefined){value[1].replace(/[^a-zA-Z0-9]/g, '')}else{value[1] = null}
                    if(value[2] != undefined){value[2].replace(/[^a-zA-Z0-9]/g, '')}else{value[2] = null}
                    if(value[3] != undefined){value[3].replace(/[^a-zA-Z0-9]/g, '')}else{value[3] = null}
                    if(value[4] != undefined){value[4].replace(/[^a-zA-Z0-9]/g, '')}else{value[4] = null}
        
                    var ss= '("'+value[0]+'","'+value[1]+'", "'+value[2]+'",'+value[3]+','+value[4]+','+req.decoded.logedinuser.id+');';

                    connection.acquire(function (err, con) {
                    con.query(sql+ss,function(err,result)
                    {
                        if(err)
                            {
                                console.log(err)
                                if(index == req.body.length -1)
                                res.send({
                                    status: 0,
                                    type: "error",
                                    title: "Oops!",
                                    message: "Something went worng, Please try again letter"
                                });
                                con.release();
                            }
                            else
                            {
                                if(index == req.body.length -1)
                                res.send({
                                    status: 1,
                                    type: "success",
                                    title: "Done!",
                                    message: "Record imported successfully"
                                });
                               
                            }
                    });
                    con.release();
                });



                });


                
                //  ss = ss.substr(0, ss.length - 1);
               
                // connection.acquire(function (err, con) {
                    /* con.query(sql+ss,function(err,result)
                    {
                        if(err)
                            {
                                console.log(err)
                                res.send({
                                    status: 0,
                                    type: "error",
                                    title: "Oops!",
                                    message: "Something went worng, Please try again letter"
                                });
                                con.release();
                            }
                            else
                            {
                                res.send({
                                    status: 1,
                                    type: "success",
                                    title: "Done!",
                                    message: "Record imported successfully"
                                });
                                con.release();
                            }
                    }); */
                // });
            }
    },


    ImportContactDetailsCustomeSetting: function(req, res)
    {

console.log(JSON.stringify(req.body.setting));


[{"field":"name","title":"Name","excelField":{"field":"1","title":"B"}},{"field":"gender","title":"Gender","excelField":{"field":"0","title":"A"}},{"field":"mobile1","title":"Mobile No.","excelField":{"field":"3","title":"D"}},{"field":"mobile2","title":"Alt. Mobile No.","excelField":{"field":"2","title":"C"}},{"field":"email","title":"Email","excelField":{"field":"4","title":"E"}}]

        var fieldIndex= [];
         if (req.decoded.success == true) {   
            
                var sql = 'INSERT INTO `contacts`(`name`, `gender`, `mobile1`, `mobile2`, `email`, `createdby`) VALUES ';
                var ss = '';

                req.body.setting.map(function(value,index){
                    if(value.excelField && value.excelField.field)
                    {
                        fieldIndex.push(value.excelField.field)
                    }
                    else
                    {
                        fieldIndex.push(index)
                    }
                });

                if(fieldIndex.length == req.body.setting.length)
                {
                    fieldIndex.map(function(flind){
                        req.body.excelDate.map(function(value){
                            if(value[flind] != undefined){value[flind]}else{value[flind] = ""}
                        })
                    });


                    /* fieldIndex.map(function(flind){
                        req.body.excelDate.map(function(value){
                            
                        })
                    }); */


                   

                }


                excelfield.map(function(fields){
                    req.body.map(function(value){
                        if(value[0] != undefined){value[0]}else{value[0] = ""}
                        if(value[1] != undefined){value[1]}else{value[1] = ""}
                        if(value[2] != undefined){value[2]}else{value[2] = ""}
                        if(value[3] != undefined){value[3]}else{value[3] = ""}
                        if(value[4] != undefined){value[4]}else{value[4] = ""}
            
                       
                    });
                });

                
                 ss = ss.substr(0, ss.length - 1);
               
                connection.acquire(function (err, con) {
                    con.query(sql+ss,function(err,result)
                    {
                        if(err)
                            {
                                console.log(err)
                                res.send({
                                    status: 0,
                                    type: "error",
                                    title: "Oops!",
                                    message: "Something went worng, Please try again letter"
                                });
                                con.release();
                            }
                            else
                            {
                                res.send({
                                    status: 1,
                                    type: "success",
                                    title: "Done!",
                                    message: "Record imported successfully"
                                });
                                con.release();
                            }
                    });
                });
            } 
    },

    deleteContactDetails: function(req, res)
    {
        if (req.decoded.success == true) {   
            connection.acquire(function(err, con){
                   
                con.query('DELETE FROM `contacts` WHERE `id` = '+req.params.id, function(err,result){
                    if(err)
                    {
                        res.send({
                            status: 1,
                            type: "error",
                            title: "Oops!",
                            message: "Something went wrong, Please try again."
                        });
                    }
                    else
                    {
                        res.send({
                            status: 0,
                            type: "success",
                            title: "Done!",
                            message: "Record deleted successfully."
                        });
                    }
                });
                con.release();
            });
        }
    },

    saveContact: function(req, res)
    {
        if (req.decoded.success == true) {   
            connection.acquire(function(err, con){
                req.body.createddate = moment(req.body.createddate).format("YYYY-MM-DD HH:mm:ss");
<<<<<<< HEAD
                  delete req.body.totalcontacts;
=======

                delete req.body.totalcontacts
>>>>>>> 58bf49bd4e4d82fd1a9d5e505229f55511460ab9
                var keys = Object.keys(req.body);

                keys.map(function(value){
                    if(req.body[value] == '')
                    req.body[value] = null;
                });

                con.query('UPDATE contacts SET ? WHERE id = ?',[req.body, req.body.id], function(err,result){
                    if(err)
                    {
                        console.log(err)
                        res.send({
                            status: 1,
                            type: "error",
                            title: "Oops!",
                            message: "Something went wrong, Please try again."
                        });
                    }
                    else
                    {
                        res.send({
                            status: 0,
                            type: "success",
                            title: "Done!",
                            message: "Contact details saved successfully"
                        });
                    }
                });
                con.release();
            });
        }
    },


// NEAREST CONTACTS

getVoterContactList: function(req, res)
    {
        if (req.decoded.success == true) {   
            connection.acquire(function(err, con){
                   
                con.query('SELECT *, (SELECT COUNT(*) - 50 FROM voters) as totalcontacts FROM voters ORDER BY id DESC LIMIT 50', function(err,result){
                    if(err)
                    {
                        console.log(err)
                        res.send({status:1, message:"Something went wrong"})
                    }
                    else
                    {
                        res.send({voterContactsList:result})
                    }
                });
                con.release();
            });
        }
    },
    FilterNearestResult: function(req, res)
    {
         if (req.decoded.success == true) {   
            connection.acquire(function(err, con){
                   
                con.query('SELECT *, (SELECT COUNT(*) - 50 FROM voters WHERE '+req.body.field+' LIKE "%'+req.body.searchinput+'%") as totalcontacts FROM voters WHERE '+req.body.field+' LIKE "%'+req.body.searchinput+'%" ORDER BY id DESC LIMIT 50', function(err,result){
                    if(err)
                    {
                        console.log(err)
                        res.send({status:1, message:"Something went wrong"})
                    }
                    else
                    {
                        res.send({voterContactsList:result})
                    }
                });
                con.release();
            });
        } 
    },

    AddNewVoterContact: function(req, res)
    {
        if (req.decoded.success == true) {   
            connection.acquire(function(err, con){
                   
                con.query('INSERT INTO voters (createdby) values ('+req.decoded.logedinuser.id+')', function(err,result){
                    if(err)
                    {
                        res.send({status:1, message:"Something went wrong"})
                    }
                    else
                    {
                        res.send({status:0, message:"contact added", insertedid: result.insertId})
                    }
                });
                con.release();
            });
        }
    },

    CopyContacttoNearest: function(req, res)
    {
        if (req.decoded.success == true) {   
            connection.acquire(function(err, con){

                delete req.body.id;
                delete req.body.createddate;
                delete req.body.totalcontacts;

                   req.body.createdby = req.decoded.logedinuser.id

                con.query('INSERT INTO voters SET ?',req.body, function(err,result){
                    if(err)
                    {
                        console.log(err)
                        res.send({
                            status: 1,
                            type: "error",
                            title: "Oops!",
                            message: "Something went wrong, Please try again."
                        });
                    }
                    else
                    {
                        res.send({
                            status: 0,
                            type: "success",
                            title: "Done!",
                            message: "Contact copied to nearest successfully"
                        });
                    }
                });
                con.release();
            });
        }
    },


    ImportVoterContactDetails: function(req, res)
    {
        if (req.decoded.success == true) {   
                var ss = '';

                   
                var sql = 'INSERT INTO `voters`( `listno`,`indexno`, `rctno`, `name`,`gender`, `email`, `mobile1`, `mobile2`, `dob`, `address`,`createdby`)  VALUES ';
                var ss = '';
                req.body.map(function(value){
                    if(value[0] != undefined){value[0]}else{value[0] = ""}
                    if(value[1] != undefined){value[1]}else{value[1] = ""}
                    if(value[2] != undefined){value[2]}else{value[2] = ""}
                    if(value[3] != undefined){value[3]}else{value[3] = ""}
                    if(value[4] != undefined){value[4]}else{value[4] = ""}
                    if(value[5] != undefined){value[5]}else{value[5] = ""}
                    if(value[6] != undefined){value[6]}else{value[6] = ""}
                    if(value[7] != undefined){value[7]}else{value[7] = ""}
                    if(value[8] != undefined){value[8]}else{value[8] = ""}
                    if(value[9] != undefined){value[9]}else{value[9] = ""}
        
                    ss= ss+ '("'+value[0]+'","'+value[1]+'", "'+value[2]+'","'+value[3]+'","'+value[4]+'","'+value[5]+'",'+value[6]+','+value[7]+',"'+value[8]+'","'+value[9]+'",'+req.decoded.logedinuser.id+'),';
                });
                 ss = ss.substr(0, ss.length - 1);
               
                connection.acquire(function (err, con) {
                    con.query(sql+ss,function(err,result)
                    {
                        if(err)
                            {
                                console.log(err)
                                res.send({
                                    status: 0,
                                    type: "error",
                                    title: "Oops!",
                                    message: "Something went worng, Please try again letter"
                                });
                                con.release();
                            }
                            else
                            {
                                res.send({
                                    status: 1,
                                    type: "success",
                                    title: "Done!",
                                    message: "Record imported successfully"
                                });
                                con.release();
                            }
                    });
                });
            }
    },


    ImportVoterContactDetailsCustomeSetting: function(req, res)
    {




            var excelfield = [];

         if (req.decoded.success == true) {   
                var ss = '';
            
                var sql = 'INSERT INTO `voters`( `listno`,`indexno`, `rctno`, `name`,`gender`, `email`, `mobile1`, `mobile2`, `dob`, `address`,`createdby`)  VALUES ';
                var ss = '';


                req.body.setting.map(function(value){
                    value.excelField.field
                })

                    req.body.map(function(value){
                        if(value[0] != undefined){value[0]}else{value[0] = ""}
                        if(value[1] != undefined){value[1]}else{value[1] = ""}
                        if(value[2] != undefined){value[2]}else{value[2] = ""}
                        if(value[3] != undefined){value[3]}else{value[3] = ""}
                        if(value[4] != undefined){value[4]}else{value[4] = ""}
            
                        ss= ss+ '("'+value[0]+'","'+value[1]+'", "'+value[2]+'",'+value[3]+','+value[4]+','+req.decoded.logedinuser.id+'),';
                    });
                

                
                 ss = ss.substr(0, ss.length - 1);
               
                connection.acquire(function (err, con) {
                    con.query(sql+ss,function(err,result)
                    {
                        if(err)
                            {
                                console.log(err)
                                res.send({
                                    status: 0,
                                    type: "error",
                                    title: "Oops!",
                                    message: "Something went worng, Please try again letter"
                                });
                                con.release();
                            }
                            else
                            {
                                res.send({
                                    status: 1,
                                    type: "success",
                                    title: "Done!",
                                    message: "Record imported successfully"
                                });
                                con.release();
                            }
                    });
                });
            } 
    },

    deleteVoterContactDetails: function(req, res)
    {
        if (req.decoded.success == true) {   
            connection.acquire(function(err, con){
                   
                con.query('DELETE FROM `voters` WHERE `id` = '+req.params.id, function(err,result){
                    if(err)
                    {
                        res.send({
                            status: 1,
                            type: "error",
                            title: "Oops!",
                            message: "Something went wrong, Please try again."
                        });
                    }
                    else
                    {
                        res.send({
                            status: 0,
                            type: "success",
                            title: "Done!",
                            message: "Record deleted successfully."
                        });
                    }
                });
                con.release();
            });
        }
    },

    saveVoterContact: function(req, res)
    {
        if (req.decoded.success == true) {   
            connection.acquire(function(err, con){
                //req.body.createddate= moment(req.body.createddate).format("YYYY-MM-DD HH:mm:ss");
                delete req.body.totalcontacts;
                if(req.body.dob)
                req.body.dob = moment(req.body.dob).format("YYYY-MM-DD HH:mm:ss");
                req.body.createddate = moment(req.body.createddate).format("YYYY-MM-DD HH:mm:ss");

                var keys = Object.keys(req.body);

                keys.map(function(value){
                    if(req.body[value] == '')
                    req.body[value] = null;
                });

                con.query('UPDATE voters SET ? WHERE id = ?',[req.body, req.body.id], function(err,result){
                    if(err)
                    {
                        console.log(err)
                        res.send({
                            status: 1,
                            type: "error",
                            title: "Oops!",
                            message: "Something went wrong, Please try again."
                        });
                    }
                    else
                    {
                        res.send({
                            status: 0,
                            type: "success",
                            title: "Done!",
                            message: "Contact details saved successfully"
                        });
                    }
                });
                con.release();
            });
        }
    },

    getVoterContactListPagination: function(req, res)
    {
        if (req.decoded.success == true) {   
            connection.acquire(function(err, con){
                if(req.body.skip == 1)
                {
                 var skiplimit = '50';
                }
                else
                {
                 var skiplimit = ((req.body.skip -1) * 50)+', 50';
                }

                if(req.body.filter)
                {
                     var searchFilter = ' WHERE '+req.body.filter.field+' LIKE "%'+req.body.filter.searchinput+'%"';
                }
                else
                {
                 var searchFilter = '';
                }


             con.query('SELECT * FROM voters '+searchFilter+' ORDER BY id DESC LIMIT '+skiplimit, function(err,result){
                    if(err)
                    {
                        console.log(err)
                        res.send({status:1, message:"Something went wrong"})
                    }
                    else
                    {
                        res.send({voterContactsList:result})
                    }
                });
                con.release();
            });
        }
    },


    CreateFamily: function(req, res)
    {
        if (req.decoded.success == true) {   
            connection.acquire(function(err, con){
                if(req.body[0].familyid)
                {
                    var ss = '';
                    req.body.map(function(value){
                        ss = ss+value.id+',';
                    });
                    ss = ss.substr(0, ss.length - 1);


                    con.query('UPDATE voters SET familyid = '+req.body[0].familyid+' WHERE id  IN ('+ss+')', function(err,updateresult){
                        if(err)
                        {
                            console.log(err)
                            res.send({
                                status: 1,
                                type: "error",
                                title: "Oops!",
                                message: "Something went wrong, Please try again."
                            });
                        }
                        else
                        {
                            res.send({
                                status: 0,
                                type: "success",
                                title: "Done!",
                                message: "Family saved successfully"
                            });
                        }
                    });

                }
                else
                {
                    con.query('INSERT INTO voters_family SET ?',{createdby:req.decoded.logedinuser.id}, function(err,result){
                            if(err)
                            {
                                console.log(err)
                                res.send({status:1, message:"Something went wrong"})
                            }
                            else
                            {
                                var ss = '';
                                req.body.map(function(value){
                                    ss = ss+value.id+',';
                                });
                                ss = ss.substr(0, ss.length - 1);

                                con.query('UPDATE voters SET familyid = '+result.insertId+' WHERE id  IN ('+ss+')', function(err,updateresult){
                                    if(err)
                                    {
                                        console.log(err)
                                        res.send({
                                            status: 1,
                                            type: "error",
                                            title: "Oops!",
                                            message: "Something went wrong, Please try again."
                                        });
                                    }
                                    else
                                    {
                                        res.send({
                                            status: 0,
                                            type: "success",
                                            title: "Done!",
                                            message: "Family saved successfully"
                                        });
                                    }
                                });

                            }
                        });
                 }

            con.release();
            });
        }
    },
    ShowFamilyDetails: function(req, res)
    {
        if (req.decoded.success == true) {   
            connection.acquire(function(err, con){
                   
                con.query('SELECT * FROM `voters` WHERE `familyid` = '+req.params.familyid, function(err,result){
                    if(err)
                    {
                        res.send({
                            status: 1,
                            type: "error",
                            title: "Oops!",
                            message: "Something went wrong, Please try again."
                        });
                    }
                    else
                    {
                        res.send({status: 0,familyDetails:result});
                    }
                });
                con.release();
            });
        }
    },
    SaveListDetails: function(req, res)
    {
        if (req.decoded.success == true) {   
            connection.acquire(function(err, con){
                   if(req.body.id)
                   {

                   }
                   else
                   {
                    con.query('INSERT INTO listnos (listno) VALUES (?)',[req.body.listno], function(err,result){
                        if(err)
                        {
                            console.log('-------------1',err)

                            res.send({
                                status: 1,
                                type: "error",
                                title: "Oops!",
                                message: "Something went wrong, Please try again."
                            });
                        }
                        else
                        {
                            var ss = '';
                            req.body.userAllocation.map(function(value){
                                ss = ss+'('+value.userid+','+result.insertId+'),'
                            });
                            ss = ss.substr(0, ss.length - 1);
                            con.query('INSERT INTO listallocation (userid, listid) VALUES '+ss, function(err,result){
                                if(err)
                                {
                                    console.log('-------------2',err)
                                    res.send({
                                        status: 1,
                                        type: "error",
                                        title: "Oops!",
                                        message: "Something went wrong, Please try again."
                                    });
                                }
                                else
                                {
                                    res.send({
                                        status: 0,
                                        type: "success",
                                        title: "Done!",
                                        message: "List Details saved successfully."
                                    });
                                }
                            });
                        }
                    });
                   }
                con.release();
            });
        }
    },
    
    getListRecord:function(req, res)
    {
        if (req.decoded.success == true) {   
            connection.acquire(function(err, con){
                con.query('SELECT * FROM listnos', function(err,result){
                    if(err)
                    {
                        res.send({
                            status: 1,
                            type: "error",
                            title: "Oops!",
                            message: "Something went wrong, Please try again."
                        });
                    }
                    else
                    {
                        res.send({
                            status: 0,
                            listNosList:result
                        });
                    }
                });
            });

        }
    },

};