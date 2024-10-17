import { Invitation, InvitationDetails, PaginatedList, PaginationParams, SendInvitationRequest, UpdateInvitationRequest } from '@/@types/invitations';
import ApiService from './ApiService';
import endpointConfig from '@/configs/endpoint.config';



export async function apiGetInvitations(params: PaginationParams) {
    return ApiService.fetchAuthorizedDataWithAxios<PaginatedList<Invitation>>({
        url: endpointConfig.getInvitations,
        method: 'get',
        params,
    });
}

export async function apiGetInvitationDetails(invitationId: string) {
    return ApiService.fetchDataWithAxios<InvitationDetails>({
        url: endpointConfig.getInvitationDetails(invitationId),
        method: 'get',
    });
}

export async function apiSendInvitation(data: SendInvitationRequest) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.sendInvitation,
        method: 'post',
        data,
    });
}

export async function apiAcceptInvitation(invitationId: string) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.acceptInvitation(invitationId),
        method: 'post',
    });
}

export async function apiRejectInvitation(invitationId: string) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.rejectInvitation(invitationId),
        method: 'post',
    });
}

export async function apiCancelInvitation(invitationId: string) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.cancelInvitation(invitationId),
        method: 'post',
    });
}

export async function apiResendInvitation(invitationId: string) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.resendInvitation(invitationId),
        method: 'post',
    });
}

export async function apiUpdateInvitation(invitationId: string, data: UpdateInvitationRequest) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.updateInvitation(invitationId),
        method: 'put',
        data,
    });
}
