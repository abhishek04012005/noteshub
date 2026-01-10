const { google } = require('googleapis');
const readline = require('readline');

const CLIENT_ID = 'dummy';
const CLIENT_SECRET = 'dummy';
const REDIRECT_URI = 'http://localhost:3000/api/auth/google/callback';

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Generate auth URL
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/drive'],
});

console.log('\n=== Google Refresh Token Generator ===\n');
console.log('1. Open this URL in your browser:');
console.log(authUrl);
console.log('\n2. You will be redirected to localhost');
console.log('3. Copy the authorization code from the URL and paste it below\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter authorization code: ', async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log('\n✅ Success! Your refresh token is:\n');
    console.log('GOOGLE_REFRESH_TOKEN=' + tokens.refresh_token);
    console.log('\nAdd this to your .env.local file\n');
    rl.close();
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    rl.close();
    process.exit(1);
  }
});
