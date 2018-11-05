import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import {withRouter, Redirect, Link} from 'react-router-dom'
import Moment from 'react-moment'
import ReactTable from "react-table"
import matchSorter from 'match-sorter'
import 'react-table/react-table.css'
import { Grid, Row, Col, PageHeader,ButtonToolbar, Button, InputGroup, FormControl } from 'react-bootstrap'
import './styles.css'
import './stylesM.css'
import {getUsers} from '../../actions/Admin'

const columns = [
  {Header: 'INFO', columns: [
    {Header: 'Username', accessor: 'username', filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: [filter.id] }), filterAll: true, maxWidth: 125,
      Cell: props => (<Link to={'admin/user/profile/' + props.original.id}>{props.value}</Link>)},
    {Header: 'Email', accessor: 'email', filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: [filter.id] }), filterAll: true},
  ]},
  {Header: 'Permissions', columns: [
    {Header: 'Admin?', accessor: 'is_superuser', filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: [filter.id] }), filterAll: true, maxWidth: 75,
    Cell: props => String(props.value)},
  {Header: 'Mod?', accessor: 'is_staff', filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: [filter.id] }), filterAll: true, maxWidth: 75,
    Cell: props => String(props.value)}
  ]},
  {Header: 'IN GAME', columns: [
  {Header: 'Role', accessor: 'primary_role', filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: [filter.id] }), filterAll: true, maxWidth: 120},
  {Header: 'Class', accessor: 'primary_class', filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: [filter.id] }), filterAll: true, maxWidth: 120},
  {Header: 'Profession', accessor: 'profession', filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: [filter.id] }), filterAll: true, maxWidth: 120},
  {Header: 'Specialization', accessor: 'profession_specialization', filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: [filter.id] }), filterAll: true, maxWidth: 120},
  ]},
  {Header: 'ACTIVITY', columns: [
  {Header: 'Last Login', accessor: 'last_login', maxWidth: 100,
    Cell: props => <Moment format="YYYY-MM-DD">{props.value}</Moment>, filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: [filter.id] }), filterAll: true},
  {Header: 'Joined', accessor: 'date_joined', maxWidth: 100,
    Cell: props => <Moment format="YYYY-MM-DD">{props.value}</Moment>,filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: [filter.id] }), filterAll: true},
  {Header: 'XP', accessor: 'experience_points', filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: [filter.id] }), filterAll: true, maxWidth: 80},
  ]}
]

const mapStateToProps = ({Admin, User,}) => ({
  Admin, User
})

const mapDispatchToProps = {
  getUsers
}

class Admin extends Component {
  constructor(props) {
    super(props)
 
    this.state = {
    }
  }

  static propTypes = { 
  }

  static defaultProps = {
  }
  
  componentWillMount() {
    this.getState(this.props)
  }

  componentDidMount() {
    const {token} = this.props.User
    this.props.getUsers(token)
  }
  
  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const {Admin, User} = props
    this.setState({Admin, User})
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

  render() {
    const {data} = this.props
    const {Admin, User} = this.state
    const {Users} = Admin

    return (
      !User.is_superuser ? <Redirect to={this.props.history.goBack()}/>
      :<Grid className="Admin Container fadeIn-2">
      <PageHeader className="pageHeader">ADMIN</PageHeader>
        <Row>
          <Col md={12} xs={12} className="ActionToolbar" componentClass={ButtonToolbar}>
              <Button onClick={() => this.props.history.push('/articles/new/newsletter')} disabled>
                Create User
              </Button>
              <Button onClick={() => this.props.history.push('/articles/new/article')}>
                Create Article
              </Button>
              <Button onClick={() => this.props.history.push('/articles/new/newsletter')} >
                Create Newsletter
              </Button>
              <Button onClick={() => this.props.history.push('/articles/new/newsletter')} disabled>
                Create Event
              </Button>
            </Col>
            {/* <Col md={8} xs={12} className="ActionToolbar" componentClass={InputGroup}>
              <InputGroup.Addon>
                <FormControl name="filter" componentClass="select" onChange={this.onChange}>
                  <option value="article">article</option>
                  <option value="newsletter">newsletter</option>
                </FormControl>
              </InputGroup.Addon>
            <FormControl type="text" name="search" placeholder="Search..." onChange={this.onChange} />
          </Col> */}
        </Row>
        <Row>
          <ReactTable
            loading={!Users}
            data={Users}
            columns={columns}
            filterable
            // defaultFilterMethod={(filter, row) => String(row[filter.id]) === filter.value)}
            showFilters
            showPageSizeOptions
            showPaginationBottom
            showPageJump
            // getTrProps = {
            //   (state, rowInfo) => {
            //     console.log("state: ", state)
            //       console.log('rowInfo: ', rowInfo)
            //     return {
            //       onClick: () => this.props.history.push(`admin/user/profile/` + rowInfo.row.username)
            //     }
            //   }
            // }
            />
        </Row>
      </Grid>
    )
  }
}
export default withRouter(reduxConnect(mapStateToProps, mapDispatchToProps)(Admin))
