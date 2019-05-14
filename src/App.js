import React, { PureComponent } from "react";

import PropTypes from "prop-types";
import { connect as reduxConnect } from "react-redux";
import { withAlert } from "react-alert";
import Cookies from "js-cookie";
import "./App.css";
import "./AppM.css";

import "regenerator-runtime/runtime";
import { withRouter, Route, Switch, Redirect } from "react-router-dom";
import { Image } from "react-bootstrap";

import Admin from "./views/Admin";
import FormSystem from "./views/Admin/FormSystem";
import TicketDetails from "./views/Admin/TicketsTable/TicketDetails";
import TicketSystem from "./views/Profile/TicketSystem";
import Ticket from "./views/Profile/TicketSystem/Ticket";
import FormGenerator from "./components/FormGenerator";
import BackgroundImage from "./components/BackgroundImage";
import UserProfile from "./views/Admin/UserProfile";
import NavBar from "./components/NavBar";
import Home from "./views/Home";
import TextEditor from "./components/TextEditor";
import NewsLetterGenerator from "./components/NewsLetterGenerator";
import GuildCalendar from "./views/GuildCalendar";
import Event from "./views/GuildCalendar/Event";
import EventDetails from "./views/GuildCalendar/EventDetails";
import News from "./views/News";
import ViewHtmlDocument from "./components/ViewHtmlDocument";
import Forums from "./views/Forums";
import Guild from "./views/Guild";
import Media from "./views/Media";
import Gallery from "./views/Media/Images/Gallery";
import VideoPlayer from "./components/VideoPlayer";
import Profile from "./views/Profile";
import PublicProfile from "./views/Profile/PublicProfile";
import Messages from "./views/Profile/Messages";
import Login from "./components/Login";
import PageNotFound from "./views/PageNotFound";
import Footer from "./components/Footer";
import PrivacyPolicy from "./components/PrivacyPolicy";
import Settings from "./views/Settings";
import {
  clearApiResponse,
  setWindow,
  getVoTYouTubeChannelData,
  getVotChannelsPlayLists,
  getAllVotYouTube,
  getVRYouTubeChannelData,
  Logout
} from "./actions/App";
import {
  getAllUserGroups,
  getAllUserPermissions
} from "./actions/AuthenticationAndAuthorization";
import { getUsers } from "./actions/Admin";
import { getUserMessages } from "./actions/Messages";
import { refreshPatchUser } from "./actions/App";
import { getUserSettings } from "./actions/Settings";
import "moment-timezone";
import MomentJS from "moment";
import "react-image-lightbox/style.css"; // This only needs to be imported once in your app
import { userRefreshDelay } from "./helpers/variables";

const mapStateToProps = ({
  Admin,
  ApiResponse,
  Window,
  User,
  VoTYouTubeChannelData,
  VRYouTubeChannelData
}) => ({
  Admin,
  ApiResponse,
  Window,
  User,
  VoTYouTubeChannelData,
  VRYouTubeChannelData
});

