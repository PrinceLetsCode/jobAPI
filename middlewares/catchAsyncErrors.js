// This is a higher-order function that takes another function 'func' as an argument.
module.exports = func => (
    // This is a middleware function that takes 'req', 'res', and 'next' as parameters.
    req, res, next) => (
        // Wrap 'func(req, res, next)' in a Promise.resolve() to ensure it returns a Promise.
        Promise.resolve(func(req, res, next))
        // If the Promise resolves (no errors), it continues to the next middleware/route handler.
        .catch(next) // If the Promise rejects (an error occurs), it passes the error to the 'next' middleware.
    );
