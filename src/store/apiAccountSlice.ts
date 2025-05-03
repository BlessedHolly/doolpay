import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiAccountSlice = createApi({
  reducerPath: "apiAccount",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5005/",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => "profile",
    }),
    registrationProfile: builder.mutation({
      query: (newUser) => ({
        url: "register",
        method: "POST",
        body: newUser,
      }),
    }),
    loginProfile: builder.mutation({
      query: (user) => ({
        url: "login",
        method: "POST",
        body: user,
      }),
    }),
    logoutProfile: builder.mutation({
      query: () => ({
        url: "logout",
        method: "POST",
      }),
    }),
    changeBalance: builder.mutation({
      query: (sum) => ({
        url: "balance",
        method: "PATCH",
        body: { amount: sum },
      }),
    }),
    deleteAccount: builder.mutation({
      query: () => ({
        url: "delete-account",
        method: "DELETE",
      }),
    }),
    uploadAvatar: builder.mutation({
      query: (avatar) => {
        const formData = new FormData();
        formData.append("avatar", avatar);

        return {
          url: "upload-avatar",
          method: "PATCH",
          body: formData,
        };
      },
    }),
    updateEmail: builder.mutation({
      query: (email: { email: string }) => ({
        url: "update-email",
        method: "PATCH",
        body: email,
      }),
    }),
  }),
});

export default apiAccountSlice;

export const {
  useGetProfileQuery,
  useRegistrationProfileMutation,
  useLoginProfileMutation,
  useLogoutProfileMutation,
  useChangeBalanceMutation,
  useDeleteAccountMutation,
  useUploadAvatarMutation,
  useUpdateEmailMutation,
} = apiAccountSlice;
