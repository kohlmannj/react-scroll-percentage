import {
  IntersectionObserverProps,
  IntersectionObserverRenderProps,
} from '@kohlmannj/react-intersection-observer'
import { PureComponent } from 'react'
import { parseRootMargin } from './parseRootMargin'
import { unwatch, watch } from './scroll'
import {
  IScrollPercentageObserverOwnProps,
  ScrollPercentageObserverRenderFunction,
} from './ScrollPercentageObserver'

export type ScrollPercentageCalculatorProps = IntersectionObserverRenderProps &
  Pick<IntersectionObserverProps, 'rootMargin' | 'root' | 'threshold'> &
  IScrollPercentageObserverOwnProps

export interface IScrollPercentageCalculatorState {
  percentage: number
  percentageOfViewport: number
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

  public static getRootMarginOffsetTerm(
    { value, unit }: { value: number; unit: string },
    length: number,
  ) {
    switch (unit) {
      case 'px':
        return value
      case '%':
        return (value / 100) * length
      default:
        throw new Error(`'${unit}' units not supported`)
    }
  }

  public static calculatePercentages(
    bounds: ClientRect,
    rootMargin: IntersectionObserverProps['rootMargin'],
    threshold: number = 0,
  ): IScrollPercentageCalculatorState {
    const parsedRootMargin = parseRootMargin(rootMargin)
    const rootMarginTop = parsedRootMargin[0]
    const rootMarginBottom = parsedRootMargin[2]

    const vh = ScrollPercentageCalculator.viewportHeight()
    const offsetTop =
      threshold * vh * 0.25 -
      ScrollPercentageCalculator.getRootMarginOffsetTerm(rootMarginTop, vh)
    const offsetBottom =
      threshold * vh * 0.25 -
      ScrollPercentageCalculator.getRootMarginOffsetTerm(rootMarginBottom, vh)

    const percentage =
      1 -
      Math.max(
        0,
        Math.min(
          1,
          (bounds.bottom - offsetTop) /
            (vh + bounds.height - offsetBottom - offsetTop),
        ),
      )

    const lowestTopEdge = Math.max(offsetTop, bounds.top)
    const highestBottomEdge = Math.min(vh - offsetBottom, bounds.bottom)
    const effectiveViewportHeight = 0 - offsetTop + vh - offsetBottom

    const percentageOfViewport: number = Math.max(
      0,
      Math.min(
        1,
        (highestBottomEdge - lowestTopEdge) / effectiveViewportHeight,
      ),
    )

    return { percentage, percentageOfViewport }
  }

  public state: IScrollPercentageCalculatorState = {
    percentage: 0,
    percentageOfViewport: 0,
  }

  public componentDidMount() {
    // Start by updating the scroll position, so it correctly reflects the elements start position
    this.handleScroll()
    if (this.props.inView) {
      this.monitorScroll(this.props.inView)
    }
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
      // const transitionedToOffScreenButNeedsPercentageUpdate =
      //   !!prevProps.inView &&
      //   !this.props.inView &&
      //   this.state.percentage > 0 &&
      //   this.state.percentage < 1

      // if (transitionedToOffScreenButNeedsPercentageUpdate) {
      //   console.log({ transitionedToOffScreenButNeedsPercentageUpdate })
      // }

      this.props.onChange({ ...this.state, inView: this.props.inView })
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
      // Call handleScroll() an additional time to cover an edge case affecting the call to
      // this.props.onChange() when we transition from in-view to out-of-view, but
      // this.state.percentage isn't yet equal to 0 or 1
      if (this.state.percentage > 0 && this.state.percentage < 1) {
        console.log(
          'Calling handleScroll() an additional time to update this.stage.percentage after transitioning from in-view to out-of-view',
        )
        this.handleScroll()
      }
      unwatch(this.handleScroll)
    }
  }

  public handleScroll = () => {
    const { forwardedRef, rootMargin, threshold } = this.props

    if (!forwardedRef) {
      return
    }

    const bounds = forwardedRef.current.getBoundingClientRect()
    const {
      percentage,
      percentageOfViewport,
    } = ScrollPercentageCalculator.calculatePercentages(
      bounds,
      rootMargin,
      threshold,
    )

    if (percentage !== this.state.percentage) {
      this.setState({ percentage })
    }

    if (percentageOfViewport !== this.state.percentageOfViewport) {
      this.setState({ percentageOfViewport })
    }
  }

  public render() {
    const { children, inView, forwardedRef } = this.props
    const { percentage, percentageOfViewport } = this.state

    return (
      (typeof children === 'function'
        ? (children as ScrollPercentageObserverRenderFunction)({
            inView,
            forwardedRef,
            percentage,
            percentageOfViewport,
          })
        : children) || null
    )
  }
}
