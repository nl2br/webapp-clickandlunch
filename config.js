export const baseURL =
  process.env.NODE_ENV !== 'production'
    ? process.env.localApiUrl
    : process.env.apiUrl
