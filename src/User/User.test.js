import React from 'react';
import { shallow } from 'enzyme';
import { Map } from 'immutable';
import sinon from 'sinon';

import User from './User';

describe('User component', () => {
    const TEST_USER = new Map({
        "id": 1,
        "name": "Leanne Graham",
        "username": "Bret",
        "email": "Sincere@april.biz"
    })

    let user = null;
    const onSelect = jest.fn();

    beforeEach(() => {
        user = shallow(<User user={TEST_USER} onSelect={onSelect} />);
    });

    it('renders correctly', () => {
        expect(user.find('input[type="checkbox"]').length).toBe(1);
        expect(user.find('.userName').length).toBe(1);
        expect(user.find('.userEmail').length).toBe(1);
    });

    it('dislays user info correctly', () => {
        expect(user.find('.userName').text()).toEqual(TEST_USER.get('name'));
        expect(user.find('.userEmail').text()).toEqual(TEST_USER.get('email'));
    });

    describe('when checkbox is changed', () => {

        it('should call onSelect handler prop', () => {
            user.find('input[type="checkbox"]').simulate('change');
            expect(onSelect).toHaveBeenCalledWith(TEST_USER);
        });
    })
})