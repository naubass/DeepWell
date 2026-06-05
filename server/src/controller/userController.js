import response from '../utils/response.js';
import UserRepository from '../repository/userRepository.js';
import AuthRepository from '../repository/authRepository.js';
import TokenManager from '../security/tokenManager.js';
import { InvariantError } from '../exceptions/index.js';

export async function register(req, res, next) {
    try {
        const { name, email, password, role } = req.body;

        const result = await UserRepository.createUser({ name, email, password, role });

        return response(res, 201, 'User berhasil didaftarkan.', result);
    } catch (error) {
        return next(error);
    }
}

export async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        const userId = await UserRepository.getUserByEmailAndPassword(email, password);

        const accessToken  = TokenManager.generateAccessToken({ id: userId });
        const refreshToken = TokenManager.generateRefreshToken({ id: userId });

        await AuthRepository.generateRefreshToken(refreshToken);

        return response(res, 200, 'Login berhasil.', { accessToken, refreshToken });
    } catch (error) {
        return next(error);
    }
}

export const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.validated;

        const result = await AuthRepository.getRefreshToken(refreshToken);

        if (!result) {
            return next(new InvariantError('Refresh token tidak valid.'));
        }

        const { id } = TokenManager.verifyRefreshToken(refreshToken);
        const accessToken = TokenManager.generateAccessToken({ id });

        return response(res, 200, 'Access token berhasil diperbarui.', { accessToken });
    } catch (error) {
        return next(error);
    }
};

export const logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.validated;

        const result = await AuthRepository.deleteRefreshToken(refreshToken);

        if (!result) {
            return next(new InvariantError('Refresh token tidak valid.'));
        }

        return response(res, 200, 'Logout berhasil.');
    } catch (error) {
        return next(error);
    }
};

export async function getUserById(req, res, next) {
    try {
        const { id } = req.params;

        const result = await UserRepository.getUserById(id);

        return response(res, 200, 'User ditemukan.', result);
    } catch (error) {
        return next(error);
    }
}

export async function updateUserById(req, res, next) {
    try {
        const { id } = req.params;
        const payload = req.body;

        if (Object.keys(payload).length === 0) {
            return next(new InvariantError('Tidak ada data yang diperbarui.'));
        }

        const result = await UserRepository.updateUserById(id, payload);

        return response(res, 200, 'User berhasil diperbarui.', result);
    } catch (error) {
        return next(error);
    }
}