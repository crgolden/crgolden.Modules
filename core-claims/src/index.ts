// https://openid.net/specs/openid-connect-core-1_0.html#AddressClaim

export class Address {
  formatted?: string;
  street_address?: string;
  locality?: string;
  region?: string;
  postal_code?: string;
  country?: string;
}
