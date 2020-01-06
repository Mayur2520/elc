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
                   
                con.query('SELECT * FROM contacts', function(err,result){
                    if(err)
                    {
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
                var ss = '';

                   
                var sql = 'INSERT INTO `contacts`(`name`, `gender`, `email`, `mobile1`, `mobile2`, `createdby`) VALUES ';
                var ss = '';
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


    ImportContactDetailsCustomeSetting: function(req, res)
    {

console.log(JSON.stringify(req.body.setting));


[{"field":"name","title":"Name","excelField":{"field":"1","title":"B"}},{"field":"gender","title":"Gender","excelField":{"field":"0","title":"A"}},{"field":"mobile1","title":"Mobile No.","excelField":{"field":"3","title":"D"}},{"field":"mobile2","title":"Alt. Mobile No.","excelField":{"field":"2","title":"C"}},{"field":"email","title":"Email","excelField":{"field":"4","title":"E"}}]


            var excelfield = [];

         if (req.decoded.success == true) {   
                var ss = '';
                var field = '(';
                req.body.setting.map(function(value){
                    field= field+value.field+', ';
                    excelfield.push(value.excelField.field);
                })
                field = field+' `createdby`)';

                var sql = 'INSERT INTO `contacts` '+field+' VALUES ';
                var ss = '';


                excelfield.map(function(fields){
                    req.body.map(function(value){
                        if(value[0] != undefined){value[0]}else{value[0] = ""}
                        if(value[1] != undefined){value[1]}else{value[1] = ""}
                        if(value[2] != undefined){value[2]}else{value[2] = ""}
                        if(value[3] != undefined){value[3]}else{value[3] = ""}
                        if(value[4] != undefined){value[4]}else{value[4] = ""}
            
                        ss= ss+ '("'+value[0]+'","'+value[1]+'", "'+value[2]+'",'+value[3]+','+value[4]+','+req.decoded.logedinuser.id+'),';
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
                   
                con.query('UPDATE contacts SET ? WHERE id = ?',[req.body, req.body.id], function(err,result){
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
                            message: "Contact details saved successfully"
                        });
                    }
                });
                con.release();
            });
        }
    },

};