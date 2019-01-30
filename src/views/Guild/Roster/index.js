import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect as reduxConnect } from "react-redux";
import { Grid, Row, Col, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./styles.css";
import EventList from "../../../components/EventList";
import { getUsers } from "../../../actions/Admin";
import { classIcon } from "../../../helpers";

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

    this.state = {
      discordData: {},
      guildMembers: []
    };
  }

  static propTypes = {
    discordData: PropTypes.object,
    guildMembers: PropTypes.array
  };

  static defaultProps = {
    Leaders: ["Yarnila"],
    Advisors: ["Shaiana"],
    Council: ["Leksur", "Kodiack"],
    Officers: ["Scribble", "Nomad", "Jorconn", "Joshue"],
    Members: [
      "Youmu Svartie",
      "Zathris",
      "Rezum",
      "Glenndyn",
      "Nailuj",
      "DarkSoulOmega",
      "SelarnDiloxz",
      "Ancalime",
      "RoyalLeoWolf",
      "Alic",
      "Diemond",
      "Brainbean",
      "Genocidal",
      "Dhul Qarnayn",
      "coach",
      "Syntro",
      "Mortanos",
      "Eanaden",
      "Zolzimar",
      "Backin",
      "Stormbow",
      "Derek",
      "Rousie",
      "Damarack",
      "Iaediil",
      "Badger",
      "Rumor Hasit",
      "Mentor",
      "Rurian",
      "Jie",
      "Malidos",
      "Pyratt",
      "Sitoryp",
      "Dots",
      "Kyrais",
      "Banin",
      "Sydor",
      "Adira",
      "Broonsbane",
      "Osiris Benderly",
      "Bailrock",
      "Karnix",
      "Sheidar",
      "Halifax",
      "Raziel",
      "Kadrio",
      "CreepySneed",
      "Sinisster",
      "draeznor",
      "MonsterKoala",
      "Siggard",
      "Krank",
      "Kazgoroth",
      "Lyonheart",
      "Rhovan"
    ]
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
    const { Admin } = props;
    const guildMembers = this.props.DiscordData.members;
    this.setState({ Admin, guildMembers });
  };

  renderPeople = (color, routeItems) =>
    routeItems.map(k => {
      return (
        <Col md={3} xs={4}>
          <Link to={`/profile/${k.id}`} className="userContainer">
            <Image
              src={classIcon(k.primary_class)}
              style={{ height: "25px" }}
            />{" "}
            <p style={{ color: color }}>{k.username}</p>
          </Link>
        </Col>
      );
    });

  render() {
    const { Admin, guildMembers } = this.state;
    const Leaders = Admin.Users
      ? Admin.Users.filter(user => user.is_leader)
      : this.props.Leaders;
    const Advisors = Admin.Users
      ? Admin.Users.filter(user => user.is_advisor)
      : this.props.Advisors;
    const Council = Admin.Users
      ? Admin.Users.filter(user => user.is_council)
      : this.props.Council;
    const GeneralOfficers = Admin.Users
      ? Admin.Users.filter(user => user.is_general_officer)
      : [];
    const Officers = Admin.Users
      ? Admin.Users.filter(user => user.is_officer)
      : this.props.Officers;
    const SeniorMembers = Admin.Users
      ? Admin.Users.filter(user => user.is_senior_member)
      : [];
    const JuniorMembers = Admin.Users
      ? Admin.Users.filter(user => user.is_junior_member)
      : this.props.Members;
    const Recruits = Admin.Users
      ? Admin.Users.filter(user => user.is_recruit)
      : [];
    return (
      <div className="Roster">
        <Grid>
          <Row>
            <h3>Leader(s)</h3>
            {this.renderPeople("#ba0bfb", Leaders)}
          </Row>
          <Row>
            <h3>Advisors</h3>
            {this.renderPeople("var(--primaryColor)", Advisors)}
          </Row>
          <Row>
            <h3>Council</h3>
            {this.renderPeople("#ff9800", Council)}
          </Row>
          <Row>
            <h3>General Officers</h3>
            {this.renderPeople("#f00", GeneralOfficers)}
          </Row>
          <Row>
            <h3>Officers</h3>
            {this.renderPeople("#f00", Officers)}
          </Row>
          <Row>
            <h3>Senior Members</h3>
            {this.renderPeople("#0f0", SeniorMembers)}
          </Row>
          <Row>
            <h3>Junior Members</h3>
            {this.renderPeople("#0f0", JuniorMembers)}
          </Row>
          <Row>
            <h3>Recruits</h3>
            {this.renderPeople("#0f0", Recruits)}
          </Row>
        </Grid>
      </div>
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Roster);
