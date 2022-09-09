exports.successResponse = async (res, { message, data = null }) => {
    let object = { status: true, message };
    if (data) {
        object.data = data;
    }
    return res.json(object);
};

exports.errorResponse = (res, msg) =>
    res.status(200).json({
        status: false,
        message: msg,
        error: msg,
});
