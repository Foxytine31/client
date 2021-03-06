// @flow
import React, {Component} from 'react'
import type {Props as CheckboxProps} from './checkbox'
import type {Props} from './form-with-checkbox'
import {Checkbox, Input, Box, Text} from './index'
import {globalStyles, globalMargins} from '../styles'

class FormWithCheckbox extends Component<void, Props, void> {
  render () {
    const {inputProps, checkboxesProps} = this.props
    const {errorText = ''} = inputProps
    const inputWOError = {...inputProps, errorText: null}

    return (
      <Box style={{...globalStyles.flexBoxColumn, marginBottom: 15, ...this.props.style}}>
        <Input errorStyle={{marginTop: 26}} {...inputWOError} />
        <Box style={{...styles.checkboxContainer, ...this.props.checkboxContainerStyle}}>
          {checkboxesProps.map(p => {
            const checkProps: CheckboxProps = {key: p.label, ...p}
            return <Checkbox key={p.label} {...checkProps} />
          })}
        </Box>
        {!!errorText && <Text type='BodyError' style={{textAlign: 'center', marginTop: globalMargins.tiny}}>{errorText}</Text>}
      </Box>
    )
  }
}

const styles = {
  checkboxContainer: {
    ...globalStyles.flexBoxRow,
    justifyContent: 'center',
    position: 'relative',
    bottom: 7,
  },
}

export default FormWithCheckbox
