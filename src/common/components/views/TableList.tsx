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
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { 
  makeStyles,
  createStyles, 
  lighten,
  Theme
} from '@material-ui/core/styles';

import { Icon } from '@iconify/react';

import cx from 'clsx';

const TableList: FunctionComponent<TableListProps> = ({
  columns,
  rows,
  toolbarProps
}) => {
  const classes = useStyles();

  // first column provides selection keys
  const keyCol = columns[0].id;

  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<Column>(keyCol);
  const [selected, setSelected] = React.useState<Value[]>([]);
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
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
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

    setSelected(newSelected);
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
        <ExTableToolbar selected={selected} {...toolbarProps} />
      }      
      <TableContainer>
        <Table
          className={classes.table}
          aria-labelledby='tableTitle'
          size='small'
          aria-label='enhanced table'
        >
          <ExTableHead
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
              .map((row, index) => {
                const isItemSelected = isSelected(row[keyCol]);
                const labelId = `enhanced-table-checkbox-${index}`;
                
                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row[keyCol])}
                    role='checkbox'
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.user}
                    selected={isItemSelected}
                  >
                    <TableCell key={-1} padding='checkbox'>
                      <Checkbox
                        size='small'
                        checked={isItemSelected}
                        inputProps={{ 'aria-labelledby': labelId }}
                        color='primary'
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
                          >
                            {row[col.id]}
                          </TableCell>
                        );
                      } else {
                        return (
                          <TableCell 
                            key={colIndex} 
                            align={col.align || 'left'} 
                            className={cx(!col.disablePadding && classes.sizeSmall)}
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
                <TableCell colSpan={6} />
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
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </div>
  );
}

export default TableList;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
      borderRight: '1px solid rgba(224, 224, 224, 1)',
      borderLeft: '1px solid rgba(224, 224, 224, 1)',
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
  }),
);

type TableListProps = {
  columns: ColumnProps[]
  rows: RowData[]

  // title and actions to show in toolbar
  toolbarProps?: TableToolbarProps
}

export interface ColumnProps {
  id: Column
  disablePadding: boolean
  align?: 'left' | 'right' | 'center'
  label: string
}
export type RowData = { [ column: string ]: Value }
export type Column = string
export type Value = string | number

// Table Header

const ExTableHead: FunctionComponent<ExTableHeadProps> = ({
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
          />
        </TableCell>
        {columns.map(col => (
          <TableCell
            key={col.id}
            align={col.align || 'left'} 
            padding={col.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === col.id ? order : false}
            className={cx(classes.tableHeadCell, !col.disablePadding && classes.sizeSmall)}
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
  order: Order
  orderBy: string
  numSelected: number
  rowCount: number
  columns: ColumnProps[]
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const useTableHeadStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  }),
);

const ExTableToolbar: FunctionComponent<ExTableToolbarProps> = ({ 
  selected,
  title,
  defaultActions,
  selectedItemName,
  selectedItemActions
}) => {
  const classes = useToolbarStyles();

  const numSelected = selected.length;

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
          {selectedItemActions.map((action, index) => (
            <Tooltip key={index} title={action.tooltip}>
              <IconButton 
                aria-label={action.ariaLabel} 
                color='primary' 
                size='small'
                onClick={() => action.handler(selected)}
              >
                <Icon width={24} icon={action.icon} />
              </IconButton>
            </Tooltip>
          ))}          
        </>
      ) : (
        <>
          <Typography className={classes.title} variant='h6' id='tableTitle' component='div'>
            &nbsp;&nbsp;{title}
          </Typography>
          {defaultActions.map((action, index) => (
            <Tooltip key={index} title={action.tooltip}>
              <IconButton 
                aria-label={action.ariaLabel} 
                color='primary' 
                size='small'
                onClick={() => action.handler()}
              >
                <Icon width={24} icon={action.icon} />
              </IconButton>
            </Tooltip>
          ))}          
        </>
      )}
    </Toolbar>
  );
};

interface ExTableToolbarProps extends TableToolbarProps {
  selected: Value[]
}

export interface TableToolbarProps {
  title: string
  defaultActions: UnselectedToolBarAction[]
  selectedItemName: string
  selectedItemActions: SelectedToolBarAction[]
}

type ToolBarAction = {
  icon: object
  tooltip: string
  ariaLabel: string
  handler: (selected: Value[]) => void
}

type UnselectedToolBarAction = ToolBarAction & {
  handler: () => void
}

type SelectedToolBarAction = ToolBarAction & {
  handler: (selected: Value[]) => void
}

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  }),
);

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
