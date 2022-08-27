import { Box, ButtonGroup, HStack, IconButton } from '@chakra-ui/react'
import { signOut } from 'firebase/auth'
import React, { useContext } from 'react'
import { FiLogOut } from 'react-icons/fi'
import { Navigate, Outlet } from 'react-router-dom'
import { auth } from '../../../config/fire'
import UserContext from '../../../context/UserContext'
import { Logo } from './Logo'

type Props = {}

export const Navbar = (props: Props) => {
    const user = useContext(UserContext)

    const logout = () => {
        signOut(auth)
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }
    return (
        <Box>
            {/* <HStack as='nav' px='4' py='1' bg='white' w="100vw" shadow={'sm'} borderBottom="1px solid" borderBottomColor="gray.50" spacing='6' justify={'flex-end'}> */}
            {/* <Logo /> */}
            <ButtonGroup pos='fixed' right={2} top={2}>
                <IconButton size='lg' icon={<FiLogOut />} aria-label='Logout' variant={'ghost'} colorScheme='blue' onClick={logout} />
            </ButtonGroup>
            <Outlet />
        </Box>

    )
}