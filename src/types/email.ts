import { UserLog } from "../hooks/FirestoreHooks";

export interface EmailTemplate {
    createdBy?: UserLog,
    lastUpdatedBy?: UserLog,
    html: string,
    subject: string,
    tags: string[]
}