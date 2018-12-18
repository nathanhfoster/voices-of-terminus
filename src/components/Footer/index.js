import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect as reduxConnect } from "react-redux";
import "./styles.css";
import "./stylesM.css";
import { Image } from "react-bootstrap";
import femaleElf from "../../images/backgrounds/elf_female.png";
import maleElf from "../../images/backgrounds/elf_male.png";
import femaleHalfling from "../../images/backgrounds/halfling_female.png";
import maleHalfling from "../../images/backgrounds/halfling_male.png";
import femaleHuman from "../../images/backgrounds/human_female.png";
import maleHuman from "../../images/backgrounds/human_male.png";
import { withRouter } from "react-router-dom";
import { Collapse } from "react-collapse";
import { Link } from "react-router-dom";

const mapStateToProps = ({ Window, Settings }) => ({
  Window,
  Settings
});

const mapDispatchToProps = {};

class Footer extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      shouldShow: false
    };
  }

  static propTypes = {
    shouldShow: PropTypes.bool
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
    const { history, location, match, Window, Settings } = props;
    this.setState({
      history,
      location,
      match,
      shouldShow: Window.innerWidth > 1550,
      Settings
    });
  };

  backgroundImageRouteMap = route => {
    const elves = [femaleElf, maleElf];
    const halflings = [femaleHalfling, maleHalfling];
    const humans = [femaleHuman, maleHuman];
    switch (route) {
      case "/home":
        return elves;
      case "/calendar":
        return halflings;
      case "/news/latest":
        return humans;
      case "/news/suggested":
        return halflings;
      case "/news/popular":
        return elves;
      case "/news/my-docs":
        return humans;
      case "/guild/about":
        return elves;
      case "/guild/roster":
        return halflings;
      case "/guild/charters":
        return humans;
      case "/guild/lore":
        return halflings;
      case "/guild/contests":
        return humans;
      case "/guild/team":
        return elves;
      case "/guild/join":
        return halflings;
      case "/forums":
        return elves;
      case "/login":
        return humans;
      case "/media/images":
        return halflings;
      case "/media/videos":
        return humans;
      case "/media/streams":
        return elves;
      case "/media/podcasts":
        return halflings;
      case "/media/vot-network":
        return elves;
      default:
        return humans;
    }
  };

  render() {
    const { history, location, match, Settings, isMobile } = this.state;
    const { showFooter } = Settings;
    const { pathname } = location;
    const { shouldShow } = this.state;
    const femaleImage = this.backgroundImageRouteMap(pathname)[0];
    const maleImage = this.backgroundImageRouteMap(pathname)[1];

    return showFooter ? (
      <Collapse
        isOpened={showFooter}
        fixedHeight={52}
        className="MainFooter fadeIn-2"
      >
        <footer>
          <div>
            &copy; {new Date().getFullYear()} Voices of Terminus. Trademarks,
            copyrights, and media are property of their respective owners.
          </div>
          <div>
            <Link to="/privacy-policy">
              <i className="fas fa-user-secret" /> Privacy policy
            </Link>
          </div>
          {shouldShow
            ? [
                <Image className="Female footerImages" src={femaleImage} />,
                <Image className="Male footerImages" src={maleImage} />
              ]
            : null}
        </footer>
      </Collapse>
    ) : null;
  }
}
export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(Footer)
);
