const jwt = require('jsonwebtoken');

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}

const authenticateToken = async (req, res, next) => {
    try {
        console.log('cookie', req.cookies)
        const token = req.cookies.jwt;
        
        console.log('Cookies received:', req.cookies);
        console.log('JWT token:', token);

        if (!token) {
            console.log('No token found in cookies');  
            throw new Error('Authentication required');
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Decoded token:', decoded);
            
            req.user = decoded;
            next();
        } catch (error) {
            console.log('JWT verification failed:', error.message);
            throw new Error('Invalid token');
        }
    } catch (error) {
        console.error('Auth error:', error.message);
        return res.status(401).json({ message: error.message });
    }
};

module.exports = { authenticateToken };

