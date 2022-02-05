import React, { useState, useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import Chip from '@material-ui/core/Chip'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import Fields from '../auth/Fields'
import Slots from './Slots'

import locationIcon from '../../images/location.svg'
import streetAdornment from '../../images/street-adornment.svg'
import zipAdornment from '../../images/zip-adornment.svg'

const useStyles = makeStyles(theme => ({
    icon: {
        marginBottom: '3rem'
    },
    locationContainer: {
        position: 'relative',
    },
    chipWrapper: {
        marginTop: '2rem',
        marginBottom: '3rem'
    },
    fieldContainer: {
        '& > :not(:first-child)': {
            marginTop: '2rem'
        },
    },
    slotContainer: {
        position: 'absolute',
        bottom: 0,
    },
}))

export default function Location({ user, edit, setChangesMade }) {
    const classes = useStyles()
    const [values, setValues] = useState({street: '', zip: '', city: '', state: ''})
    const [errors, setErrors] = useState({})
    const [slot, setSlot] = useState(0) 
    

    const fields = {
        street: {
            placeholder: 'Street',
            helperText: 'invalid address',
            startAdornment: <img src={streetAdornment} alt='street' />
        },
        zip: {
                placeholder: 'Zip Code',
                helperText: 'invalid zip code',
                startAdornment: <img src={zipAdornment} alt='zip code' />
        },
    }

    useEffect(() => {
        setValues(user.locations[slot])
    }, [slot])

    useEffect(() => {
        const changed = Object.keys(user.locations[slot]).some(field => values[field]
          !== user.locations[slot][field])
    
        setChangesMade(changed)
      }, [values])

    return (
      <Grid
            item
            container
            direction="column"
            alignItems="center"
            xs={6}
            justifyContent='center'
            classes={{root: classes.locationContainer}}
            >
            <Grid item>
                <img src={locationIcon} alt="location setting" className={classes.icon} />
            </Grid>
            <Grid item container direction="column" alignItems="center" classes={{ root: classes.fieldContainer }}>
                <Fields
            fields={fields}
            values={values}
            setValues={setValues}
            errors={errors}
            setErrors={setErrors}
            isWhite
            disabled={!edit}
          />
        </Grid>
        <Grid item classes={{root: classes.chipWrapper}}>
            <Chip label={values.city ? `${values.city}, ${values.state}` : 'City, State'} />
        </Grid>
        <Grid item container classes={{root: classes.slotContainer}}>
            <Slots slot={slot} setSlot={setSlot} />
        </Grid>
      </Grid>
    )
}