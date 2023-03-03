import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';

import {
  makeStyles,
  lighten,
  Theme
} from '@material-ui/core/styles';

import {
  DeviceUser,
  DeviceDetail,
  UserSpaceService,
  UserSpaceStateProps,
  UserSpaceActionProps,
} from '@appbricks/user-space';

import {
  TableList,
  ColumnProps,
  RowData,
  RowCellClasses,
  TableRowFormat,
  Value
} from '../../../common/components/views';

import SpaceAccessConfig from './SpaceAccessConfig';

const SpaceAccessConfigList: FunctionComponent<SpaceAccessConfigListProps> = (props) => {
  const classes = useStyles();

  // user row selected
  const [rowsSelected, setRowsSelected] = React.useState<Value[]>([]);

  const { device } = props;
  const rows = device.spaceAccessConfigs;

  const handleCloseConfig = () => {
    setRowsSelected([]);
  };

  const tableRowFormat = (columns: ColumnProps[], row: RowData): TableRowFormat => {

    const cellFormats = {} as RowCellClasses;
    const status = row['status'];

    const deviceUser = (row['deviceUser'] as unknown) as DeviceUser;
    const rowIsDisabled = !!deviceUser.isOwner;

    columns.forEach(col => {
      if (rowIsDisabled) {
        cellFormats[col.id] = classes.disabledUserCell;
      } else {
        switch (status) {
          case 'pending': {
            cellFormats[col.id] = classes.pendingUserCell;
            break;
          }
          case 'inactive': {
            cellFormats[col.id] = classes.inactiveUserCell;
            break;
          }
        }  
      }
    });
    return { rowIsDisabled, cellFormats };
  };

  return (
    <div className={classes.root}>
      <TableList
        keyField='spaceID'
        columns={columns}
        rows={rows}
        toolbarProps={{
          title: 'Space Access Configs'
        }}
        multiSelect={false}
        selected={rowsSelected}
        handleRowsSelected={setRowsSelected}
      />
      <SpaceAccessConfig 
        device={device}
        spaceID={rowsSelected.length > 0 ? rowsSelected[0] as string : undefined}

        open={rowsSelected.length > 0}
        onClose={handleCloseConfig}
      />
    </div>
  );
}

export default connect(UserSpaceService.stateProps, UserSpaceService.dispatchProps)(SpaceAccessConfigList);

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%'
  },
  autoCompleteContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  autoCompleteComponent: {
    flex: '2',
  },
  autoCompleteInput: {
    minHeight: '21px'
  },
  autoCompleteList: {
    borderStyle: 'solid',
    borderWidth: '2px',
    borderColor: '#3f51b5',
    backgroundColor: lighten('#efefef', 0.5),
    marginBlockEnd: theme.spacing(1.5)
  },
  addUserButton: {
    height: '40px'
  },
  pendingUserCell: {
    color: theme.palette.info.main,
    fontStyle: 'italic'
  },
  inactiveUserCell: {
    color: '#b5b5b5'
  },
  disabledUserCell: {
    color: 'rgba(0, 0, 0, 0.38)'
  },
}));

type SpaceAccessConfigListProps =
  UserSpaceStateProps &
  UserSpaceActionProps & {
  device: DeviceDetail
}

// Data

const columns: ColumnProps[] = [
  {
    id: 'spaceName',
    label: 'Space Name',
    headCellStyle: { minWidth: '7rem' },
    disablePadding: true
  },
  {
    id: 'expireAt',
    label: 'Expires On',
    disablePadding: false,
    rowCellStyle: { whiteSpace: 'nowrap' }
  }
];
