import React, { PureComponent } from "react";
import { connect as reduxConnect } from "react-redux";
import { Grid, Row, Col, Image, Tab, Tabs, PageHeader } from "react-bootstrap";
import "./styles.css";
import contestImage from "../../../images/contest.png";

const mapStateToProps = ({}) => ({});

const mapDispatchToProps = {};

class Contests extends PureComponent {
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
    return (
      <Grid className="Contests Container fadeIn-2">
        <Row>
          <PageHeader>CURRENT</PageHeader>
          <Col sm={12}>
            <Image src={contestImage} responsive />
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <PageHeader>PAST</PageHeader>
            <h4>
              Ended: November 2, 2017.
              <br />
              Winner(s): Rezum
            </h4>
            <PageHeader>Skarface Contest</PageHeader>
            <h4>
              Ended: Jan 31st 2017.
              <br />
              Winner(s): Moxxie
            </h4>
            <PageHeader>Joke Contest</PageHeader>
            <h4>
              Ended: Nov 9th 2016.
              <br />
              Winner(s): Syntro
            </h4>
            <PageHeader>Meme Contest</PageHeader>
            <h4>
              Ended: Sept 29th 2016. <br />
              Winner(s): Lyrina
            </h4>
            <PageHeader>Short Story Contest</PageHeader>
            <h4>
              Ended: Aug 18th 2016. <br />
              Winner(s): DarkSoulOmega &amp; Teila
            </h4>
          </Col>
        </Row>
      </Grid>
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Contests);
