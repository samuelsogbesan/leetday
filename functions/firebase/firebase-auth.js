const firebase = require('firebase/app').default;
require('firebase/database');

const firebaseConfig = require('../credentials/config.json');
firebase.initializeApp(firebaseConfig);

module.exports = { app: firebase.app(), database: firebase.database() };
