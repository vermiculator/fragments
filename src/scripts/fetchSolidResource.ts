import fetch from 'node-fetch';
import { createDpopHeader, generateDpopKeyPair } from '@inrupt/solid-client-authn-core';
import { access } from 'node:fs/promises';
import { buildAuthenticatedFetch } from '@inrupt/solid-client-authn-core';

const dpopKey = await generateDpopKeyPair();

const credentials = {
    username: import.meta.env.SOLID_USERNAME,
    email:  import.meta.env.SOLID_EMAIL,
    pwd: import.meta.env.SOLID_PASSWORD,
    idp: import.meta.env.SOLID_IDP,
}

const paths = {
    base: `https://${credentials.username}.${credentials.idp}/${import.meta.env.SOLID_VAULT_BASE_PATH}/`,
    idp: `https://${credentials.username}.${credentials.idp}/.internal/idp/keys/`,
    token: `http://${credentials.username}.${credentials.idp}/.oidc/token`,
}

export default async function getSession(): Promise<{data?: {id: string, secret: string}, errors?: any}> {
    try {
        const response = await fetch(paths.idp, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                email: credentials.email,
                password: credentials.pwd,
                name: 'login-token',
            }),
        });
        console.log(response);
        return await response.json();
    } catch(error: any) {
        //console.log( error )         // full error response
        console.log( error.status )   // status code
        console.log( error.message ) // status code and statusText
        return Promise.reject(error);
    }
}

export async function fetchResourceAt(slug: string, currentToken?: Promise<any>, currentSession?: { id: string; secret: string; }){
    const path = `${paths.base}/${slug}`;
    try {
        const newSession = currentSession ?? (async () => {
            const response = await getSession();
            if (!response || !response.data) {
                return Promise.reject(new Error(`Access denied`));
            } else {
                return response.data;
            }
        })();
        const session = await newSession;
        if (!session) {
            throw new Error('Session error');
        }
        const accessToken = currentToken ?? await getToken(session);
        const authFetch = await buildAuthenticatedFetch(fetch, accessToken, { dpopKey });
        return await authFetch(path);
        //Accept: application/ld+json
    } catch(error: any) {
        return Promise.reject(error);
    }
}

export async function getToken(session: {id: string, secret: string}): Promise<any>{
    try {
        const authString = `${encodeURIComponent(session.id)}:${encodeURIComponent(session.secret)}`;
        const response = await fetch(paths.token, {
            method: 'POST',
                headers: {
                    authorization: `Basic ${Buffer.from(authString).toString('base64')}`,
                    'content-type': 'application/x-www-form-urlencoded',
                    dpop: await createDpopHeader(paths.token, 'POST', dpopKey),
                },
                body: 'grant_type=client_credentials&scope=webid',
            });
        return await response.json();
    } catch(error: any) {
        return Promise.reject(error);
    }
}