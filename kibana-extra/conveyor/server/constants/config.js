import pkg from '../../package.json';

const config = {
  APP_NAME: pkg.name,
  APP_TITLE: 'Conveyor',
  APP_DESCRIPTION: pkg.description,
  APP_VERSION: pkg.version,
  APP_INDEX: `.${pkg.name}`,
  BASE_API: `/api/${pkg.name}`,
  KBN_VERSION: pkg.kibana.version,
  API_URL: 'http://localhost:4000'
};

export default config;
