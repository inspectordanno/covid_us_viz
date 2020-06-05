const colors = {
  lightblue: "#4b6cb7",
  darkblue: "#182848"
}

export const selectColorStyles = {
  menu: (styles) => ({
    ...styles,
    backgroundColor: colors.lightblue,
  }),
  singleValue: (styles) =>({
    ...styles,
    color: 'black'
  }),
  input: (styles) =>({
    ...styles,
    color: 'black'
  }),
  noOptionsMessage: (styles) =>({
    ...styles,
    color: 'black'
  }),
  control: (styles) => ({
    ...styles,
    backgroundColor: colors.lightblue,
    borderColor: 'transparent',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'
  })
}

export default colors;