import React, { useEffect, useState, useCallback } from "react";

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import { IObjectRecord, objectService } from "../../services/ObjectService";
import { IUpdateObjectInput } from "../../utils/interfaces";
import { updateObject } from "../../utils/updateObject";
import { EConfirmDialogType, ConfirmDialog } from "../ConfirmDialog/ConfirmDialog";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import { JsonOutput } from "../JsonOutput/JsonOutput";

interface Column {
  id: 'id' | 'data';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'id', label: 'ID', minWidth: 170 },
  { id: 'data', label: 'JSON', minWidth: 170 },
];

// define a React component that takes no props and renders a table of objects and an input field to edit them
export const ObjectTable = () => {
  // use state to store the objects, the selected object, and the input value
  const [objects, setObjects] = useState<IObjectRecord[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

    // handler function for changing the page number
    const handleChangePage = useCallback((event: unknown, newPage: number) => {
      setPage(newPage);
    }, []);
  
    // handler function for changing the number of rows per page
    const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    }, []);
  
    // use effect to load all objects using ObjectService when the component mounts
    useEffect(() => {
      const fetchData = async () => {
        // call the loadAll method of objectService and set the objects state
        const allObjects = await objectService.loadAll();
        setObjects(allObjects);
      };
  
      fetchData();
    }, []);

    // define a handler function that calls the updateObject function with the input value and updates the selected object state
    const handleUpdate = useCallback((object: IObjectRecord, inputValue: IUpdateObjectInput) => {
      try {
        // find the index of the object in the objects array
        const objectIndex = objects.indexOf(object);
  
        // call the updateObject function with the object data and the input value and get the updated object
        const updatedObject = updateObject(object.data, inputValue);
        // create a shallow copy of the objects array and update the object at the index with the updated object
        const updatedObjects = [...objects];
        updatedObjects[objectIndex].data = updatedObject;
  
        // set the objects state with the updated objects array
        setObjects(updatedObjects)

        // update data in database
        objectService.save(object.id, updatedObject);
  
      } catch (error) {
        if (error instanceof Error) {
          // handle any parsing or updating errors
          alert(error.message);
        }
      }
    }, [objects]);
  
    // define a handler function that creates a new object with the given id and adds it to the objects array
    const handleAdd = useCallback((id: string) => {
      // create a new object with the given id and a default data value
      const newObject: IObjectRecord = {
        id,
        data: { key: "value" }
      };
  
      // create a shallow copy of the objects array and append the new object
      setObjects([...objects, newObject]);

      // update data in database
      objectService.save(id, newObject);
    }, [objects]);
  
    // define a handler function that removes an object from the objects array
    const handleDelete = useCallback((object: IObjectRecord) => {
        // create a shallow copy of the objects array and filter out the object to delete
        const updatedObjects = objects.filter(obj => obj !== object);
  
        // set the objects state with the updated objects array
        setObjects(updatedObjects)

      // delete data from database
      objectService.delete(object.id);
    }, [objects]);


  // Try to render the component and catch any errors
  try {
    return (
      <Container>
        <Paper elevation={3} sx={{ m: 1, p: 2 }}>
          <h1>Object Table Component</h1>
          <div>
            <Alert severity="info">
              <Typography variant="body1">
                <p>You can edit the entries in the table by inputting JSON values in the following format:</p> 
                <ul> 
                  <li>To edit a normal object, use the key of the object. For example, to change the name of an object, use <code>{`{name: “New name”}`}</code>.</li> 
                  <li>To edit a nested object, use the dot notation to specify the path. For example, to change the subpath of an object, use <code>{`{“root.path.subpath”: “New value”}`}</code>.</li> 
                  <li>To edit an array, use the key of the array or append <code>[ ]</code> to the key. For example, to change the skills of an object, use <code>{`{skills: [“New skill”]}`}</code> or <code>{`{“skills[]”: “New skill”}`}</code>.</li> 
                  <li>To edit a specific element of an array, use the _id of the element inside <code>[ ]</code>. For example, to change the name of a skill, use <code>{`{“skills[a]”: {name: “New name”}}`}</code>.</li> 
                  <li>To add a new element to an array, use an empty <code>[ ]</code> after the key. For example, to add a new skill, use <code>{`{“skills[]”: {_id: “c”, name: “C++”}}`}</code>.</li> 
                  <li>To remove an element from an array or an object, use null as the value. For example, to remove a skill, use <code>{`{“skills[a]”: null}`}</code> or <code>{`{skills: null}`}</code>.</li> 
                  <li>If the path you specify does not exist, it will be created as an object or an array depending on your input.</li> 
                </ul> 
              </Typography>
            </Alert>
        </div>
        </Paper>
        <Paper elevation={3} sx={{ m: 1, p: 2 }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
                  <TableCell
                    key={"actions"}
                  >
                    Actions
                  </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {objects
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow hover tabIndex={-1} key={row.id}>
                      {columns.map((column) => {
                        if (column.id === "id") {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {row[column.id]}
                            </TableCell>
                          );
                        }

                        return (
                          <TableCell key={column.id} align={column.align}>
                            <JsonOutput jsonValue={row[column.id]} />
                          </TableCell>
                        );
                      })}
                    <TableCell key={"actions"}>
                    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                      <ConfirmDialog 
                        type={EConfirmDialogType.JSON_INPUT}
                        button={{
                          label: "Edit",
                          icon: "edit",
                          size: "small"
                        }}
                        dialogTitle="Edit Existing Object"
                        dialogText="
                          Enter the JSON values you want to update in the text box below. 
                          You can use keys, dot notation, brackets and null to edit objects, nested objects and arrays. 
                          See the examples for more details."
                        cancelButtonLabel="Cancel"
                        confirmButtonLabel="Save"
                        placeholder="JSON"
                        value={row.data}
                        onConfirm={(jsonObject) => handleUpdate(row, jsonObject as IUpdateObjectInput)} 
                      />
                      <Box sx={{m: 1}} />
                      <ConfirmDialog 
                        button={{
                          label: "Delete",
                          color: "error",
                          icon: "delete",
                          size: "small"
                        }}
                        dialogTitle="Are you sure?"
                        dialogText="Please be careful, once you delete an object, you cannot restore it."
                        cancelButtonLabel="Cancel"
                        confirmButtonLabel="Delete"
                        onConfirm={() => handleDelete(row)}
                      />
                    </Box>
                    </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={objects.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <ConfirmDialog
          type={EConfirmDialogType.TEXT_INPUT}
          button={{
            label: "Add new object",
            size: "large",
          }}
          placeholder="ID"
          dialogTitle="Add a new object"
          dialogText=""
          cancelButtonLabel="Cancel"
          confirmButtonLabel="Add"
          onConfirm={(input) => handleAdd(input as string)} 
        />
      </Paper>
      </Container>
    );
  } catch (error) {
    // Log the error and return a fallback UI
    console.error(error);
    return <div>Something went wrong. Please try again later.</div>;
  }
};
