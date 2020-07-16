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
/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent, HttpParameterCodec }       from '@angular/common/http';
import { CustomHttpParameterCodec }                          from '../encoder';
import { Observable }                                        from 'rxjs';

import { ReqCreateSystem } from '../model/models';
import { ReqUpdateSystem } from '../model/models';
import { RespBasic } from '../model/models';
import { RespChangeCount } from '../model/models';
import { RespResourceUrl } from '../model/models';
import { RespSystem } from '../model/models';
import { RespSystemArray } from '../model/models';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';



@Injectable({
  providedIn: 'root'
})
export class SystemsService {

    protected basePath = 'http://localhost:8080';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();
    public encoder: HttpParameterCodec;

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (configuration) {
            this.configuration = configuration;
        }
        if (typeof this.configuration.basePath !== 'string') {
            if (typeof basePath !== 'string') {
                basePath = this.basePath;
            }
            this.configuration.basePath = basePath;
        }
        this.encoder = this.configuration.encoder || new CustomHttpParameterCodec();
    }



    private addToHttpParams(httpParams: HttpParams, value: any, key?: string): HttpParams {
        if (typeof value === "object" && value instanceof Date === false) {
            httpParams = this.addToHttpParamsRecursive(httpParams, value);
        } else {
            httpParams = this.addToHttpParamsRecursive(httpParams, value, key);
        }
        return httpParams;
    }

    private addToHttpParamsRecursive(httpParams: HttpParams, value?: any, key?: string): HttpParams {
        if (value == null) {
            return httpParams;
        }

        if (typeof value === "object") {
            if (Array.isArray(value)) {
                (value as any[]).forEach( elem => httpParams = this.addToHttpParamsRecursive(httpParams, elem, key));
            } else if (value instanceof Date) {
                if (key != null) {
                    httpParams = httpParams.append(key,
                        (value as Date).toISOString().substr(0, 10));
                } else {
                   throw Error("key may not be null if value is Date");
                }
            } else {
                Object.keys(value).forEach( k => httpParams = this.addToHttpParamsRecursive(
                    httpParams, value[k], key != null ? `${key}.${k}` : k));
            }
        } else if (key != null) {
            httpParams = httpParams.append(key, value);
        } else {
            throw Error("key may not be null if value is not object or array");
        }
        return httpParams;
    }

    /**
     * Change owner of a system
     * Change owner of a system.
     * @param systemName 
     * @param userName 
     * @param pretty 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public changeSystemOwner(systemName: string, userName: string, pretty?: boolean, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<RespChangeCount>;
    public changeSystemOwner(systemName: string, userName: string, pretty?: boolean, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<RespChangeCount>>;
    public changeSystemOwner(systemName: string, userName: string, pretty?: boolean, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<RespChangeCount>>;
    public changeSystemOwner(systemName: string, userName: string, pretty?: boolean, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        if (systemName === null || systemName === undefined) {
            throw new Error('Required parameter systemName was null or undefined when calling changeSystemOwner.');
        }
        if (userName === null || userName === undefined) {
            throw new Error('Required parameter userName was null or undefined when calling changeSystemOwner.');
        }

        let queryParameters = new HttpParams({encoder: this.encoder});
        if (pretty !== undefined && pretty !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>pretty, 'pretty');
        }

        let headers = this.defaultHeaders;

        // authentication (TapisJWT) required
        if (this.configuration.apiKeys) {
            const key: string | undefined = this.configuration.apiKeys["TapisJWT"] || this.configuration.apiKeys["X-Tapis-Token"];
            if (key) {
                headers = headers.set('X-Tapis-Token', key);
            }
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
        }

        return this.httpClient.post<RespChangeCount>(`${this.configuration.basePath}/systems/v2/${encodeURIComponent(String(systemName))}/changeOwner/${encodeURIComponent(String(userName))}`,
            null,
            {
                params: queryParameters,
                responseType: <any>responseType,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Create a system
     * Create a system using a request body. System name must be unique within a tenant and can be composed of alphanumeric characters and the following special characters: [-._~]. Name must begin with an alphabetic character and can be no more than 256 characters in length. Description is optional with a maximum length of 2048 characters.
     * @param reqCreateSystem A JSON object specifying information for the system to be created.
     * @param pretty 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public createSystem(reqCreateSystem: ReqCreateSystem, pretty?: boolean, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<RespResourceUrl>;
    public createSystem(reqCreateSystem: ReqCreateSystem, pretty?: boolean, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<RespResourceUrl>>;
    public createSystem(reqCreateSystem: ReqCreateSystem, pretty?: boolean, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<RespResourceUrl>>;
    public createSystem(reqCreateSystem: ReqCreateSystem, pretty?: boolean, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        if (reqCreateSystem === null || reqCreateSystem === undefined) {
            throw new Error('Required parameter reqCreateSystem was null or undefined when calling createSystem.');
        }

        let queryParameters = new HttpParams({encoder: this.encoder});
        if (pretty !== undefined && pretty !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>pretty, 'pretty');
        }

        let headers = this.defaultHeaders;

        // authentication (TapisJWT) required
        if (this.configuration.apiKeys) {
            const key: string | undefined = this.configuration.apiKeys["TapisJWT"] || this.configuration.apiKeys["X-Tapis-Token"];
            if (key) {
                headers = headers.set('X-Tapis-Token', key);
            }
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        let responseType: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
        }

        return this.httpClient.post<RespResourceUrl>(`${this.configuration.basePath}/systems/v2/`,
            reqCreateSystem,
            {
                params: queryParameters,
                responseType: <any>responseType,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Soft delete a system given the system name
     * Soft delete a system given the system name. 
     * @param systemName 
     * @param pretty 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public deleteSystemByName(systemName: string, pretty?: boolean, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<RespChangeCount>;
    public deleteSystemByName(systemName: string, pretty?: boolean, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<RespChangeCount>>;
    public deleteSystemByName(systemName: string, pretty?: boolean, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<RespChangeCount>>;
    public deleteSystemByName(systemName: string, pretty?: boolean, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        if (systemName === null || systemName === undefined) {
            throw new Error('Required parameter systemName was null or undefined when calling deleteSystemByName.');
        }

        let queryParameters = new HttpParams({encoder: this.encoder});
        if (pretty !== undefined && pretty !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>pretty, 'pretty');
        }

        let headers = this.defaultHeaders;

        // authentication (TapisJWT) required
        if (this.configuration.apiKeys) {
            const key: string | undefined = this.configuration.apiKeys["TapisJWT"] || this.configuration.apiKeys["X-Tapis-Token"];
            if (key) {
                headers = headers.set('X-Tapis-Token', key);
            }
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
        }

        return this.httpClient.delete<RespChangeCount>(`${this.configuration.basePath}/systems/v2/${encodeURIComponent(String(systemName))}`,
            {
                params: queryParameters,
                responseType: <any>responseType,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Retrieve information for a system
     * Retrieve information for a system given the system name. Use query parameter returnCredentials&#x3D;true to have effectiveUserId access credentials included in the response. Use query parameter accessMethod&#x3D;&lt;method&gt; to override default access method.
     * @param systemName 
     * @param returnCredentials 
     * @param accessMethod 
     * @param pretty 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getSystemByName(systemName: string, returnCredentials?: boolean, accessMethod?: string, pretty?: boolean, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<RespSystem>;
    public getSystemByName(systemName: string, returnCredentials?: boolean, accessMethod?: string, pretty?: boolean, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<RespSystem>>;
    public getSystemByName(systemName: string, returnCredentials?: boolean, accessMethod?: string, pretty?: boolean, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<RespSystem>>;
    public getSystemByName(systemName: string, returnCredentials?: boolean, accessMethod?: string, pretty?: boolean, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        if (systemName === null || systemName === undefined) {
            throw new Error('Required parameter systemName was null or undefined when calling getSystemByName.');
        }

        let queryParameters = new HttpParams({encoder: this.encoder});
        if (returnCredentials !== undefined && returnCredentials !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>returnCredentials, 'returnCredentials');
        }
        if (accessMethod !== undefined && accessMethod !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>accessMethod, 'accessMethod');
        }
        if (pretty !== undefined && pretty !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>pretty, 'pretty');
        }

        let headers = this.defaultHeaders;

        // authentication (TapisJWT) required
        if (this.configuration.apiKeys) {
            const key: string | undefined = this.configuration.apiKeys["TapisJWT"] || this.configuration.apiKeys["X-Tapis-Token"];
            if (key) {
                headers = headers.set('X-Tapis-Token', key);
            }
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
        }

        return this.httpClient.get<RespSystem>(`${this.configuration.basePath}/systems/v2/${encodeURIComponent(String(systemName))}`,
            {
                params: queryParameters,
                responseType: <any>responseType,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Retrieve list of systems
     * Retrieve list of systems.
     * @param pretty 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getSystems(pretty?: boolean, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<RespSystemArray>;
    public getSystems(pretty?: boolean, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<RespSystemArray>>;
    public getSystems(pretty?: boolean, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<RespSystemArray>>;
    public getSystems(pretty?: boolean, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {

        let queryParameters = new HttpParams({encoder: this.encoder});
        if (pretty !== undefined && pretty !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>pretty, 'pretty');
        }

        let headers = this.defaultHeaders;

        // authentication (TapisJWT) required
        if (this.configuration.apiKeys) {
            const key: string | undefined = this.configuration.apiKeys["TapisJWT"] || this.configuration.apiKeys["X-Tapis-Token"];
            if (key) {
                headers = headers.set('X-Tapis-Token', key);
            }
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
        }

        return this.httpClient.get<RespSystemArray>(`${this.configuration.basePath}/systems/v2/`,
            {
                params: queryParameters,
                responseType: <any>responseType,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Update a system
     * Update attributes for a system. Only certain attributes may be updated: description, host, enabled, effectiveUserId, defaultAccessMethod, transferMethods, port, useProxy, proxyHost, proxyPort, jobCapabilities, tags, notes.
     * @param systemName 
     * @param reqUpdateSystem A JSON object specifying changes to be applied.
     * @param pretty 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public updateSystem(systemName: string, reqUpdateSystem: ReqUpdateSystem, pretty?: boolean, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<RespResourceUrl>;
    public updateSystem(systemName: string, reqUpdateSystem: ReqUpdateSystem, pretty?: boolean, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<RespResourceUrl>>;
    public updateSystem(systemName: string, reqUpdateSystem: ReqUpdateSystem, pretty?: boolean, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<RespResourceUrl>>;
    public updateSystem(systemName: string, reqUpdateSystem: ReqUpdateSystem, pretty?: boolean, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        if (systemName === null || systemName === undefined) {
            throw new Error('Required parameter systemName was null or undefined when calling updateSystem.');
        }
        if (reqUpdateSystem === null || reqUpdateSystem === undefined) {
            throw new Error('Required parameter reqUpdateSystem was null or undefined when calling updateSystem.');
        }

        let queryParameters = new HttpParams({encoder: this.encoder});
        if (pretty !== undefined && pretty !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>pretty, 'pretty');
        }

        let headers = this.defaultHeaders;

        // authentication (TapisJWT) required
        if (this.configuration.apiKeys) {
            const key: string | undefined = this.configuration.apiKeys["TapisJWT"] || this.configuration.apiKeys["X-Tapis-Token"];
            if (key) {
                headers = headers.set('X-Tapis-Token', key);
            }
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        let responseType: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
        }

        return this.httpClient.patch<RespResourceUrl>(`${this.configuration.basePath}/systems/v2/${encodeURIComponent(String(systemName))}`,
            reqUpdateSystem,
            {
                params: queryParameters,
                responseType: <any>responseType,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
