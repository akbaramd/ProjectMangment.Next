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
    createProject: '/projects',
    getProjectDetails: (projectId: string) => `/projects/${projectId}`,
    updateProject: (projectId: string) => `/projects/${projectId}`,
    deleteProject: (projectId: string) => `/projects/${projectId}`,
    
    getSprints:  `/sprints`,
    getSprintDetails: (sprintId: string) => `/sprints/${sprintId}`,
    createSprint: '/sprints',
    updateSprint: (sprintId: string) => `/sprints/${sprintId}`,
    deleteSprint: (sprintId: string) => `/sprints/${sprintId}`,


    getBoards: '/boards',
    getBoardDetails: (boardId: string) => `/boards/${boardId}`,
    createBoard: '/api/boards',
    updateBoard: (boardId: string) => `/boards/${boardId}`,
    deleteBoard: (boardId: string) => `/boards/${boardId}`,

    getBoardsBySprintId: (sprintId: string) => `/boards?sprintId=${sprintId}`,
    getTasksByBoardId: (boardId: string) => `/boards/${boardId}/tasks`,
    getBoardDetailsById: (boardId: string) => `/boards/${boardId}`,
}

export default endpointConfig;
