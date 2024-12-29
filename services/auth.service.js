const User = require('../models/user.model');
const googleClient = require('../config/google.config');

class AuthService {
  async verifyGoogleToken(token) {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    return ticket.getPayload();
  }

  async findOrCreateUser(googleData) {
    const { sub: googleId, email, name } = googleData;
    
    let user = await User.findOne({ googleId });
    
    if (!user) {
      user = await User.create({
        googleId,
        email,
        name
      });
    }
    
    return user;
  }
}

module.exports = new AuthService();