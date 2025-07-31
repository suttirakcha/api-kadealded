import { google } from "googleapis";
import jwt from "jsonwebtoken";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:5173/callback' // must match redirect_uri
);

async function findOrCreateUser(userData) {
  return {
    id: userData.id,
    email: userData.email,
    name: userData.name,
    picture: userData.picture,
  };
}


export const loginWithGoogle = async (req, res) => {
  const { code } = req.body;

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();

    // Extract user info
    const { email, name, picture, id } = userInfo.data;

    // Find or create user in DB
    const user = await findOrCreateUser({ email, name, picture, id });

    const appToken = jwt.sign({ id: user.id }, process.env.GOOGLE_CLIENT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token: appToken, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Google login failed' });
  }
};