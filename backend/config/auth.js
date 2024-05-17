const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];
    console.log(authorizationHeader);

    if (!authorizationHeader) {
        return res.status(401).json({ message: 'Authorization header is missing!' });
    }
    const token = authorizationHeader

    if (!token) {
        return res.status(401).json({ message: 'Token is missing!' });
    }

    jwt.verify(token, 'crud', (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired!' });
            }
            return res.status(401).json({ message: 'Invalid token!' });
        }

        //object should contain the payload
        req.user = decoded;
        next();
    });
};

module.exports = { verifyToken };