import React from "react";
import Auth from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import { getUserId } from "../utils/getUserId";

import FullCalendarApp from "../components/Calendar/FullCalendarApp";
import WorkOrder from "../components/AdminPortal/Schedule";
import ClientList from "../components/AdminPortal/Clients";
import Employees from "../components/AdminPortal/Employees(Admin)";

import { Button, Container, Col, Row } from "react-bootstrap/";
import "../styles/spinner.css";

const AdminPortal = ({
  renderPanel,
  workOrderButtonIsActive,
  employeeListButtonIsActive,
  clientListButtonIsActive,
}) => {
  // get user info to render to page
  const userId = getUserId();
  const { loading, data } = useQuery(QUERY_ME, {
    variables: { id: userId },
    // if skip is true, this query will not be executed; in this instance, if the user is not logged in this query will be skipped when the component mounts
    skip: !Auth.loggedIn(),
  });

  let navigate = useNavigate();

  if (loading) {
    return (
      <div
        style={{ minHeight: "80vh", width: "100vw" }}
        className="d-flex justify-content-center align-items-center align-content-center mt-5"
      >
        <div className="lds-hourglass"></div>
      </div>
    );
  } else {
    return (
      <>
        <Container style={{ marginTop: "25px" }}>
          <Row className="justify-content-center">
            <p style={{ fontSize: "30px", marginTop: "20px" }}>
              <b>Administrator Panel</b>
            </p>
          </Row>
        </Container>

        <Container className="mb-1">
          <Row>
            <Col>
              <div className="d-flex flex-row mb-1 p-0 border border-secondary rounded-lg">
                <Button
                  variant="outline-primary"
                  style={workOrderButtonIsActive ? isActive : notActive}
                  active={workOrderButtonIsActive}
                  onClick={() => {
                    navigate("/work-order");
                  }}
                >
                  Jobs
                </Button>

                <Button
                  variant="outline-primary"
                  style={employeeListButtonIsActive ? isActive : notActive}
                  active={employeeListButtonIsActive}
                  onClick={() => {
                    navigate("/employees");
                  }}
                >
                  Employees
                </Button>
                <Button
                  variant="outline-primary"
                  style={clientListButtonIsActive ? isActive : notActive}
                  active={clientListButtonIsActive}
                  onClick={() => {
                    navigate("/clientlist");
                  }}
                >
                  Clients
                </Button>
              </div>

              {renderPanel === "calendar" ? (
                <FullCalendarApp />
              ) : renderPanel === "workorder" ? (
                <WorkOrder />
              ) : renderPanel === "employees" ? (
                <Employees />
              ) : (
                <ClientList />
              )}
            </Col>
          </Row>
        </Container>
      </>
    );
  }
};

export default AdminPortal;

const isActive = {
  flex: "auto",
  border: "solid 3px black",
  borderRadius: "3px",
};

const notActive = {
  flex: "auto",
  border: "none",
  borderRadius: "0",
  outline: "none",
  boxShadow: "none",
};
