import React, {useState} from 'react';
import {useDrag, useDrop} from 'react-dnd';
import {Button, IconButton, TableCell, TableRow, TextField} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const ItemType = 'Table_Row';
const DragableRow = ({index, row, columns, handleEditRow, handleMoveRow, handleToggleEditRow}) => {
  const [,ref] = useDrag({
    type: ItemType,
    item: {index}
  })

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if(draggedItem.index !== index) {
        handleMoveRow(draggedItem.index, index);
        draggedItem.index = index
      }
    }
  })

  const [cellStates, setCellStates] = useState(columns.reduce((acc, col)=>({...acc, [col] : row[col]}), {}))
  const handleToggleEdit = () => {
    handleToggleEditRow(index)
  }

  const handleSaveRow = () => {
    Object.entries(cellStates).forEach(([col, value]) => {
      handleEditRow(index, col, value);
    });
    handleToggleEditRow(index);
  }

  const handleCancelEdit = () => {
    setCellStates(columns.reduce((acc, col) => ( {...acc, [col]: row[col] }) , {}));
    handleToggleEditRow(index)
  }



  return (
    <TableRow ref={(node) => ref(drop(node))}>
      {columns.map((col, idx) =>(
      <TableCell key={idx}>
        {row.editable ? (
          <TextField
            value={cellStates[col]}
            onChange = {(e) => setCellStates({...cellStates, [col]: e.target.value})}
          />
        ) : (
            row[col]
          )
        }
      </TableCell>
      ))}
      <TableCell>

        {row.editable ?
            (
          <>
          <Button onClick={handleSaveRow}>Save</Button>
          <Button onClick={handleCancelEdit}>Cancel</Button>
          </>
          ) : (
            <IconButton onClick={handleToggleEdit} area-label='Edit'>
              <EditIcon />
            </IconButton>
          )}
      </TableCell>
    </TableRow>

  );
};

export default DragableRow;