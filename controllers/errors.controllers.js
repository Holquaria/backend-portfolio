exports.handleInvalidPath = (req, res, next) => {
    res.status(404).send({ message: 'path not found' })
}

exports.handleAbsentId = (err, req, res, next) => {
    if (err.message === 'article id not found') {
        res.status(404).send({ message: 'article id not found' })
    } else next(err)
}

exports.handleInvalidId = (err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({ message: 'invalid id data type' })
    }
}

exports.handle500Error = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({ message: "Internal Server Error" });
}