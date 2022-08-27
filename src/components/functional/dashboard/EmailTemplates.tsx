import { User } from 'firebase/auth'
import { collection, query, where } from 'firebase/firestore'
import React, { useContext } from 'react'
import { firestore } from '../../../config/fire'
import UserContext from '../../../context/UserContext'
import { useFirestoreCollectionPathListener, useFirestoreQueryListener } from '../../../hooks/FirestoreHooks'
import { EmailTemplate } from '../../../types/email'
import { EmailTemplatesList } from '../../layout/dashboard'

export const EmailTemplates = () => {
    if (import.meta.env.VITE_MULTI_USER_DEMO) {
        return <MultiUserEmailTemplates />
    }
    return (
        <GenericEmailTemplates />
    )
}

const MultiUserEmailTemplates = () => {
    const user = useContext(UserContext) as User

    const [emailTemplates, error] = useFirestoreQueryListener<EmailTemplate>(
        query(collection(firestore, import.meta.env.VITE_EMAIL_TEMPLATES_COLLECTION),
            where('createdBy.id', '==', user.uid)))

    return (
        <EmailTemplatesList
            isLoading={!emailTemplates && !error}
            error={error}
            emailTemplates={emailTemplates}
        />
    )

}

const GenericEmailTemplates = () => {

    const [emailTemplates, error] = useFirestoreCollectionPathListener<EmailTemplate>(import.meta.env.VITE_EMAIL_TEMPLATES_COLLECTION)

    return (
        <EmailTemplatesList
            isLoading={!emailTemplates && !error}
            error={error}
            emailTemplates={emailTemplates}
        />
    )

}