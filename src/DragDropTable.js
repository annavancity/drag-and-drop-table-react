import React, { useState } from "react";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import DragableRow from "./DragableRow";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const DragDropTable = () => {
  const initialColumns = ["Row Name", "Data"];
  const initialData = [
    { "Row Name": "Row 1", Data: "Data 1", editable: false },
    { "Row Name": "Row 2", Data: "Data 2", editable: false },
    { "Row Name": "Row 3", Data: "Data 3", editable: false },
  ];
  const [columns, setColumns] = useState(initialColumns);
  const [tableData, setTableData] = useState(initialData);
  const [newRow, setNewRow] = useState({});
  const [showAddRowForms, setShowAddRowForms] = useState(false);
  const [newColumn, setNewColumn] = useState("");
  const [showColumnInputs, setShowColumnInputs] = useState(false);

  //checkbox

  const handleCheckboxChange = (event) => {
    const columnName = event.target.name;
    if (event.target.checked) {
      setColumns([...columns, columnName]);
    } else {
      setColumns(columns.filter((col) => col !== columnName));
    }
  };

  const handleNewColumnChange = (event) => {
    setNewColumn(event.target.value);
  };

  const handleAddColumn = () => {
    if (newColumn.trim() !== "") {
      setColumns([...columns, newColumn]);
      setNewColumn("");
    }
  };

  const handleNewRowChange = (event) => {
    setNewRow({ ...newRow, [event.target.name]: event.target.value });
  };

  const handleAddRow = () => {
    setTableData([...tableData, { ...newRow, editable: false }]);
    setNewRow({});
    setShowAddRowForms(false);
  };

  const handleEditRow = (index, col, value) => {
    const newData = [...tableData];
    newData[index][col] = value;
    setTableData(newData);
  };

  //drag and drop function
  const handleMoveRow = (fromIndex, toIndex) => {
    const newData = [...tableData];
    newData.splice(toIndex, 0, newData.splice(fromIndex, 1)[0]);
    setTableData(newData);
  };

  const handleToggleEditRow = (index) => {
    if (tableData[index].editable) {
      const newData = [...tableData];
      newData[index].editable = false;
      setTableData(newData);
    } else {
      const newData = tableData.map((row, i) =>
        i === index ? { ...row, editable: true } : row
      );
      setTableData(newData);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <Button onClick={() => setShowColumnInputs(!showColumnInputs)}>
          Add Column
        </Button>
        {showColumnInputs && (
          <div>
            <TextField
              label="New Column"
              value={newColumn}
              onChange={handleNewColumnChange}
            />
            <Button onClick={handleAddColumn}>Add</Button>
            <div>
              {columns.map((col, idx) => (
                <FormControlLabel
                  key={idx}
                  control={
                    <Checkbox
                      checked={columns.includes(col)}
                      onChange={handleCheckboxChange}
                      name={col}
                    />
                  }
                  label={col}
                />
              ))}
            </div>
          </div>
        )}
        <Button onClick={() => setShowAddRowForms(!showAddRowForms)}>
          Add Row
        </Button>
        {showAddRowForms && (
          <div>
            {columns.map((col, idx) => (
              <TextField
                key={idx}
                label={col}
                name={col}
                value={newRow[col] || ""}
                onChange={handleNewRowChange}
              />
            ))}
            <Button onClick={handleAddRow}>Add Row</Button>
          </div>
        )}
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col, idx) => (
                <TableCell key={idx}>{col}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, index) => (
              <DragableRow
                key={index}
                row={row}
                index={index}
                columns={columns}
                handleEditRow={handleEditRow}
                handleMoveRow={handleMoveRow}
                handleToggleEditRow={handleToggleEditRow}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </DndProvider>
  );
};

export default DragDropTable;
