import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

interface IProps {

}

interface IState {

}

export default class Settings extends React.Component<IProps, IState> {
    constructor(props: Readonly<IProps>) {
        super(props);

        this.state = {};
    }

    public render() {
        return (
            <Container fluid>
                <Row className='min-vh-100'>
                    <Col md={12}>
                        <h1>Settings Window</h1>
                    </Col>
                </Row>
            </Container>
        );
    }
}
