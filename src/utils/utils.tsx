
const checkUntouchable = (e) => {
  e.preventDefault();
  console.log('touching')

}

const overlapElement = (ref) => {
  ref.measure( (fx, fy, width, height, px, py) => {
    console.log('Component width is: ' + width)
    console.log('Component height is: ' + height)
    console.log('X offset to page: ' + px)
    console.log('Y offset to page: ' + py)
  })
}

export {checkUntouchable, overlapElement}