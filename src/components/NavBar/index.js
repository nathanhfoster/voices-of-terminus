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
import { toggleFooter } from "../../actions/App";

const mapStateToProps = ({ User, Settings }) => ({
  User,
  Settings
});

const mapDispatchToProps = {
  Logout,
  toggleFooter
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
    const { User } = props;
    this.setState({ User });
  };

  componentWillUpdate() {}

  componentDidUpdate() {}

  componentWillUnmount() {}

  Logout = () => {
    this.props.Logout();
    this.props.alert.show([<div>GOODBYE</div>]);
  };

  render() {
    const { pathname } = this.props.location;
    const { User } = this.state;
    const {
      token,
      id,
      is_superuser,
      is_staff,
      bio,
      primary_role,
      primary_class
    } = User;
    const { showFooter } = this.props.Settings;
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
              eventKey={5}
              title={[<i className="fab fa-fort-awesome" />, " GUILD"]}
              id="basic-nav-dropdown"
            >
              <LinkContainer to="/guild/about">
                <NavItem eventKey={5.1}>ABOUT</NavItem>
              </LinkContainer>
              <LinkContainer to="/guild/donate">
                <NavItem eventKey={5.1}>DONATE</NavItem>
              </LinkContainer>
              <LinkContainer to="/guild/roster">
                <NavItem eventKey={5.2}>ROSTER</NavItem>
              </LinkContainer>
              <LinkContainer to="/guild/charters">
                <NavItem eventKey={5.3}>CHARTERS</NavItem>
              </LinkContainer>
              <LinkContainer to="/guild/lore">
                <NavItem eventKey={5.4}>LORE</NavItem>
              </LinkContainer>
              <LinkContainer to="/guild/contests">
                <NavItem eventKey={5.5}>CONTESTS</NavItem>
              </LinkContainer>
              <LinkContainer to="/guild/team">
                <NavItem eventKey={5.6}>TEAM</NavItem>
              </LinkContainer>
              <LinkContainer to="/guild/join">
                <NavItem eventKey={5.7}>JOIN</NavItem>
              </LinkContainer>
              <NavItem
                href="https://www.designbyhumans.com/shop/VoicesofTerminus/"
                target="_blank"
                eventKey={5.8}
              >
                <i className="fas fa-store" /> STORE
              </NavItem>
            </NavDropdown>
            <NavDropdown
              eventKey={6}
              title={[<i className="fas fa-compact-disc" />, " MEDIA"]}
              id="basic-nav-dropdown"
            >
              <LinkContainer to="/media/images">
                <NavItem eventKey={6.1}>IMAGES</NavItem>
              </LinkContainer>
              <LinkContainer to="/media/videos">
                <NavItem eventKey={6.2}>VIDEOS</NavItem>
              </LinkContainer>
              <LinkContainer to="/media/streams">
                <NavItem eventKey={6.3}>STREAMS</NavItem>
              </LinkContainer>
              <LinkContainer to="/media/podcasts">
                <NavItem eventKey={6.4}>PODCASTS</NavItem>
              </LinkContainer>
            </NavDropdown>
            <NavDropdown
              eventKey={8}
              title={[<i className="fas fa-vr-cardboard" />, " VR"]}
              id="connect-nav-dropdown"
            >
              <Image eventKey={8.1} src={vrLogo} className="vrLogo" />
              <NavItem
                eventKey={8.2}
                href="http://pantheonmmo.com/?referer=VoicesOfTerminus"
                target="_blank"
              >
                WEBSITE
              </NavItem>
              <NavItem
                eventKey={8.3}
                href="http://visionaryrealms.com/?referer=VoicesOfTerminus"
                target="_blank"
              >
                NEWS + EVENTS
              </NavItem>
              <NavItem
                eventKey={8.4}
                href="https://www.youtube.com/channel/UC4MbaiykerIrjKWRA6407tQ"
                target="_blank"
              >
                GAMEPLAY
              </NavItem>
              <NavItem
                eventKey={8.5}
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
                    <i className="fas fa-user" />
                  ),
                  " " + User.username
                ]}
                id="basic-nav-dropdown"
              >
                <LinkContainer to="/profile">
                  <NavItem eventKey={11}>
                    <i className="fas fa-user-circle" /> PROFILE
                  </NavItem>
                </LinkContainer>
                <LinkContainer to="/profile">
                  <NavItem eventKey={12}>
                    <i className="fas fa-bell" /> MESSAGES <Badge>42</Badge>
                  </NavItem>
                </LinkContainer>
                <NavItem onClick={this.Logout}>
                  <i className="fas fa-sign-out-alt" /> LOGOUT
                </NavItem>
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
              </NavDropdown>
            )}
          </Nav>
          <Nav className="Center pull-right">
            {User.is_superuser || User.is_staff ? (
              <LinkContainer
                to="/admin"
                componentClass={Button}
                className="AdminButton"
              >
                <NavItem eventKey={7}>ADMIN</NavItem>
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
