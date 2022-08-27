import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Center, Heading, HStack, IconButton, List, ListItem, Spinner, Stack, Text, useDisclosure } from '@chakra-ui/react'
import { User } from 'firebase/auth'
import { useContext } from 'react'
import { FiPlus } from 'react-icons/fi'
import { Link, useSearchParams } from 'react-router-dom'
import UserContext from '../../../context/UserContext'
import { ErrorTypes, FirestoreDoc } from '../../../hooks/FirestoreHooks'
import { EmailTemplate } from '../../../types/email'
import { AddEmailTemplateIconButton } from '../../functional/dashboard'
import { AddEmailTemplateButton } from '../../functional/dashboard/AddEmailTemplate'

type Props = {
    isLoading: boolean,
    error: ErrorTypes,
    emailTemplates: FirestoreDoc<EmailTemplate>[] | null,
}

export const EmailTemplatesList = ({ isLoading, error, emailTemplates }: Props) => {



    return (
        <Box w="320px" bg="gray.50" h="100vh" pos={'fixed'}>
            <HStack pl="4" py="4" spacing='0' justify={'space-between'}>
                <Heading as='h2' textTransform={'uppercase'} fontWeight='500' fontSize='xs' color='gray.600'>Email Templates</Heading>
                <AddEmailTemplateIconButton />
            </HStack>
            {error && <Alert px="2" py="6" mx="auto" maxW="300px" variant='subtle' rounded="md" status='error' flexDirection={'column'} justifyContent='center' textAlign={'center'}>
                <AlertIcon mr={0} boxSize='40px' />
                <AlertTitle my={4} mb={1} fontSize='sm' lineHeight={'1.5'}>There was an error while loading the email templates.</AlertTitle>
                <AlertDescription fontSize={'xs'} lineHeight='1.5'>{error.message}<br />[{error.code}]</AlertDescription>
            </Alert>}
            {isLoading && <Center p="4" w="full"><Spinner /></Center>}
            {emailTemplates && <List spacing='0' pt='4'>
                {emailTemplates.length === 0 ?
                    <Stack textAlign={'center'} py='8'>
                        <Text color='gray.500' fontSize='sm'>No email templates have been created.</Text>
                        <Box>
                            <AddEmailTemplateButton size='sm' colorScheme={'blue'} variant='link'>
                                Create one?
                            </AddEmailTemplateButton>
                        </Box>

                    </Stack>


                    :
                    emailTemplates.map(template => <EmailTemplateListItem key={template.id} template={template} />)}
            </List>}
        </Box>
    )
}

export const EmailTemplateListItem = ({ template }: { template: FirestoreDoc<EmailTemplate> }) => {
    const user = useContext(UserContext) as User
    const name = import.meta.env.VITE_MULTI_USER_DEMO ? template.id.split(user.uid + '_')[1] : template.id

    let [searchParams] = useSearchParams()
    const isCurrent = searchParams.get('template') === template.id
    return <ListItem px='4' py='2' _hover={{ bg: "gray.100" }} bg={isCurrent ? "gray.100" : "gray.50"} borderLeft={"4px solid"} borderLeftColor={isCurrent ? "blue.400" : "transparent"}>
        <Stack spacing='0' overflow={'hidden'} textOverflow='ellipsis' whiteSpace={'nowrap'} as={Link} to={`/dashboard?template=${template.id}`}>
            <Text fontSize='sm' fontWeight='500'>{name}</Text>
            <Text fontSize='xs' fontWeight='300'>{template.subject}</Text>
        </Stack>
    </ListItem>
}

