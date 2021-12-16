import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { connect, ConnectedProps } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '@renderer/redux/store';
import { FaArrowUp } from "react-icons/fa";

interface IState {

}

const connector = connect(
    ({ example }: TRootState) => ({ ...example }),
    (dispatch) =>
        bindActionCreators({
            ...actions.example
        }, dispatch)
);

type TProps = ConnectedProps<typeof connector>;

class Main extends React.Component<TProps, IState> {
    constructor(props: Readonly<TProps>) {
        super(props);

        this.state = {

        };

        this.openSettings = this.openSettings.bind(this);
    }

    private openSettings() {
        window.electron.settings.open();
    }

    public render() {
        const { count, increment } = this.props;

        return (
            <Container fluid>
                <Row>
                    <Col md={12}>
                        <h1>Main Window</h1>
                        <Button onClick={increment}><FaArrowUp /> Click Me!</Button>
                        <p>{count}</p>
                        <Button onClick={this.openSettings}>Open Settings</Button>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default connector(Main);
