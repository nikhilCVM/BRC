import { getAuthState } from "./auth";

export const getAuthHeaders = () => {
  const { token } = getAuthState();

  return token
    ? {
        Authorization: `Bearer ${token}`
      }
    : {};
};
