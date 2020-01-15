const security = require('./config/auth');
const multer = require('multer');
var path = require('path');
const dir = './app/uploads';

var user = require('./controller/user.Ctrl');
var entity = require('./controller/entity.Ctrl');

let storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, dir);
	},
	filename: (req, file, cb) => {
		cb(null, file.fieldname + '-' + Date.now() + '.' + path.extname(file.originalname));
	}
});

let upload = multer({
	storage: storage
});



module.exports = {

	configure: function (app) {
		
		app.post('/api/authUser', function (req, res) {
			user.AuthenticateUser(req, res);
		});

		app.post('/api/SetNewPassword', function (req, res) {
			security(req, res);user.SetNewPassword(req, res);
		});

		app.post('/api/ForgotPassword', function (req, res) {
			user.ForgotPassword(req, res);
		});

		app.get('/api/SignOut', function (req, res) {
			security(req, res);user.SignOut(req, res);
		});

		app.get('/api/verifyOTP/:otp', function (req, res) {
			user.verifyOTP(req, res);
		});

		app.get('/api/getSession', function (req, res) {
			security(req, res);
			user.getSession(req, res);
		});


		app.get('/api/getUserList', function (req, res) {
			security(req, res);
			user.getUserList(req, res);
		});

		app.get('/api/deleteUserDetails/:id', function (req, res) {
			security(req, res);
			user.deleteUserDetails(req, res);
		});

		app.post('/api/VerifyUserEmail', function (req, res) {
			security(req, res);
			user.VerifyUserEmail(req, res);
		});

		app.post('/api/VerifyUserMobile', function (req, res) {
			security(req, res);
			user.VerifyUserMobile(req, res);
		});

		app.post('/api/SaveUserDetails', function (req, res) {
			security(req, res);
			user.SaveUserDetails(req, res);
		});

		app.post('/api/getDashboardValues/', function (req, res) {
			security(req, res);
			entity.getDashboardValues(req, res);
		});

		app.get('/api/getContactList/', function (req, res) {
			security(req, res);
			entity.getContactList(req, res);
		});

		app.post('/api/getContactListPagination/', function (req, res) {
			security(req, res);
			entity.getContactListPagination(req, res);
		});
		
		app.get('/api/AddNewContact/', function (req, res) {
			security(req, res);
			entity.AddNewContact(req, res);
		});

		app.post('/api/saveContact/', function (req, res) {
			security(req, res);
			entity.saveContact(req, res);
		});

		app.post('/api/ImportContactDetails/', function (req, res) {
			security(req, res);
			entity.ImportContactDetails(req, res);
		});

		app.post('/api/ImportContactDetailsCustomeSetting/', function (req, res) {
			security(req, res);
			entity.ImportContactDetailsCustomeSetting(req, res);
		});

		app.get('/api/deleteContactDetails/:id', function (req, res) {
			security(req, res);
			entity.deleteContactDetails(req, res);
		});

		app.post('/api/FilterResult/', function (req, res) {
			security(req, res);
			entity.FilterResult(req, res);
		});

		// NEAREST CONTACTS

		app.get('/api/getVoterContactList/:sort', function (req, res) {
			security(req, res);
			entity.getVoterContactList(req, res);
		});

		app.get('/api/AddNewVoterContact/', function (req, res) {
			security(req, res);
			entity.AddNewVoterContact(req, res);
		});

		app.post('/api/saveVoterContact/', function (req, res) {
			security(req, res);
			entity.saveVoterContact(req, res);
		});

		app.post('/api/ImportVoterContactDetails/', function (req, res) {
			security(req, res);
			entity.ImportVoterContactDetails(req, res);
		});

		app.post('/api/ImportVoterContactDetailsCustomeSetting/', function (req, res) {
			security(req, res);
			entity.ImportVoterContactDetailsCustomeSetting(req, res);
		});

		app.get('/api/deleteVoterContactDetails/:id', function (req, res) {
			security(req, res);
			entity.deleteVoterContactDetails(req, res);
		});

		app.post('/api/FilterNearestResult/', function (req, res) {
			security(req, res);
			entity.FilterNearestResult(req, res);
		});
		
		app.post('/api/getVoterContactListPagination/', function (req, res) {
			security(req, res);
			entity.getVoterContactListPagination(req, res);
		});

		app.post('/api/CopyContacttoNearest/', function (req, res) {
			security(req, res);
			entity.CopyContacttoNearest(req, res);
		});

		app.post('/api/CreateFamily/', function (req, res) {
			security(req, res);
			entity.CreateFamily(req, res);
		});

		app.get('/api/ShowFamilyDetails/:familyid', function (req, res) {
			security(req, res);
			entity.ShowFamilyDetails(req, res);
		});

		app.get('/api/RemoveFromFamily/:memberid', function (req, res) {
			security(req, res);
			entity.RemoveFromFamily(req, res);
		});

		app.post('/api/SaveListDetails/', function (req, res) {
			security(req, res);
			entity.SaveListDetails(req, res);
		});

		app.get('/api/getListRecord/', function (req, res) {
			security(req, res);
			entity.getListRecord(req, res);
		});

		app.get('/api/getListRecordDetails/:listid', function (req, res) {
			security(req, res);
			entity.getListRecordDetails(req, res);
		});

		app.get('/api/getBirthdaysList/', function (req, res) {
			security(req, res);
			entity.getBirthdaysList(req, res);
		});
		
    }
};