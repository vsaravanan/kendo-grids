import React from 'react';
import ReactDOM from 'react-dom';
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';

import { sampleProducts } from './sample-products.jsx';
import MyCommandCell from './my-command-cell.jsx';

class App extends React.Component {

    CommandCell;

    constructor(props) {
        super(props);

        this.state = {
            data: sampleProducts.slice(0)
        };

        this.enterInsert = this.enterInsert.bind(this);
        this.itemChange = this.itemChange.bind(this);

        const enterEdit = this.enterEdit.bind(this);
        const save = this.save.bind(this);
        const cancel = this.cancel.bind(this);
        const remove = this.remove.bind(this);
        this.CommandCell = MyCommandCell(enterEdit,remove,save,cancel, "inEdit");
    }

    enterInsert() {
        const dataItem = { inEdit: true, Discontinued: false };
        const newproducts = this.state.data.slice();
        newproducts.unshift(dataItem);
        this.update(newproducts, dataItem);
        this.setState({
            data: newproducts
        });
    }

    enterEdit(dataItem) {
        this.update(this.state.data, dataItem).inEdit = true;
        this.setState({
            data: this.state.data.slice()
        });
    }

    save(dataItem) {
        dataItem.inEdit = undefined;
        dataItem.ProductID = this.update(sampleProducts, dataItem).ProductID;
        this.setState({
            data: this.state.data.slice()
        });
    }

    cancel(dataItem) {
        if (dataItem.ProductID) {
            let originalItem = sampleProducts.find(p => p.ProductID === dataItem.ProductID);
            this.update(this.state.data, originalItem);
        } else {
            this.update(this.state.data, dataItem, !dataItem.ProductID);
        }
        this.setState({
            data: this.state.data.slice()
        });
    }

    remove(dataItem) {
        dataItem.inEdit = undefined;
        this.update(this.state.data, dataItem, true);
        this.update(sampleProducts, dataItem, true);
        this.setState({
            data: this.state.data.slice()
        });
    }

    itemChange(event) {
        const value = event.value;
        const name = event.field;
        if (!name) {
            return;
        }
        const updatedData = this.state.data.slice();
        const item = this.update(updatedData, event.dataItem);
        item[name] = value;
        this.setState({
            data: updatedData
        });
    }

    update(data, item, remove) {
        let updated;
        let index = data.findIndex(p => p === item || ( item.ProductID && p.ProductID === item.ProductID));
        if (index >= 0) {
            updated = Object.assign({}, item);
            data[index] = updated;
        } else {
            let id = 1;
            data.forEach(p => { id = Math.max(p.ProductID + 1, id); });
            updated = Object.assign({}, item, { ProductID: id });
            data.unshift(updated);
            index = 0;
        }

        if (remove) {
            data = data.splice(index, 1);
        }

        return data[index];
    }

    render() {
        return (
            <div>
                <Grid
                    style={{ height: '420px' }}
                    data={this.state.data}
                    onItemChange={this.itemChange}
                    editField="inEdit"
                >
                    <GridToolbar>
                        <button
                            title="Add new"
                            className="k-button k-primary"
                            onClick={this.enterInsert}
                        >Add new
                        </button>

                        {this.state.data.filter(p => p.inEdit).length > 0 && (
                            <button
                                title="Cancel current changes"
                                className="k-button"
                                onClick={(e) => this.setState({ data: sampleProducts.slice() })}
                            >Cancel current changes
                            </button>
                        )}
                    </GridToolbar>
                    <Column field="ProductID" title="Id" width="50px" editable={false} />
                    <Column field="ProductName" title="Product Name" />
                    <Column field="FirstOrderedOn" title="First Ordered" editor="date" format="{0:d}" />
                    <Column field="UnitsInStock" title="Units" width="150px" editor="numeric" />
                    <Column field="Discontinued" title="Discontinued" editor="boolean" />
                    <Column cell={this.CommandCell} width="180px" />
                </Grid>
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
