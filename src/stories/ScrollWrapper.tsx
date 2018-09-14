import React, { AllHTMLAttributes, DetailedHTMLProps, SFC } from 'react'

const style = {
  height: '101vh',
  textAlign: 'center' as 'center',
  display: 'flex',
  flexDirection: 'column' as 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'papayawhip',
}

/**
 * ScrollWrapper directs the user to scroll the page to reveal it's children.
 * Use this on Modules that have scroll and/or observer triggers.
 */
const ScrollWrapper: SFC<
  DetailedHTMLProps<AllHTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ children, ...props }) => (
  <div {...props}>
    <section style={style}>
      <h1>⬇ Scroll Down ⬇</h1>
    </section>
    {children}
    <section style={style}>
      <h1>⬆︎ Scroll up ⬆︎</h1>
    </section>
  </div>
)

export default ScrollWrapper
