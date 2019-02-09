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
import PollSystem from "./views/Admin/PollSystem";
import PollGenerator from "./components/PollGenerator";
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
import { getUsers } from "./actions/Admin";
import { getMessages } from "./actions/Messages";
import { refreshPatchUser } from "./actions/App";
import "moment-timezone";
import MomentJS from "moment";
import "react-image-lightbox/style.css"; // This only needs to be imported once in your app
import { userRefreshDelay } from "./helpers/variables";

const mapStateToProps = ({
  ApiResponse,
  Window,
  User,
  VoTYouTubeChannelData,
  VRYouTubeChannelData,
  Settings
}) => ({
  ApiResponse,
  Window,
  User,
  VoTYouTubeChannelData,
  VRYouTubeChannelData,
  Settings
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
  getMessages,
  getUsers
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
        { path: "/admin/edit/user/:id", component: UserProfile },
        { path: "/polls", component: PollSystem },
        { path: "/polls/:id", component: PollSystem },
        { path: "/polls/:id/respond", component: PollSystem },
        { path: "/polls/:id/results", component: PollSystem },
        { path: "/poll/new/", component: PollGenerator },
        { path: "/poll/edit/:id", component: PollGenerator },
        { path: "/articles/:id", component: ViewHtmlDocument },
        { path: "/article/new", component: TextEditor },
        { path: "/article/edit/:id", component: TextEditor },
        { path: "/calendar", component: GuildCalendar },
        { path: "/calendar/new/event", component: Event },
        { path: "/calendar/event/:id", component: EventDetails },
        { path: "/news/latest", component: News },
        { path: "/news/suggested", component: News },
        { path: "/news/popular", component: News },
        { path: "/news/my-docs", component: News },
        { path: "/newsletters/:id", component: ViewHtmlDocument },
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
    imagesMobile: PropTypes.array
  };

  static defaultProps = {};

  componentWillMount() {
    this.getState(this.props);
  }

  componentDidMount() {
    this.props.getUsers();
    const { User, VoTYouTubeChannelData, VRYouTubeChannelData } = this.props;
    if (this.shouldUpdate(VoTYouTubeChannelData[0]))
      this.props.getVoTYouTubeChannelData();
    if (this.shouldUpdate(VRYouTubeChannelData[0]))
      this.props.getAllVotYouTube();
    this.props.getVRYouTubeChannelData();
    this.props.getVotChannelsPlayLists();
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);

    // if cookie is expired and redux has User data remove it by logging out
    if (!Cookies.get("User_LoginToken") && this.props.User.token)
      this.props.Logout();
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
    const { ApiResponse, Window, User, location, Settings } = props;
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
    const { refreshPatchUser, getMessages } = this.props;
    const { pushMessages } = Settings;
    refreshPatchUser(id, token);
    if (pushMessages) getMessages(id, token);
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
    const { showFooter } = Settings;
    const { history, location, match } = this.props;
    return location.pathname === "/" ? (
      <Redirect to="/home" />
    ) : (
      <div className="App">
        <NavBar history={history} location={location} match={match} />
        <BackgroundImage history={history} location={location} match={match} />
        <div
          className="routeOverlay"
          style={{ bottom: showFooter ? "var(--navBarHeight" : 0 }}
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
