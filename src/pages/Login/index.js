module.exports = Login;
const React = require('react');
const apiUser = require('./../../services/apiUser');
const Redirect = require('react-router-dom').Redirect;
const {toast} = require('react-toastify');
require('./style.less');

function Login(props) {
    React.Component.call(this, props);
    
    this.state = {
        username: "",
        password: "",
        changed: true
    }

    this.componentDidMount = function() {
        this.setState({
            username: "",
            password: ""
        });
    }

    this.login = function() {
        apiUser.login(this.state.username, this.state.password)
        .then((res)=>{
            console.log(res);
            toast.success('Login successfully');
            this.setState({
                changed: !changed
            })
        })
        .catch((e)=>{
            toast.error(e);
        });
        this.setState({
            username: "",
            password: ""
        });
    }

    this.render = function() {
        if (apiUser.isLoggedIn() && (this.state.changed == this.state.changed)) {
            return <Redirect to={this.props.from || '/'} />
        }
        return (
            <div>
                <div onKeyDown = {(e)=>{if (e.keyCode == 13) this.login();}}>
                <h4>Username:</h4><input value = {this.state.username} onChange = {(e) => {this.setState({username: e.target.value})}}/>
                <h4>Password:</h4><input type="password" value = {this.state.password} onChange = {(e) => {this.setState({password: e.target.value})}}/>
                <br/>
                <br/>
                <input type="Submit" value="Login" onChange={(e)=>{e.preventDefault()}} onClick={(e)=>{this.login();}}/>
                </div>
            </div>
        );
    }
}

Login.prototype = Object.create(React.Component.prototype);
