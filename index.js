const { google } = require('googleapis');
const { OAuth2 } = google.auth;

const oAuth2Client = new OAuth2(
  '395289575361-v8ja9p646kag36dk0amau4cgdi71ohg7.apps.googleusercontent.com', 
  'U4dRpUcHhyG3oWeJMtvNtGHw'
);

oAuth2Client.setCredentials({
  refresh_token:'1//04Qut_ZFQ-brzCgYIARAAGAQSNwF-L9Iru6ZN63ioFrXl-o0EyAUQ8rGnoPRB0zAaCZ0fWG3UmOgzVgIWY6WKoH9KC02AWQ8_UPg'
});

const calendar = google.calendar({
  version: 'v3',
  auth: oAuth2Client
});

