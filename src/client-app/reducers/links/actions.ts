const linksReducerActions = {
    LINKS_GET: '[links] GET'
};

export let getLinks = () => ({type: linksReducerActions.LINKS_GET});

export default linksReducerActions;