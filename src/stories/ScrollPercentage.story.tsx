/* tslint:disable no-implicit-dependencies */
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
/* tslint:enable no-implicit-dependencies */
import React, { forwardRef, ReactNode } from 'react'
import { ScrollPercentageObserver } from '..'

import ScrollWrapper from './ScrollWrapper'

const calcPercentage = (percentage: number) => Math.floor(percentage * 100)

interface IProps {
  style?: object
  children?: ReactNode
  threshold?: number
}

const Header = forwardRef((props: IProps) => (
  <div
    style={{
      display: 'flex',
      minHeight: '25vh',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      background: 'lightcoral',
      color: 'azure',
      ...props.style,
    }}
  >
    {props.threshold ? (
      <h2
        style={{ marginTop: 0 }}
      >{`Threshold: ${props.threshold.toString()}%`}</h2>
    ) : null}
    <h3 style={{ marginBottom: 0 }}>{props.children}</h3>
  </div>
))

storiesOf('Scroll Percentage', module)
  .add('Child as function', () => (
    <ScrollWrapper>
      <ScrollPercentageObserver>
        {({ percentage }) => (
          <Header>{`Percentage scrolled: ${calcPercentage(
            percentage,
          )}%.`}</Header>
        )}
      </ScrollPercentageObserver>
    </ScrollWrapper>
  ))
  .add('Taller then viewport', () => (
    <ScrollWrapper>
      <ScrollPercentageObserver>
        {({ percentage }) => (
          <Header
            style={{ height: '150vh' }}
          >{`Percentage scrolled: ${calcPercentage(percentage)}%.`}</Header>
        )}
      </ScrollPercentageObserver>
    </ScrollWrapper>
  ))
  .add('With threshold', () => (
    <ScrollWrapper>
      <ScrollPercentageObserver threshold={0}>
        {({ percentage }) => (
          <Header threshold={0}>
            {`Percentage scrolled: ${calcPercentage(percentage)}%.`}
          </Header>
        )}
      </ScrollPercentageObserver>
      <ScrollPercentageObserver threshold={0.25}>
        {({ percentage }) => (
          <Header style={{ background: 'slategrey' }} threshold={25}>
            {`Percentage scrolled: ${calcPercentage(percentage)}%.`}
          </Header>
        )}
      </ScrollPercentageObserver>
      <ScrollPercentageObserver threshold={0.5}>
        {({ percentage }) => (
          <Header style={{ background: 'plum' }} threshold={50}>
            {`Percentage scrolled: ${calcPercentage(percentage)}%.`}
          </Header>
        )}
      </ScrollPercentageObserver>
      <ScrollPercentageObserver threshold={0.75}>
        {({ percentage }) => (
          <Header style={{ background: 'lightseagreen' }} threshold={75}>
            {`Percentage scrolled: ${calcPercentage(percentage)}%.`}
          </Header>
        )}
      </ScrollPercentageObserver>
      <ScrollPercentageObserver threshold={1}>
        {({ percentage }) => (
          <Header style={{ background: 'cornflowerblue' }} threshold={100}>
            {`Percentage scrolled: ${calcPercentage(percentage)}%.`}
          </Header>
        )}
      </ScrollPercentageObserver>
    </ScrollWrapper>
  ))
  .add('onChange function', () => (
    <ScrollWrapper>
      <ScrollPercentageObserver onChange={action('Scroll')}>
        <Header>
          Scroll percentage dispatched to <em>onChange</em>
        </Header>
      </ScrollPercentageObserver>
    </ScrollWrapper>
  ))
