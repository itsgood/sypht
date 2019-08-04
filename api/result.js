const async = require('async');
const Sypht = require('../lib/sypht.js');

module.exports = function upload(req, res) {
    let fileId = req.params.fileId;
    let sypht = new Sypht;
    async.waterfall(
        [
            sypht.authenticate,
            async.apply(sypht.getResultFinal, fileId),
            //sypht.getResultFinal
        ],
        (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
            res.end();
        }
    );
}