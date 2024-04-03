import serverFetchApi from "~/server/utils/serverFetchApi";
import type {H3Event} from "h3";
import {jwtVerify, JWTVerifyResult} from "jose";
import Session from "~/types/api/Session";

export default async function serverAuthenticate(event: H3Event, accessToken: string = ""): Promise<Session> {
    const res = await serverFetchApi(event, useRuntimeConfig().public.userinfoEndpoint, {}, accessToken)
    return await res.json()
}

export async function serverOnlyofficeAuthenticate(event: H3Event): Promise<JWTVerifyResult> {
    const runtimeConfig = useRuntimeConfig();
    const token = event.headers.get("authorization")?.replace('Bearer ', '') as string;

    const secret = new TextEncoder().encode(runtimeConfig.onlyofficeJwtSecret)
    return await jwtVerify(token, secret)
}
