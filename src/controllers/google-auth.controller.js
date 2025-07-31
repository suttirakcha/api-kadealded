import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const loginWithGoogle = async (req, res, next) => {
  const { idToken } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    let user = await findOrCreateUser({
      id: sub,
      email,
      name,
      picture,
    });

    const token = jwt.sign({ id: user.id }, process.env.GOOGLE_CLIENT_SECRET, {
      expiresIn: "1h",
    });

    return res.json({ token, user });
  } catch (error) {
    next(error)
  }
};

async function findOrCreateUser(userData) {
  return {
    id: userData.id,
    email: userData.email,
    name: userData.name,
    picture: userData.picture,
  };
}
