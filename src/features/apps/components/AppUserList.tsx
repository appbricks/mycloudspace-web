import React, { FunctionComponent } from 'react';
import { connect, useSelector } from 'react-redux';

import {
  makeStyles,
  lighten,
  Theme
} from '@material-ui/core/styles';

import addUser from '@iconify/icons-mdi/account-plus-outline';
import removeUser from '@iconify/icons-mdi/delete';

import { 
  ActionStatus,
  ActionStatusTracker 
} from '@appbricks/utils';

import {
  AppUser,
  AppDetail,
  UserSpaceService,
  UserSpaceStateProps,
  UserSpaceActionProps,
  UserRef,
  USER_SEARCH,
  GRANT_USER_ACCESS_TO_APP,
  REMOVE_USER_ACCESS_TO_APP
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

const AppUserList: FunctionComponent<AppUserListProps> = (props) => {
  const classes = useStyles();

  const loggedInUser = useSelector(user);

  // user list rows selected
  const [rowsSelected, setRowsSelected] = React.useState<Value[]>([]);
  // user invite autocomplete options selected
  const [optionsSelected, setOptionsSelected] = React.useState<Option<UserRef>[]>([]);

  const { app, userspace, userspaceService } = props;
  const rows = app.users;

  const actionStatusTracker = React.useRef(new ActionStatusTracker());

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
        // disable any users that are already associated with the app
        disabled: value.userName == loggedInUser!.username || rows.some(r => r.userID == value.userID)
      } as Option<UserRef>;
    });
  }

  const handleRemoveUsers = () => {
    rowsSelected.forEach(userID => {
      actionStatusTracker.current.track(
        userspaceService!.removeUserAccessToApp(app.appID!, userID as string)
      );
    });
  };

  const handleAddUsers = () => {
    optionsSelected.forEach(option => {
      actionStatusTracker.current.track(
        userspaceService!.grantUserAccessToApp(app.appID!, option.value!.userID!)
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
    
    const appUser = (row['appUser'] as unknown) as AppUser;
    const rowIsDisabled = !!appUser.isOwner;

    columns.forEach(col => {
      if (rowIsDisabled) {
        cellFormats[col.id] = classes.disabledUserCell;
      }
    });
    return { rowIsDisabled, cellFormats };
  };

  const untrackAction = (actionStatus: ActionStatus) => {
    const untracked = actionStatusTracker.current.untrack(actionStatus);

    if (untracked) {
      switch (actionStatus.actionType) {
        case GRANT_USER_ACCESS_TO_APP:
          setOptionsSelected([]);
          break;
        case REMOVE_USER_ACCESS_TO_APP:
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
      GRANT_USER_ACCESS_TO_APP, 
      REMOVE_USER_ACCESS_TO_APP
    ]
  );

  // check is user search call is in progress
  const userSearchCallInProgress = actionStatusTracker.current.isStatusPending(USER_SEARCH, userspace!);
  // check is user invite calls are in progress
  const grantingAccessToSpace = actionStatusTracker.current.isStatusPending(GRANT_USER_ACCESS_TO_APP, userspace!);

  const removingAccessToSpace = actionStatusTracker.current.isStatusPending(REMOVE_USER_ACCESS_TO_APP, userspace!);
  const disableTableList = removingAccessToSpace;

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
              icon: removeUser,
              tooltip: 'Remove Users',
              ariaLabel: 'remove selected users',
              disabled: disableTableList,
              processing: removingAccessToSpace,
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
          disabled={grantingAccessToSpace}
          loading={userSearchCallInProgress}
          className={classes.autoCompleteComponent}
        />
        <IconButton
          ariaLabel='add users to app'
          tooltip='add users'
          color='primary'
          size='small'
          icon={addUser}
          disabled={optionsSelected.length === 0 || grantingAccessToSpace}
          wipIndicator={grantingAccessToSpace}
          className={classes.addUserButton}
          handleClick={handleAddUsers}
        />
      </div>
    </div>
  );
}

export default connect(UserSpaceService.stateProps, UserSpaceService.dispatchProps)(AppUserList);

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

type AppUserListProps =
  UserSpaceStateProps &
  UserSpaceActionProps & {
  app: AppDetail
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
    id: 'lastAccessedTime',
    label: 'Last Accessed',
    disablePadding: false,
    headCellStyle: { whiteSpace: 'nowrap' },
    rowCellStyle: { whiteSpace: 'nowrap' }
  }
];
