export const validateRegisterInput = ({
    username,
    email,
    password
}) => {
    const errors = {};

    if (!username || username.trim().length < 3) {
        errors.username =
            'Username must be at least 3 characters long';
    }

    if (!email || !email.includes('@')) {
        errors.email = 'Valid email is required';
    }

    if (!password || password.length < 8) {
        errors.password =
            'Password must be at least 8 characters long';
    }

    return errors;
};