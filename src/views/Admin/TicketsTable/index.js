import React from "react";
import ReactTable from "react-table";
import matchSorter from "match-sorter";
import { Button, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import {
  arrayToObject,
  statusLevelInt,
  statusLevelString
} from "../../../helpers";
import "./styles.css";

const TicketTable = (Tickets, history) => {

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
          columns: [
            {
              Header: "Author",
              accessor: "author_username",
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {
                  keys: [filter.id]
                }),
              filterAll: true,
              maxWidth: 125,
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
                      (acc, curr) => (acc + curr.offender ? 1 : 0),
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
          ]
        },
        {
          Header: <i className="fas fa-info-circle"> DETAILS</i>,
          columns: [
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
                      (acc, curr) => acc + curr.priority > 2,
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
              Footer: Tickets => (
                <span>
                  <i className="fas fa-unlock" />{" "}
                  <strong style={{ color: "var(--primaryColor)" }}>
                    {Tickets.data.reduce(
                      (acc, curr) => acc + curr.status == "Open",
                      0
                    )}
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
      defaultSorted={[{ id: "priority", desc: true }]}
      defaultPageSize={Window.isMobile ? 10 : 15}
      pageSizeOptions={[5, 10, 15, 20, 50, 100]}
      multiSort={true}
      previousText={<i className="fas fa-arrow-left" />}
      nextText={<i className="fas fa-arrow-right" />}
    />
  );
};

export default TicketTable;
