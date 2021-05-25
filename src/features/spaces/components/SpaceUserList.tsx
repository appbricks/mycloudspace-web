import React, { FunctionComponent } from 'react';
import { connect, useSelector } from 'react-redux';

import {
  makeStyles,
  lighten,
  Theme
} from '@material-ui/core/styles';

import addUser from '@iconify/icons-mdi/account-plus-outline';
import activateUser from '@iconify/icons-mdi/account-check-outline';
import deactivateUser from '@iconify/icons-mdi/account-off-outline';
import removeUser from '@iconify/icons-mdi/delete';

import { 
  Action,
  ActionStatus,
  ActionStatusTracker 
} from '@appbricks/utils';

import {
  Space,
  UserAccessStatus,
  UserSpaceService,
  UserSpaceStateProps,
  UserSpaceActionProps,
  UserSearchItem,
  USER_SEARCH,
  INVITE_USER_TO_SPACE,
  REMOVE_USER_ACCESS_TO_SPACE,
  GRANT_USER_ACCESS_TO_SPACE,
  DELETE_USER_FROM_SPACE
} from '@appbricks/user-space';

import AutoComplete, {
  Option,
  ListPageNav
} from '../../../common/components/forms/AutoComplete';
import IconButton from '../../../common/components/forms/IconButton';

import {
  TableList,
  ColumnProps,
  RowData,
  RowCellClasses,
  Value
} from '../../../common/components/views';

import { useActionStatus } from '../../../common/state/status';
import { user } from '../../../common/state/auth';

const SpaceUserList: FunctionComponent<SpaceUserListProps> = (props) => {
  const classes = useStyles();

  const loggedInUser = useSelector(user);

  // user list rows selected
  const [rowsSelected, setRowsSelected] = React.useState<Value[]>([]);
  // user invite autocomplete options selected
  const [optionsSelected, setOptionsSelected] = React.useState<Option<UserSearchItem>[]>([]);

  const { space, userspace, userspaceService } = props;
  const rows = userspace!.spaceUsers[space.spaceID!];

  const actionStatusTracker = React.useRef(new ActionStatusTracker());

  React.useEffect(() => {
    userspaceService!.userSearch('', 10);
    return () => {
      userspaceService!.clearUserSearchResults();
    };
  }, [])

  // build autocomplete option list
  let options: Option<UserSearchItem>[] = [];
  if (userspace!.userSearchResult) {
    const { result, pageInfo } = userspace!.userSearchResult;

    options = result.map(value => {
      return {
        value,
        // disable any users that are already associated with the space
        disabled: value.userName == loggedInUser!.username || rows.some(r => r.userID == value.userID)
      } as Option<UserSearchItem>;
    });
    // add pagination options for option list
    if (pageInfo.hasPreviousePage) {
      options.unshift({ navOption: ListPageNav.prev })
    }
    if (pageInfo.hasNextPage) {
      options.push({ navOption: ListPageNav.next })
    }
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
        userspaceService!.inviteUserToSpace(space.spaceID!, option.value!.userID!, false, false)
      );
    });
  };

  const handleUpdateOptionList = (filter: string) => {
    if (userspace!.userSearchResult!.searchPrefix != filter) {
      actionStatusTracker.current.track(
        userspaceService!.userSearch(filter, 10)
      );
    }
  };

  const handleOptionPagePrev = () => {
    userspaceService!.userSearchPagePrev();
  };

  const handleOptionPageNext = () => {
    userspaceService!.userSearchPageNext();
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
        case INVITE_USER_TO_SPACE:
          setOptionsSelected([]);
          break;
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
    }
  );

  // check is user search call is in progress
  const userSearchCallInProgress = actionStatusTracker.current.isStatusPending(USER_SEARCH, userspace!);
  // check is user invite calls are in progress
  const sendingInvite = actionStatusTracker.current.isStatusPending(INVITE_USER_TO_SPACE, userspace!);

  const deactivatingUsers = actionStatusTracker.current.isStatusPending(REMOVE_USER_ACCESS_TO_SPACE, userspace!);
  const activatingUsers = actionStatusTracker.current.isStatusPending(GRANT_USER_ACCESS_TO_SPACE, userspace!);
  const deletingUsers = actionStatusTracker.current.isStatusPending(DELETE_USER_FROM_SPACE, userspace!);
  const disableTableList = deactivatingUsers || activatingUsers || deletingUsers;

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
              icon: deactivateUser,
              tooltip: 'Deactivate Users',
              ariaLabel: 'deactivate selected users',
              hidden: deactivateUsersHidden,
              disabled: disableTableList,
              processing: deactivatingUsers,
              handler: handleDeactivateUsers
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
          handleOptionPagePrev={handleOptionPagePrev}
          handleOptionPageNext={handleOptionPageNext}
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
          processing={sendingInvite}
          className={classes.addUserButton}
          handleClick={handleAddUsers}
        />
      </div>
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
}));

type SpaceUserListProps =
  UserSpaceStateProps &
  UserSpaceActionProps & {
  space: Space
}

// Data

const columns: ColumnProps[] = [
  {
    id: 'userName',
    label: 'User',
    disablePadding: true,
    headCellStyle: { minWidth: '5rem' }
  },
  {
    id: 'fullName',
    label: 'Name',
    disablePadding: false,
    headCellStyle: { minWidth: '5rem' }
  },
  {
    id: 'status',
    label: 'Status',
    disablePadding: false,
    headCellStyle: { minWidth: '4rem' }
  },
  {
    id: 'lastConnectTime',
    label: 'Last Seen',
    disablePadding: false,
    align: 'right',
    headCellStyle: { minWidth: '7rem' }
  },
  {
    id: 'bytesUploaded',
    label: 'Data Usage Up',
    disablePadding: false,
    align: 'right',
    headCellStyle: { minWidth: '9rem' }
  },
  {
    id: 'bytesDownloaded',
    label: 'Data Usage Down',
    disablePadding: false,
    align: 'right',
    headCellStyle: { minWidth: '11rem' }
  },
];
