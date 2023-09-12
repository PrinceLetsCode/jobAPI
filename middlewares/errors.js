module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;

    console.log('middleware running');
    console.log('environment -> ', process.env.NODE_ENV);

    if (process.env.NODE_ENV === 'development') {
        
        console.log('development middleware entered');

        res.status(err.statusCode).json({
            success: false,
            error: err,
            errMessage: err.message,
            stack: err.stack
        });
    } else if (process.env.NODE_ENV === 'production') {

        console.log('production middleware entered');
        let error = { ...err };
        error.message = err.message;

        res.status(err.statusCode).json({
            success: false,
            message: error.message || 'Internal Server Error.'
        });
    }
};
