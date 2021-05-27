import React, { FunctionComponent } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';

import {
  makeStyles,
  lighten,
  Theme
} from '@material-ui/core/styles';

import cx from 'clsx';

import IconButton from '../../../common/components/forms/IconButton';

const TableList: FunctionComponent<TableListProps> = ({
  keyField,
  columns,
  rows,
  tableRowFormat,
  toolbarProps,
  selected,
  handleRowsSelected,
  disabled
}) => {
  const classes = useStyles();

  // first column provides selection keys
  const keyCol = keyField || columns[0].id;

  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<Column>(keyCol);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map(n => n[keyCol]);
      handleRowsSelected(newSelecteds);
      return;
    }
    handleRowsSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, keyValue: Value) => {
    const selectedIndex = selected.indexOf(keyValue);
    let newSelected: Value[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, keyValue);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    handleRowsSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (keyValue: Value) => selected.indexOf(keyValue) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      {toolbarProps &&
        <ExTableToolbar 
          numSelected={selected.length}
          {...toolbarProps}
        />
      }
      <TableContainer>
        <Table
          className={classes.table}
          aria-labelledby='tableTitle'
          size='small'
          aria-label='enhanced table'
        >
          <ExTableHead
            disabled={disabled}
            order={order}
            orderBy={orderBy}
            numSelected={selected.length}
            rowCount={rows.length}
            columns={columns}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {stableSort<RowData>(rows, getComparator<Column>(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, rowIndex) => {
                const isItemSelected = isSelected(row[keyCol]);
                const labelId = `enhanced-table-checkbox-${rowIndex}`;

                const cellFormats = tableRowFormat ? tableRowFormat(columns, row) : {};

                return (
                  <TableRow
                    hover
                    key={rowIndex}
                    tabIndex={-1}
                    role='checkbox'
                    aria-checked={isItemSelected}
                    selected={isItemSelected}
                    onClick={(event) => disabled || handleClick(event, row[keyCol])}
                  >
                    <TableCell 
                      key={-1} 
                      padding='checkbox'
                    >
                      <Checkbox
                        size='small'
                        checked={isItemSelected}
                        inputProps={{ 'aria-labelledby': labelId }}
                        color='primary'
                        disabled={disabled}
                      />
                    </TableCell>
                    {columns.map((col, colIndex) => {
                      if (colIndex === 0) {
                        return (
                          <TableCell
                            key={colIndex}
                            component='th'
                            id={labelId}
                            scope='row'
                            padding='none'
                            className={cellFormats[col.id]}
                          >
                            {row[col.id]}
                          </TableCell>
                        );
                      } else {
                        return (
                          <TableCell
                            key={colIndex}
                            align={col.align || 'left'}
                            className={cx(
                              cellFormats[col.id],
                              !col.disablePadding && classes.sizeSmall
                            )}
                            style={col.rowCellStyle}
                          >
                            {row[col.id]}
                          </TableCell>
                        );
                      }
                    })}
                  </TableRow>
                );
              })}
            {emptyRows > 0 && (
              <TableRow style={{ height: 33 * emptyRows }}>
                <TableCell colSpan={columns.length+1} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[]}
        component='div'
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        labelDisplayedRows={
          ({ from, to, count }) =>  count > 0
            ? `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}` : ''
        }
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </div>
  );
}

export default TableList;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    '& .Mui-selected': {
      backgroundColor: theme.palette.type === 'light'
        ? lighten(theme.palette.primary.light, 0.75)
        : theme.palette.primary.dark,
      '&:hover': {
        backgroundColor: theme.palette.type === 'light'
          ? lighten(theme.palette.primary.light, 0.5)
          : lighten(theme.palette.primary.dark, 0.25),
      }
    }
  },
  table: {
    minWidth: 600,
    borderRight: '2px solid rgba(224, 224, 224, 1)',
    borderBottom: '2px solid rgba(224, 224, 224, 1)',
    borderLeft: '2px solid rgba(224, 224, 224, 1)',
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.primary.main,
          backgroundColor: lighten(theme.palette.primary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.primary.dark,
        },
  // TableCell CSS override
  sizeSmall: {
    padding: '6px 0px 6px 8px',
  }
}));

