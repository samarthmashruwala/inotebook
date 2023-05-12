const jwt = require("jsonwebtoken")

const JWT_SECRET = 'samis$ocool'

const fetchuser = (req, res, next) => {
    // get ther user from the jwt token and add id to req object
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "please authenticate using valid token" });
    }
    try {
        // varify the token using jwt function with jwtsecret key
        const data = jwt.verify(token, JWT_SECRET)
        // send the fetched data of user to request
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: "please authenticate using valid token" });
    }
}

module.exports = fetchuser;