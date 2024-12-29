const AuthService = require('../services/auth.service');

exports.googleSignIn = async (req, res) => {
  try {
    const { token } = req.body;
    
    // Verify Google token
    const googleData = await AuthService.verifyGoogleToken(token);
    
    // Find or create user
    const user = await AuthService.findOrCreateUser(googleData);
    
    // Set session
    req.session.userId = user._id;
    
    res.json({ 
      message: 'Successfully authenticated',
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

exports.logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Could not log out' });
    }
    res.json({ message: 'Successfully logged out' });
  });
};