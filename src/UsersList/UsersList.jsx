import React from 'react';
import { List } from 'immutable';
import _sortBy from 'lodash/sortBy';
import './UsersList.css';

import User from '../User';

class UsersList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users: new List(),
            usersSelected: new List()
        };
    }

    componentDidMount() {
        this._getUsers();
    }

    _getUsers() {
        const USERS_API = 'https://jsonplaceholder.typicode.com/users'

        fetch(USERS_API)
        .then(response => response.json())
        .then(usersJson => {

            this.setState(({users}) => ({
                users: users.merge(_sortBy(usersJson, ['name']))
            }))
        })
        .catch(error => {
            console.error('Something went wrong: %s', error)
        });
    }

    onUserSelect = user => {
        const {usersSelected} = this.state;

        const userSelectedIndex = usersSelected.findIndex(u => u.get('id') === user.get('id'));

        this.setState(({usersSelected}) => ({
            usersSelected: userSelectedIndex > -1 ? usersSelected.delete(userSelectedIndex) :
                                                usersSelected.push(user)
        }));
    }

    confirmButtonDidClick = event => {
        const {usersSelected} = this.state;

        const names = usersSelected.map(u => u.get('name'));

        alert(names.join('\n'));
    }

    render() {
        const {users, usersSelected} = this.state;

        return (
            <div className="usersListContainer">
                {
                    usersSelected.size > 0 && (
                        <p className="usersSelectedLabel">
                            {`${usersSelected.size} of ${users.size} selected`}
                        </p>
                    )
                }
                <ul className="usersList">
                    {
                        users.map(user => {
                            return (
                                <li key={user.get('id')}>
                                    <User user={user} onSelect={this.onUserSelect} />
                                </li>
                            )
                        })
                    }
                </ul>
                <button className="confirmButton"
                onClick={this.confirmButtonDidClick}>
                    Confirm
                </button>
            </div>
        )
    }
}

export default UsersList;