exports.handleInvalidPath = (req, res, next) => {
    res.status(404).send({ message: 'path not found' })
}

exports.handleAbsentId = (err, req, res, next) => {
    if (err.message) {
        res.status(err.status).send({ message: err.message })
    } else next(err)
}

exports.handleInvalidId = (err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({ message: 'invalid id data type' })
    } else next(err)
}

exports.handle500Error = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({ message: "Internal Server Error" });
}