const mapDispatchToProps = {
  clearApiResponse,
  setWindow,
  getVoTYouTubeChannelData,
  getVotChannelsPlayLists,
  getAllVotYouTube,
  getVRYouTubeChannelData,
  Logout,
  refreshPatchUser,
  getUserMessages,
  getUsers,
  getAllUserGroups,
  getAllUserPermissions,
  getUserSettings
};

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

    this.state = {
      width: null,
      height: null,
      isMobile: false,
      User: {},
      routeItems: [
        { path: "/home", component: Home },
        { path: "/admin", component: Admin },
        { path: "/admin/overview", component: Admin },
        { path: "/admin/permissions", component: Admin },
        { path: "/admin/tickets", component: Admin },
        { path: "/admin/view/ticket/:id", component: TicketDetails },
        { path: "/admin/edit/user/:id", component: UserProfile },
        { path: "/forms", component: FormSystem },
        { path: "/forms/:id", component: FormSystem },
        { path: "/forms/:id/questions", component: FormSystem },
        { path: "/forms/:id/results", component: FormSystem },
        { path: "/form/new/", component: FormGenerator },
        { path: "/form/edit/:id", component: FormGenerator },
        { path: "/view/article/:id", component: ViewHtmlDocument },
        { path: "/article/new", component: TextEditor },
        { path: "/article/edit/:id", component: TextEditor },
        { path: "/calendar", component: GuildCalendar },
        { path: "/calendar/new/event", component: Event },
        { path: "/calendar/edit/event/:id", component: Event },
        { path: "/calendar/event/:id", component: EventDetails },
        { path: "/articles/*", component: News },
        { path: "/news/*", component: News },
        { path: "/view/newsletter/:id", component: ViewHtmlDocument },
        { path: "/newsletter/new", component: NewsLetterGenerator },
        { path: "/newsletter/edit/:id", component: NewsLetterGenerator },
        { path: "/forums", component: Forums },
        { path: "/guild/about", component: Guild },
        { path: "/guild/donate", component: Guild },
        { path: "/guild/roster", component: Guild },
        { path: "/guild/charters", component: Guild },
        { path: "/guild/lore", component: Guild },
        { path: "/guild/contests", component: Guild },
        { path: "/guild/team", component: Guild },
        { path: "/guild/join", component: Guild },
        { path: "/media/images", component: Media },
        { path: "/media/images/gallery/:id", component: Gallery },
        { path: "/media/videos", component: Media },
        { path: "/media/videos/:id/:type", component: VideoPlayer },
        { path: "/media/streams", component: Media },
        { path: "/media/podcasts", component: Media },
        { path: "/media/podcasts/:id/:type", component: VideoPlayer },
        { path: "/profile", component: Profile },
        { path: "/profile/:id/", component: PublicProfile },
        { path: "/tickets", component: TicketSystem },
        { path: "/ticket/new", component: Ticket },
        { path: "/messages", component: Messages },
        { path: "/login", component: Login },
        { path: "/privacy-policy", component: PrivacyPolicy },
        { path: "/settings", component: Settings }
      ]
    };
  }

  static propTypes = {
    setWindow: PropTypes.func.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    isMobile: PropTypes.bool,
    User: PropTypes.object,
    getVoTYouTubeChannelData: PropTypes.func.isRequired,
    getAllVotYouTube: PropTypes.func.isRequired,
    getVRYouTubeChannelData: PropTypes.func.isRequired,
    routeItems: PropTypes.array,
    images: PropTypes.array,
    imagesMobile: PropTypes.array,
    Settings: PropTypes.object,
    getAllUserGroups: PropTypes.func.isRequired,
    getAllUserPermissions: PropTypes.func.isRequired
  };

  static defaultProps = {};

  componentWillMount() {
    //localStorage.clear(); // Clear local storage
    this.getState(this.props);
  }

  componentDidMount() {
    const {
      User,
      VoTYouTubeChannelData,
      VRYouTubeChannelData,
      getUsers,
      getVoTYouTubeChannelData,
      getAllVotYouTube,
      getVRYouTubeChannelData,
      getVotChannelsPlayLists,
      Logout,
      getAllUserGroups,
      getAllUserPermissions
    } = this.props;

    getUsers();
    getAllUserGroups();
    getAllUserPermissions();
    if (this.shouldUpdate(VoTYouTubeChannelData[0])) getVoTYouTubeChannelData();
    if (this.shouldUpdate(VRYouTubeChannelData[0])) getAllVotYouTube();
    getVRYouTubeChannelData();
    getVotChannelsPlayLists();
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);

    // if cookie is expired and redux has User data remove it by logging out
    if (!Cookies.get("User_LoginToken") && User.token) Logout();
  }

  /* If youtubeData exists ? update it if the latest video is 3 days old : else update it */
  shouldUpdate = youtubeData =>
    youtubeData
      ? MomentJS().diff(MomentJS(youtubeData.publishedAt), "days") > 3
      : true;

  componentWillReceiveProps(nextProps) {
    clearInterval(this.interval);
    this.getState(nextProps);
  }

  getState = props => {
    const { ApiResponse, Window, User, location } = props;
    const { Settings } = User;
    const { id, token } = User;
    if (ApiResponse) this.alertApiResponse(ApiResponse);
    /* Check if User permissions have changed every 10 seconds */
    if (
      Cookies.get("User_LoginToken") &&
      User.id &&
      !["/edit/", "/new/"].some(e => location.pathname.includes(e))
    )
      this.interval = setInterval(
        () => this.fetchProfileUpdates(id, token, Settings),
        userRefreshDelay
      );
    this.setState({ ApiResponse, Window, User, Settings });
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
    clearInterval(this.interval);
  }

  fetchProfileUpdates = (id, token, Settings) => {
    const {
      refreshPatchUser,
      getUserSettings,
      getAllUserGroups,
      getUserMessages
    } = this.props;
    const { push_messages } = Settings;
    getAllUserGroups();
    refreshPatchUser(token, id);
    getUserSettings(token, id);
    if (push_messages) getUserMessages(id, token);
  };

  alertApiResponse = ApiResponse => {
    const { data, status, statusText, headers, config, request } = ApiResponse;
    const { alert } = this.props;

    if (status === 200 || status === 201)
      alert.success([
        <div>
          {status} {statusText}
        </div>
      ]);
    if (status === 400 || status === 401)
      alert.error([
        <div>
          {status} {statusText}
        </div>,
        <div>{JSON.stringify(data)}</div>
      ]);

    if (!status && statusText) {
      alert.error([<div>{statusText}</div>]);
    }

    this.props.clearApiResponse();
  };

  updateWindowDimensions() {
    const { innerHeight, innerWidth } = window;
    const isMobile = innerWidth < 768;
    this.props.setWindow({ innerHeight, innerWidth, isMobile });
    this.setState({ height: innerHeight, width: innerWidth, isMobile });
  }

  renderRouteItems = routeItems =>
    routeItems.map((k, i) => {
      const { path, component } = k;
      const { history, location, match } = this.props;
      return (
        <Route
          exact
          key={i}
          path={path}
          component={component}
          history={history}
          location={location}
          match={match}
        />
      );
    });

  renderBackgroundImages = (images, shouldRespond) =>
    images.map(k => (
      <Image src={k} width="100%" height="100%" responsive={shouldRespond} />
    ));

  render() {
    const { Settings, routeItems } = this.state;
    const { show_footer } = Settings;
    const { history, location, match } = this.props;
    return location.pathname === "/" ? (
      <Redirect to="/home" />
    ) : (
        <div className="App">
          <NavBar history={history} location={location} match={match} />
          <BackgroundImage history={history} location={location} match={match} />
          <div
            className="routeOverlay"
            style={{ bottom: show_footer ? "var(--navBarHeight" : 0 }}
          >
            <Switch>
              {this.renderRouteItems(routeItems)}
              <Route component={PageNotFound} />
            </Switch>
          </div>
          <Footer history={history} location={location} match={match} />
        </div>
      );
  }
}

export default withRouter(
  withAlert(reduxConnect(mapStateToProps, mapDispatchToProps)(App))
);
