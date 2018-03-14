import { AppConstants } from '../../lib/common/app-constants';

export class AppState {
    constructor() {
        this.kbnVersion = AppConstants.APP_VERSION;
        this.basePath = undefined;
        this.location = undefined;
        this.selectedTab = false;
        this.snackBarMessage = undefined;
        this.snackBarIsOpen = false;
    }
} 