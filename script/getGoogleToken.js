const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from the root .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });
console.log(process.env.GOOGLE_CLIENT_ID);

const app = express();
const PORT = 3001;

// Validate Google Client ID and Client Secret
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!CLIENT_ID) {
  console.error('Error: GOOGLE_CLIENT_ID is not set in .env file');
  process.exit(1);
}

if (!CLIENT_SECRET) {
  console.error('Error: GOOGLE_CLIENT_SECRET is not set in .env file');
  process.exit(1);
}

const REDIRECT_URI = `http://localhost:${PORT}/oauth2callback`;

const oAuth2Client = new OAuth2Client({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET, // Add the client secret here
  redirectUri: REDIRECT_URI,
});

app.get('/oauth2callback', async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      throw new Error('No authorization code received');
    }

    // Exchange the authorization code for tokens
    const { tokens } = await oAuth2Client.getToken(code);
    console.log('\nYour ID token (use this for testing):', tokens.id_token);
    res.send('Token received! You can close this window.');
    setTimeout(() => process.exit(0), 1000);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send(`Error getting token: ${error.message}`);
  }
});

app.listen(PORT, () => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
  });

  console.log('\n3. open this URL in your browser:');
  console.log(authUrl);
});
