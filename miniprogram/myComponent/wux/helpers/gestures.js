/**
 * 获取触摸点位置信息
 */
export const getTouchPoints = (nativeEvent, index = 0) => {
    const touches = nativeEvent.touches
    const changedTouches = nativeEvent.changedTouches
    const hasTouches = touches && touches.length > 0
    const hasChangedTouches = changedTouches && changedTouches.length > 0
    const points = !hasTouches && hasChangedTouches ? changedTouches[index] : hasTouches ? touches[index] : nativeEvent

    return {
        x: points.pageX,
        y: points.pageY,
    }
}

/**
 * 获取触摸点个数
 */
export const getPointsNumber = (e) => e.touches && e.touches.length || e.changedTouches && e.changedTouches.length

/**
 * 判断是否为同一点
 */
export const isEqualPoints = (p1, p2) => p1.x === p2.x && p1.y === p2.y

/**
 * 判断是否为相近的两点
 */
export const isNearbyPoints = (p1, p2, DOUBLE_TAP_RADIUS = 25) => {
    const xMove = Math.abs(p1.x - p2.x)
    const yMove = Math.abs(p1.y - p2.y)
    return xMove < DOUBLE_TAP_RADIUS & yMove < DOUBLE_TAP_RADIUS
}

/**
 * 获取两点之间的距离
 */
export const getPointsDistance = (p1, p2) => {
    const xMove = Math.abs(p1.x - p2.x)
    const yMove = Math.abs(p1.y - p2.y)
    return Math.sqrt(xMove * xMove + yMove * yMove)
}

/**
 * 获取触摸移动方向
 */
export const getSwipeDirection = (x1, x2, y1, y2) => {
    return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
}
