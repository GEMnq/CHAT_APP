// Not Found
const notFound = (req, res, next) => {
    const error = new Error('Not Found'); 
    res.status(404);
    next(error);
}

// Handle Error
const handleError = (err, req, res, next) => {
    // nếu k có lỗi ủa client thì là lỗi của server
    const statusCode = res.statusCode == 200 ? 500 : res.statusCode;
    console.log('>>>>>>>Handle Error', err.message)
    res.status(statusCode).json({
        EM: err?.message,
        EC: statusCode,
    })
}

module.exports = {
    notFound,
    handleError,
}
