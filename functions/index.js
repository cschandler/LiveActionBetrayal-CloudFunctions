// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');

admin.initializeApp();

exports.addCard = functions.https.onRequest((request, response) => {
	if (request.method !== 'POST') {
		response.status(400).send('Only POST requests are supported.');
		return;
	}

	if (request.get('content-type') !== 'application/json') {
		response.status(400).send('Only application/json content types are supported.');
		return;
	}

	let body = request.body;

	console.log(body);

	let title = body.fields.title;

	return admin.database().ref('/items').push({name: title}).then((snapshot) => {
		return response.redirect(200, snapshot.ref.toString());
	});
});
