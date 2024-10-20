const endpointConfig = {
    // Authentication endpoints
    authSignIn: '/auth/login',
    authSignUp: '/auth/register',
    authProfile: '/auth/profile',
    signOut: '/sign-out',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
    refreshToken: '/auth/refresh-token',

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

    // Role and Permission endpoints
    getRoles: '/tenant-roles', // Fetch all roles for a tenant
    createRole: '/tenant-roles', // Create a new role
    updateRole: (roleId: string) => `/tenant-roles/${roleId}`, // Update a role
    deleteRole: (roleId: string) => `/tenant-roles/${roleId}`, // Delete a role
    getPermissions: '/tenant-roles/permissions', // Fetch all permission groups
   

    getProjects: '/projects',
    getProjectDetails: (projectId: string) => `/projects/${projectId}`,
    createProject: '/projects',
    updateProject: (projectId: string) => `/projects/${projectId}`,
    deleteProject: (projectId: string) => `/projects/${projectId}`,
    getSprintsByProjectId: (projectId: string) => `/projects/${projectId}/sprints`,
    getBoardsBySprintId: (sprintId: string) => `/projects/sprints/${sprintId}/boards`,
    getTasksByBoardId: (boardId: string) => `/projects/boards/${boardId}/tasks`,
    getBoardDetailsById: (boardId: string) => `/projects/boards/${boardId}/details`,
}

export default endpointConfig;
