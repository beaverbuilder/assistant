import { clamp, distance } from "@popmotion/popcorn"

// Prevent rapid reverse swapping
const buffer = 5

const findIndex = (
  i,
  yOffset,
  positions = []
) => {
    let target = i
    const { top, height } = positions[i]
    const bottom = top + height

    // If moving down
    if ( yOffset > 0 ) {
      const nextItem = positions[i + 1]
      if ( nextItem === undefined ) return i

      const swapOffset = distance( bottom, nextItem.top + nextItem.height / 2 ) + buffer
      if ( yOffset > swapOffset ) target = i + 1

      // If moving up
    } else if ( yOffset < 0 ) {
      const prevItem = positions[i - 1]
      if ( prevItem === undefined ) return i

      const prevBottom = prevItem.top + prevItem.height
      const swapOffset = distance( top, prevBottom - prevItem.height / 2 ) + buffer
      if ( yOffset < -swapOffset ) target = i - 1
    }

    return clamp( 0, positions.length, target )
}

export default findIndex
