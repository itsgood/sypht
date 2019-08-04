import React, { Component } from 'react';
import { Accordion, Card, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import ReactJson from 'react-json-view';
import Upload from './components/Upload';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            results: [],
        };

        this.onUploadFailed = this.onUploadFailed.bind(this);
        this.onUploadCompleted = this.onUploadCompleted.bind(this);
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
                        <Accordion>
                            {this.state.results.map((result, idx) => {
                                return (
                                    <Card>
                                        <Card.Header>
                                            <Accordion.Toggle as={Button} variant="link" eventKey={idx} onClick={this.onAccordionToggleClicked}>
                                                {result.file.name}
                                            </Accordion.Toggle>
                                        </Card.Header>
                                        <Accordion.Collapse eventKey={idx}>
                                            <Card.Body>
                                                {
                                                    result.status == 'ERROR' ? result.message : (<ReactJson src={result.results} />)
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
        console.log(results);
        this.setState(prevState => ({
            error: null,
            results: prevState.results.concat(results)
        }));
    }

    onUploadFailed(err) {
        console.log('onUploadFailed');
        console.log(typeof(err));
        console.log(err);
        console.log(JSON.stringify(err));
        this.setState({
            error: JSON.stringify(err),
            results: []
        });
    }
}

export default App;
