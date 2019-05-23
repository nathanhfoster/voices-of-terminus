import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Grid, Row, Col, PageHeader } from "react-bootstrap";
import { connect as reduxConnect } from "react-redux";
import "./styles.css";

const mapStateToProps = ({ User }) => ({ User });

const mapDispatchToProps = {};

class ReferenceDetails extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static propTypes = {};

  static defaultProps = {};

  componentWillMount() {
    this.getState(this.props);
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    this.setState({});
  };

  render() {
    const { User } = this.props;
    return (
      <Grid className="ReferenceDetails Container">
        <Row>
          <PageHeader className="pageHeader">REFERENCE DETAIL</PageHeader>
        </Row>
        <Row className="borderedRow">
          <Col xs={12}>Reference Detail</Col>
        </Row>
      </Grid>
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(
  ReferenceDetails
);
