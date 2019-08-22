import React, {Component} from 'react';
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";

interface Props {
    onFormSubmitted: any;
    docket: any
}

interface State {
    _id: string,
    name: string,
    display: string
}

export class DocketForm extends Component<Props, State> {


    componentDidMount(): void {
        const {_id, name, display} = this.props.docket
        this.setState({
            _id, name, display
        })
    }

    handleSubmit = (event: any) => {
        event.preventDefault();
        this.props.onFormSubmitted(this.state);
    }

    render() {
        return (
            <div>
                {this.state ?
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            Id:<InputText type="text" value={this.state._id} name="id" readOnly
                                          onChange={(event:any) => this.setState({_id: event.target.value})}

                        />
                        </label>
                        <label>
                            Name:<InputText type="text" value={this.state.name} name="name"
                                            onChange={(event:any) => this.setState({name: event.target.value})}/>
                        </label>
                        <label>
                            Display:<InputText type="text" value={this.state.display} name="display"
                                               onChange={(event:any) => this.setState({display: event.target.value})}/>
                        </label>

                        <Button type="submit" label="Save" icon="pi pi-check" className="p-button-success"/>
                    </form> :
                    <div></div>
                }
            </div>);
    }

}
