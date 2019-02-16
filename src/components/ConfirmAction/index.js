import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Row, Col, Button, ButtonGroup, Modal } from "react-bootstrap";
import "./styles.css";

class ConfirmAction extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { show: false };
  }

  static propTypes = {};

  static defaultProps = { show: false };

  componentWillMount() {
    this.getState(this.props);
  }

  componentDidMount() {
    this.setState({ show: false });
  }

  componentWillReceiveProps(nextProps) {
    const { CloseOnReceiveProps } = nextProps;
    if (CloseOnReceiveProps) this.setState({ show: false });
    this.getState(nextProps);
  }

  getState = props => {
    const { Disabled, Icon, hasPermission, Size, Class, Title } = props;
    this.setState({
      Disabled,
      Icon,
      hasPermission,
      Size,
      Class,
      Title
    });
  };

  componentWillUnmount() {
    this.setState({ show: false });
  }

  handleHide = e => {
    if (e) e.stopPropagation();
    this.setState({ show: false });
  };

  handleClickCapture = e => {
    if (e.target.type === "button") {
      return this.handleHide;
    } else {
      return e.stopPropagation();
    }
  };

  handleDelete = e => {
    e.stopPropagation();
    const { Action } = this.props;
    return Action();
  };

  actionText = Icon => {
    if (!Icon) return "delete";
    else {
      const { className } = Icon.props;
      if (className.includes("minus")) return "remove";
      if (className.includes("trash")) return "delete";
    }
    return "delete";
  };

  render() {
    const {
      show,
      Disabled,
      Icon,
      hasPermission,
      Size,
      Class,
      Title
    } = this.state;
    const actionText = this.actionText(Icon);
    return hasPermission
      ? [
          <Button
            disabled={Disabled}
            onClick={e => {
              e.stopPropagation();
              this.setState({ show: true });
            }}
            bsSize={Size}
            className={Class}
          >
            {Icon}
          </Button>,
          show ? (
            <Modal
              bsSize="small"
              onClickCapture={this.handleClickCapture}
              backdrop="static"
              //keyboard={false}
              show={show}
              onHide={this.handleHide}
              dialogClassName="confirmModal"
            >
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-lg">DELETE</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Row>
                  <Col xs={12}>
                    <h4 className="Center">
                      {`Are you sure you want to ${actionText} "${Title}"?`}
                    </h4>
                  </Col>
                </Row>
              </Modal.Body>
              <Modal.Footer>
                <Row>
                  <Col md={12} className="Center">
                    <ButtonGroup>
                      <Button
                        onClick={this.handleDelete}
                        className="ConfirmActionButton"
                      >
                        Yes
                      </Button>
                      <Button onClick={this.handleHide}>No</Button>
                    </ButtonGroup>
                  </Col>
                </Row>
              </Modal.Footer>
            </Modal>
          ) : null
        ]
      : null;
  }
}
export default ConfirmAction;
