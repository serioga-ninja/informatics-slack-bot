import * as React from 'react';
import {ILinkModel} from '../../interfaces/i-link-model';
import {LinkTypes} from '../../enums/link-types';
import {RouteComponentProps} from 'react-router';
import {connect} from 'react-redux'

interface ILinksState {
    links: ILinkModel[];
}

export interface ILinksProps extends ILinksState, RouteComponentProps<any> {
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
    }

    handleSubmit = (event) => {
        event.preventDefault();

        // TODO: do patch update method
    };

    addEmptyLink = () => {
        this.setState(((prevState: ILinksState) => ({
            links: [...prevState.links, {
                link: '',
                type: LinkTypes.InstagramLink
            }]
        })))
    };

    render() {
        let {links} = this.state;
        let listItems = links.map((link, index) =>
            <div className={'form-group'} key={index}>
                <input defaultValue={link.link} type="text" className="form-control" name={'links'}/>
            </div>
        );

        return (
            <div className={'row justify-content-md-center'}>
                <div className="col col-lg-6">
                    <form action={'/api/v1/social/links'} onSubmit={this.handleSubmit}>
                        {listItems}
                        <div className={'form-group'}>
                            <input type="text" className="form-control" name={'links'}/>
                        </div>
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
