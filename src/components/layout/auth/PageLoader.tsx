import { Center, Spinner } from '@chakra-ui/react'

export const PageLoader = () => {
    return (
        <Center width="100vw" height="100vh">
            <Spinner />
        </Center>
    )
}