exports.handleInvalidPath = (req, res, next) => {
    res.status(404).send({ message: 'path not found' })
}



exports.handleAbsentId = (err, req, res, next) => {
    if (err.msg) {
        res.status(err.status).send({ message: err.msg })
    } else next(err)
}

exports.handleInvalidBody = (err, req, res, next) => {
    if (err.code === '23502') {
        res.status(400).send({ message: 'invalid input in request' })
    } else next(err)
}

exports.handleInvalidId = (err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({ message: 'invalid input data type' })
    } else next(err)
}

exports.handleAbsentUsername = (err, req, res, next) => {
    if (err.code === '23503') {
        res.status(404).send({ message: 'username does not exist' })
    } else next(err)
}

exports.handle500Error = (err, req, res, next) => {
    res.status(500).send({ message: "Internal Server Error" });
}