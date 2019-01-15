import Observer, {
  IntersectionObserverProps,
  IntersectionObserverRenderProps,
} from '@kohlmannj/react-intersection-observer'
import React, { createRef, PureComponent, ReactNode } from 'react'
import {
  IScrollPercentageCalculatorState,
  ScrollPercentageCalculator,
} from './ScrollPercentageCalculator'

export interface IScrollPercentageObserverRenderProps
  extends IntersectionObserverRenderProps,
    IScrollPercentageCalculatorState {}

export type ScrollPercentageObserverRenderFunction = ((
  fields: IScrollPercentageObserverRenderProps,
) => ReactNode)

export interface IScrollPercentageObserverOwnProps {
  /** Children should be either a function or a node */
  children?: ReactNode | ScrollPercentageObserverRenderFunction
  /** Call this function whenever the percentage changes */
  onChange?: (
    percentage: IScrollPercentageCalculatorState['percentage'],
    inView: boolean,
    percentageOfViewport: IScrollPercentageCalculatorState['percentageOfViewport'],
  ) => void
}

export type ScrollPercentageObserverProps = Pick<
  IntersectionObserverProps,
  Exclude<keyof IntersectionObserverProps, 'children' | 'onChange'>
> &
  IScrollPercentageObserverOwnProps

// TODO: convert to Stateless Functional Component (SFC)
/** @see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/28249 */
export class ScrollPercentageObserver extends PureComponent<
  ScrollPercentageObserverProps
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
      importPolyfill,
    } = this.props

    return (
      <Observer
        forwardedRef={forwardedRefProp}
        root={root}
        rootId={rootId}
        rootMargin={rootMargin}
        threshold={threshold}
        triggerOnce={triggerOnce}
        importPolyfill={importPolyfill}
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
