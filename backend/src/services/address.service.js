import {
    listAddresses,
    createAddress,
    updateAddress,
    deleteAddress
} from '../models/address.model.js';

const toAddressError = (err) => {
    if (!err.sqlMessage?.includes('ADDRESS_NOT_FOUND')) {
        return err;
    }

    const error = new Error('Address not found');
    error.statusCode = 404;
    return error;
};

export const listAddressesService = async (userId) => {
    return listAddresses(userId);
};

export const createAddressService = async (userId, input) => {
    return createAddress({
        userId,
        label: input.label,
        fullName: input.full_name,
        phone: input.phone,
        line1: input.line1,
        line2: input.line2,
        city: input.city,
        state: input.state,
        postalCode: input.postal_code,
        countryCode: input.country_code,
        makeDefault: input.make_default
    });
};

export const updateAddressService = async (userId, addressId, input) => {
    try {
        return await updateAddress({
            userId,
            addressId,
            label: input.label,
            labelProvided: input.label_provided,
            fullName: input.full_name,
            phone: input.phone,
            line1: input.line1,
            line2: input.line2,
            line2Provided: input.line2_provided,
            city: input.city,
            state: input.state,
            postalCode: input.postal_code,
            countryCode: input.country_code,
            makeDefault: input.make_default
        });
    } catch (err) {
        throw toAddressError(err);
    }
};

export const deleteAddressService = async (userId, addressId) => {
    try {
        const result = await deleteAddress(userId, addressId);

        return { new_default_address_id: result.new_default_address_id };
    } catch (err) {
        throw toAddressError(err);
    }
};