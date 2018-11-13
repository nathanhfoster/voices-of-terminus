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
import {statusLevelInt, statusLevelString} from '../../helpers'

const columns = [
  {Header: 'INFO', columns: [
    {Header: 'Username', accessor: 'username', filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: [filter.id] }), filterAll: true, maxWidth: 125,
    Footer: Users => (
      <span style={{color: 'var(--primaryColor)'}}>
        <strong>Total: {Users.data.length}</strong>
      </span>
    ),
    Cell: props => (<Link to={'admin/user/profile/' + props.original.id}>{props.value}</Link>)},
    {Header: 'Email', accessor: 'email', filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: [filter.id] }), filterAll: true},
  ]},
  {Header: 'Permissions', columns: [
    {Header: 'Admin?', accessor: 'is_superuser', filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: [filter.id] }), filterAll: true, maxWidth: 75,
    Footer: Users => (
      <span style={{color: 'var(--primaryColor)'}}>
        <strong>Total: {Users.data.filter(user => user.is_superuser).length}</strong>
      </span>
    ),
    Cell: props => String(props.value)},
  {Header: 'Mod?', accessor: 'is_staff', filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: [filter.id] }), filterAll: true, maxWidth: 75,
  Footer: Users => (
    <span style={{color: 'var(--primaryColor)'}}>
      <strong>Total: {Users.data.filter(user => user.is_staff).length}</strong>
    </span>
  ),
    Cell: props => String(props.value)},
  {Header: 'Status',  id: 'status', accessor: User => statusLevelInt({is_leader: User.is_leader, is_council: User.is_council, is_general_officer: User.is_general_officer, 
    is_officer: User.is_officer, is_senior_member: User.is_senior_member, is_junior_member: User.is_junior_member, is_recruit: User.is_recruit}), filterMethod: (filter, rows) => matchSorter(rows, filter.value[1], { keys: [filter.id] }), filterAll: true, maxWidth: 125,
    Cell: props => statusLevelString(props.value)}
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
  {Header: 'XP', accessor: 'experience_points', filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: [filter.id] }), filterAll: true, maxWidth: 100,
  Footer: Users => (
    <span style={{color: 'var(--primaryColor)'}}>
      <strong>Max: {Math.max(...Users.data.map(user => user.experience_points))}</strong>
    </span>
  )},
  ]}
]

const mapStateToProps = ({Admin, User, Window}) => ({
  Admin,
  User,
  Window
})

const mapDispatchToProps = {
  getUsers
}

class Admin extends Component {
  constructor(props) {
    super(props)
 
    this.state = {
      selected: null
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
    this.props.getUsers()
  }
  
  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const {Admin, User, Window} = props
    this.setState({Admin, User, Window})
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

  render() {
    const {Admin, User, Window} = this.state
    const {Users} = Admin

    return (
      User.is_superuser || User.is_staff ? 
      <Grid className="Admin Container fadeIn-2">
        <PageHeader className="pageHeader">ADMIN</PageHeader>
        <Row>
          <Col md={12} xs={12} className="ActionToolbar" componentClass={ButtonToolbar}>
            <Button onClick={() => this.props.history.goBack()}>
              <i class="fas fa-arrow-left"/>
            </Button>
            <Button onClick={() => this.props.history.push('/articles/new/newsletter')} disabled>
            <i class="fas fa-plus"/> User
            </Button>
            <Button disabled={!(User.is_superuser || User.can_create_article)} onClick={() => this.props.history.push('/articles/new/article')}>
            <i class="fas fa-plus"/> Article
            </Button>
            <Button disabled={!(User.is_superuser || User.can_create_newsletter)} onClick={() => this.props.history.push('/articles/new/newsletter')} >
            <i class="fas fa-plus"/> Newsletter
            </Button>
            <Button onClick={() => this.props.history.push('/articles/new/newsletter')} disabled>
            <i class="fas fa-plus"/> Event
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
            defaultSorted={[{id: "date_joined", desc: true}]}
            defaultPageSize={Window.isMobile ? 10 : 15}
            pageSizeOptions={[5, 10, 15, 20, 50, 100]}
            multiSort={true}
            previousText={<i class="fas fa-arrow-left"/>}
            nextText={<i class="fas fa-arrow-right"/>}
            />
        </Row>
      </Grid> : <Redirect to={this.props.history.goBack()}/>
    )
  }
}
export default withRouter(reduxConnect(mapStateToProps, mapDispatchToProps)(Admin))
