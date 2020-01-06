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
		
    }
};