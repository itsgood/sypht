'use strict';

let request = require('request');
let fs = require('fs');

class Sypht {
    constructor(params) {
        this.token = null;

        this.authenticate = this.authenticate.bind(this);
        this.upload = this.upload.bind(this);
        this.getResultFinal = this.getResultFinal.bind(this);
    }

    authenticate(cb) {
        let options = {
            url: 'https://login.sypht.com/oauth/token',
            body: {
                client_id: "C8vBAsrKF5iQFctJ9hg90pjtT82i4Z0j",
                client_secret: "I_0rT1-38D0mxYWnzq9-ZpKzKvJJZMsIqbUlZTIGlCn-Iu82dO4XNGg1DcLI3v_2",
                audience: "https://api.sypht.com",
                grant_type: "client_credentials"
            },
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            json: true
        };

        request.post(options, (error, response, body) => {
            if (error) {
                cb(error);
            } else {
                this.token = body['access_token'];
                cb(null);
            }
        });
    }

    upload(file, cb) {
        let options = {
            url: 'https://api.sypht.com/fileupload',
            formData: {
                fileToUpload: fs.createReadStream(file.path),
                fieldSets: JSON.stringify(['sypht.invoice', 'sypht.document', 'sypht.generic'])
            },
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
            json: true
        };

        request.post(options, (error, response, body) => {
            if (error) {
                cb(error, null);
            } else {
                cb(null, body);
            }
        });
    }

    getResultFinal(uploadResponse, cb) {
        let options = {
            url: `https://api.sypht.com/result/final/${uploadResponse.fileId}`,
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
            json: true
        }
        request.get(options, (error, response, body) => {
            console.log(body)
            if (error) {
                cb(error, null);
            } else {
                cb(null, body);
            }
        })

    }
}

module.exports = Sypht;