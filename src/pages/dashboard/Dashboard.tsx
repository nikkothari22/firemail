import { HStack } from '@chakra-ui/react'
import React from 'react'
import { EmailTemplates } from '../../components/functional/dashboard'

type Props = {}

export const Dashboard = (props: Props) => {
    return (
        <HStack h="100vh">
            <EmailTemplates />
        </HStack>

    )
}