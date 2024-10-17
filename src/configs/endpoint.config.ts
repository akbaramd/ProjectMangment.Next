export const apiPrefix = '/api'

const endpointConfig = {
    signIn: '/auth/login',
    signOut: '/sign-out',
    signUp: '/sign-up',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',

    getInvitations: `/invitations`,
    getInvitationDetails: (invitationId: string) => `/invitations/${invitationId}`,
    sendInvitation: `/invitations`,
    acceptInvitation: (invitationId: string) => `/invitations/${invitationId}/accept`,
    rejectInvitation: (invitationId: string) => `/invitations/${invitationId}/reject`,
    cancelInvitation: (invitationId: string) => `/invitations/${invitationId}/cancel`,
    resendInvitation: (invitationId: string) => `/invitations/${invitationId}/resend`,
    updateInvitation: (invitationId: string) => `/invitations/${invitationId}`,
}



export default endpointConfig
