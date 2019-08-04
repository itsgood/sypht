import React, { Component } from 'react';
import async from 'async';
import Dropzone from './Dropzone';


class Upload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uploading: false,
        };

        this.onFilesAdded = this.onFilesAdded.bind(this);
        this.uploadFiles = this.uploadFiles.bind(this);
        this.sendRequest = this.sendRequest.bind(this);
    }

    render() {
        return (
            <div>
                <Dropzone
                    onFilesAdded={this.onFilesAdded}
                    disabled={this.state.uploading}
                />
            </div>
        );
    }

    onFilesAdded(files) {

        this.uploadFiles(files, (err, results) => {
            if (err) {
                this.props.onUploadFailed(err);
            } else {
                this.props.onUploadCompleted(results);
            }
        });

    }

    uploadFiles(files, cb) {
        this.setState({ uploading: true });

        async.waterfall([
            (next) => {
                async.concat(
                    files,
                    this.sendRequest,
                    next
                );
            }],
            (err, results) => {
                console.log(results);
                this.setState({ uploading: false });
                if (err) {
                    cb(err, null);
                } else {
                    cb(null, results);
                }
            }
        );
    }

    sendRequest(file, cb) {
        const req = new XMLHttpRequest();

        req.upload.addEventListener("error", event => {
            console.log('upload error');
            cb('upload error', null);
        });

        req.addEventListener("loadend", (evt) => {
            let response = JSON.parse(req.response);
            response['file'] = file;

            cb(null, response);
        });

        const formData = new FormData();
        formData.append("file", file, file.name);

        req.open("POST", "http://localhost:8000/upload");
        req.send(formData);
    }
}

export default Upload;