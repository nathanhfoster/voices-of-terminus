import React, { PureComponent } from "react";
import { Link } from 'react-router-dom'
import PropTypes from "prop-types";

class RouterRedirect extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {};
    }

    static propTypes = {};

    static defaultProps = {};

    componentWillMount() {
        this.getState(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.getState(nextProps);
    }

    getState = props => {
        const { pathname, history, click, label, Class } = props
        this.setState({ pathname, history, click, label, Class });
    };

    render() {
        const { pathname, history, click, label, Class } = this.state
        return (
            <Link
                to={{ pathname, state: { from: history.location.pathname } }}
                onClick={click}
                className={Class}>
                {label}
            </Link>
        );
    }
}
export default (RouterRedirect);