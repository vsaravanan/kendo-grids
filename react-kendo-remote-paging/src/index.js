import React from 'react';
import ReactDOM from 'react-dom';


import kendo from '@progress/kendo-ui';
import { Grid, GridColumn } from '@progress/kendo-grid-react-wrapper';

import './extra.css';


class GridContainer extends React.Component {
    constructor(props) {
        super(props);

        this.dataSource = new kendo.data.DataSource({
            transport: {
                read:  {
                    url: "http://localhost:2990/products",
                    dataType: "jsonp"
                }
            },
            batch: true,
            pageSize: 20,
            schema: {
                model: {
                    id: "ProductID",
                    fields: {
                        ProductID: { editable: false, nullable: true },
                        ProductName: { validation: { required: true } },
                        UnitPrice: { type: "number", validation: { required: true, min: 1} },
                        Discontinued: { type: "boolean" },
                        UnitsInStock: { type: "number", validation: { min: 0, required: true } }
                    }
                }
            }
        });
    }

    render() {
        return (
            <Grid dataSource={this.dataSource}
                pageable={true} height={600}>
                <GridColumn field="ProductName" title="Product Name" />
                <GridColumn field="UnitPrice" title="Unit Price" format="{0:c}" width="120px" />
                <GridColumn field="UnitsInStock" title="Units in Stock" width="120px" />
                <GridColumn field="Discontinued" width="120px" />
            </Grid>
        );
    }
}


ReactDOM.render(<GridContainer />, document.getElementById("root"));
