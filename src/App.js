import React, { Component } from 'react';
import { Accordion, Card, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import ReactJson from 'react-json-view';
import async from 'async';
import request from 'request';
import Upload from './components/Upload';
import './App.css'
import NavbarCollapse from 'react-bootstrap/NavbarCollapse';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            results: [],
        };

        this.onUploadFailed = this.onUploadFailed.bind(this);
        this.onUploadCompleted = this.onUploadCompleted.bind(this);
        this.onClickButtonClear = this.onClickButtonClear.bind(this);
        this.getResults = this.getResults.bind(this);
    }

    render() {
        return (
            <Container>
                <Row><Col>&nbsp;</Col></Row>
                <Row>
                    <Col>
                        <Upload
                            onUploadFailed={this.onUploadFailed}
                            onUploadCompleted={this.onUploadCompleted}
                        />
                    </Col>
                </Row>
                <Row><Col>&nbsp;</Col></Row>
                <Row>
                    <Col>
                        {
                            this.state.error && (
                                <Alert variant='danger'>
                                    {this.state.error}
                                </Alert>
                            )
                        }
                        {
                            this.state.results.length > 0 && (
                                <Alert variant='success'>
                                    {this.state.results.length} files are uploaded. <Button variant="outline-dark" className="float-right" size="sm" onClick={this.onClickButtonClear}>Clear</Button>
                                </Alert>
                            )
                        }
                        <Accordion>
                            {this.state.results.map((result, idx) => {
                                return (
                                    <Card>
                                        <Card.Header>
                                            <Accordion.Toggle as={Button} variant="link" eventKey={idx} onClick={this.onAccordionToggleClicked}>
                                                {result.file.name}
                                            </Accordion.Toggle>
                                            {result.uploading_status && (<span>&nbsp;&rarr;&nbsp;{result.uploading_status}</span>)}
                                            {result.loading_status && (<span>&nbsp;&rarr;&nbsp;{result.loading_status}</span>)}
                                        </Card.Header>
                                        <Accordion.Collapse eventKey={idx}>
                                            <Card.Body>
                                                {
                                                    result.status == 'ERROR' ? result.message : (<ReactJson src={result.results} collapsed="1" />)
                                                }
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                );
                            })}
                        </Accordion>
                    </Col>
                </Row>
                <Row><Col>&nbsp;</Col></Row>
            </Container>
        )
    }

    onUploadCompleted(results) {
        async.waterfall(
            [
                (next) => {
                    for (let i=0; i < results.length; i++) {
                        if (results[i]['status'] == 'RECEIVED') {
                            results[i]['uploading_status'] = 'file uploaded';
                            results[i]['loading_status'] = 'result loading...';
                        } else {
                            results[i]['uploading_status'] = 'uploading failed';
                        }
                        console.log(results[i]);
                    }
                    next(null);
                },
                (next) => {
                    this.setState({
                        error: null,
                        results: results
                    });
                    next(null);
                },
                async.apply(this.getResults, results),
            ],
            (err, result) => {
                if (err) {
                    this.onUploadFailed(err);
                } else {
                    this.setState({
                        error: null,
                        results: results
                    });
                }
            }
        );
        
    }

    onUploadFailed(err) {
        this.setState({
            error: JSON.stringify(err),
            results: []
        });
    }

    onClickButtonClear() {
        this.setState({
            results:[]
        });
    }

    getResults(files, cb) {
        async.each(
            files,
            (file, done) => {
                if (file.fileId) {
                    let options = {
                        url: `http://localhost:8000/result/${file.fileId}`,
                        json: true
                    };
            
                    request.get(options, (error, response, body) => {
                        if (error) {
                            done(error);
                        } else {
                            console.log(body);
                            file['results'] = body.results;
                            file['loading_status'] = 'result loaded';
                            done(null);
                        }
                    });
                } else {
                    done(null);
                }
            },
            cb
        );
    }
}

export default App;
