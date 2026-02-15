
const asyncHandler = (theFunction) => (req, res, next) => {
    Promise.resolve(theFunction(req, res, next)).catch((err) => next(err));
};

export default asyncHandler;