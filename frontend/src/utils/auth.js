const decodeToken = (token) => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch (error) {
    return null;
  }
};

export const getAuthState = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return {
      token: "",
      role: "",
      isLoggedIn: false,
      isAdmin: false
    };
  }

  const decodedToken = decodeToken(token);
  const isExpired =
    decodedToken?.exp && decodedToken.exp * 1000 < new Date().getTime();

  if (!decodedToken || isExpired) {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    return {
      token: "",
      role: "",
      isLoggedIn: false,
      isAdmin: false
    };
  }

  return {
    token,
    role: decodedToken.role,
    isLoggedIn: true,
    isAdmin: decodedToken.role === "admin"
  };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};
