import React from "react";
import ReactTable from "react-table";
import { Checkbox } from "react-bootstrap";
import ConfirmAction from "../../../components/ConfirmAction";
import matchSorter from "match-sorter";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import {
  GetUserPermissions,
  statusLevelInt,
  statusLevelString
} from "../../../helpers";
import { ReduxStore } from "../../../index";
import "./styles.css";

const PermissionsTable = (Users, User, changePermissions) => {
  const {
    AllUserPermissions
  } = ReduxStore.getState().AuthenticationAndAuthorization;
  return (
    <ReactTable
      className="PermissionsTable"
      loading={!Users}
      data={Users}
      columns={[
        {
          columns: [
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
            }
          ]
        },
        {
          columns: AllUserPermissions.map(p => {
            const { id, codename, content_type, name } = p;
            return (p = {
              Header: name,
              accessor: "user_permissions",
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {
                  keys: [filter.id]
                }),
              filterAll: true,
              // maxWidth: 75,
              Cell: props => {
                const userId = props.original.id;
                let user_permissions = props.value;
                const userHasPermission = user_permissions.includes(id);
                user_permissions = userHasPermission
                  ? user_permissions.filter(p => p != id)
                  : [...user_permissions, ...[id]];
                const userPermissionsPayload = {
                  user_permissions: JSON.stringify(user_permissions)
                };
                return (
                  <Checkbox
                    checked={userHasPermission}
                    onClick={e =>
                      changePermissions(
                        User.token,
                        userId,
                        userPermissionsPayload
                      )
                    }
                  />
                );
              }
            });
          })
        }
      ]}
      filterable
      // defaultFilterMethod={(filter, row) => String(row[filter.id]) === filter.value)}
      showFilters
      showPageSizeOptions
      showPaginationBottom
      showPageJump
      defaultSorted={[{ id: "id", desc: false }]}
      defaultPageSize={Window.isMobile ? 10 : 15}
      pageSizeOptions={[5, 10, 15, 20, 50, 100]}
      multiSort={true}
      previousText={<i className="fas fa-arrow-left" />}
      nextText={<i className="fas fa-arrow-right" />}
    />
  );
};

export default PermissionsTable;
