import {AnyAction} from 'redux';
import {ILinkModel} from '../../../interfaces/i-link-model';
import linksReducerActions from './actions';

interface ILinkReducerState {
    links: ILinkModel[];
    link: ILinkModel;
}

interface ILinksReducerAction extends ILinkReducerState, AnyAction {

}

const INITIAL_STATE: ILinkReducerState = {
    links: [],
    link: <ILinkModel>{}
};

const LinksReducerService = {

    [linksReducerActions.LINKS_ADD]: (state: any, action: ILinksReducerAction) => {
        return [...state, action.link];
    },

    [linksReducerActions.LINKS_UPDATE_SINGLE]: (state: any, action: ILinksReducerAction) => {
        return [...action.links];
    }
};

function linksReducer(state: ILinkReducerState = INITIAL_STATE, action: ILinksReducerAction) {
    let fn = LinksReducerService[action.type];
    return typeof fn === 'function' ? fn(state, action) : state;
}

export default linksReducer;