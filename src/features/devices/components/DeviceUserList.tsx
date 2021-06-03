import React, { FunctionComponent } from 'react';
import { connect, useSelector } from 'react-redux';

import {
  makeStyles,
  lighten,
  Theme
} from '@material-ui/core/styles';

import activateUser from '@iconify/icons-mdi/account-check-outline';
import removeUser from '@iconify/icons-mdi/delete';

import { 
  ActionStatus,
  ActionStatusTracker 
} from '@appbricks/utils';

import {
  Device,
  UserAccessStatus,
  UserSpaceService,
  UserSpaceStateProps,
  UserSpaceActionProps,
  ACTIVATE_USER_ON_DEVICE,
  DELETE_USER_FROM_DEVICE
} from '@appbricks/user-space';

import {
  TableList,
  ColumnProps,
  RowData,
  RowCellClasses,
  Value
} from '../../../common/components/views';

import { useActionStatus } from '../../../common/state/status';

const DeviceUserList: FunctionComponent<DeviceUserListProps> = (props) => {
  const classes = useStyles();

  // user list rows selected
  const [rowsSelected, setRowsSelected] = React.useState<Value[]>([]);

  const { device, userspace, userspaceService } = props;
  const rows = userspace!.deviceUsers[device.deviceID!];

  const actionStatusTracker = React.useRef(new ActionStatusTracker());

  const handleActivateUsers = () => {
    rowsSelected.forEach(userID => {
      actionStatusTracker.current.track(
        userspaceService!.activateUserOnDevice(device.deviceID!, userID as string)
      );
    });
  };

  const handleRemoveUsers = () => {
    rowsSelected.forEach(userID => {
      actionStatusTracker.current.track(
        userspaceService!.deleteUserFromDevice(device.deviceID!, userID as string)
      );
    });
  };

  const tableRowFormat = (columns: ColumnProps[], row: RowData): RowCellClasses => {

    const rowCellClasses = {} as RowCellClasses;
    const status = row['status'];

    columns.forEach(col => {
      switch (status) {
        case 'pending': {
          rowCellClasses[col.id] = classes.pendingUserCell;
          break;
        }
        case 'inactive': {
          rowCellClasses[col.id] = classes.inactiveUserCell;
          break;
        }
      }
    });
    return rowCellClasses;
  };

  const untrackAction = (actionStatus: ActionStatus) => {
    const untracked = actionStatusTracker.current.untrack(actionStatus);

    if (untracked) {
      switch (actionStatus.actionType) {
        case ACTIVATE_USER_ON_DEVICE:
        case DELETE_USER_FROM_DEVICE:
          setRowsSelected([])
      }
    }
  }

  // handle user-space service action statuses
  useActionStatus(userspace!, 
    actionStatus => {
      untrackAction(actionStatus);
    },
    (actionStatus, error) => {
      untrackAction(actionStatus);
      return false;
    }
  );

  const activatingUsers = actionStatusTracker.current.isStatusPending(ACTIVATE_USER_ON_DEVICE, userspace!);
  const deletingUsers = actionStatusTracker.current.isStatusPending(DELETE_USER_FROM_DEVICE, userspace!);
  const disableTableList =  activatingUsers || deletingUsers;

  const activateUsersHidden = rowsSelected.some(
    userID => rows.some(
      row => row.userID == userID && row.status == UserAccessStatus.active
    )
  );

  return (
    <div className={classes.root}>
      <TableList
        keyField='userID'
        columns={columns}
        rows={rows}
        tableRowFormat={tableRowFormat}
        toolbarProps={{
          title: 'Guest Users',
          selectedItemName: 'user',
          selectedItemActions: [
            {
              icon: activateUser,
              tooltip: 'Activate Users',
              ariaLabel: 'activate selected users',
              hidden: activateUsersHidden,
              disabled: disableTableList,
              processing: activatingUsers,
              handler: handleActivateUsers
            },
            {
              icon: removeUser,
              tooltip: 'Remove Users',
              ariaLabel: 'remove selected users',
              disabled: disableTableList,
              processing: deletingUsers,
              handler: handleRemoveUsers
            }
          ]
        }}
        selected={rowsSelected}
        handleRowsSelected={setRowsSelected}
        disabled={disableTableList}
      />      
    </div>
  );
}

export default connect(UserSpaceService.stateProps, UserSpaceService.dispatchProps)(DeviceUserList);

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
}));

type DeviceUserListProps =
  UserSpaceStateProps &
  UserSpaceActionProps & {
  device: Device
}

// Data

const columns: ColumnProps[] = [
  {
    id: 'userName',
    label: 'User',
    disablePadding: true
  },
  {
    id: 'fullName',
    label: 'Name',
    disablePadding: false,
    headCellStyle: { minWidth: '5rem' },
    rowCellStyle: { whiteSpace: 'nowrap', paddingRight: '1rem' }
  },
  {
    id: 'status',
    label: 'Status',
    disablePadding: false,
    headCellStyle: { whiteSpace: 'nowrap' }
  },
  {
    id: 'lastAccessTime',
    label: 'Last Active',
    disablePadding: false,
    align: 'right',
    headCellStyle: { whiteSpace: 'nowrap' }
  },
  {
    id: 'bytesUploaded',
    label: 'Data Usage Up',
    disablePadding: false,
    align: 'right',
    headCellStyle: {whiteSpace: 'nowrap' }
  },
  {
    id: 'bytesDownloaded',
    label: 'Data Usage Down',
    disablePadding: false,
    align: 'right',
    headCellStyle: {whiteSpace: 'nowrap' }
  },
];
