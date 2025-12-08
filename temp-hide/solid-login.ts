const vaultBaseUrl = process.env.SOLID_VAULT_BASE_PATH;
import SolidNodeClient from 'solid-node-client';
import { MERGE } from 'solid-file-client';
const client = new SolidNodeClient();
const fileManager = client.getFileManager();

  type JSONResponse = {
    data?: {
      id: string;
    }
    errors?: Array<{ message: string }>
  }

export default async function getSession(): Promise<any>{
    try {
        let session = await client.login();
        if (session) {
            console.log(`Logged in as ${session.webId}.`);
            return session;
        } else {
            return Promise.reject(new Error(`Access denied`));
        }
    } catch(error: any) {
        return Promise.reject(error);
    }
}

export async function get(path: string): Promise<JSONResponse>{
    try {
            const loggedIn = await getSession();
            if(loggedIn){
                console.log(`Loading from ${vaultBaseUrl}`)
                const exists = await fileManager.itemExists(`${vaultBaseUrl}/${path}`);
                if (exists) {
                    return await fileManager.readFile( `${vaultBaseUrl}/${path}`, {merge: MERGE.KEEP_SOURCE } );
                } else {
                    return Promise.reject(new Error(`No item at path ${vaultBaseUrl}/${path}`));
                }
            } else {
                return Promise.reject(new Error(`Not logged in`));
            }
    } catch(error: any) {
        return Promise.reject(error);
    }
}