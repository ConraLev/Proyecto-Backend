const validateProduct = (product) => {
    const errors = [];

    if (!product.title) {
        errors.push({ field: 'title', message: 'Title is required', type: 'string' });
    }

    if (!product.price) {
        errors.push({ field: 'price', message: 'Price is required', type: 'number' });
    } else if (typeof product.price !== 'number') {
        errors.push({ field: 'price', message: 'Price must be a number', type: 'number' });
    }

    return errors;
};

module.exports = {
    validateProduct,
};
