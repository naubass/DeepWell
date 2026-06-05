import jwt from 'jsonwebtoken';
import InvariantError from '../exceptions/invariantError.js';

const TokenManager = {
    generateAccessToken: (payload) => jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, { expiresIn: '3h' }),
    generateRefreshToken: (payload) => jwt.sign(payload, process.env.REFRESH_TOKEN_KEY, { expiresIn: '7d' }),
    verifyAccessToken: (accessToken) => {
        try {
            const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY);
            return payload;
        } catch (error) {
            throw new InvariantError(error.message);            
        }
    },
    verify: (accessToken, secretKey) => {
        try {
            const payload = jwt.verify(accessToken, secretKey);
            return payload;
        } catch (error) {
            throw new InvariantError("Invalid token");   
        }
    }, 
    verifyRefreshToken: (refreshToken) => {
        try {
            const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
            return payload;
        } catch (error) {
            throw new InvariantError(error.message);            
        }
    },
}

export default TokenManager;