import { RootState } from './store';

// auth selector
const UserSpace = (state: RootState) => state.userspace;
export default UserSpace;
