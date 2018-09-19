/**
 * Accepts the rootMargin value from the user configuration object
 * and returns an array of the four margin values as an object containing
 * the value and unit properties. If any of the values are not properly
 * formatted or use a unit other than px or %, and error is thrown.
 * @private
 * @param {string=} rootMargin An optional rootMargin value,
 *     defaulting to '0px'.
 * @return {Array<Object>} An array of margin objects with the keys
 *     value and unit.
 */
export function parseRootMargin(rootMargin = '0px') {
  const margins = rootMargin.split(/\s+/).map(margin => {
    const parts = /^(-?\d*\.?\d+)(px|%)$/.exec(margin)
    if (!parts) {
      throw new Error('rootMargin must be specified in pixels or percent')
    }
    return { value: parseFloat(parts[1]), unit: parts[2] }
  })

  // Handles shorthand.
  margins[1] = margins[1] || margins[0]
  margins[2] = margins[2] || margins[0]
  margins[3] = margins[3] || margins[1]

  return margins
}
