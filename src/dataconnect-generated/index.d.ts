import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Campaign_Key {
  id: UUIDString;
  __typename?: 'Campaign_Key';
}

export interface ConsentLog_Key {
  id: UUIDString;
  __typename?: 'ConsentLog_Key';
}

export interface Contact_Key {
  id: UUIDString;
  __typename?: 'Contact_Key';
}

export interface CreateContactData {
  contact_insert: Contact_Key;
}

export interface CreateContactVariables {
  phoneNumber: string;
  name: string;
  consentStatus: string;
  email?: string | null;
  tags?: string[] | null;
}

export interface ListCampaignsData {
  campaigns: ({
    id: UUIDString;
    name: string;
    status: string;
    scheduledAt: TimestampString;
    template: {
      id: UUIDString;
      name: string;
      category: string;
      bodyContent: string;
      languageCode: string;
    } & Template_Key;
  } & Campaign_Key)[];
}

export interface ListContactsData {
  contacts: ({
    id: UUIDString;
    phoneNumber: string;
    name: string;
    consentStatus: string;
    email?: string | null;
    tags?: string[] | null;
  } & Contact_Key)[];
}

export interface MessageLog_Key {
  id: UUIDString;
  __typename?: 'MessageLog_Key';
}

export interface Template_Key {
  id: UUIDString;
  __typename?: 'Template_Key';
}

interface ListContactsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListContactsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListContactsData, undefined>;
  operationName: string;
}
export const listContactsRef: ListContactsRef;

export function listContacts(options?: ExecuteQueryOptions): QueryPromise<ListContactsData, undefined>;
export function listContacts(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListContactsData, undefined>;

interface ListCampaignsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListCampaignsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListCampaignsData, undefined>;
  operationName: string;
}
export const listCampaignsRef: ListCampaignsRef;

export function listCampaigns(options?: ExecuteQueryOptions): QueryPromise<ListCampaignsData, undefined>;
export function listCampaigns(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListCampaignsData, undefined>;

interface CreateContactRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateContactVariables): MutationRef<CreateContactData, CreateContactVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateContactVariables): MutationRef<CreateContactData, CreateContactVariables>;
  operationName: string;
}
export const createContactRef: CreateContactRef;

export function createContact(vars: CreateContactVariables): MutationPromise<CreateContactData, CreateContactVariables>;
export function createContact(dc: DataConnect, vars: CreateContactVariables): MutationPromise<CreateContactData, CreateContactVariables>;

