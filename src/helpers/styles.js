/*clearIndicator container control dropdownIndicator 
group groupHeading indicatorsContainer indicatorSeparator 
input loadingIndicator loadingMessage menu menuList multiValue 
multiValueLabel multiValueRemove noOptionsMessage option placeholder singleValue valueContainer */
export const selectStyles = {
  /* 
  clearIndicator function (Object) => Object
  container function (Object) => Object
  control function (Object) => Object
  dropdownIndicator function (Object) => Object
  group function (Object) => Object
  groupHeading function (Object) => Object
  indicatorsContainer function (Object) => Object
  indicatorSeparator function (Object) => Object
  input function (Object) => Object
  loadingIndicator function (Object) => Object
  loadingMessageCSS function (Object) => Object
  menu function (Object) => Object
  menuList function (Object) => Object
  menuPortal function (Object) => Object
  multiValue function (Object) => Object
  multiValueLabel function (Object) => Object
  multiValueRemove function (Object) => Object
  noOptionsMessageCSS function (Object) => Object
  option function (Object) => Object
  placeholder function (Object) => Object
  singleValue function (Object) => Object
  valueContainer functionrequired (Object) => Object
  */
    menu: (base, state) => ({
      ...base,
      backgroundColor: 'transparent',
    }),
    menuList: (base, state) => ({
      ...base,
      backgroundColor: 'transparent',
    }),
    menuPortal: (base, state) => ({
      ...base,
      backgroundColor: 'blue',
    }),
    container: (base, state) => ({
      ...base,
      opacity: state.isDisabled ? '.5' : '1',
      backgroundColor: 'transparent',
    }),
    clearIndicator: (base, state) => ({
      ...base,
      color: 'var(--tertiarycolor)'
    }),
    dropdownIndicator: (base, state) => ({
      ...base,
      color: 'var(--tertiarycolor)'
    }),
    control: (base, state) => ({
      ...base,
      backgroundColor: 'var(--grey)',
    }),
    option: (base, state) => ({
      ...base,
      borderBottom: '1px solid var(--primaryColor)',
      borderRadius: '4px',
      background: state.isFocused ? 'var(--primaryColor)' : 'var(--grey)',
      color: 'white'
    }),
    placeholder: (base, state) => ({
      ...base,
      color: 'var(--tertiarycolor)'
    }),
    singleValue: (base, state) => ({
      ...base,
      color: 'var(--tertiarycolor)'
    }),
    valueContainer: (base, state) => ({
      ...base,
      backgroundColor: 'var(--grey)'
    }),
    multiValue: (base, state) => state.data.isFixed ? { ...base, backgroundColor: 'var(--grey_out)' } : { ...base, backgroundColor: 'var(--primaryColor)' },
    multiValueLabel: (base, state) => state.data.isFixed ? { ...base, fontWeight: 'bold', color: 'white', paddingRight: 6 } : { ...base, color: 'var(--tertiarycolor)'},
    multiValueRemove: (base, state) => state.data.isFixed ? { ...base, display: 'none' } : { ...base, ':hover': {backgroundColor: 'var(--secondaryColor)',  color: 'var(--tertiarycolor)'}}
  }