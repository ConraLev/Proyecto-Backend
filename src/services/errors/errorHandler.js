class CustomError extends Error {
    constructor(code, message, details = []) {
        super(message);
        this.code = code;
        this.details = details;
    }
}

const errorDictionary = {
    PRODUCT_NOT_FOUND: { code: 404, message: 'Producto no encontrado' },
    CART_NOT_FOUND: { code: 404, message: 'Carro no encontrado' },
    INVALID_PRODUCT_DATA: { code: 400, message: 'Dato ingresado invalido' },
    MISSING_REQUIRED_FIELDS: { code: 400, message: 'No se completo todos los campos' },
    INVALID_CREDENTIALS: {code: 400, message: 'Credencial invalida'},
    INVALID_PASSWORD: {code: 400, message: 'Contraseña incorrecta'}
};

const createError = (type, details) => {
    const error = errorDictionary[type];
    if (error) {
        return new CustomError(error.code, error.message ,  details);
    }
    return new CustomError(500, 'Internal Server Error');
};

const errorHandler = (err, req, res, next) => {
    console.error(`Error: ${err.message}`);
    if (err.details && err.details.length > 0) {
        console.error('Validation details:');
        err.details.forEach(detail => {
            console.error(`- Field: ${detail.field}, Message: ${detail.message}, Expected Type: ${detail.type}`);
        });
    }
    res.status(err.code || 500).json({
        error: {
            message: err.message || 'Internal Server Error',
            code: err.code || 500,
            details: err.details || [],
        },
    });
};

CustomError,
module.exports = {
    createError,
    errorHandler,
};


