import React, { useContext, useState, useRef } from 'react'
import Grid from '@material-ui/core/Grid'
import clsx from 'clsx'
import axios from 'axios'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import Rating from '../home/Rating'
import Fields from '../auth/Fields'

import {FeedbackContext } from '../../contexts'
import { setSnackbar } from '../../contexts/actions'

const useStyles = makeStyles(theme => ({
    light: {
        color: theme.palette.primary.main
    },
    date: {
        marginTop: '-0.5rem'
    },
    rating: {
      cursor: 'pointer'
    },
    reviewButtonText: {
        color: '#fff',
        fontFamily: 'Montserrat',
        fontWeight: 600
    },
    cancel: {
        color: theme.palette.primary.main,
        fontFamily: 'Montserrat',
        fontWeight: 600
    },
    review: {
      marginBottom: '3rem'
    },
    buttonContainer: {
        marginTop: '2rem'
    },
  
    "@global": {
        ".MuiInput-underline:before, .MuiInput-underline:hover:not(.Mui-disabled):before": {
          borderBottom: `2px solid ${theme.palette.primary.main}`,
        },
        ".MuiInput-underline:after": {
          borderBottom: `2px solid ${theme.palette.secondary.main}`,
        },
      },
}))

export default function ProductReview({ product, review, setEdit, reviews, user }) {
    const classes = useStyles()
    const { dispatchFeedback } = useContext(FeedbackContext)
    const ratingRef = useRef(null)

  const found = !review ? reviews.find(review => review.user.username === user.username) : null

    const [values, setValues] = useState({ message: found ? found.text :  ''})
    const [tempRating, setTempRating] = useState(0)
    const [rating, setRating] = useState(review ? review.rating : found ? found.rating :  null)
    const [loading, setLoading] = useState(null)


  const fields = { message: {
        helperText: '',
        placeholder: 'Write your review.'
    }}

    const handleReview = () => {
      setLoading('leave-review')

      axios.post(process.env.GATSBY_STRAPI_URL + '/reviews', {
        text: values.message,
        product,
        rating
      }, {
        headers: { Authorization: `Bearer ${user.jwt}`}
      }).then(response => {
        setLoading(null)

        dispatchFeedback(setSnackbar({status: 'success', message: 'Product Reviewed Successfully'}))
      }).catch(error => {
        setLoading(null)
        console.error(error)

        dispatchFeedback(setSnackbar({status: 'error', message: 'There was a problem leaving your review. Please try again.'}))
      })
    }

    const buttonDisabled = found ? found.text === values.message && found.rating === rating : !rating

    return (
      <Grid item container direction="column" classes={{ root: classes.review }}>
        <Grid item container justifyContent="space-between">
          <Grid item>
            <Typography variant="h4" classes={{ root: classes.light }}>
              {review ? review.user.username : user.username}
            </Typography>
          </Grid>
          <Grid
            item
            classes={{ root: clsx({ [classes.rating]: !review }) }}
            ref={ratingRef}
            onClick={() => (review ? null : setRating(tempRating))}
            onMouseLeave={() => {
              if (tempRating > rating) {
                setTempRating(rating)
              }
            }}
            onMouseMove={e => {
              if (review) return

              const hoverRating =
                ((ratingRef.current.getBoundingClientRect().left - e.clientX) /
                  ratingRef.current.getBoundingClientRect().width) *
                -5
              setTempRating(Math.round(hoverRating * 2) / 2)
            }}
          >
            <Rating
              number={rating > tempRating ? rating : tempRating}
              size={2.5}
            />
          </Grid>
        </Grid>
        <Grid item>
          <Typography
            variant="h5"
            classes={{ root: clsx(classes.date, classes.light) }}
          >
            {review
              ? new Date(review.createdAt).toLocaleString([], {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                })
              : new Date().toLocaleDateString()}
          </Typography>
        </Grid>
        <Grid item>
          {review ? (
            <Typography variant="body1">{review.text}</Typography>
          ) : (
            <Fields
              values={values}
              setValues={setValues}
              fields={fields}
              fullWidth
              noError
            />
          )}
        </Grid>
        {review ? null : (
          <Grid item container classes={{ root: classes.buttonContainer }}>
            <Grid item>
              {loading === "leave-review" ? (
                <CircularProgress />
              ) : (
                <Button
                  onClick={handleReview}
                  disabled={buttonDisabled}
                  variant="contained"
                  color="primary"
                >
                  <span className={classes.reviewButtonText}>{found ? 'Edit' : 'Leave'} Review</span>
                </Button>
              )}
            </Grid>
            <Grid item>
              <Button onClick={(() => setEdit(false))}>
                <span className={classes.cancelButtonText}>Cancel</span>
              </Button>
            </Grid>
          </Grid>
        )}
      </Grid>
    )
}