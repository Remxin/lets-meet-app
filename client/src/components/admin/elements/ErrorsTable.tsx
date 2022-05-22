import React from "react";
import { Table, Collapse, Text } from "@nextui-org/react";
import adminHelper from "../../../helpers/adminData";

const ErrorsTable = () => {
  return (
    <div>
      <Collapse.Group>
        <Collapse title="Server errors">
          <Table
            aria-label="Example table with static content"
            css={{
              height: "auto",
              minWidth: "100%",
            }}
          >
            <Table.Header>
              <Table.Column>TYPE</Table.Column>
              <Table.Column>COUNT</Table.Column>
              <Table.Column>STATUS</Table.Column>
            </Table.Header>
            <Table.Body>
              {/* TODO: tutaj dodać prawdziwe dane, zamiast fakowych*/}
              <Table.Row key="1">
                <Table.Cell>Email errors</Table.Cell>
                <Table.Cell>0</Table.Cell>
                <Table.Cell css={{ color: adminHelper.colorStatus("Great") }}>
                  Great
                </Table.Cell>
              </Table.Row>
              <Table.Row key="2">
                <Table.Cell>Filesystem errors</Table.Cell>
                <Table.Cell>2</Table.Cell>
                <Table.Cell css={{ color: adminHelper.colorStatus("Normal") }}>
                  Normal
                </Table.Cell>
              </Table.Row>
              <Table.Row key="3">
                <Table.Cell>Security errors</Table.Cell>
                <Table.Cell>4</Table.Cell>
                <Table.Cell css={{ color: adminHelper.colorStatus("Bad") }}>
                  Bad
                </Table.Cell>
              </Table.Row>
              <Table.Row key="4">
                <Table.Cell>Apollo server errors</Table.Cell>
                <Table.Cell>1</Table.Cell>
                <Table.Cell css={{ color: adminHelper.colorStatus("Normal") }}>
                  Normal
                </Table.Cell>
              </Table.Row>
              <Table.Row key="5">
                <Table.Cell>Socket io errors</Table.Cell>
                <Table.Cell>1</Table.Cell>
                <Table.Cell css={{ color: adminHelper.colorStatus("Normal") }}>
                  Normal
                </Table.Cell>
              </Table.Row>
              <Table.Row key="6">
                <Table.Cell>Other errors</Table.Cell>
                <Table.Cell>8</Table.Cell>
                <Table.Cell css={{ color: adminHelper.colorStatus("Fatal") }}>
                  Fatal
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Collapse>
        <Collapse title="User reported errors">
          <Table
            aria-label="Example table with static content"
            css={{
              height: "auto",
              minWidth: "100%",
            }}
          >
            <Table.Header>
              <Table.Column>TYPE</Table.Column>
              <Table.Column>COUNT</Table.Column>
              <Table.Column>STATUS</Table.Column>
            </Table.Header>
            <Table.Body>
              {/* TODO: tutaj dodać prawdziwe dane, zamiast fakowych*/}
              <Table.Row key="1">
                <Table.Cell>Server response errors</Table.Cell>
                <Table.Cell>0</Table.Cell>
                <Table.Cell css={{ color: adminHelper.colorStatus("Great") }}>
                  Great
                </Table.Cell>
              </Table.Row>
              <Table.Row key="2">
                <Table.Cell>Graphical errors</Table.Cell>
                <Table.Cell>2</Table.Cell>
                <Table.Cell css={{ color: adminHelper.colorStatus("Normal") }}>
                  Normal
                </Table.Cell>
              </Table.Row>
              <Table.Row key="3">
                <Table.Cell>Security errors</Table.Cell>
                <Table.Cell>4</Table.Cell>
                <Table.Cell css={{ color: adminHelper.colorStatus("Bad") }}>
                  Bad
                </Table.Cell>
              </Table.Row>
              <Table.Row key="4">
                <Table.Cell>Alert errors</Table.Cell>
                <Table.Cell>1</Table.Cell>
                <Table.Cell css={{ color: adminHelper.colorStatus("Normal") }}>
                  Normal
                </Table.Cell>
              </Table.Row>
              <Table.Row key="5">
                <Table.Cell>Email errors</Table.Cell>
                <Table.Cell>1</Table.Cell>
                <Table.Cell css={{ color: adminHelper.colorStatus("Normal") }}>
                  Normal
                </Table.Cell>
              </Table.Row>
              <Table.Row key="6">
                <Table.Cell>Other errors</Table.Cell>
                <Table.Cell>8</Table.Cell>
                <Table.Cell css={{ color: adminHelper.colorStatus("Fatal") }}>
                  Fatal
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Collapse>
      </Collapse.Group>
    </div>
  );
};

export default ErrorsTable;
