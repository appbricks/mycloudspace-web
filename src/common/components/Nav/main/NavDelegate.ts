import { navigate } from 'gatsby';
import MainMenuItem from './MainMenuItem';

// this delegate propagates selection 
// changes to all nav components
export default class NavDelegate {

  menuItems: MainMenuItem[];

  active: number;
 
  primaryNavSelection?: (itemIndex: number) => void;
  secondaryNavSelection?: (itemIndex: number) => void;

  isLoggedIn: boolean
  
  constructor(menuItems: MainMenuItem[], isLoggedIn: boolean) {
    this.menuItems = menuItems;
    
    const pathName = typeof window !== 'undefined' ? window.location.pathname.replace(/\/$/, '') : '';
    this.active = menuItems.findIndex(item => (item.getItem().link == pathName));

    this.isLoggedIn = isLoggedIn;
  }

  setSelection(itemIndex: number) {
    this.active = itemIndex;

    if (this.primaryNavSelection) {
      this.primaryNavSelection!(itemIndex);
    }
    if (this.secondaryNavSelection) {
      this.secondaryNavSelection!(itemIndex);
    }

    if (itemIndex >= 0 && itemIndex < this.menuItems.length) {
      navigate(this.menuItems[itemIndex]
        .getItem(this.isLoggedIn ? 'loggedin' : MainMenuItem.DEFAULT).link);
    } else {
      navigate('/');
    }
  }
}
