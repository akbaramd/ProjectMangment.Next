import React, { useState } from 'react';
import Dialog from '@/components/ui/Dialog';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import { apiSendInvitation } from '@/services/InvitationService';

interface SendInvitationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    onError: (message: string) => void;
}
const expirationOptions = [
    { value: '1.00:00:00', label: '1 day' },
    { value: '3.00:00:00', label: '3 days' },
    { value: '7.00:00:00', label: '1 week' },
];
const SendInvitationDialog: React.FC<SendInvitationDialogProps> = ({
                                                                       isOpen,
                                                                       onClose,
                                                                       onSuccess,
                                                                       onError,
                                                                   }) => {
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [expirationDuration, setExpirationDuration] = useState<string | null>(null);
    const [sendingInvitation, setSendingInvitation] = useState<boolean>(false);

    const handleSendInvitation = async () => {
        if (!phoneNumber || !expirationDuration) {
            onError('Phone number and expiration duration are required.');
            return;
        }

        setSendingInvitation(true);
        try {
            await apiSendInvitation({ phoneNumber, expirationDuration });
            toast.push(
                <Notification title="Success" type="success">
                    Invitation sent successfully.
                </Notification>
            );
            onSuccess();
            onClose();
        } catch (error) {
            onError('Failed to send invitation.');
        } finally {
            setSendingInvitation(false);
        }
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <h5 className="mb-4">Send Invitation</h5>
            <div className="mb-4">
                <label className="block mb-1">Phone Number:</label>
                <Input
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter phone number"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1">Expiration Duration:</label>
                <Select
                    placeholder="Please Select"
                    options={expirationOptions}
                    value={expirationOptions.find((option) => option.value === expirationDuration)}
                    onChange={(option) => setExpirationDuration(option?.value ?? '')}
                />
            </div>
            <div className="text-right mt-6">
                <Button className="ltr:mr-2" variant="plain" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="solid" onClick={handleSendInvitation} disabled={sendingInvitation}>
                    {sendingInvitation ? 'Sending...' : 'Send'}
                </Button>
            </div>
        </Dialog>
    );
};

export default SendInvitationDialog;
