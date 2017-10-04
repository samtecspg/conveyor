import pkg from '../../package.json';

export const AppConstants = {
    APP_NAME: pkg.name,
    APP_TITTLE: 'Conveyor',
    APP_DESCRIPTION: pkg.description,
    APP_VERSION: pkg.version,
    APP_INDEX: `${pkg.name}.index`,
    BASE_API: `/api/${pkg.name}`,
    INGEST_URL: 'http://localhost:4000'
};