import React from "react";
import ReactTable from "react-table";
import matchSorter from "match-sorter";
import { Button, Image, Checkbox } from "react-bootstrap";
import { Link } from "react-router-dom";
import { circleColor, TopKFrequentStrings } from "../../../helpers";
import Moment from "react-moment";
import "./styles.css";

const TicketTable = (Tickets, history, pathname) => {
  const onAdmin = pathname.includes("admin");
  return (
    <ReactTable
      className="TicketTable"
      loading={!Tickets}
      data={Tickets}
      columns={[
        {
          Header: <i className="fas fa-ticket-alt"> STATUS</i>,
          columns: [
            {
              Header: "Status",
              accessor: "status",
              minWidth: 120,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {
                  keys: [filter.id]
                }),
              filterAll: true,
              Cell: props => (
                <div
                  className="TicketStatusCell"
                  onClick={e =>
                    history.push(`/admin/view/ticket/${props.original.id}`)
                  }
                >
                  <i
                    className="fas fa-circle"
                    style={{ color: circleColor(props.value) }}
                  />
                  {` ${props.value}`}
                </div>
              ),
              Footer: Tickets => {
                return (
                  <div>
                    <i
                      className="fas fa-circle"
                      style={{ color: circleColor("Open") }}
                    />{" "}
                    <strong style={{ color: "var(--primaryColor)" }}>
                      {Tickets.data.reduce(
                        (acc, curr) => acc + (curr.status == "Open" ? 1 : 0),
                        0
                      )}
                    </strong>
                  </div>
                );
              }
            }
          ]
        },
        {
          Header: <i className="fas fa-info-circle"> DETAILS</i>,
          columns: onAdmin ? AdminDetailsColumns : UserDetailsColumns
        },
        {
          Header: <i className="fas fa-user-shield"> USERS INFO</i>,
          columns: onAdmin ? AdminUserInfoColumns : UserInfoColumns
        },
        AcvtivityColumns
      ]}
      filterable
      // defaultFilterMethod={(filter, row) => String(row[filter.id]) == filter.value)}
      showFilters
      showPageSizeOptions
      showPaginationBottom
      showPageJump
      defaultSorted={[
        { id: "status", desc: false },
        { id: "priority", desc: true }
      ]}
      defaultPageSize={Window.isMobile ? 10 : 15}
      pageSizeOptions={[5, 10, 15, 20, 50, 100]}
      multiSort={true}
      previousText={<i className="fas fa-arrow-left" />}
      nextText={<i className="fas fa-arrow-right" />}
      // getTrProps={(state, rowInfo, column, instance) => {
      //   console.log(state);
      //   return {
      //     onClick: e =>
      //       history.push(`/admin/view/ticket/${rowInfo.original.id}`),
      //     style: {
      //       background: rowInfo && rowInfo.row.selected ? "green" : "red"
      //       background:
      //         rowInfo.index == this.state.selected ? "#00afec" : "white",
      //       color: rowInfo.index == this.state.selected ? "white" : "black"
      //     }
      //   };
      // }}
    />
  );
};

