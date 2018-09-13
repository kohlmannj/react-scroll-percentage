import Observer, {
  IntersectionObserverProps,
  IntersectionObserverRenderProps,
} from '@kohlmannj/react-intersection-observer'
import React, { createRef, PureComponent, ReactNode } from 'react'
import ScrollPercentageCalculator from './ScrollPercentageCalculator'

export interface IScrollPercentageRenderProps
  extends IntersectionObserverRenderProps {
  percentage: number
}

export interface IScrollPercentageOwnProps {
  /** Children should be either a function or a node */
  children?: ReactNode | ((fields: IScrollPercentageRenderProps) => ReactNode)
  /** Call this function whenever the percentage changes */
  onChange?: (percentage: number, inView: boolean) => void
}

export type ScrollPercentageProps = Pick<
  IntersectionObserverProps,
  Exclude<keyof IntersectionObserverProps, 'children' | 'onChange'>
> &
  IScrollPercentageOwnProps

// TODO: convert to Stateless Functional Component (SFC)
/** @see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/28249 */
export default class ScrollPercentage extends PureComponent<
  ScrollPercentageProps
> {
  public static defaultProps = {
    forwardedRef: createRef<any>(),
    threshold: 0,
    triggerOnce: false,
  }

  public render() {
    const {
      children,
      onChange,
      root,
      rootId,
      rootMargin,
      forwardedRef: forwardedRefProp,
      threshold,
      triggerOnce,
    } = this.props

    return (
      <Observer
        forwardedRef={forwardedRefProp}
        root={root}
        rootId={rootId}
        rootMargin={rootMargin}
        threshold={threshold}
        triggerOnce={triggerOnce}
      >
        {({ inView, forwardedRef }) => (
          <ScrollPercentageCalculator
            forwardedRef={forwardedRef}
            inView={inView}
            onChange={onChange}
            rootMargin={rootMargin}
            threshold={threshold}
          >
            {children}
          </ScrollPercentageCalculator>
        )}
      </Observer>
    )
  }
}
