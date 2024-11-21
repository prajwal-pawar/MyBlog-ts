// server api endpoints
export const ENDPOINTS = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
  },
  USERS: {
    PROFILE: (id: string) => `/user/profile/${id}`,
    UPDATE: "/user/update",
    DELETE: "/user/delete",
  },
  ARTICLES: {
    CREATE: "/article/create",
    FETCH_ALL: "/article/fetch-all",
    GET_BY_ID: (id: string) => `/article/id/${id}`,
    GET_BY_SLUG: (slug: string) => `/article/${slug}`,
    UPDATE: (id: string) => `/article/update/${id}`,
    DELETE: (id: string) => `/article/delete/${id}`,
  },
};
