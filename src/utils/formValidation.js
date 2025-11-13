/**
 * Form validation utilities
 */

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validateName = (name) => {
    return name.trim().length >= 2;
};

export const validateMessage = (message) => {
    return message.trim().length >= 10;
};

export const validateForm = (formData) => {
    const errors = {};

    if (!validateName(formData.name)) {
        errors.name = 'Name must be at least 2 characters long';
    }

    if (!validateEmail(formData.email)) {
        errors.email = 'Please enter a valid email address';
    }

    if (!validateMessage(formData.message)) {
        errors.message = 'Message must be at least 10 characters long';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

