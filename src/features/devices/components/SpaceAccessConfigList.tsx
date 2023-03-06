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
    const viewed = row['viewed'];

    columns.forEach(col => {
      if (!viewed) {
        cellFormats[col.id] = classes.unreadUserCell;
      }
    });
    return { rowIsDisabled: false, cellFormats };
  };

  return (
    <div className={classes.root}>
      <TableList
        keyField='spaceID'
        columns={columns}
        rows={rows}
        tableRowFormat={tableRowFormat}
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
  unreadUserCell: {
    color: theme.palette.info.main,
    fontStyle: 'italic'
  }
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
