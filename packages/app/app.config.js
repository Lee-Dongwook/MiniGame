import appJson from "./app.json";

export default {
  ...appJson,
  expo: {
    ...appJson.expo,
    updates: {
      url: "https://u.expo.dev/b2d64831-a802-4ec1-858f-826ab8d63303",
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    plugins: ["@react-native-google-signin/google-signin"],
    extra: {
      ...(appJson.expo.extra || {}),
      EXPO_ROUTER_APP_ROOT: "packages/app/app",
    },
  },
};
