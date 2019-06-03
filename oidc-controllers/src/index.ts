import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserManagerSettings, UserManager, User } from 'oidc-client';
import { AuthenticationScheme } from '@crgolden/oidc-models';
import { ChangePassword } from '@crgolden/oidc-models';
import { ConfirmEmail } from '@crgolden/oidc-models';
import { DeletePersonalData } from '@crgolden/oidc-models';
import { EnableAuthenticator } from '@crgolden/oidc-models';
import { ExternalLogins } from '@crgolden/oidc-models';
import { ForgotPassword } from '@crgolden/oidc-models';
import { GenerateRecoveryCodes } from '@crgolden/oidc-models';
import { Profile } from '@crgolden/oidc-models';
import { Register } from '@crgolden/oidc-models';
import { ResetPassword } from '@crgolden/oidc-models';
import { SetPassword } from '@crgolden/oidc-models';

export abstract class AccountController {

  protected readonly userManager: UserManager;

  protected constructor(
    protected readonly identityUrl: string,
    protected readonly identityClientId: string,
    protected readonly scopes: string[],
    protected readonly responseTypes: string[],
    protected readonly http: HttpClient) {
    this.userManager = new UserManager(this.userManagerSettings);
    
  }

  protected get userManagerSettings(): UserManagerSettings {
    const domain = `${window.location.protocol}//${window.location.host}`;
    const userManagerSettings: UserManagerSettings = {
      authority: this.identityUrl,
      client_id: this.identityClientId,
      redirect_uri: `${domain}/account/login-success`,
      response_type: this.responseTypes.join(' '),
      scope: this.scopes.join(' '),
      post_logout_redirect_uri: `${domain}/logout-success`,
      filterProtocolClaims: true,
      automaticSilentRenew: true,
      silent_redirect_uri: `${domain}/silent-callback.html`
    };
    return userManagerSettings;
  }

  protected get headers(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  confirmEmail$(model: ConfirmEmail): Observable<string> {
    return this.http
      .post<string>(`${this.identityUrl}/account/confirm-email`, JSON.stringify(model), {
        headers: this.headers
      });
  }

  forgotPassword$(model: ForgotPassword): Observable<string> {
    return this.http
      .post<string>(`${this.identityUrl}/account/forgot-password`, JSON.stringify(model), {
        headers: this.headers
      });
  }

  register$(model: Register): Observable<string> {
    return this.http
      .post<string>(`${this.identityUrl}/account/register`, JSON.stringify(model), {
        headers: this.headers
      });
  }

  resetPassword$(model: ResetPassword): Observable<string> {
    return this.http
      .post<string>(`${this.identityUrl}/cccount/reset-password`, JSON.stringify(model), {
        headers: this.headers
      });
  }

  signinSilent(): Promise<User> {
    return this.userManager.signinSilent();
  }

  signinRedirect(args?: any): Promise<any> {
    return this.userManager.signinRedirect(args);
  }

  signinRedirectCallback$(url?: string): Promise<User> {
    return this.userManager.signinRedirectCallback(url);
  }

  signoutRedirect(args?: any): Promise<any> {
    return this.userManager.signoutRedirect(args);
  }

  signoutRedirectCallback$(url?: string): Promise<any> {
    return this.userManager.signoutRedirectCallback(url);
  }
}

export abstract class ManageController {

  protected constructor(
    protected readonly identityUrl: string,
    protected readonly http: HttpClient) {
  }

  protected get headers(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  addExternalLogin$(name: string): Observable<void> {
    return this.http.get<void>(
      `${this.identityUrl}/manage/link-login?provider=${name}`);
  }

  changePassword$(model: ChangePassword): Observable<string> {
    return this.http
      .post<string>(`${this.identityUrl}/manage/change-password`, JSON.stringify(model), {
        headers: this.headers
      });
  }

  disable2fa$(): Observable<string> {
    return this.http
      .post<string>(`${this.identityUrl}/manage/disable2fa`, {}, {
        headers: this.headers
      });
  }

  deletePersonalData$(model: DeletePersonalData): Observable<void> {
    return this.http
      .post<void>(`${this.identityUrl}/manage/delete-personal-data`, JSON.stringify(model), {
        headers: this.headers
      });
  }

  downloadPersonalData$(): Observable<HttpResponse<Blob>> {
    return this.http
      .get(`${this.identityUrl}/manage/download-personal-data`,
        {
          observe: 'response',
          responseType: 'blob'
        });
  }

  externalAuthenticationSchemes$(): Observable<Array<AuthenticationScheme>> {
    return this.http
      .get<Array<AuthenticationScheme>>(`${this.identityUrl}/manage/external-authentication-schemes`);
  }

  forgetTwoFactorClient$(): Observable<string> {
    return this.http
      .post<string>(`${this.identityUrl}/manage/forget-two-factor-client`, {}, {
        headers: this.headers
      });
  }

  generateRecoveryCodes$(): Observable<GenerateRecoveryCodes> {
    return this.http
      .get<GenerateRecoveryCodes>(`${this.identityUrl}/generate-recovery-codes`);
  }

  isTwoFactorEnabled$(): Observable<boolean> {
    return this.http
      .get<boolean>(`${this.identityUrl}/manage/is-two-factor-enabled`);
  }

  profile$(model: Profile): Observable<Profile> {
    return this.http
      .post<Profile>(`${this.identityUrl}/manage/profile`, JSON.stringify(model), {
        headers: this.headers
      });
  }

  removeLogin$(loginProvider: string, providerKey: string): Observable<ExternalLogins> {
    return this.http
      .post<ExternalLogins>(`${this.identityUrl}/manage/remove-login`, JSON.stringify({
        loginProvider: loginProvider,
        providerKey: providerKey
      }), {
          headers: this.headers
        });
  }

  resetAuthenticator$(): Observable<string> {
    return this.http
      .post<string>(`${this.identityUrl}/manage/reset-authenticator`, {}, {
        headers: this.headers
      });
  }

  sendVerificationEmail$(): Observable<string> {
    return this.http
      .get<string>(`${this.identityUrl}/manage/send-verification-email`);
  }

  setPassword$(model: SetPassword): Observable<string> {
    return this.http
      .post<string>(`${this.identityUrl}/manage/set-password`, JSON.stringify(model), {
        headers: this.headers
      });
  }

  verifyAuthenticator$(model: EnableAuthenticator): Observable<EnableAuthenticator> {
    return this.http
      .post<EnableAuthenticator>(`${this.identityUrl}/manage/verify-authenticator`, JSON.stringify(model), {
        headers: this.headers
      });
  }
}
