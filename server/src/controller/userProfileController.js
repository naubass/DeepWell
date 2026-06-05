import response from '../utils/response.js';
import UserProfileRepository from '../repository/userProfileRepository.js';
import UserRepository from '../repository/userRepository.js';
import { InvariantError } from '../exceptions/index.js';

export const createProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const {
            height, weight, age, gender, occupation,
            goal, activity_level, profile_image,
        } = req.body;

        const result = await UserProfileRepository.createProfile(userId, {
            height, weight, age, gender, occupation,
            goal, activity_level, profile_image,
        });

        return response(res, 201, 'Profile berhasil dibuat.', result);
    } catch (error) {
        return next(error);
    }
};

export const getProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const result = await UserProfileRepository.getProfileByUserId(userId);

        return response(res, 200, 'Profile berhasil diambil.', result);
    } catch (error) {
        return next(error);
    }
};

export const updateProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const payload = req.body;

        if (Object.keys(payload).length === 0) {
            return next(new InvariantError('Tidak ada data yang diperbarui.'));
        }

        const result = await UserProfileRepository.updateProfile(userId, payload);

        return response(res, 200, 'Profile berhasil diperbarui.', result);
    } catch (error) {
        return next(error);
    }
};

export const updateUserDetails = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { name, email, password } = req.body;
        const updateData = {};

        if (name)     updateData.name     = name;
        if (email)    updateData.email    = email;
        if (password) updateData.password = password;

        if (Object.keys(updateData).length === 0) {
            return next(new InvariantError('Tidak ada data yang diperbarui.'));
        }

        const result = await UserRepository.updateUserById(userId, updateData);

        return response(res, 200, 'Data user berhasil diperbarui.', result);
    } catch (error) {
        return next(error);
    }
};

export const deleteProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;

        await UserProfileRepository.deleteProfile(userId);

        return response(res, 200, 'Profile berhasil dihapus.');
    } catch (error) {
        return next(error);
    }
};