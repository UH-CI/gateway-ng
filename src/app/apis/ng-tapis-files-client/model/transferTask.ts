/**
 * Tapis Files API
 * My API
 *
 * The version of the OpenAPI document: 0.0
 * Contact: cicsupport@tacc.utexas.edu
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface TransferTask { 
    id?: number;
    tenantId?: string;
    username?: string;
    sourceSystemId?: string;
    sourcePath?: string;
    destinationSystemId?: string;
    destinationPath?: string;
    totalBytes?: number;
    bytesTransferred?: number;
    /**
     * Unique ID of the task.
     */
    uuid?: string;
    /**
     * The status of the task, such as PENDING, IN_PROGRESS, COMPLETED, CANCELLED
     */
    status?: TransferTask.StatusEnum;
    /**
     * Timestamp in UTC of task creation.
     */
    created?: number;
}
export namespace TransferTask {
    export type StatusEnum = 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    export const StatusEnum = {
        ACCEPTED: 'ACCEPTED' as StatusEnum,
        INPROGRESS: 'IN_PROGRESS' as StatusEnum,
        COMPLETED: 'COMPLETED' as StatusEnum,
        CANCELLED: 'CANCELLED' as StatusEnum
    };
}

