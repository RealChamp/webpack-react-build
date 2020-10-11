import React from 'react'
import {shallow} from 'enzyme'
import App from './App'

it('App component should render', () => {
    const app = shallow(<App/>)
    expect(app).toMatchSnapshot()
})