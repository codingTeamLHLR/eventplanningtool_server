const jwt = require("jsonwebtoken");

const createToken = (user) => {
    const { _id, email, username } = user;

    // Create an object that will be set as the token payload
    const payload = { _id, email, username };

    // Create and sign the token
    const authToken = jwt.sign(
    payload,
    process.env.TOKEN_SECRET,
    { algorithm: 'HS256', expiresIn: "6h" }
    );

    return authToken;
};

module.exports = createToken;