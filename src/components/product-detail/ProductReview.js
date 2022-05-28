import React, { useContext, useState, useRef } from 'react'
import Grid from '@material-ui/core/Grid'
import clsx from 'clsx'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import Rating from '../home/Rating'
import Fields from '../auth/Fields'

import { UserContext } from '../../contexts'

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

export default function ProductReview() {
    const classes = useStyles()
    const { user } = useContext(UserContext)
  const ratingRef = useRef(null)

    const [values, setValues] = useState({ message: ''})
    const [tempRating, setTempRating] = useState(0)
    const [rating, setRating] = useState(null)


    const fields = { message: {
        helperText: '',
        placeholder: 'Write your review.'
    }}

    return (
      <Grid item container direction="column">
        <Grid item container justifyContent="space-between">
          <Grid item>
            <Typography variant="h4" classes={{ root: classes.light }}>
              {user.username}
            </Typography>
          </Grid>
          <Grid
            item
            classes={{root: classes.rating}}
            ref={ratingRef}
            onClick={() => setRating(tempRating)}
            onMouseLeave={() => {
              if(tempRating > rating) {
                setTempRating(rating)
              }
            }}
            onMouseMove={e => {
              const hoverRating =
                ((ratingRef.current.getBoundingClientRect().left - e.clientX) /
                ratingRef.current.getBoundingClientRect().width) * -5
                setTempRating(Math.round(hoverRating * 2) / 2)
            }}
          >
            <Rating number={rating > tempRating ? rating : tempRating} size={2.5} />
          </Grid>
        </Grid>
        <Grid item>
          <Typography
            variant="h5"
            classes={{ root: clsx(classes.date, classes.light) }}
          >
            {new Date().toLocaleDateString()}
          </Typography>
        </Grid>
        <Grid item>
          <Fields
            values={values}
            setValues={setValues}
            fields={fields}
            fullWidth
            noError
          />
        </Grid>
        <Grid item container classes={{ root: classes.buttonContainer }}>
          <Grid item>
            <Button variant="contained" color="primary">
              <span className={classes.reviewButtonText}>Leave Review</span>
            </Button>
          </Grid>
          <Grid item>
            <Button>
              <span className={classes.cancelButtonText}>Cancel</span>
            </Button>
          </Grid>
        </Grid>
      </Grid>
    )
}