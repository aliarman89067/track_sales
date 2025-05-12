import {
  AddMemberSalesType,
  CreateOrganizationFormType,
  MembersType,
  MemberType,
  updateOrganizationType,
} from "@/lib/types";
import { createNewUser, getNameByRole } from "@/lib/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";

interface AddLeaveProps {
  memberId: string;
  leave: string;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL!,
    prepareHeaders: async (header) => {
      const session = await fetchAuthSession();
      const { idToken } = session.tokens ?? {};
      header.set("Authorization", `Bearer ${idToken}`);
    },
  }),
  reducerPath: "api",
  tagTypes: ["Admin", "Agent"],
  endpoints: (build) => ({
    getAuthUser: build.query<UserType | null, void>({
      queryFn: async (_, _api, _extraOptions, fetchWithBQ) => {
        const session = await fetchAuthSession();
        if (!session.tokens) {
          return {
            data: null,
          };
        }
        const { idToken } = session.tokens ?? {};
        const userRole = idToken?.payload["custom:role"] as string;
        const user = await getCurrentUser();
        const endpoint =
          userRole.toLocaleLowerCase() === "admin"
            ? `/admin/${user.userId}`
            : `/agent/${user.userId}`;
        let userApiResponse = await fetchWithBQ(endpoint);
        if (userApiResponse.error && userApiResponse.error.status === 404) {
          const name = getNameByRole({ userRole, idToken });

          const userData = {
            id: user.userId,
            name,
            email: user?.signInDetails?.loginId || "",
            phoneNumber: "",
            role: userRole,
          };
          userApiResponse = await createNewUser({
            userData,
            fetchWithBQ,
          });
        }
        return {
          data: {
            ...(userApiResponse.data as UserType),
          },
        };
      },
    }),
    createOrganization: build.mutation<
      OrganizationsProps,
      Partial<CreateOrganizationFormType & { adminCognitoId: string }>
    >({
      query: (body) => ({
        url: "/organizations",
        method: "POST",
        body,
      }),
      invalidatesTags: (result) => [{ type: "Admin" }],
    }),
    getMemberOrganization: build.query<
      OrganizationsProps[],
      { adminCognitoId?: string }
    >({
      query: ({ adminCognitoId }) => ({
        url: `/organizations/${adminCognitoId}`,
      }),
      providesTags: (result) => [{ type: "Admin" }],
    }),
    getOrganizationName: build.query<
      Partial<OrganizationsProps>,
      { organizationId: string; adminCognitoId?: string }
    >({
      query: ({ organizationId, adminCognitoId }) => ({
        url: `/organizations/${organizationId}/${adminCognitoId}`,
      }),
    }),
    addMembersInOrganization: build.mutation<
      MembersType,
      MembersType & { organizationId: string; adminCognitoId: string }
    >({
      query: ({ organizationId, adminCognitoId, members }) => ({
        url: `/members`,
        method: "POST",
        body: { organizationId, adminCognitoId, members },
      }),
    }),
    getOrganizationMembers: build.query<
      OrganizationsProps,
      { organizationId: string; adminCognitoId?: string }
    >({
      query: ({ organizationId, adminCognitoId }) => ({
        url: `/organizations/members/${organizationId}/${adminCognitoId}`,
      }),
    }),
    getMember: build.query<MembersDetailsProps, { memberId: string }>({
      query: ({ memberId }) => ({
        url: `/members/${memberId}`,
      }),
      providesTags: (result) => [{ type: "Agent" }],
    }),
    addAgentSale: build.mutation<
      AddMemberSalesType,
      Partial<AddMemberSalesType> & { memberId: string; organizationId: string }
    >({
      queryFn: async (args, _api, _extraOptions, fetchWithBQ) => {
        const session = await fetchAuthSession();

        if (!session.tokens) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              data: "No tokens",
              error: "Not authenticated",
            },
          };
        }

        const userRole = session.tokens.idToken?.payload[
          "custom:role"
        ] as string;
        if (userRole.toLowerCase() !== "admin") {
          return {
            error: {
              status: "CUSTOM_ERROR",
              data: "Unauthorized",
              error: "Only admin can perform this action",
            },
          };
        }

        const response = await fetchWithBQ({
          url: "/sale",
          method: "POST",
          body: args,
        });

        if (response.error) {
          return { error: response.error };
        }

        return {
          data: response.data as AddMemberSalesType,
        };
      },
      invalidatesTags: (result) => [{ type: "Agent" }],
    }),

    addLeave: build.mutation<any, AddLeaveProps>({
      queryFn: async (args, _api, _options, fetchWithBQ) => {
        const session = await fetchAuthSession();

        if (!session.tokens) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              data: "No tokens",
              error: "Not authenticated",
            },
          };
        }

        const userRole = session.tokens.idToken?.payload[
          "custom:role"
        ] as string;
        if (userRole.toLowerCase() !== "admin") {
          return {
            error: {
              status: "CUSTOM_ERROR",
              data: "Unauthorized",
              error: "Only admin can perform this action",
            },
          };
        }
        const response = await fetchWithBQ({
          url: "/members/add-leave",
          method: "POST",
          body: args,
        });
        if (response.error) {
          return { error: response.error };
        }
        return {
          data: response.data as any,
        };
      },
    }),
    updateMember: build.mutation<MemberType, Partial<MemberType>>({
      query: (args) => ({
        url: "/members/update",
        method: "PUT",
        body: args,
      }),
      invalidatesTags: (result) => [{ type: "Agent" }],
    }),
    deleteMember: build.mutation<any, { memberId: string }>({
      query: ({ memberId }) => ({
        url: `/members/delete/${memberId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result) => [{ type: "Agent" }],
    }),
    updateOrganization: build.mutation<
      any,
      updateOrganizationType & {
        organizationId: string;
        adminCognitoId: string;
      }
    >({
      query: (args) => ({
        url: "/organizations/update",
        method: "POST",
        body: args,
      }),
      invalidatesTags: () => [{ type: "Agent" }, { type: "Admin" }],
    }),
  }),
});

export const {
  useGetAuthUserQuery,
  useCreateOrganizationMutation,
  useGetMemberOrganizationQuery,
  useGetOrganizationNameQuery,
  useAddMembersInOrganizationMutation,
  useGetOrganizationMembersQuery,
  useGetMemberQuery,
  useAddAgentSaleMutation,
  useAddLeaveMutation,
  useUpdateMemberMutation,
  useDeleteMemberMutation,
  useUpdateOrganizationMutation,
} = api;
