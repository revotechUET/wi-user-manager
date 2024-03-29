module.exports = ListUser;
const React = require('react');
const MyList = require('../MyList');
const RowUser = require('../RowUser');

function ListUser(props) {
    MyList.call(this, props);
    this.listName = "User";
    this.state = Object.assign(this.state, {
        orderByText: "",
        colWidths: [50, 100, 150, 150, 150, 150, 100, 150, 150, 0]
    });
    let superRender = this.render;
    this.render = function () {
        let controlBar = superRender.call(this);
        let items = this.props.items;
        let headerObj = {
            username: "Username",
            email: "Email",
            status: "Status",
            role: "Role",
            fullname: "FullName",
            company: "Company",
            license_package: "License Package",
            createdAt: "Date Created",
            last_logged_in: "Last Login"
        };

        return (
            <div className={"MyList ListUser"}>
                {controlBar}
                <div className={"overflow-auto"}>
                    <RowUser
                        idx={undefined}
                        selected={false}
                        colWidths={this.state.colWidths}
                        onColWidthChanged={this.changeColWidth}
                        item={headerObj}
                        isHeader={true}
                        onCellClicked={this.onHeaderClicked}
                    />
                    <div>{
                        this.filterAndSort(items).map((item, idx) => (
                            <RowUser onClick={(e) => this.handleRowClick(item)}
                                     key={idx + this.state.startAt}
                                     idx={idx + this.state.startAt} item={item}
                                     colWidths={this.state.colWidths}
                                     selected={this.state.selectedItem === item}/>
                        ))
                    }</div>
                </div>
            </div>
        )
    }
}

ListUser.prototype = Object.create(React.Component.prototype);