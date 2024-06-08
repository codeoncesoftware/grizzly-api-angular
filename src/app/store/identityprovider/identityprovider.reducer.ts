import * as identityprovider from './identityprovider.actions';
import { IdentityProviderState } from './identityprovider.state';
import { IdentityProvider } from 'src/app/shared/models/IdentityProvider';

export const initialIdentityProvidersState: IdentityProviderState = {
  identityproviders: [],
  active: new IdentityProvider(),
  loading: false,
};

export function IdentityProviderReducer(
  state = initialIdentityProvidersState,
  action: identityprovider.IdentityProviderActions): IdentityProviderState {
  switch (action.type) {
    case identityprovider.ADD_IDENTITYPROVIDER_SUCCESS:
      const newState = Object.assign({}, state);
      newState.identityproviders.push(action.payload as IdentityProvider);
      newState.identityproviders[newState.identityproviders.length-1].active = true;
      newState.active = action.payload as IdentityProvider;
      return newState;

    case identityprovider.LOAD_ALL_IDENTITYPROVIDER_SUCCESS:
      const newAllIdentityProvidersState = Object.assign({}, state);
      newAllIdentityProvidersState.identityproviders =
        action.payload as IdentityProvider[];
      newAllIdentityProvidersState.loading = false;
      return newAllIdentityProvidersState;

    case identityprovider.LOAD_ACTIVE_IDENTITYPROVIDER:
      const stateNoActive = Object.assign({}, state);
      stateNoActive.active = action.payload as IdentityProvider;
      return stateNoActive;

    case identityprovider.LOAD_ALL_IDENTITYPROVIDER:
      const stateBeforeLoad = Object.assign({}, state);
      stateBeforeLoad.loading = true;
      return stateBeforeLoad;

    case identityprovider.UPDATE_IDENTITYPROVIDER_SUCCESS:
      const newUpdatedState = Object.assign({}, state);
      const updatedIdentityProvider = action.payload as IdentityProvider;

      const indexIdentityProviderToUpdate = newUpdatedState.identityproviders.findIndex(
        (db) => db.id === (action.payload as IdentityProvider).id
      );
      newUpdatedState.identityproviders[indexIdentityProviderToUpdate] = updatedIdentityProvider;
      newUpdatedState.identityproviders[indexIdentityProviderToUpdate].active = true;
      newUpdatedState.active = updatedIdentityProvider;
      return newUpdatedState;

    case identityprovider.DELETE_IDENTITYPROVIDER_SUCCESS:
      const stateAfterDelete = Object.assign({}, state);
      stateAfterDelete.identityproviders =
        stateAfterDelete.identityproviders.filter(
          (db) => db.id !== action.payload
        );
      if (stateAfterDelete.identityproviders.length > 0) {
        stateAfterDelete.active =
          stateAfterDelete.identityproviders[
            stateAfterDelete.identityproviders.length - 1
          ];
      } else {
        stateAfterDelete.active = null;
      }
      return stateAfterDelete;

    default:
      return state;
  }
}
