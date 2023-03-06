import { DateTimeResolver } from 'graphql-scalars';
import SchemaBuilder from '@pothos/core';
import DataloaderPlugin from '@pothos/plugin-dataloader';
import PrismaPlugin from '@pothos/plugin-prisma';
import PrismaUtilsPlugin from '@pothos/plugin-prisma-utils';
import RelayPlugin from '@pothos/plugin-relay';
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';
import SimpleObjectsPlugin from '@pothos/plugin-simple-objects';
import ValidationPlugin from '@pothos/plugin-validation';
import DirectivePlugin from '@pothos/plugin-directives';
import FederationPlugin from '@pothos/plugin-federation';
import type PrismaTypes from '../prisma/generated';
import { db } from './db';

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Scalars: {
    ID: {
      Output: number | string;
      Input: string;
    };
    DateTime: {
      Output: Date;
      Input: Date;
    };
  };
}>({
  plugins: [
    ScopeAuthPlugin,
    PrismaPlugin,
    PrismaUtilsPlugin,
    RelayPlugin,
    DataloaderPlugin,
    SimpleObjectsPlugin,
    ValidationPlugin,
    DirectivePlugin,
    FederationPlugin,
  ],
  authScopes: () => ({}),
  relayOptions: {
    clientMutationId: 'omit',
    cursorType: 'String',
  },
  prisma: {
    client: db,
  },
});

builder.queryType();
builder.mutationType();

builder.addScalarType('DateTime', DateTimeResolver, {});
