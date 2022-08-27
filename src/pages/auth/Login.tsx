import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, ButtonGroup, Center, HStack, Stack } from '@chakra-ui/react'
import React, { useContext, useEffect, useState } from 'react'
import { LoginHeader } from '../../components/layout/auth'
import { FaGithub, FaGoogle } from 'react-icons/fa'
import { AuthError, GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '../../config/fire'
import { getFirebaseAuthErrorMessage } from '../../utils/firebaseAuthErrorCodes'
import UserContext from '../../context/UserContext'
type Props = {}

export const Login = (props: Props) => {

    const user = useContext(UserContext)
    const [loading, setLoading] = useState<null | "email" | "github" | "google">(null)
    const [error, setError] = useState<null | AuthError>(null)
    //TODO: Add Email/Password login support
    // const loginWithEmailPassword = () => {

    // }
    const loginWithGoogle = () => {
        setLoading("google")
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .catch(handleError)
    }

    const loginWithGithub = () => {
        setLoading("github")
        const provider = new GithubAuthProvider();
        signInWithPopup(auth, provider)
            .catch(handleError)
    }

    const handleError = (e: AuthError) => {
        setError(e)
        setLoading(null)
    }

    return (
        <Center minH='100vh' w="100vw" bg='gray.50'>
            <Stack spacing='8' align='center'>
                <LoginHeader />
                {error && <Alert status='error'>
                    <AlertIcon />
                    <AlertTitle>There was an error.</AlertTitle>
                    <AlertDescription>{getFirebaseAuthErrorMessage(error.code)}</AlertDescription>
                </Alert>}
                <Stack spacing='4' minW='320px'>

                    <Button isDisabled={loading !== null} isLoading={loading === "google"} onClick={loginWithGoogle} bg='white' color='black' shadow={'sm'} border="2px solid" borderColor="gray.900" _hover={{ bg: 'black', color: 'white' }} leftIcon={<FaGoogle />}>
                        Login with Google
                    </Button>
                    <Button isDisabled={loading !== null} isLoading={loading === "github"} onClick={loginWithGithub} bg='white' color='black' shadow={'sm'} border="2px solid" borderColor="gray.900" _hover={{ bg: 'black', color: 'white' }} leftIcon={<FaGithub />}>
                        Login with Github
                    </Button>
                </Stack>
            </Stack>

        </Center>
    )
}