const AdminUserInfoColumns = [
  {
    Header: "Author",
    accessor: "author_username",
    filterMethod: (filter, rows) =>
      matchSorter(rows, filter.value, {
        keys: [filter.id]
      }),
    filterAll: true,
    Cell: props => (
      <Link to={`/admin/edit/user/${props.original.author}`}>
        {props.value}
      </Link>
    )
  },
  {
    Header: "Offender",
    id: "offenders",
    accessor: Tickets => Tickets.offenders,
    filterable: true,
    Cell: props => props.value,
    // return (
    //   <Link to={`/admin/edit/user/${props.original.offenders}`}>
    //     {props.value}
    //   </Link>
    // )
    Footer: Offenders => {
      const User = TopKFrequentStrings(Offenders.data, "offenders", 1);
      return (
        <div>
          <i className="fas fa-skull-crossbones" />
          <strong style={{ color: "var(--primaryColor)" }}>{` ${User}`}</strong>
          <strong
            className="pull-right"
            style={{ color: "var(--primaryColor)", marginLeft: 4 }}
          >
            {Offenders.data.reduce(
              (acc, curr) => acc + (curr.offender_username ? 1 : 0),
              0
            )}
          </strong>
          <i className="fas fa-user-secret pull-right" />
        </div>
      );
    }
  },
  {
    Header: "Corroborators",
    accessor: "corroborators",
    filterable: true,
    Cell: Corroborator => Corroborator.value,
    Footer: Corroborators => {
      const User = TopKFrequentStrings(Corroborators.data, "corroborators", 1);
      return (
        <div>
          <i className="fas fa-skull-crossbones" />
          <strong style={{ color: "var(--primaryColor)" }}>{` ${User}`}</strong>
          <strong
            className="pull-right"
            style={{ color: "var(--primaryColor)", marginLeft: 4 }}
          >
            {Corroborators.data.reduce(
              (acc, curr) => acc + (curr.offender_username ? 1 : 0),
              0
            )}
          </strong>
          <i className="fas fa-user-secret pull-right" />
        </div>
      );
    }
  },
  {
    Header: "Others",
    accessor: "others_involved",
    filterable: true,
    Cell: others => others.value,
    Footer: Others => {
      const User = TopKFrequentStrings(Others.data, "others_involved", 1);
      return (
        <div>
          <i className="fas fa-skull-crossbones" />
          <strong style={{ color: "var(--primaryColor)" }}>{` ${User}`}</strong>
          <strong
            className="pull-right"
            style={{ color: "var(--primaryColor)", marginLeft: 4 }}
          >
            {Others.data.reduce(
              (acc, curr) => acc + (curr.offender_username ? 1 : 0),
              0
            )}
          </strong>
          <i className="fas fa-user-secret pull-right" />
        </div>
      );
    }
  },
  {
    Header: "Description",
    accessor: "description",
    filterMethod: (filter, rows) =>
      matchSorter(rows, filter.value, {
        keys: [filter.id]
      }),
    filterAll: true
  }
];

const UserInfoColumns = AdminUserInfoColumns.slice(1);

const AdminDetailsColumns = [
  {
    Header: "Priority",
    accessor: "priority",
    filterMethod: (filter, rows) =>
      matchSorter(rows, filter.value, {
        keys: [filter.id]
      }),
    filterAll: true,
    Footer: Tickets => (
      <div>
        <i className="fas fa-exclamation" />{" "}
        <strong style={{ color: "var(--primaryColor)" }}>
          {Tickets.data.reduce(
            (acc, curr) => (acc + curr.priority > 2 ? 1 : 0),
            0
          )}
        </strong>
      </div>
    )
  },
  {
    Header: "Type",
    accessor: "ticket_type",
    filterMethod: (filter, rows) =>
      matchSorter(rows, filter.value, {
        keys: [filter.id]
      }),
    filterAll: true
  },
  {
    Header: "Image",
    accessor: "image",
    filterMethod: (filter, rows) =>
      matchSorter(rows, filter.value, {
        keys: [filter.id]
      }),
    filterAll: true,
    Cell: props => (
      <div className="Center">
        <Image height={50} src={props.value} />
      </div>
    ),
    Footer: Tickets => (
      <div>
        <i className="fas fa-images" />{" "}
        <strong style={{ color: "var(--primaryColor)" }}>
          {Tickets.data.reduce((acc, curr) => (acc + curr.image ? 1 : 0), 0)}
        </strong>
      </div>
    )
  }
];

const UserDetailsColumns = AdminDetailsColumns.filter(
  c => c.Header != "Priority"
);

const AcvtivityColumns = {
  Header: <i className="fas fa-hiking"> ACTIVITY</i>,
  columns: [
    {
      Header: "Created",
      accessor: "date_created",
      Cell: props => <Moment fromNow>{props.value}</Moment>,
      filterMethod: (filter, rows) =>
        matchSorter(rows, filter.value, {
          keys: [filter.id]
        }),
      filterAll: true
    },
    {
      Header: "Notes",
      accessor: "notes",
      filterMethod: (filter, rows) =>
        matchSorter(rows, filter.value, {
          keys: [filter.id]
        }),
      filterAll: true,
      Footer: Tickets => (
        <div>
          <i className="fas fa-sticky-note" />{" "}
          <strong style={{ color: "var(--primaryColor)" }}>
            {Tickets.data.reduce((acc, curr) => (acc + curr.notes ? 1 : 0), 0)}
          </strong>
        </div>
      )
    }
  ]
};

export default TicketTable;
