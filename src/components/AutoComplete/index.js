import React from 'react'
import { Component, PropTypes } from 'react'

class Autocomplete extends Component {

	get value() {
		return this.refs.inputLocation.value
	}

	set value(inputValue) {
		this.refs.inputLocation.value = inputValue
	}

	render() {
		return (
			<div class = "input-text">
			<input class = "input-text"
				   ref = "inputLocation"
			       type="text" 
			       list="locations" />
			<datalist id="locations">
				{this.props.options.map(
					(opt, i) => 
					<option key= {i}>{opt}</option>)}
			</datalist>
			</div>
			)
	}
}

export default Autocomplete;