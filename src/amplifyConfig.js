import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "eu-north-1_IdHj0ilBi",
      userPoolClientId: "11d6597is2fnllkpn7e56kiqtv",

      loginWith: {
        oauth: {
          domain: "eu-north-1idhj0ilbi.auth.eu-north-1.amazoncognito.com",
          scopes: ["openid", "email", "phone"],
          redirectSignIn: ["http://localhost:5173"],
          redirectSignOut: ["http://localhost:5173"],
          responseType: "code",
        },
      },
    },
  },
});
