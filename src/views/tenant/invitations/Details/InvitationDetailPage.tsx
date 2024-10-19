import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import { apiGetInvitationDetails, apiAcceptInvitation, apiRejectInvitation } from '@/services/InvitationService';
import { apiSignUp } from '@/services/AuthService'; // Assume this exists
import { useAuth } from '@/auth'; // Custom hook for authentication
import { InvitationDetails } from '@/@types/invitations';

const InvitationDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const { authenticated } = useAuth(); // Get authentication status
    const navigate = useNavigate();
    const [invitation, setInvitation] = useState<InvitationDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [registrationForm, setRegistrationForm] = useState({
        fullName: '',
        email: '',
        password: '',
        phoneNumber: '',
    });

    const [isRegistered, setIsRegistered] = useState(false); // Track if registration was successful

    useEffect(() => {
        const fetchInvitation = async () => {
            setLoading(true);
            try {
                if (id == null) return;
                const response = await apiGetInvitationDetails(id);
                setInvitation(response);
                setRegistrationForm((prev) => ({
                    ...prev,
                    phoneNumber: response.invitation.phoneNumber,
                }));
            } catch (error) {
                toast.push(
                    <Notification title="خطا" type="danger">
                        بارگیری جزئیات دعوت‌نامه ناموفق بود.
                    </Notification>
                );
            } finally {
                setLoading(false);
            }
        };

        fetchInvitation();
    }, [id]);

    const handleAccept = async () => {
        setProcessing(true);
        try {
            if (id == null) return;
            await apiAcceptInvitation(id);
            toast.push(
                <Notification title="موفقیت" type="success">
                    دعوت‌نامه با موفقیت پذیرفته شد.
                </Notification>
            );
            if (authenticated) {
                navigate('/home'); // Redirect to home if authenticated
            } else {
                navigate('/sign-in'); // Redirect to login if not authenticated
            }
        } catch (error) {
            toast.push(
                <Notification title="خطا" type="danger">
                    پذیرش دعوت‌نامه ناموفق بود.
                </Notification>
            );
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async () => {
        setProcessing(true);
        try {
            if (id == null) return;
            await apiRejectInvitation(id);
            toast.push(
                <Notification title="موفقیت" type="success">
                    دعوت‌نامه با موفقیت رد شد.
                </Notification>
            );
            if (authenticated) {
                navigate('/home'); // Redirect to home if authenticated
            } else {
                navigate('/sign-in'); // Redirect to login if not authenticated
            }
        } catch (error) {
            toast.push(
                <Notification title="خطا" type="danger">
                    رد دعوت‌نامه ناموفق بود.
                </Notification>
            );
        } finally {
            setProcessing(false);
        }
    };

    const handleRegister = async () => {
        setProcessing(true);
        try {
            await apiSignUp({
                fullName: registrationForm.fullName,
                email: registrationForm.email,
                phoneNumber: registrationForm.phoneNumber,
                password: registrationForm.password,
            });
            toast.push(
                <Notification title="موفقیت" type="success">
                    کاربر با موفقیت ثبت‌نام شد.
                </Notification>
            );
            setIsRegistered(true); // Show accept/reject form after registration
        } catch (error) {
            toast.push(
                <Notification title="خطا" type="danger">
                    ثبت‌نام کاربر ناموفق بود.
                </Notification>
            );
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner size="40px" />
                <span className="ml-4 text-lg text-gray-500">در حال بارگیری جزئیات دعوت‌نامه...</span>
            </div>
        );
    }

    if (!invitation) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Card className="p-6 shadow-lg max-w-sm w-full text-center">
                    <p className="text-lg font-medium text-gray-700">دعوت‌نامه یافت نشد</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="flex justify-center items-center">
                <Card className="p-4 w-full max-w-lg shadow-xl rounded-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">جزئیات دعوت‌نامه</h2>

          

                    {(!invitation.userExists && !isRegistered) ? (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-700">برای پذیرش دعوت‌نامه {invitation.invitation.tenant.name} ثبت‌نام کنید</h3>
                            <label className="block text-sm text-gray-600">شماره تلفن</label>
                            <Input
                                className="mb-4"
                                value={registrationForm.phoneNumber}
                                disabled
                            />
                            <label className="block text-sm text-gray-600">نام کامل</label>
                            <Input
                                className="mb-4"
                                placeholder="نام کامل خود را وارد کنید"
                                value={registrationForm.fullName}
                                onChange={(e) => setRegistrationForm({ ...registrationForm, fullName: e.target.value })}
                            />
                            <label className="block text-sm text-gray-600">ایمیل</label>
                            <Input
                                className="mb-4"
                                placeholder="آدرس ایمیل خود را وارد کنید"
                                value={registrationForm.email}
                                onChange={(e) => setRegistrationForm({ ...registrationForm, email: e.target.value })}
                            />
                            <label className="block text-sm text-gray-600">رمز عبور</label>
                            <Input
                                className="mb-6"
                                type="password"
                                placeholder="رمز عبور ایجاد کنید"
                                value={registrationForm.password}
                                onChange={(e) => setRegistrationForm({ ...registrationForm, password: e.target.value })}
                            />
                            <Button
                                variant="solid"
                                size="lg"
                                className="w-full"
                                onClick={handleRegister}
                                disabled={processing}
                            >
                                {processing ? 'در حال ثبت‌نام...' : 'ثبت‌نام و ادامه'}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-700 mb-4"><strong>وضعیت:</strong> در انتظار</p>
                            <div className="flex space-x-4">
                                <Button
                                    variant="solid"
                                    size="lg"
                                    className="w-full"
                                    onClick={handleAccept}
                                    disabled={processing}
                                >
                                    {processing ? 'در حال پردازش...' : 'پذیرش دعوت‌نامه'}
                                </Button>
                                <Button
                                    size="lg"
                                    className="w-full"
                                    onClick={handleReject}
                                    disabled={processing}
                                >
                                    {processing ? 'در حال پردازش...' : 'رد دعوت‌نامه'}
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default InvitationDetailPage;
