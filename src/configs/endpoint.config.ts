const endpointConfig = {
    authSignIn: '/auth/login',
    authSignUp: '/auth/register',
    authProfile: '/auth/profile',
    signOut: '/sign-out',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',

    // Invitations endpoints
    getInvitations: `/invitations`,
    getInvitationDetails: (invitationId: string) => `/invitations/${invitationId}`,
    sendInvitation: `/invitations`,
    acceptInvitation: (invitationId: string) => `/invitations/${invitationId}/accept`,
    rejectInvitation: (invitationId: string) => `/invitations/${invitationId}/reject`,
    cancelInvitation: (invitationId: string) => `/invitations/${invitationId}/cancel`,
    resendInvitation: (invitationId: string) => `/invitations/${invitationId}/resend`,
    updateInvitation: (invitationId: string) => `/invitations/${invitationId}`,

    // Tenant endpoints
    getTenantInfo: `/tenants`, // Fetch tenant info
    getTenantMembers: `/tenants/members`, // Fetch all members of a tenant
    removeTenantMember: (memberId: string) => `/tenants/members/${memberId}`, // Remove tenant member
    updateTenantMemberRole: (memberId: string) => `/tenants/members/${memberId}/role`, // Update tenant member's role
}

export default endpointConfig;
