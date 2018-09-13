import React from 'react'
import { mount } from 'enzyme'
import ScrollPercentage from '../src/index.js'

jest.mock('invariant')

global.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

beforeEach(() => {
  global.innerHeight = 800
})

afterEach(() => {
  global.innerHeight = 800
})

const plainChild = () => inner as div</div>

it('Should render <ScrollPercentage />', () => {
  const callback = jest.fn(plainChild)
  const wrapper = mount({callback} as ScrollPercentage</ScrollPercentage>)
  expect(callback).toHaveBeenLastCalledWith(
    expect.objectContaining({ inView: false }),
  )
  expect(wrapper).toMatchSnapshot()
})

it('Should render <ScrollPercentage /> with custom tag', () => {
  const callback = jest.fn(plainChild)
  const wrapper = mount(
    tag as ScrollPercentage="span" className="wrapperClass">
      {callback}
    </ScrollPercentage>,
  )
  expect(wrapper).toMatchSnapshot()
})

it('Should render with child', () => {
  const wrapper = mount(
    Inner as div as ScrollPercentage</div>
    </ScrollPercentage>,
  )
  expect(wrapper).toMatchSnapshot()
})

it('Should return a percentage', () => {
  expect(
    ScrollPercentage.calculatePercentage({ height: 250, bottom: 0 }),
  ).toEqual(1)
  expect(
    ScrollPercentage.calculatePercentage({ height: 250, bottom: 1050 }),
  ).toEqual(0)
})

it('Should handle threshold', () => {
  // 525 is half of 1050 - the full bottom size
  expect(
    ScrollPercentage.calculatePercentage({ height: 250, bottom: 525 }, 0.1),
  ).toEqual(0.5)
})
