import React from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import {Map, List, fromJS} from 'immutable';

import UsersList from './UsersList.jsx';
import User from '../User';

describe('UsersList Component', () => {
    const INITIAL_STATE = {
        users: List(),
        usersSelected: List()
    }

    const TEST_USERS = [
        {
            "id": 1,
            "name": "Leanne Graham",
            "username": "Bret",
            "email": "Sincere@april.biz"
        },
        {
            "id": 2,
            "name": "Ervin Howell",
            "username": "Antonette",
            "email": "Shanna@melissa.tv",
        }
    ];

    it('renders a <ul> element with initial state', () => {
        const userList = shallow(<UsersList />);
        expect(userList.find('ul').length).toBe(1);
        expect(userList.state()).toEqual(INITIAL_STATE);
    });

    describe('Users request', () => {
        const USERS_API = 'https://jsonplaceholder.typicode.com/users'

        beforeEach(() => {
            sinon.spy(UsersList.prototype, 'componentDidMount');
            sinon.stub(window, 'fetch');  

            const response = new window.Response(JSON.stringify(TEST_USERS), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            window.fetch.returns(Promise.resolve(response))          
        });


        afterEach(() => {
            UsersList.prototype.componentDidMount.restore();
            window.fetch.restore();
        })

        it('should make a request for users on componentDidMount', () => {
            let usersList = mount(<UsersList />);
            expect(UsersList.prototype.componentDidMount.calledOnce).toBe(true);
            expect(window.fetch.calledOnce).toBe(true);
            expect(window.fetch.getCall(0).args[0]).toEqual(USERS_API);
        });

        it('should sort users by name in ascendent order', (done) => {
            let usersList = mount(<UsersList />);

            setImmediate(() => {
                expect(usersList.state().users.get(0).toJS()).toEqual(TEST_USERS[1]);
                expect(usersList.state().users.get(1).toJS()).toEqual(TEST_USERS[0]);
                done();
            });
        });
    });

    describe('Users rendering', () => {
        const usersList = shallow(<UsersList />);
        const _users = fromJS(TEST_USERS);

        beforeEach(() => {
            usersList.setState(({users}) => ({
                users: users.merge(_users)
            }));
        });

        it('should render a User component for each user', () => {
            expect(usersList.find(User).length).toEqual(2);
        });
    });

    describe('Users selection', () => {
        const usersList = shallow(<UsersList />);
        const _users = fromJS(TEST_USERS);
        const LABEL_CSS_CLASS = '.usersSelectedLabel';

        beforeEach(() => {
            usersList.setState(({users}) => ({
                users: users.merge(_users)
            }));
        })

        it('should not display the label for "x of y selected" when no users are selected', () => {
            expect(usersList.find(LABEL_CSS_CLASS).length).toEqual(0);
        });

        it('should display the label for "x of y selected" when at least 1 user is selected', () => {
            const selectedUsers = new List([_users.get(0)])
            usersList.setState(({usersSelected}) => ({
                usersSelected: selectedUsers
            }));
            expect(usersList.find(LABEL_CSS_CLASS).length).toEqual(1);
        });
    });

    describe('User select callback', () => {
        const usersList = shallow(<UsersList />);
        const _users = fromJS(TEST_USERS);

        beforeEach(() => {
            usersList.setState(({usersSelected}) => ({
                usersSelected: new List()
            }));
        })

        it('should add the selected user to usersSelected array when is not selected', () => {
            usersList.instance().onUserSelect(_users.get(0));
            expect(usersList.state('usersSelected').get(0)).toEqual(_users.get(0));
        });

        it('should remove the selected user from usersSelected array when is already selected', () => {
            usersList.setState(({usersSelected}) => ({
                usersSelected: new List([_users.get(0)])
            }));
            usersList.instance().onUserSelect(_users.get(0));
            expect(usersList.state('usersSelected').size).toEqual(0);
        })
    });

    describe('Users List confirm button', () => {
        const usersList = shallow(<UsersList />);
        const _users = fromJS(TEST_USERS);
        const BUTTON_CSS_SELECTOR = 'button.confirmButton';

        beforeEach(() => {
            sinon.spy(window, 'alert')
        });

        afterEach(() => {
            window.alert.restore();
        })

        it('should render a button', () => {
            expect(usersList.find(BUTTON_CSS_SELECTOR).length).toEqual(1);
        });

        it('should display the selected names when button is clicked', () => {
            usersList.setState(({usersSelected}) => ({
                usersSelected: new List([_users.get(0)])
            }));
            usersList.find(BUTTON_CSS_SELECTOR).simulate('click');
            expect(window.alert.args[0][0]).toEqual(_users.get(0).get('name'));
        })
    })
});