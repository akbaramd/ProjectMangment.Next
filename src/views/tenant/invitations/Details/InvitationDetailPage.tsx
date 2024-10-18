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
                    <Notification title="Error" type="danger">
                        Failed to load invitation details.
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
                <Notification title="Success" type="success">
                    Invitation accepted successfully.
                </Notification>
            );
            if (authenticated) {
                navigate('/home'); // Redirect to home if authenticated
            } else {
                navigate('/sign-in'); // Redirect to login if not authenticated
            }
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger">
                    Failed to accept the invitation.
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
                <Notification title="Success" type="success">
                    Invitation rejected successfully.
                </Notification>
            );
            if (authenticated) {
                navigate('/home'); // Redirect to home if authenticated
            } else {
                navigate('/sign-in'); // Redirect to login if not authenticated
            }
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger">
                    Failed to reject the invitation.
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
                <Notification title="Success" type="success">
                    User registered successfully.
                </Notification>
            );
            setIsRegistered(true); // Show accept/reject form after registration
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger">
                    Failed to register user.
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
                <span className="ml-4 text-lg text-gray-500">Loading invitation details...</span>
            </div>
        );
    }

    if (!invitation) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Card className="p-6 shadow-lg max-w-sm w-full text-center">
                    <p className="text-lg font-medium text-gray-700">Invitation not found</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="flex justify-center items-center">
                <Card className="p-4 w-full max-w-lg shadow-xl rounded-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Invitation Details</h2>

                    <div className="text-left mb-6">
                        <p className="text-sm text-gray-600 mb-2"><strong>Phone Number:</strong> {invitation.invitation.phoneNumber}</p>
                        <p className="text-sm text-gray-600"><strong>Tenant name:</strong> {invitation.invitation.tenant.name}</p>
                    </div>

                    {(!invitation.userExists && !isRegistered) ? (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-700">Register to accept the invitation</h3>
                            <label className="block text-sm text-gray-600">Phone Number</label>
                            <Input
                                className="mb-4"
                                value={registrationForm.phoneNumber}
                                disabled
                            />
                            <label className="block text-sm text-gray-600">Full Name</label>
                            <Input
                                className="mb-4"
                                placeholder="Your full name"
                                value={registrationForm.fullName}
                                onChange={(e) => setRegistrationForm({ ...registrationForm, fullName: e.target.value })}
                            />
                            <label className="block text-sm text-gray-600">Email</label>
                            <Input
                                className="mb-4"
                                placeholder="Email address"
                                value={registrationForm.email}
                                onChange={(e) => setRegistrationForm({ ...registrationForm, email: e.target.value })}
                            />
                            <label className="block text-sm text-gray-600">Password</label>
                            <Input
                                className="mb-6"
                                type="password"
                                placeholder="Create a password"
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
                                {processing ? 'Registering...' : 'Register & Continue'}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-700 mb-4"><strong>Status:</strong> Pending</p>
                            <div className="flex space-x-4">
                                <Button
                                    variant="solid"
                                    size="lg"
                                    className="w-full"
                                    onClick={handleAccept}
                                    disabled={processing}
                                >
                                    {processing ? 'Processing...' : 'Accept Invitation'}
                                </Button>
                                <Button
                                    size="lg"
                                    className="w-full"
                                    onClick={handleReject}
                                    disabled={processing}
                                >
                                    {processing ? 'Processing...' : 'Reject Invitation'}
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
