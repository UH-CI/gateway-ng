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
import { Credential } from './credential';


export interface RespCredential { 
    status?: string;
    message?: string;
    version?: string;
    result?: Credential;
}

