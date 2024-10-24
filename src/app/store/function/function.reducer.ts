import { Function } from 'src/app/shared/models/Function';
import { FunctionState } from './function.state';
import * as functionActions from './function.actions';
import * as globalActions from '../global.actions';


export const initialFunctionState: FunctionState = {
    functions: [],
    active: new Function(),
    success: false
};


export function functionReducer(state = initialFunctionState, action: functionActions.FunctionActions): FunctionState {
    switch (action.type) {
        case functionActions.LOAD_ALL_FUNCTIONS_SUCCESS:
            const oldState = Object.assign({}, state);
            oldState.functions = (action.payload as Array<any>);
            return oldState;

        case functionActions.CREATE_FUNCTION_SUCCESS:
            const createdState = Object.assign({}, state);
            createdState.functions.push(action.payload as any);
            createdState.active = (action.payload as any);
            return createdState;

        case functionActions.GET_FUNCTION_SUCCESS:
            const newState = Object.assign({}, state);
            newState.functions.push(action.payload as any);
            newState.active = (action.payload as any);
            return newState;

        case functionActions.UPDATE_FUNCTION_SUCCESS:
            const stateUpdated = Object.assign({}, state);
            const oldName = 'oldName';
            const functionCreated = 'functionCreated';
            const oldVersion = 'oldVersion';
            const index = stateUpdated.functions.findIndex(x => x.name === action.payload[oldName] && (x.version === action.payload[oldVersion]));
            stateUpdated.functions[index] = (action.payload[functionCreated] as any);
            stateUpdated.active = (action.payload[functionCreated] as any);
            return stateUpdated;

        case functionActions.DELETE_FUNCTION_SUCCESS:
            const stateToReturn = Object.assign({}, state);
            stateToReturn.active = new Function();
            const name='name';
            const version='version';
            stateToReturn.functions = stateToReturn.functions.filter((item) => item.name !== action.payload[name] || item.version !== action.payload[version]);
            return stateToReturn;

        case functionActions.DELETE_ALL_FUNCTIONS_SUCCESS:
            const deleteAllState = Object.assign({}, state);
            deleteAllState.active = new Function();
            deleteAllState.functions = [];
            return deleteAllState;

        case functionActions.CLONE_FUNCTION_SUCCESS:
            const clonedState = Object.assign({}, state);
            clonedState.functions.push(action.payload as any);
            clonedState.active = (action.payload as any);
            return clonedState;

        case functionActions.SELECT_FUNCTION:
            const olddState2 = Object.assign({}, state);
            clonedState.functions.push(action.payload as any);
            clonedState.active = (action.payload as any);
            return clonedState;

        case globalActions.EFFECT_ERROR:
            return Object.assign({}, state);

        default:
            return state;
    }
}
