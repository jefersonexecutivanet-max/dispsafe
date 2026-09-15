# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListContacts*](#listcontacts)
  - [*ListCampaigns*](#listcampaigns)
- [**Mutations**](#mutations)
  - [*CreateContact*](#createcontact)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListContacts
You can execute the `ListContacts` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listContacts(options?: ExecuteQueryOptions): QueryPromise<ListContactsData, undefined>;

interface ListContactsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListContactsData, undefined>;
}
export const listContactsRef: ListContactsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listContacts(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListContactsData, undefined>;

interface ListContactsRef {
  ...
  (dc: DataConnect): QueryRef<ListContactsData, undefined>;
}
export const listContactsRef: ListContactsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listContactsRef:
```typescript
const name = listContactsRef.operationName;
console.log(name);
```

### Variables
The `ListContacts` query has no variables.
### Return Type
Recall that executing the `ListContacts` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListContactsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListContacts`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listContacts } from '@dataconnect/generated';


// Call the `listContacts()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listContacts();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listContacts(dataConnect);

console.log(data.contacts);

// Or, you can use the `Promise` API.
listContacts().then((response) => {
  const data = response.data;
  console.log(data.contacts);
});
```

### Using `ListContacts`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listContactsRef } from '@dataconnect/generated';


// Call the `listContactsRef()` function to get a reference to the query.
const ref = listContactsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listContactsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.contacts);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.contacts);
});
```

## ListCampaigns
You can execute the `ListCampaigns` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listCampaigns(options?: ExecuteQueryOptions): QueryPromise<ListCampaignsData, undefined>;

interface ListCampaignsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListCampaignsData, undefined>;
}
export const listCampaignsRef: ListCampaignsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listCampaigns(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListCampaignsData, undefined>;

interface ListCampaignsRef {
  ...
  (dc: DataConnect): QueryRef<ListCampaignsData, undefined>;
}
export const listCampaignsRef: ListCampaignsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listCampaignsRef:
```typescript
const name = listCampaignsRef.operationName;
console.log(name);
```

### Variables
The `ListCampaigns` query has no variables.
### Return Type
Recall that executing the `ListCampaigns` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListCampaignsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListCampaigns`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listCampaigns } from '@dataconnect/generated';


// Call the `listCampaigns()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listCampaigns();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listCampaigns(dataConnect);

console.log(data.campaigns);

// Or, you can use the `Promise` API.
listCampaigns().then((response) => {
  const data = response.data;
  console.log(data.campaigns);
});
```

### Using `ListCampaigns`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listCampaignsRef } from '@dataconnect/generated';


// Call the `listCampaignsRef()` function to get a reference to the query.
const ref = listCampaignsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listCampaignsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.campaigns);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.campaigns);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateContact
You can execute the `CreateContact` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createContact(vars: CreateContactVariables): MutationPromise<CreateContactData, CreateContactVariables>;

interface CreateContactRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateContactVariables): MutationRef<CreateContactData, CreateContactVariables>;
}
export const createContactRef: CreateContactRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createContact(dc: DataConnect, vars: CreateContactVariables): MutationPromise<CreateContactData, CreateContactVariables>;

interface CreateContactRef {
  ...
  (dc: DataConnect, vars: CreateContactVariables): MutationRef<CreateContactData, CreateContactVariables>;
}
export const createContactRef: CreateContactRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createContactRef:
```typescript
const name = createContactRef.operationName;
console.log(name);
```

### Variables
The `CreateContact` mutation requires an argument of type `CreateContactVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateContactVariables {
  phoneNumber: string;
  name: string;
  consentStatus: string;
  email?: string | null;
  tags?: string[] | null;
}
```
### Return Type
Recall that executing the `CreateContact` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateContactData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateContactData {
  contact_insert: Contact_Key;
}
```
### Using `CreateContact`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createContact, CreateContactVariables } from '@dataconnect/generated';

// The `CreateContact` mutation requires an argument of type `CreateContactVariables`:
const createContactVars: CreateContactVariables = {
  phoneNumber: ..., 
  name: ..., 
  consentStatus: ..., 
  email: ..., // optional
  tags: ..., // optional
};

// Call the `createContact()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createContact(createContactVars);
// Variables can be defined inline as well.
const { data } = await createContact({ phoneNumber: ..., name: ..., consentStatus: ..., email: ..., tags: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createContact(dataConnect, createContactVars);

console.log(data.contact_insert);

// Or, you can use the `Promise` API.
createContact(createContactVars).then((response) => {
  const data = response.data;
  console.log(data.contact_insert);
});
```

### Using `CreateContact`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createContactRef, CreateContactVariables } from '@dataconnect/generated';

// The `CreateContact` mutation requires an argument of type `CreateContactVariables`:
const createContactVars: CreateContactVariables = {
  phoneNumber: ..., 
  name: ..., 
  consentStatus: ..., 
  email: ..., // optional
  tags: ..., // optional
};

// Call the `createContactRef()` function to get a reference to the mutation.
const ref = createContactRef(createContactVars);
// Variables can be defined inline as well.
const ref = createContactRef({ phoneNumber: ..., name: ..., consentStatus: ..., email: ..., tags: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createContactRef(dataConnect, createContactVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.contact_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.contact_insert);
});
```

