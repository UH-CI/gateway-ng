/**
 * Tapis Systems API
 * The Tapis Systems API provides for management of Tapis Systems including access and transfer methods, permissions and credentials.
 *
 * The version of the OpenAPI document: 0.1
 * Contact: cicsupport@tacc.utexas.edu
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { Capability } from './capability';


export interface ReqUpdateSystem { 
    description?: string;
    host?: string;
    enabled?: boolean;
    effectiveUserId?: string;
    defaultAccessMethod?: ReqUpdateSystem.DefaultAccessMethodEnum;
    transferMethods?: Array<ReqUpdateSystem.TransferMethodsEnum>;
    port?: number;
    useProxy?: boolean;
    proxyHost?: string;
    proxyPort?: number;
    jobCapabilities?: Array<Capability>;
    tags?: Array<string>;
    notes?: object;
}
export namespace ReqUpdateSystem {
    export type DefaultAccessMethodEnum = 'PASSWORD' | 'PKI_KEYS' | 'ACCESS_KEY' | 'CERT';
    export const DefaultAccessMethodEnum = {
        PASSWORD: 'PASSWORD' as DefaultAccessMethodEnum,
        PKIKEYS: 'PKI_KEYS' as DefaultAccessMethodEnum,
        ACCESSKEY: 'ACCESS_KEY' as DefaultAccessMethodEnum,
        CERT: 'CERT' as DefaultAccessMethodEnum
    };
    export type TransferMethodsEnum = 'SFTP' | 'S3';
    export const TransferMethodsEnum = {
        SFTP: 'SFTP' as TransferMethodsEnum,
        S3: 'S3' as TransferMethodsEnum
    };
}

