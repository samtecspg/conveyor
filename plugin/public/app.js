import React from 'react';

import chrome from 'ui/chrome';

import 'ui/autoload/all';
import 'plugins/kbn_vislib_vis_types/kbn_vislib_vis_types';

import './angular/history';
import './angular/app_store_hooks';
import './angular/global_state';
import 'typeface-rubik';
import 'react-circular-progressbar/dist/styles.css';
import './less/style.less';

import {render} from 'react-dom';
import {AppConstants} from '../lib/common/app-constants';
import {Routes} from './routes/routes';

chrome
    .setRootTemplate(`<div id="root" class="${AppConstants.APP_NAME}"></div>`)
    .setRootController((docTitle, $history, $scope, $appStoreHooks) => {
        docTitle.change(AppConstants.APP_NAME);

        // Mount the React app
        const el = document.getElementById('root');
        render(<Routes history={$history}/>, el);

        // Initialized the loading spinner thingy
        $scope.loading = false;
    });
