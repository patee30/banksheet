import {initializeBlock,useBase,useViewport, Loader} from '@airtable/blocks/ui';
import React,  {useState, useMemo }  from 'react';

const access_token_endpoint = 'https://oauth.casso.vn';
import {globalConfig} from '@airtable/blocks';
import { SplashView } from './Splash';

initializeBlock(() => <SplashView />);
