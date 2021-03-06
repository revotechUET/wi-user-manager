module.exports = PageUser;
require('./style.less');
const React = require('react');
const api = require('../../services/apiClient');
const UserInfoModal = require('../../dialogs').UserInfoModal;
const ConfirmationModal = require('../../dialogs').ConfirmationModal;
const UserAddModal = require('../../dialogs').UserAddModal;
const ListUser = require('../../components/ListUser');
const { toast } = require('react-toastify');
const LeftNavigation = require('./../LeftNavigation');
const apiUser = require('../../services/apiUser');
const Redirect = require('react-router-dom').Redirect;
const UserStatus = require('../../components/UserStatus');

function myStringify(item) {
    return Object.values(item).filter(value => typeof value !== 'object').join(',').toLowerCase();
    // return JSON.stringify(item).toLowerCase()
}


function PageUser(props) {
    React.Component.call(this, props);
    this.state = {
        items: [],
        companies: [],
        licensePackages: [],
        isAddingUser: false,
        isEditingUser: false,
        isDeletingUser: false,
        filter: "",
        companyFilter: null
    };

    this.componentDidMount = function () {
        this.initFromServer();
        this.setState({
            filter: "",
            companyFilter: -1
        });
    }

    this.initFromServer = function () {
        listUser.call(this);
        listCompanies.call(this);
        listLicensePackage.call(this);
    }

    this.refreshListUser = function() {
        listUser.call(this);
    }
    this.refreshListUser = this.refreshListUser.bind(this);

    // function myStringify(item) {
    //     return Object.values(item).filter(value => typeof value !== 'object').join(',');
    //     // return JSON.stringify(item).toLowerCase()
    // }

    this.getItemList = function () {
        // if (this.state.filter == "") return (this.state.items || []);
        if (this.state.items.length) return this.state.items;
        // return this.state.items.filter((item) => {
        //     return myStringify(item).toLowerCase().includes(this.state.filter.toLowerCase());
        // });
        return [];
    }

    this.listUser = listUser.bind(this);

    function listUser() {
        api.getUsersPromise().then(users => {
            this.setState({ items: users.sort((a,b)=>a.username.toString().localeCompare(b.username.toString())) });
        }).catch(err => {
            console.log(err);
            console.error(e);
        })
    }

    this.listCompanies = listCompanies.bind(this);

    function listCompanies() {
        api.getCompaniesPromise().then(companies => {
            this.setState({
                companies: companies
            });
        }).catch((e) => {
            toast.error(e);
            console.error(e);
        })
    }

    this.listLicensePackage = listLicensePackage.bind(this);

    function listLicensePackage() {
        api.getLicensePackages().then(licensePackages => {
            // console.log(licensePackages);
            this.setState({
                licensePackages: licensePackages
            });
        }).catch((e) => {
            toast.error(e);
            console.error(e);
        })
    }

    this.callApiAddUser = callApiAddUser.bind(this);

    function callApiAddUser(user) {
        if (user.password != user.repassword) {
            toast.error('Your confirm password is not match');
            return;
        }
        if (!user.email.match(/[a-z0-9_\.]+@[a-z0-9]{2,}(\.[a-z0-9]+){1,2}$/)) {
            toast.error('Email is not valid');
            return;
        }
        if (!(user.idLicensePackage)) {
            toast.error("User must have license packge");
            return;
        }
        if (user.username.toString().trim().length == 0) {
            toast.error("Username can be empty");
            return;
        }
        return api.newUser(user)
            .then((rs) => {
                toast.success('Create user successfully');
                this.initFromServer();
                this.setState({
                    isAddingUser: false
                });
            })
            .catch(e => {
                toast.error(e);
                console.error(e);
            });
    }

    this.callApiUpdateUser = callApiUpdateUser.bind(this);

    function callApiUpdateUser(user) {
        if (user.username.toString().trim().length == 0) {
            toast.error("Username can be empty");
            return;
        }
        if (!user.email.match(/[a-z0-9_\.]+@[a-z0-9]{2,}(\.[a-z0-9]+){1,2}$/)) {
            toast.error('Email is not valid');
            return;
        }
        if (user.password != user.repassword) {
            toast.error('Your confirm password is not match');
            return;
        }
        delete user.repassword;
        let promises = [];
        promises.push(api.updateUserPromise(user));
        for (let i = 0; i < user.removeGroups.length; i++) {
            promises.push(api.removeUserFromGroup(user.removeGroups[i].idGroup, user.idUser));
        }
        Promise.all(promises)
        .then(() => {
            toast.success('Update user successfully');
            this.initFromServer();
            this.setState({ isEditingUser: false })
        }).catch(err => {
            toast.error(err);
            console.error(err);
        });
    }

    this.callApiDeleteUser = callApiDeleteUser.bind(this);

    function callApiDeleteUser(user) {
        // console.log('run');
        api.deleteUser(user.idUser)
            .then((rs) => {
                toast.success('Delete user successfully');
                this.initFromServer();
                this.setState({ isDeletingUser: false });
            })
            .catch(e => {
                toast.error(e);
            });
    }

    this.startDeleteUser = startDeleteUser.bind(this);

    function startDeleteUser(selectedUser) {
        this.setState({ isDeletingUser: true, selectedUser: selectedUser });
        console.log("Delete ", selectedUser);
    }

    this.startAddUser = startAddUser.bind(this);

    function startAddUser() {
        this.setState({ isAddingUser: true });
    }


    this.startEditUser = startEditUser.bind(this);

    function startEditUser(user) {
        this.setState({ isEditingUser: true, selectedUser: user });
    }

    this.filter = function (items) {
        return items.filter((e)=>{if (this.state.companyFilter >= 0) return (e.idCompany == this.state.companyFilter)
             else return true})
             .filter((item) => {
                let str = myStringify(item);
                return str.includes((this.state.filter||"").toLowerCase());
            });
    }



    this.render = function () {
        if (!apiUser.isLoggedIn()) return <Redirect to={{ pathname: "/login", from: "/user" }} />;
        return (
            <div className={"PageUser"} style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                <LeftNavigation routes={
                    [
                        { path: "/user", label: "User" },
                        { path: "/group", label: "Group" },
                        { path: "/company", label: "Company" },
                        { path: "/project", label: "Project" },
                        { path: '/license-package', label: "License Package" }
                    ]
                } />
                <div style={{ width: 'calc(100vw - 102px)', display: 'flex', flexDirection: 'column' }}>
                    <div className={"top-bar"}>
                        {
                            apiUser.getRole() > 0 ?
                                <React.Fragment></React.Fragment>
                                :
                                <div className="select-company">
                                    <select onChange={(e) => this.setState({ companyFilter: e.target.value })}
                                        style={{ border: 'none', background: 'none' }} value={this.state.companyFilter || ""}>
                                        {(([{ idCompany: -1, name: "All" }].concat(this.state.companies))).map((e, idx) => <option key={idx} value={e.idCompany}>{e.name}</option>)}
                                    </select>
                                </div>
                        }
                        <div className={"search-box"}>
                            <div style={{ marginRight: '10px', color: '#000' }} className={"ti ti-search"} />
                            <input placeholder="Filter" value={this.state.filter} onChange={(e) => {
                                this.setState({ filter: e.target.value });
                            }} />
                        </div>
                        <UserStatus />
                    </div>
                    <ListUser itemPerPage={20} items={this.filter(this.state.items || [])}
                        actions={[{
                            name: "Add", handler: this.startAddUser, show: true
                        }, {
                            name: "Delete", handler: this.startDeleteUser, show: true
                        }, {
                            name: "Edit", handler: this.startEditUser, show: true
                        }, {
                            name: "Refresh", handler: this.listUser, show: true
                        }]}
                    />
                    <UserInfoModal isOpen={this.state.isEditingUser} onOk={this.callApiUpdateUser} action={"edit"}
                        onCancel={(e) => this.setState({ isEditingUser: false })}
                        user={this.state.selectedUser}
                        licensePackages={this.state.licensePackages}
                        refreshListUser = {this.refreshListUser}
                        companies={this.state.companies}
                    />
                    <UserAddModal isOpen={this.state.isAddingUser} onOk={this.callApiAddUser} action={"add"}
                        onCancel={(e) => this.setState({ isAddingUser: false })}
                        companies={this.state.companies} licensePackages={this.state.licensePackages} />
                    <ConfirmationModal isOpen={this.state.isDeletingUser} title={"Confirmation"}
                        message={"Are you sure to delete selected user?"}
                        onCancel={() => this.setState({ isDeletingUser: false })}
                        onOk={() => this.callApiDeleteUser(this.state.selectedUser)}
                    />
                </div>
            </div>
        )
    };
}

PageUser.prototype = Object.create(React.Component.prototype);