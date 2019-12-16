module.exports = UserInfoModal;
const React = require("react");
const Modal = require('react-modal');
Modal.setAppElement('#react-app');
const PropTypes = require('prop-types');
require('./style.less');
const Editable = require('../../components/Editable');
const DropDown = require('../../components/DropDown');

const SearchableDropdown = require('./../../components/SearchableDropdown').default;
const userService = require('./../../services/apiUser');

// const DropDownWithOutSearchBar = require('../../components/DropDownWithoutSearchBar');

UserInfoModal.protoTypes = {
    isOpen: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func
};

function UserInfoModal(props) {
    React.Component.call(this, props);
    this.state = {
        username: "",
        email: "",
        fullname: "",
        status: "Active",
        role: 2,
        password: "",
        repassword: "",
        idCompany: null,
        idLicensePackage: null
    };

    this.status = [
        {
            display: "Active",
            value: "Active"
        },
        {
            display: "Inactive",
            value: "Inactive"
        }
    ];

    this.role = [
        {
            value: 0,
            display: "System Manager"
        },
        {
            value: 1,
            display: "Company Admin"
        },
        {
            value: 2,
            display: "Normal User"
        },
        {
            value: 3,
            display: "Company Storage (Full permission)"
        },
        {
            value: 3.1,
            display: "Company Storage (Upload only)"
        },
        {
            value: 3.2,
            display: "Company Storage (Edit only)"
        },
        {
            value: 3.3,
            display: "Company Storage (View only)"
        }
    ];

    this.updateProps = function () {
        this.setState({
            username: "",
            email: "",
            fullname: "",
            status: "Active",
            role: 2,
            password: "",
            repassword: "",
            idCompany: null,
            idLicensePackage: null
        });
    }


    this.render = function () {
        return (
            <Modal isOpen={this.props.isOpen} portalClassName="ModalStyle"
                className="UserInfoModal" overlayClassName="modal-backdrop"
                onAfterOpen={() => { this.updateProps(); }}>
                <h4>New User</h4>
                <div className="content-dialog">
                    <div style={{ flex: 1, overflow: 'visible' }}>
                        <div className="fieldset">
                            <div>Username</div>
                            <Editable value={this.state.username} formatValue={(v) => ((v === null || v === undefined || v.length === 0) ? "[empty]" : v)}
                                onValueChanged={(value) => this.setState((state) => {
                                    return {
                                        username: value
                                    };
                                })}
                            />
                        </div>
                        <div className="fieldset">
                            <div>Full Name</div>
                            <Editable value={this.state.fullname} formatValue={(v) => ((v === null || v === undefined || v.length === 0) ? "[empty]" : v)}
                                onValueChanged={(value) => this.setState((state) => {
                                    return {
                                        fullname: value
                                    };
                                })}
                            />
                        </div>
                        <div className="fieldset">
                            <div>Password</div>
                            <Editable value={this.state.password}
                                formatValue={(v) => {
                                    if (v.length === 0) {
                                        return '[empty]';
                                    }
                                    return new Array(v.length).fill('*', 0, v.length);
                                }}
                                onValueChanged={(value) => this.setState((state) => {
                                    return {
                                        password: value
                                    };
                                })}
                                hideText
                            />
                        </div>
                        <div className="fieldset">
                            <div>Re-password</div>
                            <Editable value={this.state.repassword}
                                formatValue={(v) => {
                                    if (v.length === 0) {
                                        return '[empty]';
                                    }
                                    return new Array(v.length).fill('*', 0, v.length);
                                }}
                                onValueChanged={(value) => this.setState((state) => {
                                    return {
                                        repassword: value
                                    };
                                })}
                                hideText
                            />
                        </div>
                        <div className="fieldset">
                            <div>Email</div>
                            <Editable value={this.state.email} formatValue={(v) => ((v === null || v === undefined || v.length === 0) ? "[empty]" : v)}
                                onValueChanged={(value) => this.setState((state) => {
                                    return {
                                        email: value
                                    };
                                })}
                            />
                        </div>
                        {userService.getRole() > 0 ? 
                            <React.Fragment></React.Fragment>
                            :
                            <div className="fieldset">
                                <div>Company:</div>
                                {/* <DropDown  getItem={(company) => (
                                <div style={{ height: '18px', display: 'flex', alignItems: 'center' }}>{company ? company.name : "[select company]"}</div>)}
                                items = {this.props.companies}
                                itemHeight={18}
                                selectedItem={this.props.companies.find((e) => e.idCompany === this.state.idCompany)}
                                onItemClicked = {(clickedCompany)=>{
                                    this.setState((state)=>{
                                        return {
                                            idCompany: clickedCompany.idCompany
                                        }
                                    });
                                }}
                            /> */}
                                <SearchableDropdown choices={this.props.companies.map((e) => ({ value: e.idCompany, display: e.name }))}
                                    value={this.state.idCompany} onChange={(e) => { this.setState({ idCompany: e }) }}
                                />
                            </div>
                        }
                        <div className="fieldset">
                            <div>License:</div>
                            {/* <DropDown getItem={(license) => (
                                <div style={{
                                    height: '18px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>{license ? license.name : "[select license]"}</div>)}
                                      items={this.props.licensePackages}
                                      itemHeight={18}
                                      selectedItem={this.props.licensePackages.find((e) => e.idLicensePackage === this.state.idLicensePackage)}
                                      onItemClicked={(license) => {
                                          this.setState((state) => {
                                              return {
                                                  idLicensePackage: license.idLicensePackage
                                              }
                                          });
                                      }}
                            /> */}
                            <SearchableDropdown choices={this.props.licensePackages.map((e) => ({ value: e.idLicensePackage, display: e.name }))}
                                value={this.state.idLicensePackage} onChange={(e) => { this.setState({ idLicensePackage: e }) }}
                            />
                        </div>
                        {/* <div className="fieldset">
                            <div>Status</div>
                            <Editable value={this.state.status} formatValue={(v) => ((v === null || v === undefined || v.length === 0 )? "[empty]" : v)}
                                            onValueChanged={(value) => this.setState((state)=>{
                                                return {
                                                    status: value
                                                };
                                            })}
                            />
                        </div> */}
                        <div className="fieldset">
                            <div>Role:</div>
                            <SearchableDropdown maxHeight="200px"
                                choices={this.role} value={this.state.role} onChange={(e) => { this.setState({ role: e }); }}
                            />
                        </div>
                        <div className="fieldset">
                            <div>Status:</div>
                            <SearchableDropdown
                                choices={this.status} value={this.state.status} onChange={(e) => { this.setState({ status: e }); }}
                            />
                        </div>
                        {/* <div className="fieldset">
                            <div>Role</div>
                            <Editable value={this.state.role} formatValue={(v) => ((v === null || v === undefined || v.length === 0 )? "[empty]" : v)} 
                                            onValueChanged={(value) => this.setState((state)=>{
                                                return {
                                                    role: value
                                                };
                                            })}
                            />
                        </div> */}
                        {/* <div className="fieldset">
                            <div>Company:</div>
                            <DropDown  getItem={(company) => (
                                <div style={{ height: '18px' }}>{company ? company.name : "[select company]"}</div>)}
                                items = {this.props.companies}
                                itemHeight={18}
                                onItemClicked = {(clickedCompany)=>{
                                    this.setState((state)=>{
                                        return {
                                            idCompany: clickedCompany.idCompany
                                        }
                                    });
                                }}
                            />
                        </div> */}
                    </div>
                </div>
                <div className="footer-dialog">
                    <div className="btn-next" onClick={(e) => props.onOk(Object.assign({}, this.state))}>Ok</div>
                    <div className="btn-next" onClick={props.onCancel}>Close</div>
                </div>

            </Modal>
        );
    };
}

UserInfoModal.prototype = Object.create(React.Component.prototype);