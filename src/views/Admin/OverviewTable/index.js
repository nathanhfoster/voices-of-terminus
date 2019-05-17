import React from "react";
import ReactTable from "react-table";
import ConfirmAction from "../../../components/ConfirmAction";
import matchSorter from "match-sorter";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import {
  isOnline,
  findMaxInt,
  MainAltCharacter,
  arrayToObject
} from "../../../helpers";
import "./styles.css";
import { deleteUser } from "../../../actions/Admin";
import {
  statusLevelInt,
  statusLevelString,
  UserHasPermissions
} from "../../../helpers/userPermissions";

const OverviewTable = (Users, User, deleteThisUser) => {
  const { token } = User;

  return (
    <ReactTable
      className="OverviewTable"
      loading={!Users}
      data={Users}
      columns={[
        {
          Header: <i className="fas fa-gavel" />,
          columns: [
            {
              Header: <i className="fas fa-trash" />,
              accessor: "id",
              filterable: false,
              maxWidth: 48,
              Cell: props => (
                <ConfirmAction
                  Action={e => deleteThisUser(token, props.value)}
                  Disabled={!UserHasPermissions(User, "delete_user")}
                  Icon={<i className="fas fa-trash" />}
                  hasPermission={true}
                  Size="small"
                  Class=""
                  Title={props.original.username}
                />
              )
            }
          ]
        },
        {
          Header: <i className="fas fa-user-shield"> INFO</i>,
          columns: [
            {
              Header: <i className="far fa-envelope-open" />,
              accessor: "opt_in",
              filterable: false,
              maxWidth: 40,
              Cell: props =>
                props.value ? (
                  <i className="fas fa-check" />
                ) : (
                  <i className="fas fa-times" />
                ),
              Footer: Users => (
                <span>
                  <i className="fas fa-check" />{" "}
                  <strong style={{ color: "var(--primaryColor)" }}>
                    {Users.data.reduce((acc, curr) => acc + curr.opt_in, 0)}
                  </strong>
                </span>
              )
            },
            {
              Header: "Username",
              accessor: "username",
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {
                  keys: [filter.id]
                }),
              filterAll: true,
              maxWidth: 125,
              Footer: Users => (
                <span>
                  <i className="fas fa-users" />{" "}
                  <strong style={{ color: "var(--primaryColor)" }}>
                    {Users.data.length}
                  </strong>
                </span>
              ),
              Cell: props => (
                <Link to={`/admin/edit/user/${props.original.id}`}>
                  {props.value}
                </Link>
              )
            },
            {
              Header: "Email",
              accessor: "email",
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {
                  keys: [filter.id]
                }),
              filterAll: true
            }
          ]
        },
        {
          Header: <i className="fas fa-id-badge"> RANKS</i>,
          columns: [
            {
              Header: "Status",
              id: "status",
              accessor: User => statusLevelInt(User),
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value[1], {
                  keys: [filter.id]
                }),
              filterAll: true,
              maxWidth: 125,
              Footer: Users => (
                <span>
                  <i className="fab fa-fort-awesome" />{" "}
                  <strong style={{ color: "var(--primaryColor)" }}>
                    {Users.data.filter(user => user.status > 0).length}
                  </strong>
                </span>
              ),
              Cell: props => statusLevelString(props.value)
            },
            {
              Header: "Admin?",
              accessor: "is_superuser",
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {
                  keys: [filter.id]
                }),
              filterAll: true,
              maxWidth: 75,
              Footer: Users => (
                <span>
                  <i className="fas fa-unlock-alt" />{" "}
                  <strong style={{ color: "var(--primaryColor)" }}>
                    {Users.data.reduce(
                      (acc, curr) => acc + curr.is_superuser,
                      0
                    )}
                  </strong>
                </span>
              ),
              Cell: props => String(props.value)
            },
            {
              Header: "Mod?",
              accessor: "is_staff",
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {
                  keys: [filter.id]
                }),
              filterAll: true,
              maxWidth: 75,
              Footer: Users => (
                <span>
                  <i className="fas fa-unlock" />{" "}
                  <strong style={{ color: "var(--primaryColor)" }}>
                    {Users.data.reduce((acc, curr) => acc + curr.is_staff, 0)}
                  </strong>
                </span>
              ),
              Cell: props => String(props.value)
            }
          ]
        },
        {
          Header: <i className="fas fa-dungeon"> IN GAME</i>,
          columns: [
            {
              Header: "Role",
              id: "role",
              accessor: c => MainAltCharacter(c, "main").role,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {
                  keys: [filter.id]
                }),
              filterAll: true,
              maxWidth: 120
            },
            {
              Header: "Class",
              id: "character_class",
              accessor: c => MainAltCharacter(c, "main").character_class,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {
                  keys: [filter.id]
                }),
              filterAll: true,
              maxWidth: 120
            },
            {
              Header: "Profession",
              id: "profession",
              accessor: c => MainAltCharacter(c, "main").profession,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {
                  keys: [filter.id]
                }),
              filterAll: true,
              maxWidth: 120
            },
            {
              Header: "Specialization",
              id: "profession_specialization",
              accessor: c =>
                MainAltCharacter(c, "main").profession_specialization,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {
                  keys: [filter.id]
                }),
              filterAll: true,
              maxWidth: 120
            }
          ]
        },
        {
          Header: <i className="fas fa-hiking"> ACTIVITY</i>,
          columns: [
            {
              Header: "Last Login",
              accessor: "last_login",
              maxWidth: 100,
              Cell: props => (
                <div>
                  <i
                    className="fas fa-circle"
                    style={{
                      color: isOnline(props.value)
                        ? "var(--color_emerald)"
                        : "var(--color_alizarin)"
                    }}
                  />{" "}
                  <Moment fromNow>{props.value}</Moment>
                </div>
              ),

              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {
                  keys: [filter.id]
                }),
              filterAll: true
            },
            {
              Header: "Joined",
              accessor: "date_joined",
              maxWidth: 100,
              Cell: props => <Moment fromNow>{props.value}</Moment>,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {
                  keys: [filter.id]
                }),
              filterAll: true
            },
            {
              Header: "XP",
              accessor: "experience_points",
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {
                  keys: [filter.id]
                }),
              filterAll: true,
              maxWidth: 60,
              Footer: Users => (
                <span>
                  <i className="fas fa-level-up-alt" />{" "}
                  <strong style={{ color: "var(--primaryColor)" }}>
                    {findMaxInt(Users.data, "experience_points")}
                  </strong>
                </span>
              )
            }
          ]
        }
      ]}
      filterable
      // defaultFilterMethod={(filter, row) => String(row[filter.id]) === filter.value)}
      showFilters
      showPageSizeOptions
      showPaginationBottom
      showPageJump
      defaultSorted={[{ id: "last_login", desc: true }]}
      defaultPageSize={Window.isMobile ? 10 : 15}
      pageSizeOptions={[5, 10, 15, 20, 50, 100]}
      multiSort={true}
      previousText={<i className="fas fa-arrow-left" />}
      nextText={<i className="fas fa-arrow-right" />}
    />
  );
};

export default OverviewTable;
