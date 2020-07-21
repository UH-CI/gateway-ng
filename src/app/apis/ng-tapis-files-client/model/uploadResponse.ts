import { respLinks } from './respLinks';

export interface UploadResponse {
    internalUsername?: any;
    lastModified?: string;
    name?: string;
    nativeFormat?: string;
    owner?: string;
    source?: string;
    status?: string;
    systemId?: string;
    uuid?: string;
    _links?: respLinks;
}