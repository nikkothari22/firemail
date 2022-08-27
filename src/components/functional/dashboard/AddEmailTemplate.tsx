import { ButtonProps, Button, IconButton, IconButtonProps, useDisclosure, chakra, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, Input, FormLabel, FormHelperText, Stack, FormErrorMessage, useToast, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react'
import React, { useContext, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FiPlus } from 'react-icons/fi'
import {
    Select,
    GroupBase,
    OptionBase
} from "chakra-react-select";
import { useFirestoreDocSet } from '../../../hooks/FirestoreHooks';
import UserContext from '../../../context/UserContext';
import { User } from 'firebase/auth';
import { EmailTemplate } from '../../../types/email';

export const AddEmailTemplateIconButton = (props: Partial<IconButtonProps>) => {
    const modalProps = useDisclosure()

    return <><IconButton aria-label='Create Email Template' variant="link" icon={<FiPlus />} p='0'
        _hover={{ borderColor: 'transparent', color: 'black' }}
        _focus={{ outline: 'none', color: 'black' }}
        _focusVisible={{ outline: 'none', color: 'black' }}
        {...props}
        onClick={modalProps.onOpen} />
        <AddEmailTemplateModal {...modalProps} />
    </>
}

export const AddEmailTemplateButton = (props: ButtonProps) => {
    const modalProps = useDisclosure()

    return <><Button aria-label='Create Email Template'
        {...props} onClick={modalProps.onOpen}>{props.children}</Button>
        <AddEmailTemplateModal {...modalProps} />
    </>
}
interface Props {
    isOpen: boolean,
    onClose: () => void,
}

interface ColorOption extends OptionBase {
    label: string;
    value: string;
    colorScheme: string;
}

interface Form {
    name: string,
    subject: string,
    tags: ColorOption[],
}

const tagOptions: ColorOption[] = [{
    label: "Notification",
    value: "Notification",
    colorScheme: "green"
}, {
    label: "Transactional",
    value: "Transactional",
    colorScheme: "blue"
}, {
    label: "Promotional",
    value: "Promotional",
    colorScheme: "purple"
}, {
    label: "Critical",
    value: "Critical",
    colorScheme: "red"
}]
const AddEmailTemplateModal = ({ isOpen, onClose }: Props) => {

    const user = useContext(UserContext) as User
    const [startDocUpload, loading, , error, resetFirestore] = useFirestoreDocSet()

    const toast = useToast()

    const { control, register, handleSubmit, formState: { errors }, reset } = useForm<Form>({
        defaultValues: {
            tags: []
        }
    })

    useEffect(() => {
        reset()
        resetFirestore()
    }, [isOpen])

    const uploadToFirestore = (data: Form) => {
        const docname = import.meta.env.VITE_MULTI_USER_DEMO ? `${user.uid}_${data.name.trim()}` : data.name.trim();
        const doc: EmailTemplate = {
            html: "",
            subject: data.subject.trim(),
            tags: data.tags.map(tag => tag.value),
        }

        startDocUpload(`${import.meta.env.VITE_EMAIL_TEMPLATES_COLLECTION}/${docname}`, doc)
            .then(() => {
                toast({
                    title: "Email template created",
                    duration: 1000,
                    status: "success",
                })
                onClose()
            })
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose} size='lg'>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Create Email Template</ModalHeader>
                <ModalCloseButton />
                <chakra.form onSubmit={handleSubmit(uploadToFirestore)}>
                    <ModalBody>
                        <Stack spacing={4}>
                            {error &&
                                <Alert status='error'>
                                    <AlertIcon />
                                    <Stack spacing={-1}>
                                        <AlertTitle fontSize={'sm'} mb='0' pb='0'>There was an error.</AlertTitle>
                                        <AlertDescription fontSize={'xs'}>{error?.message} [{error.code}]</AlertDescription>
                                    </Stack>
                                </Alert>
                            }
                            <FormControl isInvalid={!!errors?.name} isRequired isDisabled={loading}>
                                <FormLabel htmlFor="name">Name</FormLabel>
                                <Input {...register("name", { required: "Name is required", validate: (v) => !v.includes(" ") || "No spaces allowed" })} placeholder="e.g. transactionSuccessful" />
                                <FormHelperText>Cannot have spaces or special characters - this is your document name.</FormHelperText>
                                <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={!!errors?.subject} isRequired isDisabled={loading}>
                                <FormLabel htmlFor="subject">Subject</FormLabel>
                                <Input {...register("subject", { required: "Subject is required" })} placeholder="e.g. Thank you for your purchase of {{ item_name }}" />
                                <FormHelperText>Can contain Handlebar variables.</FormHelperText>
                            </FormControl>
                            <Controller
                                control={control}
                                name="tags"
                                render={({
                                    field: { onChange, onBlur, value, name, ref },
                                    fieldState: { error }
                                }) => (
                                    <FormControl isInvalid={!!error} isDisabled={loading}>
                                        <FormLabel>
                                            Tags
                                        </FormLabel>
                                        <Select<ColorOption, true, GroupBase<ColorOption>>
                                            isMulti
                                            ref={ref}
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            value={value}
                                            name={name}
                                            options={tagOptions}
                                            placeholder="Select some tags..."
                                            closeMenuOnSelect={false}
                                        />
                                    </FormControl>
                                )}
                            />
                        </Stack>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme={'blue'} type="submit" isLoading={loading}>Save</Button>
                    </ModalFooter>
                </chakra.form>
            </ModalContent>

        </Modal>
    )
}