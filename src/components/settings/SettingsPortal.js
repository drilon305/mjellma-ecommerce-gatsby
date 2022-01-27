import React, { useContext, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { useSprings, animated } from 'react-spring'

import { UserContext } from '../../contexts'

import accountIcon from "../../images/account.svg"
import settingsIcon from "../../images/settings.svg"
import orderHistoryIcon from "../../images/order-history.svg"
import favoritesIcon from "../../images/favorite.svg"
import subscriptionIcon from "../../images/subscription.svg"
import background from "../../images/toolbar-background.svg"

const useStyles = makeStyles(theme => ({
    name: {
        color: theme.palette.secondary.main,
    },
    dashboard: {
        width: '100%',
        height: '30rem',
        margin: '5rem 0',
        backgroundImage: `${background}`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        borderTop: `0.5rem solid ${theme.palette.primary.main}`,
        borderBottom: `0.5rem solid ${theme.palette.primary.main}`
    },
    icon: {
        height: '12rem',
        width: '12rem'
    },
    button: {
        height: '20rem',
        width: '20rem',
        borderRadius: 25,
    },
}))

const AnimatedButton = animated(Button)

export default function SetttingsPortal() {
    const classes = useStyles()
    const { user } = useContext(UserContext)
    const [selectedSetting, setSelectedSetting] = useState(null)

    const buttons = [
        { label: 'Settings', icon: settingsIcon },
        { label: 'Order History', icon: orderHistoryIcon },
        { label: 'Favorites', icon: favoritesIcon },
        { label: 'Subscriptions', icon: subscriptionIcon },
    ]

    const handleClick = setting => {
        if(selectedSetting === setting) {
            setSelectedSetting(null)
        } else {
            setSelectedSetting(setting)
        }
    }

    const springs = useSprings(buttons.length, buttons.map(button => ({
        transform: selectedSetting === button.label || selectedSetting === null ? 'scale(1)' : 'scale(0)'
    })))

    return (
        <Grid container direction='column' alignItems='center'>
            <Grid item>
                <img src={accountIcon} alt='settings page' />
            </Grid>
            <Grid item>
                <Typography variant='h4' classes={{ root: classes.name }}>
                    Welcome back, {user.username}
                </Typography>
            </Grid>
            <Grid
                item
                container
                classes={{ root: classes.dashboard }}
                justifyContent='space-around'
                alignItems='center'
                >
                {springs.map((prop, i) => (
                    <Grid item>
                        <AnimatedButton
                         variant='contained'
                        color='primary'
                        onClick={() => handleClick(buttons[i].label)}
                        classes={{root: classes.button}}
                        style={prop}
                        >
                            <Grid container direction='column'>
                                <Grid item>
                                    <img src={buttons[i].icon}
                                        alt={buttons[i].label}
                                        className={classes.icon} />
                                </Grid>
                                <Grid item>
                                    <Typography variant='h5'>
                                        {buttons[i].label}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </AnimatedButton>
                    </Grid>
                ))}
            </Grid>
        </Grid>
    )
}