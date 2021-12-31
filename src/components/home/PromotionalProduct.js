import React, { useEffect, useState } from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import clsx from "clsx"
import { makeStyles } from '@material-ui/core/styles'
import { Link, useStaticQuery, graphql } from "gatsby"
import promoAdornment from "../../images/promo-adornment.svg"
import explore from "../../images/explore.svg"
import loadable from "@loadable/component";
const Carousel = loadable(() => import("react-spring-3d-carousel"));



const useStyles = makeStyles(theme => ({
  mainContainer: {
    backgroundImage: `url(${promoAdornment})`,
    backgroundPosition: "top",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    width: "100%",
    height: "70rem",
    padding: "30rem 10rem 10rem 10rem",
    [theme.breakpoints.down("lg")]: {
      padding: "20rem 2rem 2rem 2rem",
    },
    [theme.breakpoints.down("xs")]: {
      overflow: "hidden",
    },
  },
  productName: {
    color: "#fff",
  },
  iconButton: {
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  carouselImage: {
    height: "30rem",
    width: "25rem",
    backgroundColor: "#fff",
    borderRadius: 20,
    boxShadow: theme.shadows[5],
    [theme.breakpoints.down("sm")]: {
      height: "25rem",
      width: "20rem",
    },
    [theme.breakpoints.down("xs")]: {
      height: "20rem",
      width: "15rem",
    },
  },
  carouselContainer: {
    marginLeft: "20rem",
    [theme.breakpoints.down("md")]: {
      marginLeft: 0,
      height: "30rem",
    },
  },
  space: {
    margin: "0 15rem 10rem 15rem",
    [theme.breakpoints.down("sm")]: {
      margin: "0 8rem 10rem 8rem",
    },
    [theme.breakpoints.down("xs")]: {
      margin: "0 5rem 10rem 5rem",
    },
  },
  explore: {
    textTransform: "none",
    marginRight: "2rem",
  },
  descriptionContainer: {
    textAlign: "right",
    [theme.breakpoints.down("md")]: {
      textAlign: "center",
    },
  },
}))



export default function PromotionalProduct() {
  const classes = useStyles()
  const [selectedSlide, setSelectedSlide] = useState(0)

  const matchesMD = useMediaQuery(theme => theme.breakpoints.down('md'))
  const matchesXS = useMediaQuery(theme => theme.breakpoints.down('xs'))
  const matchesSM = useMediaQuery(theme => theme.breakpoints.down('sm'))
 

const data = useStaticQuery(graphql`
query GetPromo {
  allStrapiProduct(filter: {promo: {eq: true}}) {
    edges {
      node {
        name
        description
        strapiId
        variants {
          images {
            url
          }
        }
      }
    }
  }
}
`)

const slides = [];

data.allStrapiProduct.edges.map(({ node }, i) =>
  slides.push({
    key: i,
    content: (
      <Grid container direction="column" alignItems="center">
        <Grid item>
          <IconButton
            onClick={() => setSelectedSlide(i)}
            disableRipple
            classes={{
              root: clsx(classes.iconButton, {
                [classes.space]: selectedSlide !== i,
              }),
            }}
          >
            <img
              src={
                process.env.GATSBY_STRAPI_URL + node.variants[0].images[0].url
              }
              alt={`image-${i}`}
              className={classes.carouselImage}
            />
          </IconButton>
        </Grid>
        <Grid item>
          {selectedSlide === i ? (
            <Typography variant="h1" classes={{ root: classes.productName }}>
              {node.name.split(" ")[0]}
            </Typography>
          ) : null}
        </Grid>
      </Grid>
    ),
    description: node.description,
  })
)



    return (
      <Grid
        container
        justifyContent={matchesMD ? "space-between" : "space-between"}
        alignItems="center"
        classes={{ root: classes.mainContainer }}
        direction={matchesMD ? 'column' : 'row'}
      >
        <Grid item classes={{root: classes.carouselContainer}}>
          <Carousel slides={slides} goToSlide={selectedSlide} />
        </Grid>
        <Grid item classes={{ root: classes.descriptionContainer }}>
          <Typography  variant='h2' paragraph>
          {slides[selectedSlide].description}
          </Typography>
          <Button>
            <Typography variant='h4' classes={{root: classes.explore}}>
              Explore
            </Typography>
            <img src={explore} alt='go to product page' />
          </Button>
        </Grid>
      </Grid>
    )
}