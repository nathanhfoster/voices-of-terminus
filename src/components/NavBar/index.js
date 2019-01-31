import React, { PureComponent } from "react";
import { connect as reduxConnect } from "react-redux";
import { withAlert } from "react-alert";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import "./styles.css";
import "./stylesM.css";
import {
  Navbar,
  Nav,
  NavItem,
  NavDropdown,
  Image,
  Button,
  Badge,
  MenuItem
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import vrLogo from "../../images/VR_Logo.png";
import votLogo from "../../images/VoT-Logo-White.png";
import votLogoHover from "../../images/VoT-Logo-Orange-Border-White.png";
import { Logout } from "../../actions/App";
import { classIcon } from "../../helpers";
import { isEquivalent } from "../../helpers";
import { toggleFooter, togglerPushMessages } from "../../actions/App";

const mapStateToProps = ({ User, Settings, Messages }) => ({
  User,
  Settings,
  Messages
});

const mapDispatchToProps = {
  Logout,
  toggleFooter,
  togglerPushMessages
};

class NavBar extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static propTypes = {
    Logout: PropTypes.func.isRequired
  };

  static defaultProps = {};

  componentWillMount() {
    this.getState(this.props);
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { User, Messages } = props;
    this.setState({ User, Messages });
  };

  Logout = () => {
    this.props.Logout();
    this.props.alert.show([<div>GOODBYE</div>]);
  };

  unreadMessages = groups => {
    let count = 0;
    if (!groups) return count;
    for (let i = 0; i < groups.length; i++) {
      const { messages } = groups[i];
      for (let j = 0; j < messages.length; j++) {
        const { is_read } = messages[j];
        if (!is_read) count += 1;
      }
    }
    return count;
  };

  render() {
    const { pathname } = this.props.location;
    const { User, Messages } = this.state;
    const unreadMessages = this.unreadMessages(Messages.results);
    const {
      token,
      id,
      is_superuser,
      is_staff,
      bio,
      primary_role,
      primary_class
    } = User;
    const { showFooter, pushMessages } = this.props.Settings;
    return (
      <Navbar inverse collapseOnSelect className="NavBar">
        <Navbar.Header>
          <Navbar.Brand>
            <LinkContainer to="/home">
              <NavItem eventKey={1}>
                <i className="fas fa-home" /> HOME
              </NavItem>
            </LinkContainer>
            {/*<LinkContainer to="/">
                <NavItem eventKey={1}><Image src={votLogo} onMouseOver={e => e.currentTarget.src = votLogoHover} onMouseLeave={e => e.currentTarget.src = votLogo}/></NavItem>
                </LinkContainer>*/}
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <LinkContainer to="/calendar">
              <NavItem eventKey={3}>
                <i className="far fa-calendar-alt" /> CALENDAR
              </NavItem>
            </LinkContainer>
            <LinkContainer to="/news/latest">
              <NavItem eventKey={4}>
                <i className="fas fa-newspaper" /> NEWS
              </NavItem>
            </LinkContainer>
            <LinkContainer to="/forums">
              <NavItem eventKey={5}>
                <i className="fab fa-stack-exchange" /> FORUMS
              </NavItem>
            </LinkContainer>
            <NavDropdown
              eventKey={6}
              title={[<i key={6} className="fab fa-fort-awesome" />, " GUILD"]}
              id="basic-nav-dropdown"
            >
              <LinkContainer to="/guild/about">
                <NavItem eventKey={6.1}>ABOUT</NavItem>
              </LinkContainer>
              <LinkContainer to="/guild/roster">
                <NavItem eventKey={6.2}>ROSTER</NavItem>
              </LinkContainer>
              <LinkContainer to="/guild/charters">
                <NavItem eventKey={6.3}>CHARTERS</NavItem>
              </LinkContainer>
              <LinkContainer to="/guild/lore">
                <NavItem eventKey={6.4}>LORE</NavItem>
              </LinkContainer>
              <LinkContainer to="/guild/contests">
                <NavItem eventKey={6.5}>CONTESTS</NavItem>
              </LinkContainer>
              <LinkContainer to="/guild/team">
                <NavItem eventKey={6.6}>TEAM</NavItem>
              </LinkContainer>
              <LinkContainer to="/guild/join">
                <NavItem eventKey={6.7}>JOIN</NavItem>
              </LinkContainer>
              <MenuItem divider />
              <NavItem
                href="https://www.designbyhumans.com/shop/VoicesofTerminus/"
                target="_blank"
                eventKey={6.8}
              >
                <i className="fas fa-store" /> STORE
              </NavItem>
              <LinkContainer to="/guild/donate">
                <NavItem eventKey={6.9}>
                  <i className="fas fa-donate" /> DONATE
                </NavItem>
              </LinkContainer>
            </NavDropdown>
            <NavDropdown
              eventKey={7}
              title={[<i key={7} className="fas fa-compact-disc" />, " MEDIA"]}
              id="basic-nav-dropdown"
            >
              <LinkContainer to="/media/images">
                <NavItem eventKey={7.1}>IMAGES</NavItem>
              </LinkContainer>
              <LinkContainer to="/media/videos">
                <NavItem eventKey={7.2}>VIDEOS</NavItem>
              </LinkContainer>
              <LinkContainer to="/media/streams">
                <NavItem eventKey={7.3}>STREAMS</NavItem>
              </LinkContainer>
              <LinkContainer to="/media/podcasts">
                <NavItem eventKey={7.4}>PODCASTS</NavItem>
              </LinkContainer>
            </NavDropdown>
            <NavDropdown
              eventKey={8}
              title={[<i key={8} className="fas fa-gopuram" />, " VR"]}
              id="connect-nav-dropdown"
            >
              <Image src={vrLogo} className="vrLogo" />
              <NavItem
                eventKey={8.1}
                href="http://pantheonmmo.com/?referer=VoicesOfTerminus"
                target="_blank"
              >
                WEBSITE
              </NavItem>
              <NavItem
                eventKey={8.2}
                href="http://visionaryrealms.com/?referer=VoicesOfTerminus"
                target="_blank"
              >
                NEWS + EVENTS
              </NavItem>
              <NavItem
                eventKey={8.3}
                href="https://www.youtube.com/channel/UC4MbaiykerIrjKWRA6407tQ"
                target="_blank"
              >
                GAMEPLAY
              </NavItem>
              <NavItem
                eventKey={8.4}
                href="http://www.pantheonmmo.com/news/latest_news/"
                target="_blank"
              >
                NEWSLETTERS
              </NavItem>
            </NavDropdown>

            {!User.token ? (
              <LinkContainer to="/login">
                <NavItem eventKey={9}>
                  <i className="fas fa-sign-in-alt" /> LOGIN
                </NavItem>
              </LinkContainer>
            ) : (
              <NavDropdown
                eventKey={10}
                title={[
                  primary_class ? (
                    <Image
                      src={classIcon(primary_class)}
                      style={{ height: "25px" }}
                    />
                  ) : (
                    <i key={10.1} className="fas fa-user" />
                  ),
                  <span key={10.2}> {User.username} </span>,
                  <Badge key={10.3}>{unreadMessages}</Badge>
                ]}
                id="basic-nav-dropdown"
              >
                <LinkContainer to="/profile">
                  <NavItem eventKey={10.4}>
                    <i className="fas fa-user-circle" /> PROFILE
                  </NavItem>
                </LinkContainer>
                <LinkContainer to="/messages">
                  <NavItem eventKey={10.5}>
                    <i className="fas fa-bell" /> MESSAGES{" "}
                    <Badge>{unreadMessages}</Badge>
                  </NavItem>
                </LinkContainer>
                <NavItem onClick={this.Logout}>
                  <i className="fas fa-sign-out-alt" /> LOGOUT
                </NavItem>
                {User.is_superuser ||
                User.can_create_article ||
                User.can_create_newsletter ? (
                  <MenuItem divider />
                ) : null}
                {User.is_superuser || User.can_create_article ? (
                  <LinkContainer to="/article/new/">
                    <NavItem eventKey={10.6}>
                      <i className="fas fa-plus" /> ARTICLE
                    </NavItem>
                  </LinkContainer>
                ) : null}
                {User.is_superuser || User.can_create_newsletter ? (
                  <LinkContainer to="/newsletter/new">
                    <NavItem eventKey={10.7}>
                      <i className="fas fa-plus" /> NEWSLETTER
                    </NavItem>
                  </LinkContainer>
                ) : null}
                {User.is_superuser || User.is_staff ? (
                  <LinkContainer to="/poll/new/">
                    <NavItem eventKey={10.8}>
                      <i className="fas fa-plus" /> POLL
                    </NavItem>
                  </LinkContainer>
                ) : null}
                <MenuItem divider />
                {User.is_superuser || User.is_staff ? (
                  <LinkContainer to="/polls">
                    <NavItem eventKey={10.9}>
                      <i className="fas fa-eye" /> POLLS
                    </NavItem>
                  </LinkContainer>
                ) : null}
                <MenuItem divider />
                <MenuItem
                  onClick={() => this.props.toggleFooter(!showFooter)}
                  className="Center"
                >
                  {showFooter ? (
                    <i className="far fa-eye-slash" />
                  ) : (
                    <i className="far fa-eye" />
                  )}{" "}
                  Footer
                </MenuItem>
                <MenuItem
                  onClick={() => this.props.togglerPushMessages(!pushMessages)}
                  className="Center"
                >
                  {pushMessages ? (
                    <i className="fas fa-toggle-on" />
                  ) : (
                    <i className="fas fa-toggle-off" />
                  )}{" "}
                  Push Messages
                </MenuItem>
              </NavDropdown>
            )}
          </Nav>
          <Nav className="Center pull-right">
            {User.is_superuser || User.is_staff ? (
              <LinkContainer to="/admin/overview" className="AdminButton">
                <NavItem eventKey={11}>
                  <i className="fas fa-database" /> ADMIN
                </NavItem>
              </LinkContainer>
            ) : null}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
export default withAlert(
  withRouter(reduxConnect(mapStateToProps, mapDispatchToProps)(NavBar))
);
