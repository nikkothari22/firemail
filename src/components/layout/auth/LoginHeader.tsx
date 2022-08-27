import { Box, Heading, HStack, Stack, Text } from "@chakra-ui/react"

export const LoginHeader = () => {
    return (
        <Stack textAlign={'center'} align='center'>
            <HStack fontSize={'xxx-large'} spacing='4'>
                <Text as='span'>
                    🔥
                </Text>
                <Text as='span' color='gray.400' fontWeight='200' fontSize={'xx-large'}>+</Text>
                <Text as='span'>
                    ✉️
                </Text>
            </HStack>
            <Heading>Firemail</Heading>
            <Text>Manage your Firebase email templates</Text>
        </Stack>
    )
}