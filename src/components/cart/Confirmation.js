import React, { useState, useContext, useEffect } from 'react'
import axios from 'axios'
import Grid from '@material-ui/core/Grid'
import clsx from 'clsx'
import Button from '@material-ui/core/Button'
import Chip from '@material-ui/core/Chip'
import CircularProgress  from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { makeStyles } from '@material-ui/core/styles'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { v4 as uuidv4 } from 'uuid'

import Fields from '../auth/Fields'
import { CartContext, FeedbackContext } from '../../contexts'
import { setSnackbar, clearCart } from '../../contexts/actions'

import confirmationIcon from '../../images/tag.svg'
import NameAdornment from '../../images/NameAdornment'
import EmailAdornment from '../../images/EmailAdornment'
import PhoneAdornment from '../../images/PhoneAdornment'
import streetAdornment from '../../images/street-adornment.svg'
import zipAdornment from '../../images/zip-adornment.svg'
import cardAdornment from '../../images/card.svg'
import promoAdornment from '../../images/promo-code.svg'



const useStyles = makeStyles(theme => ({
    nameWrapper: {
        height: 22,
        width: 22,
    },
    emailWrapper: {
        height: 17,
        width: 22,
    },
    phoneWrapper: {
        height: 25.122,
        width: 25.173,
    },
    text: {
        fontSize: '1rem',
        color: '#fff',
        [theme.breakpoints.down('xs')]: {
          fontSize: '0.8rem',
        },
    },
    card: {
        height: 18,
        width: 25,
    },
    priceLabel: {
        fontSize: '1.5rem',
        [theme.breakpoints.down('xs')]: {
          fontSize: '0.85rem',
        },
    },
    darkBackground: {
      backgroundColor: theme.palette.secondary.main,
    },
    fieldRow: {
      height: '2.5rem',
    },
    iconWrapper: {
      display: 'flex',
      justifyContent:'center',
      alignItems: 'center'
    },
    centerText: {
      display: 'flex',
      alignItems: 'center',
    },
    adornmentWrapper: {
      display: 'flex',
      justifyContent: 'center'
    },
    priceValue: {
      marginRight: '1rem',
       [theme.breakpoints.down('xs')]: {
          fontSize: '0.85rem',
          marginRight: '0.5rem',
        },
    },
    fieldWrapper: {
      marginLeft: '1.2rem',
      [theme.breakpoints.down('xs')]: {
        marginLeft: '0.25rem',
      },
    },
    button: {
      width: '100%',
      height: '7rem',
      borderRadius: 0,
      backgroundColor: theme.palette.secondary.main,
      "&:hover": {
        backgroundColor: theme.palette.secondary.light,
      },
    },
    buttonWrapper: {
      marginTop: 'auto',
    },
    mainContainer: {
      height: '100%',
      display: ({ selectedStep, stepNumber }) => selectedStep !== stepNumber ? 'none' : 'flex',
    },
    chipRoot: {
      backgroundColor: '#fff',
      width: '7rem',
    },
    chipLabel: {
      color: theme.palette.secondary.main,
      fontSize: '1.3rem',
    },
    zipIcon: {
      [theme.breakpoints.down('xs')]: {
        height: '30px',
        width: '30px',
        marginTop: '0.20rem',
      },
    },
    disabled: {
      backgroundColor: theme.palette.grey[500]
    },
    "@global": {
      ".MuiSnackbarContent-message": {
        whiteSpace: 'pre-wrap'
      },
    },
}))

