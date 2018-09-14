import {
  IntersectionObserverProps,
  IntersectionObserverRenderProps,
} from '@kohlmannj/react-intersection-observer'
import { expandShorthandProperty } from 'css-property-parser'
import { PureComponent } from 'react'
import { unwatch, watch } from './scroll'
import { IScrollPercentageObserverOwnProps } from './ScrollPercentageObserver'

export type ScrollPercentageCalculatorProps = IntersectionObserverRenderProps &
  Pick<IntersectionObserverProps, 'rootMargin' | 'root' | 'threshold'> &
  IScrollPercentageObserverOwnProps

export interface IScrollPercentageCalculatorState {
  percentage: number
}

/**
 * Monitors scroll, and triggers the children function with updated props
 *
 * <ScrollPercentage>
 * {({inView, percentage}) => (
 *   <h1>{`${inView} {percentage}`}</h1>
 * )}
 * </ScrollPercentage>
 */
export class ScrollPercentageCalculator extends PureComponent<
  ScrollPercentageCalculatorProps,
  IScrollPercentageCalculatorState
> {
  public static defaultProps = {
    threshold: 0,
  }

  /**
   * Get the correct viewport height. If rendered inside an iframe, grab it from the parent
   */
  public static viewportHeight(): number {
    return window.parent ? window.parent.innerHeight : window.innerHeight || 0
  }

  public static calculatePercentage(
    bounds: ClientRect,
    rootMargin: IntersectionObserverProps['rootMargin'],
    threshold: number = 0,
  ): number {
    const parsedRootMargin = expandShorthandProperty(
      'margin',
      rootMargin || '0px',
    )
    console.log(parsedRootMargin)

    const vh = ScrollPercentageCalculator.viewportHeight()
    const offsetTop = threshold * vh * 0.25
    const offsetBottom = threshold * vh * 0.25

    return (
      1 -
      Math.max(
        0,
        Math.min(
          1,
          (bounds.bottom - offsetTop) /
            (vh + bounds.height - offsetBottom - offsetTop),
        ),
      )
    )
  }

  public state = {
    percentage: 0,
  }

  public componentDidMount() {
    // Start by updating the scroll position, so it correctly reflects the elements start position
    this.handleScroll()
  }

  public componentDidUpdate(
    prevProps: ScrollPercentageCalculatorProps, // tslint:disable-line variable-name
    prevState: IScrollPercentageCalculatorState,
  ) {
    if (
      this.props.onChange &&
      (prevState.percentage !== this.state.percentage ||
        prevProps.inView !== this.props.inView)
    ) {
      this.props.onChange(this.state.percentage, this.props.inView)
    }

    if (prevProps.inView !== this.props.inView) {
      this.monitorScroll(this.props.inView)
    }
  }

  public componentWillUnmount() {
    this.monitorScroll(false)
  }

  public monitorScroll(enable: boolean) {
    if (enable) {
      watch(this.handleScroll)
    } else {
      unwatch(this.handleScroll)
    }
  }

  public handleScroll = () => {
    const { forwardedRef, rootMargin, threshold } = this.props

    if (!forwardedRef) {
      return
    }

    const bounds = forwardedRef.current.getBoundingClientRect()
    const percentage = ScrollPercentageCalculator.calculatePercentage(
      bounds,
      rootMargin,
      threshold,
    )

    if (percentage !== this.state.percentage) {
      this.setState({ percentage })
    }
  }

  public render() {
    const { children, inView, forwardedRef } = this.props
    const { percentage } = this.state

    return typeof children === 'function'
      ? children({ inView, forwardedRef, percentage })
      : children
  }
}
