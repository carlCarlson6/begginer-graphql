import {ApolloServer, gql, ServerInfo} from 'apollo-server'
import DbClient from './Repository/DbClient';
import { DocumentNode } from 'graphql';

const main = async () => {
    
    const client = await new DbClient().Connect();

    const typeDefs:DocumentNode = gql`
        type Query {
            hello: String
        }

        type User {
            id: ID!
            username: String
        }

        type Error {
            field: String!
            message: String!
        }

        type RegisterResponse {
            error: [Error]
            user: User
        }

        type Mutation {
            register: User
        }
    `;

    const resolvers = {
        Query: {
            hello: () => 'hello world'
        },
        Mutation: {
            register: () => ({id: 1, username: 'carl'})
        }
    }


    
    const server = new ApolloServer({typeDefs, resolvers})
    const serverInfo: ServerInfo = await server.listen(4000)
    console.log('server is running on', serverInfo.url)

}

main();