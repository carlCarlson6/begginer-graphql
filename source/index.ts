import {ApolloServer, gql, ServerInfo, PubSub} from 'apollo-server'
import DbClient from './Repository/DbClient';
import { DocumentNode } from 'graphql';

const main = async () => {
    
    const client = await new DbClient().Connect();

    const typeDefs:DocumentNode = gql`
        type Query {
            hello(name: String): String
            user: User
        }

        type User {
            id: ID!
            username: String
            firstLetterOfName: String
        }

        type Error {
            field: String!
            message: String!
        }

        type RegisterResponse {
            error: [Error]
            user: User
        }

        input UserInfo{
            username: String! 
            password: String!
            age: Int
        }

        type Mutation {
            register(userInfo: UserInfo!): RegisterResponse!
            login(userInfo: UserInfo!): Boolean!
        }

        type Subscription {
            newUser: User!
        }
    `;

    const NEW_USER = 'NEW_USER';

    const resolvers = {
        Query: {
            hello: (parent: any, {name}: any) => `hello ${name}`,
            user: () => ({id: 1, username: 'bob'})
        },
        
        Mutation: {
            register: (parent: any, {userInfo: {username}}: any, context: any, info: any) => {
                const user = {username}
                context.pubsub.publish(NEW_USER, {newUser:user })
                return { error: null, user }
            },
            login: (parent: any, args: any, context: any, info: any) => {
                console.log(parent);
                return true;
            }
        },

        Subscription: {
            newUser: {
                subscribe: (parent: any, args: any, {pubsub}: any, info: any) => pubsub.asyncIterator(NEW_USER)
            }
        },

        User: {
            id: () => {
                return (Math.floor(Math.random() * (99999999999999999999999 - 1 + 1)) + 1);
            },
            firstLetterOfName: (parent: any) => {
                console.log(parent);                
                return parent.username[0];
            }
        }
    }

    const pubsub = new PubSub();
    
    const server = new ApolloServer({
        typeDefs, 
        resolvers,
        context: ({req, res}) => ({req, res, pubsub})
    })
    const serverInfo: ServerInfo = await server.listen(4000)
    console.log('server is running on', serverInfo.url)

}

main();