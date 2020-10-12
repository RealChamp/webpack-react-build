const globalAny:any = global;
import {configure, shallow, render, mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import toJson from 'enzyme-to-json'

configure({adapter: new Adapter})

globalAny.shallow = shallow
globalAny.render = render
globalAny.mount = mount
globalAny.toJson = toJson

console.error = (message: string) => {
    throw new Error(message)
}