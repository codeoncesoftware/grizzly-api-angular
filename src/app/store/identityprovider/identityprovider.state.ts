import { IdentityProvider } from 'src/app/shared/models/IdentityProvider';

export interface IdentityProviderState {
    identityproviders: IdentityProvider[];
    active: IdentityProvider;
    loading: boolean;
}
