import { ObjectTypes } from '../../lib/common/object-types';

export class AppState {
  constructor() {
    this.kbnVersion = '6.0.0-alpha1';
    this.basePath = undefined;
    this.location = undefined;
    this.selectedTab = false;
    this.showSpinner = false;
    this.snackBarMessage = undefined;
    this.snackBarIsOpen = false;
  }
} 