import React, { PureComponent } from "react";
import { connect as reduxConnect } from "react-redux";
import { Grid, Row, Col } from "react-bootstrap";
import "./styles.css";

const mapStateToProps = ({}) => ({});

const mapDispatchToProps = {};

class Join extends PureComponent {
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
      <Grid className="Join Container fadeIn-2">
        <Row>
          <Col>
            <div class="section no-pad-top">
              <h3>About VoT</h3>
              <p>
                The <strong>Voices of Terminus</strong>, Pantheon: Rise of the
                Fallen guild is always seeking out quality individuals to share
                in the adventure as we wait for and eventually enjoy Pantheon.
                We will never base our recruitment off of
                <em>classes needed</em> and we will never resort to headhunting
                as we are firm believers of <span>Quality &gt; Quantity</span>.
              </p>
              <p>
                With that said, we are a family-friendly organization and the
                primary goal of our leadership will always be to look out for
                the best interest of our members above progression and
                self-benefit.
              </p>
              <p>
                We are also a chatty bunch of people and do <em>require</em>
                that all members use{" "}
                <a href="https://discordapp.com/" target="_blank">
                  Discord
                </a>{" "}
                as it is our primary form of communication.
              </p>

              <h3>Get On With It!</h3>
              <p>
                Want to join the VoT guild? Well, you're in luck! Our
                application process is extremely simple! Here's what you need to
                do:
              </p>
              <ol>
                <li>
                  Jump on{" "}
                  <a href="http://discord.me/vot" target="_blank">
                    Discord
                  </a>
                </li>
                <li>
                  Send a DM (Direct Message) to our venerable leader, Yarnila (⛨
                  Yarnila ©
                  <vot>
                    #8639), and tell him you would like to join our ranks
                  </vot>
                </li>
                <li>
                  Go through a quick little interview with Yarnila so he can be
                  sure we are a good fit for <em>you</em>
                </li>
                <li>
                  If you are accepted, you'll be granted access to guild-only
                  channels. If you're not, that's OK! We've got some fantastic
                  people in the VoT and our #general chat channel is open to
                  <strong>everyone</strong>!
                </li>
                <li>Chat, laugh, make friends!</li>
                <li>
                  Optional: Proclaim your alligance to Leksur and
                  <em>Leksur's Legion</em> in chat!
                </li>
              </ol>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Join);
