import React, { FunctionComponent } from 'react';
import { connect, useSelector } from 'react-redux';

import {
  makeStyles,
  lighten,
  Theme
} from '@material-ui/core/styles';

import addUser from '@iconify/icons-mdi/account-plus-outline';
import userSettings from '@iconify/icons-mdi/account-cog-outline';
import activateUser from '@iconify/icons-mdi/account-check-outline';
import deactivateUser from '@iconify/icons-mdi/account-off-outline';
import removeUser from '@iconify/icons-mdi/delete';

import { 
  ActionStatus,
  ActionStatusTracker 
} from '@appbricks/utils';

import {
  SpaceUser,
  SpaceDetail,
  UserAccessStatus,
  UserSpaceService,
  UserSpaceStateProps,
  UserSpaceActionProps,
  UserRef,
  USER_SEARCH,
  INVITE_USER_TO_SPACE,
  UPDATE_SPACE_USER,
  REMOVE_USER_ACCESS_TO_SPACE,
  GRANT_USER_ACCESS_TO_SPACE,
  DELETE_USER_FROM_SPACE
} from '@appbricks/user-space';

import AutoComplete, {
  Option
} from '../../../common/components/forms/AutoComplete';
import IconButton from '../../../common/components/forms/IconButton';

import {
  TableList,
  ColumnProps,
  RowData,
  RowCellClasses,
  TableRowFormat,
  Value
} from '../../../common/components/views';

import { useActionStatus } from '../../../common/state/status';
import { user } from '../../../common/state/auth';

import SpaceUserSettings from './SpaceUserSettings';

