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
    backgroundColor: "transparent",
    zIndex: "9999"
  }),
  menuList: (base, state) => ({
    ...base,
    backgroundColor: "transparent"
  }),
  menuPortal: (base, state) => ({
    ...base
  }),
  container: (base, state) => ({
    ...base,
    fontSize: "medium",
    opacity: state.isDisabled ? ".5" : "1",
    backgroundColor: "transparent"
  }),
  clearIndicator: (base, state) => ({
    ...base,
    color: "var(--tertiarycolor)"
  }),
  dropdownIndicator: (base, state) => ({
    ...base,
    color: "var(--tertiarycolor)",
    ":hover": { color: "var(--primaryColor)" }
  }),
  control: (base, state) => ({
    ...base,
    minHeight: "var(--inputButtonHeight)",
    margin: "0 auto",
    backgroundColor: "var(--slate_grey)",
    borderColor: state.isFocused ? "var(--primaryColor)" : "lightgray",
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    ":hover": { borderColor: "var(--primaryColor)" }, // border style on hover
    //border: '1px solid lightgray', // default border color
    boxShadow: "var(--primaryColor)" // no box-shadow
  }),
  option: (base, state) => ({
    ...base,
    borderBottom: "1px solid var(--primaryColor)",
    backgroundColor: state.isFocused
      ? "var(--primaryColor)"
      : "var(--slate_grey)",
    color: "white",
    ":active": {
      backgroundColor: !state.isSelected
        ? "var(--secondaryColor)"
        : "var(--slate_grey)"
    }
  }),
  placeholder: (base, state) => ({
    ...base,
    color: "var(--tertiarycolor)"
  }),
  singleValue: (base, state) => ({
    ...base,
    color: "var(--tertiarycolor)"
  }),
  valueContainer: (base, state) => ({
    ...base,
    backgroundColor: "var(--slate_grey)"
  }),
  multiValue: (base, state) => ({
    ...base,
    fontSize: 20,
    backgroundColor: state.data.isFixed ? "var(--grey)" : "var(--primaryColor)"
  }),
  multiValueLabel: (base, state) =>
    state.data.isFixed
      ? { ...base, fontWeight: "bold", color: "white", paddingRight: 6 }
      : { ...base, color: "var(--tertiarycolor)" },
  multiValueRemove: (base, state) =>
    state.data.isFixed
      ? { ...base, display: "none" }
      : {
          ...base,
          ":hover": {
            backgroundColor: "var(--secondaryColor)",
            color: "var(--tertiarycolor)"
          }
        }
};
