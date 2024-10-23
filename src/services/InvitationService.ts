import { Invitation, InvitationDetails, PaginatedList, PaginationParams, SendInvitationRequest, UpdateInvitationRequest } from '@/@types/invitations';
import ApiService from './ApiService';
import endpointConfig from '@/configs/endpoint.config';
import { Paginated } from '@/@types/common';



export async function apiGetInvitations(take: number, skip: number, search?: string, sortBy?: string, sortDirection?: string): Promise<Paginated<Invitation>> {
    return ApiService.fetchAuthorizedDataWithAxios<Paginated<Invitation>>({
        url: endpointConfig.getInvitations,
        method: 'get',
        params: {
            take,
            skip,
            search,
            sortBy,
            sortDirection,
        },
    });
}

export async function apiGetInvitationDetails(invitationId: string) {
    return ApiService.fetchDataWithAxios<InvitationDetails>({
        url: endpointConfig.getInvitationDetails(invitationId),
        method: 'get',
    });
}

export async function apiSendInvitation(data: SendInvitationRequest) {
    return ApiService.fetchAuthorizedDataWithAxios({
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
    return ApiService.fetchAuthorizedDataWithAxios({
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
