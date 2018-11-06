/*clearIndicator container control dropdownIndicator 
group groupHeading indicatorsContainer indicatorSeparator 
input loadingIndicator loadingMessage menu menuList multiValue 
multiValueLabel multiValueRemove noOptionsMessage option placeholder singleValue valueContainer */
export const selectStyles = {
    menu: (base, state) => ({
      ...base,
      backgroundColor: 'var(--grey)',
    }),
    container: (base, state) => ({
      ...base,
      opacity: state.isDisabled ? '.5' : '1',
      backgroundColor: 'var(--grey)',
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
    singleValue: (base, state) => ({
      ...base,
      color: 'var(--tertiarycolor)'
    }),
    placeholder: (base, state) => ({
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