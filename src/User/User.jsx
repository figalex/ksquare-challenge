import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import './User.css';

class User extends React.Component {

    static propTypes = {
        user: PropTypes.instanceOf(Immutable.Map),
        onSelect: PropTypes.func.isRequired
    }

    checkboxDidChange = event => {
        this.props.onSelect(this.props.user);
    }

    render() {
        const {user} = this.props;

        return (
            <div className="user">
                <div className="checkboxColumn">
                    <input type="checkbox" onChange={this.checkboxDidChange} />
                </div>
                <div className="detailsColumn">
                    <p className="userName">{user.get('name')}</p>
                    <p className="userEmail">{user.get('email')}</p>
                </div>
            </div>
        )
    }
}

export default User;