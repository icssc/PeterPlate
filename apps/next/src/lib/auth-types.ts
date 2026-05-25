export interface AuthAdditionalData {
  returnUrl?: string;
  provider?: Provider;
}

export enum Provider {
  Google = "OIDC",
  Apple = "APPLE",
}
