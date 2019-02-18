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
	let eng = 'en-US';
	let contentfulID = body.sys.id;
	let title = body.fields.title[eng];
	let description = body.fields.description[eng];
	let type = body.fields.type[eng];

	let dict = {
		name: title,
		text: description,
		type: type
	}

	return admin.database()
		.ref('/items/' + contentfulID)
		.set(dict)
		.then(snapshot => {
			response.status(200).send('OK')
		})
		.catch(error => {
			response.status(400).send('Error in adding item to Firebase database.')
		});
});

exports.removeCard = functions.https.onRequest((request, response) => {
	if (request.method !== 'POST') {
		response.status(400).send('Only POST requests are supported.');
		return;
	}

	if (request.get('content-type') !== 'application/json') {
		response.status(400).send('Only application/json content types are supported.');
		return;
	}

	let body = request.body;
	let contentfulID = body.sys.id;

	return admin.database()
		.ref('items/' + contentfulID)
		.remove()
		.then(snapshot => {
			response.status(200).send('OK')
		})
		.catch(error => {
			response.status(400).send(error.code)
		});
});