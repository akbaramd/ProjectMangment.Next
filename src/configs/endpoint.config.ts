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
    getInvitations: '/invitations',
    getInvitationDetails: (invitationId: string) => `/invitations/${invitationId}`,
    sendInvitation: '/invitations',
    acceptInvitation: (invitationId: string) => `/invitations/${invitationId}/accept`,
    rejectInvitation: (invitationId: string) => `/invitations/${invitationId}/reject`,
    cancelInvitation: (invitationId: string) => `/invitations/${invitationId}/cancel`,
    resendInvitation: (invitationId: string) => `/invitations/${invitationId}/resend`,
    updateInvitation: (invitationId: string) => `/invitations/${invitationId}`,

    // Tenant endpoints
    getTenantInfo: '/tenants',
    getTenantMembers: '/tenants/members',
    removeTenantMember: (memberId: string) => `/tenants/members/${memberId}`,
    updateTenantMemberRole: (memberId: string) => `/tenants/members/${memberId}/role`,

    // Role and Permission endpoints
    getRoles: '/tenant-roles',
    createRole: '/tenant-roles',
    updateRole: (roleId: string) => `/tenant-roles/${roleId}`,
    deleteRole: (roleId: string) => `/tenant-roles/${roleId}`,
    getPermissions: '/tenant-roles/permissions',

    // Project endpoints
    getProjects: '/projects',
    createProject: '/projects',
    getProjectDetails: (projectId: string) => `/projects/${projectId}`,
    updateProject: (projectId: string) => `/projects/${projectId}`,
    deleteProject: (projectId: string) => `/projects/${projectId}`,

    // Sprint endpoints
    getSprints: '/sprints',
    getSprintDetails: (sprintId: string) => `/sprints/${sprintId}`,
    createSprint: '/sprints',
    updateSprint: (sprintId: string) => `/sprints/${sprintId}`,
    deleteSprint: (sprintId: string) => `/sprints/${sprintId}`,

    // Board endpoints
    getBoards: '/boards',
    getBoardDetails: (boardId: string) => `/boards/${boardId}`,
    createBoard: '/boards',
    updateBoard: (boardId: string) => `/boards/${boardId}`,
    updateBoardColumn: (boardId: string, columnId: string) => `/boards/${boardId}/columns/${columnId}`,
    deleteBoard: (boardId: string) => `/boards/${boardId}`,
    getBoardsBySprintId: (sprintId: string) => `/boards?sprintId=${sprintId}`,
    getTasksByBoardId: (boardId: string) => `/boards/${boardId}/tasks`,
    getBoardDetailsById: (boardId: string) => `/boards/${boardId}`,

    // Task endpoints
    getTasksBySprintId: (sprintId: string) => `/tasks/sprints/${sprintId}`,
    getTaskDetails: (taskId: string) => `/tasks/${taskId}`,
    createTask: '/tasks',
    updateTask: (taskId: string) => `/tasks/${taskId}`,
    deleteTask: (taskId: string) => `/tasks/${taskId}`,

    // Task Comment endpoints
    addTaskComment: (taskId: string) => `/tasks/${taskId}/comments`,
    updateTaskComment: (taskId: string, commentId: string) => `/tasks/${taskId}/comments/${commentId}`,
    deleteTaskComment: (taskId: string, commentId: string) => `/tasks/${taskId}/comments/${commentId}`,

    // Task Member Assignment endpoints
    assignTaskMember: (taskId: string, memberId: string) => `/tasks/${taskId}/members/${memberId}/assign`,
    unassignTaskMember: (taskId: string, memberId: string) => `/tasks/${taskId}/members/${memberId}/unassign`,
};

export default endpointConfig;
