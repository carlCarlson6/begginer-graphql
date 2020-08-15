import { Client } from "pg";
import { dbConn } from "./dbConn";

class DbClient {
    private _client: Client = new Client(dbConn);

    async Connect(): Promise<Client> {
        await this._client.connect();
        console.log('connected to db');
        return this._client;
    }
}

export default DbClient;