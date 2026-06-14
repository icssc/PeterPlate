export interface AuthAdditionalData {
  returnUrl?: string;
  provider?: Provider;
}

export enum Provider {
  Google = "OIDC",
  Apple = "APPLE",
}

export interface AdditionalUserFields {
  hasOnboarded: boolean;
}
