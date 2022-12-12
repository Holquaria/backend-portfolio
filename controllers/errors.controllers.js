exports.handleInvalidPath = (req, res, next) => {
    res.status(404).send({ message: 'path not found' })
}

exports.handle500Error = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({ message: "Internal Server Error" });
}