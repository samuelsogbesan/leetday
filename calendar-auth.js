const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const {client_id, client_secret, refresh_token} = require('./calendar-config.json');

const oAuth2Client = new OAuth2(
  client_id, 
  client_secret
);

oAuth2Client.setCredentials({
  refresh_token: refresh_token
});

const calendar = google.calendar({
  version: 'v3',
  auth: oAuth2Client,
});

module.exports = calendar;
