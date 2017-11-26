import * as React from 'react';
import {ILinkModel} from '../../interfaces/i-link-model';
import {LinkTypes} from '../../enums/link-types';
import {RouteComponentProps} from 'react-router';
import {connect} from 'react-redux'
import linksApiService from '../services/links-api.service';
import store from '../reducers/store';
import {addLink, updateSingleLink} from '../reducers/links/actions';

interface ILinksState {
    links: ILinkModel[];
}

export interface ILinksProps extends ILinksState, RouteComponentProps<any> {
}

interface ILinkFormRowProps {
    link: ILinkModel;
    index: number;
}

class LinkFormRow extends React.Component<ILinkFormRowProps, any> {

    state: {link: ILinkModel; index: number;};

    constructor(props: ILinkFormRowProps) {
        super(props);

        this.state = {
            link: props.link,
            index: this.props.index
        };

        this.onInputChange = this.onInputChange.bind(this);
    }

    onInputChange(ev) {
        console.log(store.getState().links);
        store.dispatch(updateSingleLink(
            store.getState().links,
            {link: ev.target.value},
            this.state.index
        ));
    }

    render() {
        let {link} = this.state;

        return (
            <div className={'form-group'}>
                <input defaultValue={link.link} onBlur={(ev) => this.onInputChange(ev)} type="text" className="form-control" name={'links'}/>
            </div>
        )
    }
}

class Links extends React.Component<ILinksProps, any> {
    state: ILinksState = {
        links: []
    };

    constructor(props) {
        super(props);

        this.state = {
            links: props.links || []
        };

        store.subscribe(() => {
            console.log(store.getState().links);
            this.setState({
                links: store.getState().links
            })
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();

        linksApiService.updateLinks(store.getState().links);
    };

    addEmptyLink = () => {
        store.dispatch(addLink({
            link: '',
            type: LinkTypes.InstagramLink
        }));
    };

    render() {
        let {links} = this.state;
        let listItems = links.map((link, index) =>
            <LinkFormRow link={link} key={index} index={index} />
        );

        return (
            <div className={'row justify-content-md-center'}>
                <div className="col col-lg-6">
                    <form onSubmit={this.handleSubmit}>
                        {listItems}
                        <div className="btn-group" data-toggle="buttons">
                            <button type="button" className="btn btn-outline-primary" onClick={this.addEmptyLink}>+
                            </button>
                            <button type="submit" className="btn btn-outline-success">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        links: state.links
    }
}

export default connect(mapStateToProps)(Links);
