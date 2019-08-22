import React, {Component} from "react";
import {DocketList} from "./DocketList";
import axios from "axios";
import {DocketForm} from "./DocketForm";
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog";
import {Messages} from "primereact/messages";
import {Docket} from "../../models/docket";

interface Props {

}

interface State {
    dockets: []
    showForm: boolean;
    actionLabel: string;
    actionIcon: string;
    activeDocket: Docket;
}

export class DocketHome extends Component<Props, State> {
    private messages: any;

    constructor(props: Readonly<Props>) {
        super(props);
        this.state = {
            dockets: [],
            showForm: false,
            actionLabel: 'Add',
            actionIcon: 'pi pi-plus',
            activeDocket: {
                _id: '00000000-0000-0000-0000-000000000000',
                name: '',
                display: ''
            }
        };
    }

    loadData = async () => {
        let res = await axios.get("./api/v1/practices/dockets");
        let data = res.data;
        this.setState({dockets: data});
        this.messages.clear();
    }

    componentDidMount() {
        this.loadData()
    }

    showForm = (event: any) => {
        event.preventDefault();
        this.setState({
            showForm: !this.state.showForm,
            actionLabel: this.state.actionLabel === 'Add' ? 'Cancel' : 'Add',
            actionIcon: this.state.actionLabel === 'Add' ? 'pi pi-times' : 'pi pi-plus',
            activeDocket: {
                _id: '00000000-0000-0000-0000-000000000000',
                name: '',
                display: ''
            }
        })
    }

    saveDocket = async (data: any) => {
        if (!data) {
            data = this.state.activeDocket;
        }
        console.log('post>', data);
        this.setState({
            showForm: false,
            actionLabel: 'saving...'
        })

        let res = await axios.post("./api/v1/practices/dockets", data);
        let savedDocket = res.data;
        console.log(`saved ${savedDocket}`);

        this.messages.show({severity: 'success', summary: 'Saved successfully', detail: `${savedDocket.name} saved`});

        this.loadData();

        this.setState({
            showForm: false,
            actionLabel: 'Add'
        })
    }

    editDocket = async (data: any) => {
        console.log('editing... >', data);
        this.setState({
            showForm: true,
            actionLabel: 'Cancel',
            actionIcon: 'pi pi-times',
            activeDocket: data
        })
    }

    deleteDocket = async (data: any) => {
        console.log('deleting... >', data);
        let res = await axios.delete(`./api/v1/practices/dockets/${data._id}`);
        this.loadData();
    }

    onHide = () => {
        this.setState({showForm: false});
    }

    render() {
        return (
            <div>
                Docket Home <Button label={this.state.actionLabel} icon={this.state.actionIcon}
                                    onClick={this.showForm}/>
                <Messages ref={(el) => this.messages = el}></Messages>
                <hr/>


                {this.state.dockets ?
                    <DocketList dcokets={this.state.dockets} onDelete={this.deleteDocket} onEdit={this.editDocket}/> :
                    <div></div>}

                <Dialog header="Docket" visible={this.state.showForm} style={{width: '50vw'}} onHide={this.onHide}
                        maximizable>
                    <DocketForm onFormSubmitted={this.saveDocket} docket={this.state.activeDocket}/>
                </Dialog>
            </div>);
    }
}
