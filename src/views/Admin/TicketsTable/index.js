import React from "react";
import ReactTable from "react-table";
import matchSorter from "match-sorter";
import { Button, Image, Checkbox } from "react-bootstrap";
import { Link } from "react-router-dom";
import { circleColor } from "../../../helpers";
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
          Header: <i className="fas fa-ticket-alt" />,
          columns: [
            {
              Header: <i className="far fa-eye" />,
              accessor: "id",
              filterable: false,
              maxWidth: 48,
              Cell: props => (
                <Button
                  bsSize="small"
                  onClick={e =>
                    history.push(`/admin/view/ticket/${props.value}`)
                  }
                >
                  <i className="far fa-eye" />
                </Button>
              )
            }
          ]
        },
        {
          Header: <i className="fas fa-user-shield"> USERS INFO</i>,
          columns: onAdmin ? AdminUserInfoColumns : UserInfoColumns
        },
        {
          Header: <i className="fas fa-info-circle"> DETAILS</i>,
          columns: onAdmin ? AdminDetailsColumns : UserDetailsColumns
        }
      ]}
      filterable
      // defaultFilterMethod={(filter, row) => String(row[filter.id]) === filter.value)}
      showFilters
      showPageSizeOptions
      showPaginationBottom
      showPageJump
      defaultSorted={[
        { id: "priority", desc: true },
        { id: "status", desc: false }
      ]}
      defaultPageSize={Window.isMobile ? 10 : 15}
      pageSizeOptions={[5, 10, 15, 20, 50, 100]}
      multiSort={true}
      previousText={<i className="fas fa-arrow-left" />}
      nextText={<i className="fas fa-arrow-right" />}
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
    accessor: "offender_username",
    filterable: true,
    Cell: props => (
      <Link to={`/admin/edit/user/${props.original.offender}`}>
        {props.value}
      </Link>
    ),
    Footer: Tickets => (
      <span>
        <i className="fas fa-check" />{" "}
        <strong style={{ color: "var(--primaryColor)" }}>
          {Tickets.data.reduce(
            (acc, curr) => acc + (curr.offender_username ? 1 : 0),
            0
          )}
        </strong>
      </span>
    )
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
    )
  },
  {
    Header: "Priority",
    accessor: "priority",
    filterMethod: (filter, rows) =>
      matchSorter(rows, filter.value, {
        keys: [filter.id]
      }),
    filterAll: true,
    Footer: Tickets => (
      <span>
        <i className="fas fa-unlock" />{" "}
        <strong style={{ color: "var(--primaryColor)" }}>
          {Tickets.data.reduce(
            (acc, curr) => (acc + curr.priority > 2 ? 1 : 0),
            0
          )}
        </strong>
      </span>
    )
  },
  {
    Header: "Status",
    accessor: "status",
    filterMethod: (filter, rows) =>
      matchSorter(rows, filter.value, {
        keys: [filter.id]
      }),
    filterAll: true,
    Cell: props => (
      <div>
        <i
          className="fas fa-circle"
          style={{ color: circleColor(props.value) }}
        />
        {` ${props.value}`}
      </div>
    ),
    Footer: Tickets => (
      <span>
        <i className="fas fa-unlock" />{" "}
        <strong style={{ color: "var(--primaryColor)" }}>
          {Tickets.data.reduce(
            (acc, curr) => acc + (curr.status == "Open" ? 1 : 0),
            0
          )}
        </strong>
      </span>
    )
  }
];

const UserDetailsColumns = AdminDetailsColumns.filter(
  c => c.Header != "Priority"
);

export default TicketTable;
