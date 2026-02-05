const {
  VITE_COGNITO_DOMAIN,
  VITE_COGNITO_CLIENT_ID,
  VITE_COGNITO_REDIRECT_URI,
  VITE_COGNITO_LOGOUT_URI,
} = import.meta.env;

export const loginUrl =
  `${VITE_COGNITO_DOMAIN}/login` +
  `?client_id=${VITE_COGNITO_CLIENT_ID}` +
  `&response_type=code` +
  `&scope=email+openid+profile` +
  `&redirect_uri=${encodeURIComponent(VITE_COGNITO_REDIRECT_URI)}`;

export const logoutUrl =
  `${VITE_COGNITO_DOMAIN}/logout` +
  `?client_id=${VITE_COGNITO_CLIENT_ID}` +
  `&logout_uri=${encodeURIComponent(VITE_COGNITO_LOGOUT_URI)}`;
