import React, { FunctionComponent } from 'react';
import { 
  makeStyles,
  Theme
} from '@material-ui/core/styles';

import addUser from '@iconify/icons-mdi/account-plus-outline';
import deactivateUser from '@iconify/icons-mdi/account-off-outline';
import removeUser from '@iconify/icons-mdi/delete';

import { 
  TableList, 
  ColumnProps, 
  RowData, 
  Value 
} from '../../../common/components/views';

const SpaceUserList: FunctionComponent<SpaceUserListProps> = (props) => {
  const classes = useStyles();

  const handleAddUser = () => {
    console.log('--> handleAddUser')
  };

  const handleDeactivateUsers = (selected: Value[]) => {
    console.log('--> handleDeactivateUsers', selected)
  };

  const handleRemoveUsers = (selected: Value[]) => {
    console.log('--> handleRemoveUsers', selected)
  };

  return (
    <TableList 
      columns={columns}
      rows={rows}
      toolbarProps={{
        title: 'Space Users',
        defaultActions: [
          {
            icon: addUser,
            tooltip: 'Add User',
            ariaLabel: 'add user',
            handler: handleAddUser
          }
        ],
        selectedItemName: 'user',
        selectedItemActions: [
          {
            icon: deactivateUser,
            tooltip: 'Deactivate Users',
            ariaLabel: 'deactivate selected users',
            handler: handleDeactivateUsers
          },
          {
            icon: removeUser,
            tooltip: 'Remove Users',
            ariaLabel: 'remove selected users',
            handler: handleRemoveUsers
          }
        ]
      }}
    />
  );
}

export default SpaceUserList;

const useStyles = makeStyles((theme: Theme) => ({  
}));

type SpaceUserListProps = {
}

// Data

const columns: ColumnProps[] = [
  { id: 'user', disablePadding: true, label: 'User' },
  { id: 'name', disablePadding: false, label: 'Name' },
  { id: 'status', disablePadding: false, label: 'Status' },
  { id: 'lastSeen', disablePadding: false, align: 'right', label: 'Last Seen' },
];

function createData(
  user: string,
  name: string,
  status: string,
  lastSeen: string
): RowData {
  return { user, name, status, lastSeen };
}

const rows = [
  createData('ken', 'Kenneth Melcher', 'active', '05/12/2021 10:43PM'),
  createData('zulfi', 'Zulfikar Antonisen', 'active', '05/02/2021 08:15PM'),
  createData('gani', 'Ganizani Simon', 'active', '05/09/2021 12:20PM'),
  createData('sari', 'Sarika Durand', 'active', '04/28/2021 06:50AM'),
  createData('zena', 'Zena Jervis', 'active', '04/10/2021 09:32AM'),
  createData('rosa', 'Rosa Antonisen', 'active', '05/11/2021 03:25PM'),
  createData('jorie', 'Jorie Penn', 'active', '05/11/2021 02:10AM'),
  createData('kathy', 'Katharyn James', 'active', '05/05/2021 05:55PM'),
  createData('denis', 'Denis Burrell', 'active', '05/09/2021 06:41AM'),
  createData('andy', 'Anderson Harlan', 'active', '05/02/2021 07:22PM'),
  createData('amy', 'Amy Simpkin', 'active', '05/02/2021 04:58PM'),
  createData('virg', 'Virgee Elmer', 'active', '04/15/2021 05:15PM'),
  createData('jean', 'Jeanie Holland', 'active', '04/25/2021 08:05AM'),
];