const SpaceUserList: FunctionComponent<SpaceUserListProps> = (props) => {
  const classes = useStyles();

  const loggedInUser = useSelector(user);

  // user list rows selected
  const [rowsSelected, setRowsSelected] = React.useState<Value[]>([]);
  // user invite autocomplete options selected
  const [optionsSelected, setOptionsSelected] = React.useState<Option<UserRef>[]>([]);

  const { space, userspace, userspaceService } = props;
  const rows = space.users;

  const actionStatusTracker = React.useRef(new ActionStatusTracker());

  // user settings
  const [openSettings, setOpenSettings] = React.useState(false);

  const handleOpenSettings = () => {
    setOpenSettings(true);
  };

  const handleCloseSettings = () => {
    setOpenSettings(false);
    setRowsSelected([])
  };

  // user search
  React.useEffect(() => {
    userspaceService!.userSearch('', 50);
    return () => {
      userspaceService!.clearUserSearchResults();
    };
  }, [])

  // build autocomplete option list
  let options: Option<UserRef>[] = [];
  if (userspace!.userSearchResult) {
    options = userspace!.userSearchResult.map(value => {
      return {
        value,
        // disable any users that are already associated with the space
        disabled: value.userName == loggedInUser!.username || rows.some(r => r.userID == value.userID)
      } as Option<UserRef>;
    });
  }

  const handleDeactivateUsers = () => {
    rowsSelected.forEach(userID => {
      actionStatusTracker.current.track(
        userspaceService!.removeUserAccessToSpace(space.spaceID!, userID as string)
      );
    });
  };

  const handleActivateUsers = () => {
    rowsSelected.forEach(userID => {
      actionStatusTracker.current.track(
        userspaceService!.grantUserAccessToSpace(space.spaceID!, userID as string)
      );
    });
  };

  const handleRemoveUsers = () => {
    rowsSelected.forEach(userID => {
      actionStatusTracker.current.track(
        userspaceService!.deleteUserFromSpace(space.spaceID!, userID as string)
      );
    });
  };

  const handleAddUsers = () => {
    optionsSelected.forEach(option => {
      actionStatusTracker.current.track(
        userspaceService!.inviteUserToSpace(space.spaceID!, option.value!.userID!, space.spaceDefaults.isEgressNode)
      );
    });
  };

  const handleUpdateOptionList = (filter: string) => {
    actionStatusTracker.current.track(
      userspaceService!.userSearch(filter, 50)
    );
  };

  const tableRowFormat = (columns: ColumnProps[], row: RowData): TableRowFormat => {

    const cellFormats = {} as RowCellClasses;
    const status = row['status'];
    
    const spaceUser = (row['spaceUser'] as unknown) as SpaceUser;
    const rowIsDisabled = !!spaceUser.isOwner;

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

  const untrackAction = (actionStatus: ActionStatus) => {
    const untracked = actionStatusTracker.current.untrack(actionStatus);

    if (untracked) {
      switch (actionStatus.actionType) {
        case INVITE_USER_TO_SPACE:
          setOptionsSelected([]);
          break;
        case UPDATE_SPACE_USER:
        case REMOVE_USER_ACCESS_TO_SPACE:
        case GRANT_USER_ACCESS_TO_SPACE:
        case DELETE_USER_FROM_SPACE:
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
    },
    [ 
      INVITE_USER_TO_SPACE, 
      UPDATE_SPACE_USER,
      REMOVE_USER_ACCESS_TO_SPACE, 
      GRANT_USER_ACCESS_TO_SPACE, 
      DELETE_USER_FROM_SPACE 
    ]
  );

  // check is user search call is in progress
  const userSearchCallInProgress = actionStatusTracker.current.isStatusPending(USER_SEARCH, userspace!);
  // check is user invite calls are in progress
  const sendingInvite = actionStatusTracker.current.isStatusPending(INVITE_USER_TO_SPACE, userspace!);

  const updatingSpaceUser = actionStatusTracker.current.isStatusPending(UPDATE_SPACE_USER, userspace!);
  const deactivatingUsers = actionStatusTracker.current.isStatusPending(REMOVE_USER_ACCESS_TO_SPACE, userspace!);
  const activatingUsers = actionStatusTracker.current.isStatusPending(GRANT_USER_ACCESS_TO_SPACE, userspace!);
  const deletingUsers = actionStatusTracker.current.isStatusPending(DELETE_USER_FROM_SPACE, userspace!);
  const disableTableList = updatingSpaceUser || deactivatingUsers || activatingUsers || deletingUsers;

  const enableEgressHidden = rowsSelected.some(
    userID => rows.some(
      row => row.userID == userID && row.egressAllowed == 'yes'
    )
  );
  const disableEgressHidden = rowsSelected.some(
    userID => rows.some(
      row => row.userID == userID && row.egressAllowed == 'no'
    )
  );
  const deactivateUsersHidden = rowsSelected.some(
    userID => rows.some(
      row => row.userID == userID && row.status == UserAccessStatus.inactive
    )
  );
  const activateUsersHidden = rowsSelected.some(
    userID => rows.some(
      row => row.userID == userID && row.status == UserAccessStatus.active
    )
  );

  const selectedUsers = rows.filter(
    row => rowsSelected.includes(row.userID)
  );

  return (
    <div className={classes.root}>
      <TableList
        keyField='userID'
        columns={columns}
        rows={rows}
        tableRowFormat={tableRowFormat}
        toolbarProps={{
          title: 'Space Users',
          selectedItemName: 'user',
          selectedItemActions: [
            {
              icon: userSettings,
              tooltip: 'Modify user settings',
              ariaLabel: 'modify the selected users\' space settings',
              disabled: disableTableList,
              processing: updatingSpaceUser,
              handler: handleOpenSettings
            },
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
              icon: deactivateUser,
              tooltip: 'Deactivate Users',
              ariaLabel: 'deactivate selected users',
              hidden: deactivateUsersHidden,
              disabled: disableTableList,
              processing: deactivatingUsers,
              handler: handleDeactivateUsers
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
      <div className={classes.autoCompleteContainer}>
        <AutoComplete
          inputLabel='Invite Users to Space'
          inputPlaceholder='username'
          selected={optionsSelected}
          options={options}
          optionLabel={option => option.value!.userName as string}
          optionEquals={(o1, o2) => !!(o1.value && o2.value && o1.value!.userName == o2.value!.userName)}
          handleUpdateOptionList={handleUpdateOptionList}
          handleOptionsSelected={setOptionsSelected}
          disabled={sendingInvite}
          loading={userSearchCallInProgress}
          className={classes.autoCompleteComponent}
        />
        <IconButton
          ariaLabel='add users to space'
          tooltip='add users'
          color='primary'
          size='small'
          icon={addUser}
          disabled={optionsSelected.length === 0 || sendingInvite}
          wipIndicator={sendingInvite}
          className={classes.addUserButton}
          handleClick={handleAddUsers}
        />
      </div>
      <SpaceUserSettings 
        space={space}
        selectedUsers={selectedUsers}
        open={openSettings}
        onClose={handleCloseSettings}
      />
    </div>
  );
}

export default connect(UserSpaceService.stateProps, UserSpaceService.dispatchProps)(SpaceUserList);

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
  }
}));

type SpaceUserListProps =
  UserSpaceStateProps &
  UserSpaceActionProps & {
  space: SpaceDetail
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
    id: 'egressAllowed',
    label: 'Can Egress',
    disablePadding: false,
    headCellStyle: { whiteSpace: 'nowrap' }
  },
  {
    id: 'lastConnectTime',
    label: 'Last Connected',
    disablePadding: false,
    headCellStyle: { whiteSpace: 'nowrap' },
    rowCellStyle: { whiteSpace: 'nowrap' }
  },
  {
    id: 'lastDeviceConnected',
    label: 'Device Connected',
    disablePadding: false,
    headCellStyle: { whiteSpace: 'nowrap' },
    rowCellStyle: { whiteSpace: 'nowrap' }
  },
  {
    id: 'dataUsageOut',
    label: 'Data Usage Up',
    disablePadding: false,
    align: 'right',
    headCellStyle: { whiteSpace: 'nowrap' }
  },
  {
    id: 'dataUsageIn',
    label: 'Data Usage Down',
    disablePadding: false,
    align: 'right',
    headCellStyle: { whiteSpace: 'nowrap' }
  },
];
