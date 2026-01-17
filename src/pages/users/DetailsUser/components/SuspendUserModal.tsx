import { Button, Dialog } from '@/components/ui'
import React from 'react'

type SuspendModalProps = {
    dialogIsOpen: boolean
    onDialogClose: () => void
    onDialogConfirm: () => void
    firstName?: string
    lastName?: string
    isActive?: boolean
    isLoading: boolean
}
const SuspendUserModal = ({
    dialogIsOpen,
    onDialogClose,
    onDialogConfirm,
    firstName,
    lastName,
    isActive,
    isLoading,
}: SuspendModalProps) => {
    return (
        <Dialog
            isOpen={dialogIsOpen}
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
            style={{
                content: {
                    marginTop: 250,
                },
            }}
        >
            <h5 className="mb-4 text-center">
                {isActive ? 'Suspend User Account' : 'Activation User Account'}
            </h5>
            <p>
                {isActive ? (
                    <>
                        Are you sure you want to suspend{' '}
                        <strong>{`${firstName} ${lastName}`}</strong>? This will
                        immediately revoke their access to all platform features
                        and active sessions.
                    </>
                ) : (
                    <>
                        Are you sure you want to activate{' '}
                        <strong>{`${firstName} ${lastName}`}</strong>? This will
                        restore their access to all platform features and active
                        sessions.
                    </>
                )}
            </p>
            <div className="text-right mt-6">
                <Button
                    className="ltr:mr-2 rtl:ml-2"
                    variant="plain"
                    onClick={onDialogClose}
                >
                    Cancel
                </Button>
                <Button
                    variant="solid"
                    onClick={onDialogConfirm}
                    loading={isLoading}
                >
                    {isActive ? 'Confirm Suspension' : 'Confirm Activation'}
                </Button>
            </div>
        </Dialog>
    )
}

export default SuspendUserModal
