import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid'
import clsx from 'clsx'
import axios from 'axios'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'

import Fields from './Fields'
import { setUser } from '../../contexts/actions'

import accountIcon from "../../images/account.svg"
import EmailAdornment from "../../images/EmailAdornment"
import PasswordAdornment from "../../images/password-adornment.svg"
import HidePasswordIcon from "../../images/hide-password.svg"
import ShowPasswordIcon from "../../images/show-password.svg"
import addUserIcon from "../../images/add-user.svg"
import forgotPasswordIcon from "../../images/forgot.svg"
import close from "../../images/close.svg"

const useStyles = makeStyles(theme => ({
    emailAdornment: {
        width: 22,
        height: 17,
        marginBottom: 10,
    },
    accountIcon: {
      marginTop: '2rem'
    },
    login: {
      width: '20rem',
      borderRadius: 50,
      textTransform: 'none',
    },
    fbText: {
      fontSize: '1.5rem',
      fontWeight: 600,
      textTransform: 'none',
    },
    fbButton: {
      marginTop: '-1rem',
    },
    visibleIcon: {
      padding: 0,
    },
    passwordError: {
      marginTop: 0
    },
    close: {
      paddingTop: 5,
    },
    reset: {
      marginTop: '-4rem'
    },
}))

export const EmailPassword = (classes, hideEmail, hidePassword, visible, setVisible) => (
  {
    email: {
      helperText: 'invalid email',
      placeholder: 'Email',
      type: 'text',
      hidden: hideEmail,
      startAdornment: (
        <span className={classes.emailAdornment}>
          <EmailAdornment  />
        </span>
      ),
    },
    password: {
      helperText: 'your password must be at least 8 characters and include one uppercase letter, one number, and special character',
      placeholder: 'Password',
      hidden: hidePassword,
      type: visible ? 'text' : 'password',
      startAdornment: <img src={PasswordAdornment} alt='password' />,
      endAdornment: (
        <IconButton classes={{ root: classes.visibleIcon }} onClick={() => setVisible(!visible)}>
          <img src={visible ? ShowPasswordIcon : HidePasswordIcon} alt={`${visible ? 'Show' : 'Hidde'} Password`} />
        </IconButton>
      ),
    },
  }
)

export default function Login({ steps, setSelectedStep, user, dispatchUser}) {
    const classes = useStyles()

  const [values, setValues] = useState({
    email: '',
    password: ''
  })
    const [errors, setErrors] = useState({})
    const [visible, setVisible] = useState(false)
    const [forgot, setForgot] = useState(false)

  const fields = EmailPassword(classes, false, forgot, visible, setVisible)

  const navigateSignUp = () => {
    const signUp = steps.find(step => step.label === 'Sign Up')

    setSelectedStep(steps.indexOf(signUp))
  }

  const handleLogin = () => {
    axios.post(process.env.GATSBY_STRAPI_URL + '/auth/local', {
      identifier: values.email,
      password: values.password
    }).then(res => {
      dispatchUser(setUser({ ...res.data.user, jwt: res.data.jwt}))
    }).catch(error => {
      console.error(error)
    })
  }

  const disabled = Object.keys(errors).some(error => errors[error] === true) ||
        Object.keys(errors).length !== Object.keys(values).length

  return(
    <>
      <Grid item classes={{ root: classes.accountIcon }}>
        <img src={accountIcon} alt="login page" />
      </Grid>
      <Fields fields={fields}
        errors={errors}
        setErrors={setErrors}
        values={values}
        setValues={setValues} />

      <Grid item>
        <Button 
        variant='contained' 
        disabled={!forgot && disabled}
        color='secondary'
        onClick={() => forgot ? null : handleLogin()}
         classes={{
          root: clsx(classes.login, {
            [classes.reset]: forgot
          })
        }}>
          <Typography variant='h5'>
            {forgot ? 'reset password' : 'login'}
          </Typography>
        </Button>
      </Grid>
      {forgot ? null : (
        <Grid item>
          <Button classes={{
            root: clsx(classes.fbButton, {
              [classes.passwordError]: errors.password
            })
          }}>
            <Typography variant='h3' classes={{ root: classes.fbText }}>
              Login with Facebook
            </Typography>
          </Button>
        </Grid>
      )}
       
        <Grid item container justifyContent='space-between'>
          <Grid item>
            <IconButton onClick={navigateSignUp}>
              <img src={addUserIcon} alt='sign up' />
            </IconButton>
          </Grid>
        <Grid item classes={{root: clsx({
          [classes.close]: forgot
        })}}>
          <IconButton onClick={() => setForgot(!forgot)}>
            <img src={forgot ? close : forgotPasswordIcon} alt={forgot ? 'back to login' : 'forgot password'} />
          </IconButton>
        </Grid>
      </Grid>
    </>
  )
}