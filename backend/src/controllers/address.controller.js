import {
    listAddressesService,
    createAddressService,
    updateAddressService,
    deleteAddressService
} from '../services/address.service.js';

const sendError = (res, error) => {
    return res.status(error.statusCode || 500).json({
        success: false,
        message: error.statusCode ? error.message : 'Internal server error'
    });
};

export const listAddresses = async (req, res) => {
    try {
        const addresses = await listAddressesService(req.user.user_id);

        return res.status(200).json({
            success: true,
            message: 'Addresses fetched successfully',
            data: addresses
        });
    } catch (error) {
        return sendError(res, error);
    }
};

export const createAddress = async (req, res) => {
    try {
        const address = await createAddressService(req.user.user_id, req.body);

        return res.status(201).json({
            success: true,
            message: 'Address added successfully',
            data: address
        });
    } catch (error) {
        return sendError(res, error);
    }
};

export const updateAddress = async (req, res) => {
    try {
        const address = await updateAddressService(req.user.user_id, req.params.id, req.body);

        return res.status(200).json({
            success: true,
            message: 'Address updated successfully',
            data: address
        });
    } catch (error) {
        return sendError(res, error);
    }
};

export const deleteAddress = async (req, res) => {
    try {
        const result = await deleteAddressService(req.user.user_id, req.params.id);

        return res.status(200).json({
            success: true,
            message: 'Address deleted successfully',
            data: result
        });
    } catch (error) {
        return sendError(res, error);
    }
};