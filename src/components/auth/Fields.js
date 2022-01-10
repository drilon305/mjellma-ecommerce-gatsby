import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from  '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import { makeStyles } from '@material-ui/core/styles'

import validate from '../ui/validate'

const useStyles = makeStyles(theme => ({
    textField: {
        width: '20rem',
      },
      input: {
        color: theme.palette.secondary.main,
      },

}))

export default function Fields({ fields, errors, setErrors, values, setValues }) {
    const classes = useStyles()

    return (
        Object.keys(fields).map(field => {
            const validateHelper = event => {
            const valid = validate({[field]: event.target.value })
            setErrors({...errors, [field]: !valid[field] })
     }
     
           return !fields[field].hidden ? (
           <Grid item key={field}>
             <TextField
               value={values[field]}
               onChange={e => {
                 if (errors[field]) {
                   validateHelper(e)
                 }
                 setValues({ ...values, [field]: e.target.value })
               }}
               placeholder={fields[field].placeholder}
               onBlur={e => validateHelper(e)}
               error={errors[field]}
               helperText={errors[field] && fields[field].helperText}
               type={fields[field].type}
               classes={{ root: classes.textField }}
               InputProps={{
                 startAdornment: (
                   <InputAdornment position='start'>
                     <span className={classes.emailAdornment}>
                       {fields[field].startAdornment}
                     </span>
                   </InputAdornment>
                 ),
                 endAdornment: fields[field].endAdornment ? (
                   <InputAdornment position='end'>
                
                     {fields[field].endAdornment}
                   </InputAdornment>
                 ) : undefined,
                 classes: { input: classes.input }
               }}
             />
           </Grid>
           ) : null
           })
    )
}