type TableListProps = {
  keyField?: string
  columns: ColumnProps[]
  rows: RowData[]

  // row format callback
  tableRowFormat?: (columns: ColumnProps[], row: RowData) => RowCellClasses

  // title and actions to show in toolbar
  toolbarProps?: TableToolbarProps

  selected: Value[]
  handleRowsSelected: (selected: Value[]) => void

  disabled?: boolean
}

export interface ColumnProps {
  id: Column
  disablePadding: boolean
  align?: 'left' | 'right' | 'center'
  label: string
  headCellStyle?: React.CSSProperties
  rowCellStyle?: React.CSSProperties
}
export type RowData = { [ column: string ]: Value }
export type RowCellClasses = { [ column: string ]: string }
export type Column = string
export type Value = string | number

// Table Header

const ExTableHead: FunctionComponent<ExTableHeadProps> = ({
  disabled,
  order,
  orderBy,
  numSelected,
  rowCount,
  columns,
  onRequestSort,
  onSelectAllClick
}) => {
  const classes = useTableHeadStyles();

  const createSortHandler = (property: Column) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding='checkbox' className={classes.tableHeadCell}>
          <Checkbox
            size='small'
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all users' }}
            color='primary'
            disabled={disabled}
          />
        </TableCell>
        {columns.map(col => (
          <TableCell
            key={col.id}
            align={col.align || 'left'}
            padding={col.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === col.id ? order : false}
            className={cx(classes.tableHeadCell, !col.disablePadding && classes.sizeSmall)}
            style={col.headCellStyle}
          >
            <TableSortLabel
              active={orderBy === col.id}
              direction={orderBy === col.id ? order : 'asc'}
              onClick={createSortHandler(col.id)}
            >
              {col.label}
              {orderBy === col.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface ExTableHeadProps {
  disabled?: boolean
  order: Order
  orderBy: string
  numSelected: number
  rowCount: number
  columns: ColumnProps[]
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const useTableHeadStyles = makeStyles((theme: Theme) => ({
  tableHeadCell: {
    fontWeight: 'bold',
    backgroundColor: 'rgba(224, 224, 224, 1)'
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  // TableCell CSS override
  sizeSmall: {
    padding: '6px 0px 6px 8px',
  }
}));

const ExTableToolbar: FunctionComponent<ExTableToolbarProps> = ({
  title,
  defaultActions = [],
  selectedItemName,
  selectedItemActions,
  numSelected
}) => {
  const classes = useToolbarStyles();

  const renderToolbarAction = (action: ToolbarAction, index: number) => {    
    return (!!action.hidden ||
      <IconButton
        key={index} 
        ariaLabel={action.ariaLabel}
        tooltip={action.tooltip}
        color='primary'
        size='small'
        icon={action.icon}
        disabled={action.disabled}
        wipIndicator={action.processing}
        handleClick={() => action.handler()}
      />
    );
  }

  return (
    <Toolbar
      variant='dense'
      className={cx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <>
          <Typography className={classes.title} color='inherit' variant='subtitle1' component='div'>
            &nbsp;&nbsp;{numSelected} {selectedItemName}{numSelected > 1 ? 's': ''} selected
          </Typography>
          {selectedItemActions.map(renderToolbarAction)}
        </>
      ) : (
        <>
          <Typography className={classes.title} variant='h6' id='tableTitle' component='div'>
            &nbsp;&nbsp;{title}
          </Typography>
          {defaultActions.map(renderToolbarAction)}
        </>
      )}
    </Toolbar>
  );
};

interface ExTableToolbarProps extends TableToolbarProps {
  numSelected: number
}

export interface TableToolbarProps {
  title: string
  defaultActions?: ToolbarAction[]
  selectedItemName: string
  selectedItemActions: ToolbarAction[]
}

type ToolbarAction = {
  icon: object
  tooltip: string
  ariaLabel: string
  hidden?: boolean
  disabled?: boolean
  processing?: boolean
  handler: () => void
}

const useToolbarStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.primary.main,
          backgroundColor: lighten(theme.palette.primary.light, 0.75),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.primary.dark,
        },
  title: {
    flex: '1 1 100%',
    textAlign: 'left'
  },
}));

// Sorting

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}
