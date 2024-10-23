// src/components/SendInvitationDialog.tsx
import React, { useState } from 'react';
import Dialog from '@/components/ui/Dialog';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';

import { SendInvitationRequest } from '@/@types/invitations';
import { useAppDispatch } from '@/store/configureStore';
import { sendInvitation } from '@/store/invitation/invitationActions';

interface SendInvitationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
}

const expirationOptions = [
  { value: '1.00:00:00', label: '۱ روز' },
  { value: '3.00:00:00', label: '۳ روز' },
  { value: '7.00:00:00', label: '۱ هفته' },
];

const SendInvitationDialog: React.FC<SendInvitationDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onError,
}) => {
  const dispatch = useAppDispatch();
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [expirationDuration, setExpirationDuration] = useState<string | null>(null);
  const [sendingInvitation, setSendingInvitation] = useState<boolean>(false);

  const handleSendInvitation = async () => {
    if (!phoneNumber || !expirationDuration) {
      onError('شماره تلفن و مدت انقضا الزامی است.');
      return;
    }

    setSendingInvitation(true);
    try {
      const payload: SendInvitationRequest = { phoneNumber, expirationDuration };
      const resultAction = await dispatch(sendInvitation(payload));
      if (sendInvitation.fulfilled.match(resultAction)) {
        toast.push(
          <Notification title="موفقیت" type="success">
            دعوت‌نامه با موفقیت ارسال شد.
          </Notification>
        );
        onSuccess();
        onClose();
      } else {
        if (resultAction.payload) {
          onError(resultAction.payload);
        } else {
          onError('ارسال دعوت‌نامه ناموفق بود.');
        }
      }
    } catch (error) {
      onError('ارسال دعوت‌نامه ناموفق بود.');
    } finally {
      setSendingInvitation(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <h5 className="mb-4">ارسال دعوت‌نامه</h5>
      <div className="mb-4">
        <label className="block mb-1">شماره تلفن:</label>
        <Input
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="شماره تلفن را وارد کنید"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">مدت انقضا:</label>
        <Select
          placeholder="لطفا انتخاب کنید"
          options={expirationOptions}
          value={expirationOptions.find((option) => option.value === expirationDuration)}
          onChange={(option) => setExpirationDuration(option?.value ?? '')}
        />
      </div>
      <div className="text-right mt-6">
        <Button className="ltr:mr-2" variant="plain" onClick={onClose}>
          لغو
        </Button>
        <Button variant="solid" onClick={handleSendInvitation} disabled={sendingInvitation}>
          {sendingInvitation ? 'در حال ارسال...' : 'ارسال'}
        </Button>
      </div>
    </Dialog>
  );
};

export default SendInvitationDialog;
