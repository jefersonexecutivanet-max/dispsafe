import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

export const dataConnect = getDataConnect(connectorConfig);
