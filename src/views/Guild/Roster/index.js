import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect as reduxConnect } from "react-redux";
import { Grid, Row, Col, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./styles.css";
import EventList from "../../../components/EventList";
import { getUsers } from "../../../actions/Admin";
import { roleClassIcon, guildRoster } from "../../../helpers";

const mapStateToProps = ({ Admin, DiscordData }) => ({
  Admin,
  DiscordData
});

const mapDispatchToProps = {
  getUsers
};

class Roster extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static propTypes = {
    discordData: PropTypes.object,
    guildMembers: PropTypes.array
  };

  static defaultProps = {
    discordData: {}
  };

  componentWillMount() {
    this.getState(this.props);
  }

  componentDidMount() {
    this.props.getUsers();
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { Admin, DiscordData } = props;
    const GuildRoster = guildRoster(Admin.Users);
    const guildMembers = DiscordData.members;
    this.setState({
      Admin,
      DiscordData,
      GuildRoster,
      guildMembers
    });
  };

  renderGuildMembers = GuildRoster =>
    GuildRoster.map(e => {
      const { color, title, members } = e;
      return (
        <Row>
          <h3>{title}</h3>
          {this.renderMembers(color, members)}
        </Row>
      );
    });

  renderMembers = (color, members) =>
    members.map(k => {
      return (
        <Col md={3} xs={4}>
          <Link to={`/profile/${k.id}`} className="userContainer">
            <Image
              src={roleClassIcon(k.primary_class)}
              style={{ height: "25px" }}
            />{" "}
            <p style={{ color: color }}>{k.username}</p>
          </Link>
        </Col>
      );
    });

  render() {
    const { Admin, DiscordData, GuildRoster, guildMembers } = this.state;

    return (
      <div className="Roster">
        <Grid>{this.renderGuildMembers(GuildRoster)}</Grid>
      </div>
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Roster);
