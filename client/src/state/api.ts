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
      const agentToken = window.localStorage.getItem("track_sale_agent");
      if (agentToken) {
        header.set("Authorization", `Bearer ${agentToken}tokenTypeJWT`);
      } else if (idToken) {
        header.set("Authorization", `Bearer ${idToken}tokenTypeCOGNITO`);
      }
    },
  }),
  reducerPath: "api",
  tagTypes: ["Admin", "Agent"],
  endpoints: (build) => ({
    getAuthUser: build.query<UserType | null, void>({
      queryFn: async (_, _api, _extraOptions, fetchWithBQ) => {
        const session = await fetchAuthSession();
        const token = window.localStorage.getItem("track_sale_agent");

        let endpoint;
        let userData;

        if (session.tokens) {
          // const { idToken } = session.tokens ?? {};
          const user = await getCurrentUser();
          endpoint = `/admin/${user.userId}`;
          userData = {
            id: user.userId,
            name: user.username,
            email: user?.signInDetails?.loginId || "",
            phoneNumber: "",
            role: "admin",
          };
        } else if (token) {
          endpoint = "/agent";
        } else {
          return {
            data: null,
          };
        }
        let userApiResponse = await fetchWithBQ(endpoint!!);
        // const userApiData = userApiResponse.data as {
        //   role: string
        // }
        if (userApiResponse.error && userApiResponse.error.status === 404) {
          userApiResponse = await createNewUser({
            userData: userData!!,
            fetchWithBQ,
          });
        }
        if (userApiResponse.error && userApiResponse.error.status === 401) {
          return {
            data: null,
          };
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
      invalidatesTags: (result) => [{ type: "Admin" }, { type: "Agent" }],
    }),
    getMemberOrganization: build.query<
      OrganizationsProps[],
      { adminCognitoId?: string }
    >({
      query: ({ adminCognitoId }) => ({
        url: `/organizations/${adminCognitoId}`,
      }),
      providesTags: (result) => [{ type: "Admin" }, { type: "Agent" }],
    }),
    getAgentOrganization: build.query<OrganizationsProps[], void>({
      queryFn: async (_args, _api, _extraOpts, baseQuery) => {
        const response = await baseQuery({
          url: "/organizations/get-agent",
          method: "POST",
        });
        return {
          data: response.data as OrganizationsProps[],
        };
      },
      providesTags: (result) => [{ type: "Admin" }, { type: "Agent" }],
    }),
    getOrganizationName: build.query<
      Partial<OrganizationsProps>,
      { organizationId: string; adminCognitoId?: string }
    >({
      query: ({ organizationId, adminCognitoId }) => ({
        url: `/organizations/${organizationId}/${adminCognitoId}`,
      }),
      providesTags: (result) => [{ type: "Admin" }, { type: "Agent" }],
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
      invalidatesTags: () => [{ type: "Admin" }, { type: "Agent" }],
    }),
    getOrganizationMembers: build.query<
      OrganizationsProps,
      { organizationId: string; adminCognitoId?: string }
    >({
      query: ({ organizationId, adminCognitoId }) => ({
        url: `/organizations/members/${organizationId}/${adminCognitoId}`,
      }),
      providesTags: (result) => [{ type: "Admin" }, { type: "Agent" }],
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
    deleteOrganization: build.mutation<any, { organizationId: string }>({
      query: ({ organizationId }) => ({
        url: `/organizations/delete/${organizationId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result) => [{ type: "Agent" }, { type: "Admin" }],
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
    getMembersOrganization: build.query<
      OrganizationsWithMembersProps[],
      { adminCognitoId?: string }
    >({
      query: ({ adminCognitoId }) => ({
        url: `/organizations/members/${adminCognitoId}`,
      }),
      providesTags: (result) => [{ type: "Admin" }, { type: "Agent" }],
    }),
    loginAgent: build.mutation<
      {
        isVerified?: boolean;
        validateId?: string;
        isNotAdded?: boolean;
        token?: string;
      },
      { email: string }
    >({
      queryFn: async (args, _api, _extraOpt, baseQuery) => {
        const responseOfLogin = await baseQuery({
          url: `/agent/${args.email}`,
          method: "GET",
        });
        if (responseOfLogin.error && responseOfLogin.error.status === 404) {
          // Agent is not found
          const responseOfRegister = await baseQuery({
            url: `/agent`,
            method: "POST",
            body: { email: args.email },
          });
          if (
            responseOfRegister.error &&
            responseOfRegister.error.status === 404
          ) {
            return {
              data: {
                isNotAdded: true,
              },
            };
          }
          const responseData = responseOfRegister.data as {
            validateId: string;
            token: string;
            isVerified: boolean;
          };
          return {
            data: {
              isVerified: false,
              validateId: responseData.validateId,
              token: responseData.token,
            },
          };
        }
        // if (responseOfLogin.error && responseOfLogin.error.status === 401) {
        //   // Agent is unauthorized
        //   // const responseOfRegister = await baseQuery({
        //   //   url: `/agent`,
        //   //   method: "PUT",
        //   //   body: args.email,
        //   // });
        //   const responseData = responseOfLogin.data as {
        //     token: string;
        //   };
        //   return {
        //     data: {
        //       isVerified: false,
        //       validateId: responseData.token,
        //     },
        //   };
        // }
        // Everything perfect
        const loginData = responseOfLogin.data as {
          token: string;
          isVerified: boolean;
        };
        return {
          data: {
            isVerified: loginData.isVerified,
            token: loginData.token,
          },
        };
      },
    }),
    verifyAgent: build.mutation<
      { status: "success" | "failed"; message: string },
      { validateId: string; code: string }
    >({
      queryFn: async ({ validateId, code }, _api, _extraOpts, baseQuery) => {
        const verifiedResponse = await baseQuery({
          url: `/agent/verify`,
          method: "PUT",
          body: { validateId, code },
        });
        if (verifiedResponse.error && verifiedResponse.error.status === 404) {
          // Wrong Code
          return {
            data: {
              status: "failed",
              message: "Please Enter the correct code.",
            },
          };
        }
        if (verifiedResponse.error && verifiedResponse.error.status === 410) {
          // Expired Code
          return {
            data: {
              status: "failed",
              message: "Code is expired click on resend to get new code.",
            },
          };
        }
        return {
          data: {
            status: "success",
            message: "Verification Completed.",
          },
        };
      },
    }),
    resendCode: build.mutation<any, { validateId: string }>({
      query: (args) => ({
        url: "/agent/resend-code",
        method: "PUT",
        body: { validateId: args.validateId },
      }),
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
  useGetMembersOrganizationQuery,
  useDeleteOrganizationMutation,
  useLoginAgentMutation,
  useVerifyAgentMutation,
  useResendCodeMutation,
  useGetAgentOrganizationQuery,
} = api;
