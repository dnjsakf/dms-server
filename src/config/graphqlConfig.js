import { buildSchema } from 'graphql';
import { loadEnv } from '../utils/envUtil';

loadEnv();

// GraphQL Schema 정의
export const schema = buildSchema(`
    type Query {
      ping: String
    }
`);

// GraphQL Query Operate
export const root = {
    ping: () => ( 'pong' ),
}