export default function Confirmation({
  user,
  detailValues,
  billingDetails,
  detailForBilling,
  locationValues,
  billingLocation,
  locationForBilling,
  shippingOptions,
  selectedShipping,
  selectedStep,
  setSelectedStep,
  setOrder,
  order,
  stepNumber
}) {
  const classes = useStyles({ selectedStep, stepNumber })
  const stripe = useStripe()
  const elements = useElements()

  const matchesXS = useMediaQuery(theme => theme.breakpoints.down('xs'))

  const [loading, setLoading] = useState(false)
  const [clientSecret, setClientSecret] = useState(null)
  const { cart, dispatchCart } = useContext(CartContext)
  const { dispatchFeedback } = useContext(FeedbackContext)

  const [promo, setPromo] = useState({ promo: "" })
  const [promoError, setPromoError] = useState({})

  const shipping = shippingOptions.find(option => option.label === selectedShipping)

  const subtotal = cart.reduce((total, item) => total + item.variant.price * item.qty, 0)

  const tax = subtotal * 0.075

  const firstFields = [
    {
      value: detailValues.name,
      adornment: (
        <div className={classes.nameWrapper}>
          <NameAdornment color="#fff" />
        </div>
      ),
    },
    {
      value: detailValues.email,
      adornment: (
        <div className={classes.emailWrapper}>
          <EmailAdornment color="#fff" />
        </div>
      ),
    },
    {
      value: detailValues.phone,
      adornment: (
        <div className={classes.phoneWrapper}>
          <PhoneAdornment />
        </div>
      ),
    },
    {
      value: locationValues.street,
      adornment: <img src={streetAdornment} alt="street address" />,
    },
  ]

  const secondFields = [
    {
      value: `${locationValues.city}, ${locationValues.state}, ${locationValues.zip}`,
      adornment: <img src={zipAdornment} alt="city, state, zip code" className={classes.zipIcon} />,
    },
    {
      value: "**** **** **** 1234",
      adornment: (
        <img src={cardAdornment} alt="credit card" className={classes.card} />
      ),
    },
    {
      promo: {
        helperText: "",
        placeholder: "Promo Code",
        adornment: <img src={promoAdornment} alt="promo code" />,
      },
    },
  ]

  const prices = [
    {
      label: "SUBTOTAL",
      value: subtotal.toFixed(2),
    },
    {
      label: "SHIPPING",
      value: shipping.price.toFixed(2),
    },
    {
      label: "TAX",
      value: tax.toFixed(2),
    },
  ]

  const total = prices.reduce((total, item) => total + parseFloat(item.value), 0)

  const adornmentValue = (adornment, value) => (
    <>
      <Grid item xs={2} classes={{ root: classes.adornmentWrapper }}>
        {adornment}
      </Grid>
      <Grid item xs={10} classes={{ root: classes.centerText }} zeroMinWidth>
        <Typography noWrap variant="body1" classes={{ root: classes.text }}>
          {value}
        </Typography>
      </Grid>
    </>
  )

  const handleOrder = async () => {
    setLoading(true)

    const idempotencyKey = uuidv4()
    
    const cardElement = elements.getElement(CardElement)

    const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
           address: billingLocation.city,
           state: billingLocation.state,
           line1: billingLocation.street
          },
          email: billingDetails.email,
          name: billingDetails.name,
          phone: billingDetails.phone
        }
    }, { idempotencyKey })

    if(result.error) {
      console.error(result.error.message)
      dispatchFeedback(setSnackbar({ status: 'error', message: result.error.message}))
      setLoading(false)
    } else if(result.paymentIntent.status === 'succeeded') {
      console.log('PAYMENT SUCCESSFULLY')
    }



    // axios.post(process.env.GATSBY_STRAPI_URL + '/orders/finalize', {
    //   shippingAddress: locationValues,
    //   billingAddress: billingLocation,
    //   shippingInfo: detailValues,
    //   billingInfo: billingDetails,
    //   shippingOption: shipping,
    //   subtotal: subtotal.toFixed(2),
    //   tax: tax.toFixed(2),
    //   total: total.toFixed(2),
    //   items: cart,
    // }, {
    //   headers: user.username === 'Guest' ? undefined : { Authorization: `Bearer ${user.jwt}`}
    // }).then(response => {
    //   setLoading(false)

    //   dispatchCart(clearCart())

    //   setOrder(response.data.order)
     
    //   setSelectedStep(selectedStep + 1)
    // }).catch(error => {
    //   setLoading(false)
    //   console.error(error)
    // })
  }

    useEffect(() => {
      if(!order && cart.length !== 0) {
        const storedIntent = localStorage.getItem('intentID')
        const idempotencyKey = uuidv4()

        setClientSecret(null)

        axios.post(process.env.GATSBY_STRAPI_URL + '/orders/process', {
          items: cart,
          total: total.toFixed(2),
          shippingOption: shipping,
          idempotencyKey,
          storedIntent,
          email: detailValues.email
        }, 
        {
          headers: user.jwt ? { Authorization: `Bearer ${user.jwt}`} : undefined,
        }).then(response => {
          setClientSecret(response.data.client_secret)
          localStorage.setItem('intentID', response.data.intentID)
        }).catch(error => {
          console.error(error)

          switch (error.response.status) {
            case 400:
            dispatchFeedback(setSnackbar({ status: 'error', message: 'Invalid Cart'}))
            break;
            case 409:
              dispatchFeedback(setSnackbar({ status: 'error', message: `The following items are not available at the
               requested quantity.
              Please update your cart and try again.\n ` + `${error.response.data.unavailable.map(item => `\nItem: ${item.id}, Available: ${item.qty}`)}`}))
               break;
            default:
            dispatchFeedback(setSnackbar({ status: 'error',
             message: 'Something went wrong, please refresh the page and try again. You have NOT been charged.'}))
          }
        })
      }

    }, [cart])

    console.log('CLIENT SECRET', clientSecret)


  return (
    <Grid
      item
      container
      direction="column"
      classes={{ root: classes.mainContainer }}
    >
      <Grid item container>
        <Grid item container direction="column" xs={7}>
          {firstFields.map((field, i) => (
            <Grid
              item
              container
              key={i}
              alignItems="center"
              classes={{
                root: clsx(classes.fieldRow, {
                  [classes.darkBackground]: i % 2 !== 0,
                }),
              }}
            >
              {adornmentValue(field.adornment, field.value)}
            </Grid>
          ))}
        </Grid>
        <Grid item xs={5} classes={{ root: classes.iconWrapper }}>
          <img src={confirmationIcon} alt="confirmation" />
        </Grid>
      </Grid>
      {secondFields.map((field, i) => (
        <Grid
          item
          container
          key={i}
          alignItems="center"
          classes={{
            root: clsx(classes.fieldRow, {
              [classes.darkBackground]: i % 2 !== 0,
            }),
          }}
        >
          <Grid item container xs={7}>
            {field.promo ? (
              <span className={classes.fieldWrapper}>
                <Fields
                  fields={field}
                  values={promo}
                  setValues={setPromo}
                  errors={promoError}
                  setErrors={setPromoError}
                  isWhite
                  xs={matchesXS}
                />
              </span>
            ) : (
              adornmentValue(field.adornment, field.value)
            )}
          </Grid>
          <Grid item container xs={5}>
            <Grid item xs={6}>
              <Typography variant="h5" classes={{ root: classes.priceLabel }}>
                {prices[i].label}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                align="right"
                variant="body2"
                classes={{ root: classes.priceValue }}
              >
                {`$${prices[i].value}`}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      ))}
      <Grid item classes={{ root: classes.buttonWrapper }}>
        <Button
          classes={{ root: classes.button, disabled: classes.disabled }}
          onClick={handleOrder}
          disabled={cart.length === 0 || loading || !clientSecret}
        >
          <Grid container justifyContent="space-around" alignItems="center">
            <Grid item>
              <Typography variant="h5">PLACE ORDER</Typography>
            </Grid>
            <Grid item>
              {loading ? (
                <CircularProgress />
              ) : (
                <Chip
                  label={`$${total.toFixed(2)}`}
                  classes={{ root: classes.chipRoot, label: classes.chipLabel }}
                />
              )}
            </Grid>
          </Grid>
        </Button>
      </Grid>
    </Grid>
  )
}