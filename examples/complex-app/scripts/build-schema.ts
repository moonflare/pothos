import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { printSchema } from 'graphql';
import { printSubgraphSchema } from '@apollo/subgraph';
import { schema } from '../src/schema';

writeFileSync(resolve(module.filename, '../../schema.graphql'), printSchema(schema));

writeFileSync(
  resolve(module.filename, '../../federated-schema.graphql'),
  printSubgraphSchema(schema),
);
