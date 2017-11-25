import {AnyAction} from 'redux';
import {ILinkModel} from '../../../interfaces/i-link-model';
import linksReducerActions from './actions';

interface ILinkReducerState {
    links: ILinkModel[];
}

interface ILinksReducerAction extends ILinkReducerState, AnyAction {

}

const INITIAL_STATE: ILinkReducerState = {
    links: []
};

const LinksReducerService = {

    [linksReducerActions.LINKS_GET]: (state: ILinkReducerState, action: ILinksReducerAction) => ({...state, links: action.links})
};

function linksReducer(state: ILinkReducerState = INITIAL_STATE, action: ILinksReducerAction) {
    let fn = LinksReducerService[action.type];
    return typeof fn === 'function' ? fn(state, action) : state;
}

export default linksReducer;