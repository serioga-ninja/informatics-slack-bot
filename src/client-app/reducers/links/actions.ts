import {ILinkModel} from '../../../interfaces/i-link-model';

const linksReducerActions = {
    LINKS_GET: '[links] GET',

    LINKS_ADD: '[links] ADD',

    LINKS_UPDATE_SINGLE: '[links] UPDATE_SINGLE',

    LINKS_UPDATE: '[links] UPDATE',
    LINKS_UPDATE_SUCCESS: '[links] UPDATE_SUCCESS',
    LINKS_UPDATE_ERROR: '[links] UPDATE_ERROR',

};

export let getLinks = () => ({type: linksReducerActions.LINKS_GET});

export let addLink = (link: any) => ({type: linksReducerActions.LINKS_ADD, link});

export let updateSingleLink = (links: ILinkModel[], link: any, index: number) => {
    let newLinks = [...links];
    newLinks[index].link = link.link;

    return {
        type: linksReducerActions.LINKS_UPDATE_SINGLE,
        links: newLinks
    }
};

export let updateLinksSuccess = (links: ILinkModel) => ({type: linksReducerActions.LINKS_UPDATE_SUCCESS, links});

export default linksReducerActions;