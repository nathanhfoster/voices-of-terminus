import React from "react";
import ReactTable from "react-table";
import { Checkbox } from "react-bootstrap";
import ConfirmAction from "../../../components/ConfirmAction";
import matchSorter from "match-sorter";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { statusLevelInt, statusLevelString } from "../../../helpers";
import "./styles.css";

const PermissionsTable = (Admin, User, updateUserProfile) => {
  const { Users } = Admin;
  const { loading, loaded, posting, posted, updating, updated, error } = Admin;
  const { token } = User;

  return (
    <ReactTable
      className="PermissionsTable"
      loading={!Users}
      data={Users}
      columns={[
        {
          Header: <i className="fas fa-user-shield"> INFO</i>,
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
          Header: <i className="fas fa-plus"> CREATE</i>,
          columns: [
            {
              Header: "Articles",
              accessor: "can_create_article",
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {
                  keys: [filter.id]
                }),
              filterAll: true,
              maxWidth: 75,
              Footer: Users => (
                <span>
                  <i className="fas fa-plus" />{" "}
                  <strong style={{ color: "var(--primaryColor)" }}>
                    {Users.data.reduce(
                      (acc, curr) => acc + curr.can_create_article,
                      0
                    )}
                  </strong>
                </span>
              ),
              Cell: props => {
                const userId = props.original.id;
                const permission = props.value;
                return (
                  <Checkbox
                    checked={permission}
                    onClick={e =>
                      updateUserProfile(userId, User.token, {
                        can_create_article: !permission
                      })
                    }
                  />
                );
              }
            },
            {
              Header: "Newsletters",
              accessor: "can_create_newsletter",
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {
                  keys: [filter.id]
                }),
              filterAll: true,
              maxWidth: 100,
              Footer: Users => (
                <span>
                  <i className="fas fa-plus" />{" "}
                  <strong style={{ color: "var(--primaryColor)" }}>
                    {Users.data.reduce(
                      (acc, curr) => acc + curr.can_create_newsletter,
                      0
                    )}
                  </strong>
                </span>
              ),
              Cell: props => {
                const userId = props.original.id;
                const permission = props.value;
                return (
                  <Checkbox
                    checked={permission}
                    onClick={e =>
                      updateUserProfile(userId, User.token, {
                        can_create_newsletter: !permission
                      })
                    }
                  />
                );
              }
            },
            {
              Header: "Events",
              accessor: "can_create_calendar_event",
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {
                  keys: [filter.id]
                }),
              filterAll: true,
              maxWidth: 75,
              Footer: Users => (
                <span>
                  <i className="fas fa-plus" />{" "}
                  <strong style={{ color: "var(--primaryColor)" }}>
                    {Users.data.reduce(
                      (acc, curr) => acc + curr.can_create_calendar_event,
                      0
                    )}
                  </strong>
                </span>
              ),
              Cell: props => {
                const userId = props.original.id;
                const permission = props.value;
                return (
                  <Checkbox
                    checked={permission}
                    onClick={e =>
                      updateUserProfile(userId, User.token, {
                        can_create_calendar_event: !permission
                      })
                    }
                  />
                );
              }
            },
            {
              Header: "Galleries",
              accessor: "can_create_galleries",
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {
                  keys: [filter.id]
                }),
              filterAll: true,
              maxWidth: 75,
              Footer: Users => (
                <span>
                  <i className="fas fa-plus" />{" "}
                  <strong style={{ color: "var(--primaryColor)" }}>
                    {Users.data.reduce(
                      (acc, curr) => acc + curr.can_create_galleries,
                      0
                    )}
                  </strong>
                </span>
              ),
              Cell: props => {
                const userId = props.original.id;
                const permission = props.value;
                return (
                  <Checkbox
                    checked={permission}
                    onClick={e =>
                      updateUserProfile(userId, User.token, {
                        can_create_galleries: !permission
                      })
                    }
                  />
                );
              }
            }
          ]
        },
        {
          Header: <i className="far fa-eye"> READ</i>,
          columns: [
            {
              Header: "Articles",
              accessor: "can_read_article",
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {
                  keys: [filter.id]
                }),
              filterAll: true,
              maxWidth: 75,
              Footer: Users => (
                <span>
                  <i className="far fa-eye" />{" "}
                  <strong style={{ color: "var(--primaryColor)" }}>
                    {Users.data.reduce(
                      (acc, curr) => acc + curr.can_read_article,
                      0
                    )}
                  </strong>
                </span>
              ),
              Cell: props => {
                const userId = props.original.id;
                const permission = props.value;
                return (
                  <Checkbox
                    checked={permission}
                    onClick={e =>
                      updateUserProfile(userId, User.token, {
                        can_read_article: !permission
                      })
                    }
                  />
                );
              }
            },
            {
              Header: "Newsletters",
              accessor: "can_read_newsletter",
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {
                  keys: [filter.id]
                }),
              filterAll: true,
              maxWidth: 100,
              Footer: Users => (
                <span>
                  <i className="far fa-eye" />{" "}
                  <strong style={{ color: "var(--primaryColor)" }}>
                    {Users.data.reduce(
                      (acc, curr) => acc + curr.can_read_newsletter,
                      0
                    )}
                  </strong>
                </span>
              ),
              Cell: props => {
                const userId = props.original.id;
                const permission = props.value;
                return (
                  <Checkbox
                    checked={permission}
                    onClick={e =>
                      updateUserProfile(userId, User.token, {
                        can_read_newsletter: !permission
                      })
                    }
                  />
                );
              }
            },
            {
              Header: "Events",
              accessor: "can_read_calendar_event",
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {
                  keys: [filter.id]
                }),
              filterAll: true,
              maxWidth: 75,
              Footer: Users => (
                <span>
                  <i className="far fa-eye" />{" "}
                  <strong style={{ color: "var(--primaryColor)" }}>
                    {Users.data.reduce(
                      (acc, curr) => acc + curr.can_read_calendar_event,
                      0
                    )}
                  </strong>
                </span>
              ),
              Cell: props => {
                const userId = props.original.id;
                const permission = props.value;
                return (
                  <Checkbox
                    checked={permission}
                    onClick={e =>
                      updateUserProfile(userId, User.token, {
                        can_read_calendar_event: !permission
                      })
                    }
                  />
                );
              }
            }
          ]
        },
        {
          Header: <i className="fa fa-pencil-alt"> UPDATE</i>,
          columns: [
            {
              Header: "Articles",
              accessor: "can_update_article",
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {
                  keys: [filter.id]
                }),
              filterAll: true,
              maxWidth: 75,
              Footer: Users => (
                <span>
                  <i className="fa fa-pencil-alt" />{" "}
                  <strong style={{ color: "var(--primaryColor)" }}>
                    {Users.data.reduce(
                      (acc, curr) => acc + curr.can_update_article,
                      0
                    )}
                  </strong>
                </span>
              ),
              Cell: props => {
                const userId = props.original.id;
                const permission = props.value;
                return (
                  <Checkbox
                    checked={permission}
                    onClick={e =>
                      updateUserProfile(userId, User.token, {
                        can_update_article: !permission
                      })
                    }
                  />
                );
              }
            },
            {
              Header: "Newsletters",
              accessor: "can_update_newsletter",
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {
                  keys: [filter.id]
                }),
              filterAll: true,
              maxWidth: 100,
              Footer: Users => (
                <span>
                  <i className="fa fa-pencil-alt" />{" "}
                  <strong style={{ color: "var(--primaryColor)" }}>
                    {Users.data.reduce(
                      (acc, curr) => acc + curr.can_update_newsletter,
                      0
                    )}
                  </strong>
                </span>
              ),
              Cell: props => {
                const userId = props.original.id;
                const permission = props.value;
                return (
                  <Checkbox
                    checked={permission}
                    onClick={e =>
                      updateUserProfile(userId, User.token, {
                        can_update_newsletter: !permission
                      })
                    }
                  />
                );
              }
            },
            {
              Header: "Events",
              accessor: "can_update_calendar_event",
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {
                  keys: [filter.id]
                }),
              filterAll: true,
              maxWidth: 75,
              Footer: Users => (
                <span>
                  <i className="fa fa-pencil-alt" />{" "}
                  <strong style={{ color: "var(--primaryColor)" }}>
                    {Users.data.reduce(
                      (acc, curr) => acc + curr.can_update_calendar_event,
                      0
                    )}
                  </strong>
                </span>
              ),
              Cell: props => {
                const userId = props.original.id;
                const permission = props.value;
                return (
                  <Checkbox
                    checked={permission}
                    onClick={e =>
                      updateUserProfile(userId, User.token, {
                        can_update_calendar_event: !permission
                      })
                    }
                  />
                );
              }
            }
          ]
        },
        {
          Header: <i className="fas fa-trash"> DELETE</i>,
          columns: [
            {
              Header: "Articles",
              accessor: "can_delete_article",
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {
                  keys: [filter.id]
                }),
              filterAll: true,
              maxWidth: 75,
              Footer: Users => (
                <span>
                  <i className="fas fa-trash" />{" "}
                  <strong style={{ color: "var(--primaryColor)" }}>
                    {Users.data.reduce(
                      (acc, curr) => acc + curr.can_delete_article,
                      0
                    )}
                  </strong>
                </span>
              ),
              Cell: props => {
                const userId = props.original.id;
                const permission = props.value;
                return (
                  <Checkbox
                    checked={permission}
                    onClick={e =>
                      updateUserProfile(userId, User.token, {
                        can_delete_article: !permission
                      })
                    }
                  />
                );
              }
            },
            {
              Header: "Newsletters",
              accessor: "can_delete_newsletter",
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {
                  keys: [filter.id]
                }),
              filterAll: true,
              maxWidth: 100,
              Footer: Users => (
                <span>
                  <i className="fas fa-trash" />{" "}
                  <strong style={{ color: "var(--primaryColor)" }}>
                    {Users.data.reduce(
                      (acc, curr) => acc + curr.can_delete_newsletter,
                      0
                    )}
                  </strong>
                </span>
              ),
              Cell: props => {
                const userId = props.original.id;
                const permission = props.value;
                return (
                  <Checkbox
                    checked={permission}
                    onClick={e =>
                      updateUserProfile(userId, User.token, {
                        can_delete_newsletter: !permission
                      })
                    }
                  />
                );
              }
            },
            {
              Header: "Events",
              accessor: "can_delete_calendar_event",
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {
                  keys: [filter.id]
                }),
              filterAll: true,
              maxWidth: 75,
              Footer: Users => (
                <span>
                  <i className="fas fa-trash" />{" "}
                  <strong style={{ color: "var(--primaryColor)" }}>
                    {Users.data.reduce(
                      (acc, curr) => acc + curr.can_delete_calendar_event,
                      0
                    )}
                  </strong>
                </span>
              ),
              Cell: props => {
                const userId = props.original.id;
                const permission = props.value;
                return (
                  <Checkbox
                    checked={permission}
                    onClick={e =>
                      updateUserProfile(userId, User.token, {
                        can_delete_calendar_event: !permission
                      })
                    }
                  />
                );
              }
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
