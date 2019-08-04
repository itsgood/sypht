const IncomingForm = require('formidable').IncomingForm;
const async = require('async');
const Sypht = require('../lib/sypht.js');

module.exports = function upload(req, res) {
    let form = new IncomingForm();
    let sypht = new Sypht;
    let uploadedFile = null;

    form.on('file', (field, file) => {
        console.log(file);
        uploadedFile = file;
    });

    form.on('end', () => {
        async.waterfall(
            [
                sypht.authenticate,
                async.apply(sypht.upload, uploadedFile),
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
    })

    form.parse(req);
}