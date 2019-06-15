import { Address } from '@crgolden/core-claims';

export class AuthenticationScheme {
  name: string;
  displayName: string;
  handlerType: string;
}

export class ChangePassword {
  oldPassword: string;
  newPassword: string;
}

export class ConfirmEmail {
  code: string;
  userId: string;
}

export class DeletePersonalData {
  password?: string;
}

export class EnableAuthenticator {
  code: string;
  sharedKey: string;
  authenticatorUri: string;
  recoveryCodes: string[];
  message: string;
}

export class ExternalLogins {
  currentLogins: UserLoginInfo[];
  otherLogins: AuthenticationScheme[];
  showRemoveButton: boolean;
}

export class ForgotPassword {
  email: string;
}

export class GenerateRecoveryCodes {
  recoveryCodes: string[];
  message: string;
}

export class Profile {
  emailConfirmed: boolean;
  email: string;
  phoneNumber?: string;
  phoneNumberConfirmed: boolean;
  firstName?: string;
  lastName?: string;
  address?: Address;
}

export class Register {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address?: Address;
}

export class ResetPassword {
  email: string;
  password: string;
  code: string;
}

export class SetPassword {
  newPassword: string;
}

export class TwoFactorAuthentication {
  hasAuthenticator: boolean;
  recoveryCodesLeft: number;
  is2faEnabled: boolean;
  isMachineRemembered: boolean;
}

export class UserLoginInfo {
  loginProvider: string;
  providerKey: string;
  providerDisplayName: string;
}
