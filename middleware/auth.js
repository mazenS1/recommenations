const jwt = require('jsonwebtoken');

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}

const authenticateToken = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        

        if (!token) {
            throw new Error('Authentication required');
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            req.user = decoded;
            next();
        } catch (error) {
            throw new Error('Invalid token');
        }
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
};

module.exports = { authenticateToken };

