import React, { useState, useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import { useQuery } from '@apollo/client'
import Typography from '@material-ui/core/Typography'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { makeStyles } from '@material-ui/core/styles'

import ProductFrameGrid from './ProductFrameGrid'
import ProductFrameList from './ProductFrameList'

import { GET_DETAILS } from '../../apollo/queries'

const useStyles = makeStyles(theme => ({
    productContainer: {
        width: '95%',
        [theme.breakpoints.only('xl')]: {
          '& > *': {
            marginRight: ({ layout }) => layout === 'grid' ? 'calc((100% - (22rem * 4)) / 3)' : 0,
            marginBottom: '5rem',
        },
        '& > :nth-child(4n)': {
            marginRight: 0,
        },
        },
        [theme.breakpoints.only('lg')]: {
          '& > *': {
            marginRight: ({ layout }) => layout === 'grid' ? 'calc((100% - (22rem * 3)) / 2)' : 0,
            marginBottom: '5rem',
        },
        '& > :nth-child(3n)': {
            marginRight: 0,
        },
        },
        [theme.breakpoints.only('md')]: {
          '& > *': {
            marginRight: ({ layout }) => layout === 'grid' ? 'calc(100% - (22rem * 2))' : 0,
            marginBottom: '5rem',
        },
        '& > :nth-child(2n)': {
            marginRight: 0,
        },
        },
        [theme.breakpoints.down('sm')]: {
          '& > * ': {
          marginBottom: '5rem',
          },
        },
    },
}))

export default function ListOfProducts({
  products,
  layout,
  content,
  page,
  productsPerPage,
  filterOptions,
}) {
  const classes = useStyles({ layout })
  const matchesSM = useMediaQuery(theme => theme.breakpoints.down("sm"))

  const FrameHelper = ({ Frame, product, variant }) => {
    const [selectedSize, setSelectedSize] = useState(null)
    const [selectedColor, setSelectedColor] = useState(null)
    const [stock, setStock] = useState(null)

    const { loading, error, data } = useQuery(GET_DETAILS, {
      variables: { id: product.node.strapiId },
    })
    
    useEffect(() => {
      if(error) {
        setStock(-1)
      } else if (data) {
        setStock(data.product.variants)
      }
    }, [error, data])

    var sizes = []
    var colors = []
    product.node.variants.map(variant => {
      sizes.push(variant.size)
      if (!colors.includes(variant.color)) { 
        colors.push(variant.color)
      }
    })

    const hasStyles = product.node.variants.some(variant => variant.style !== null)


    return (
      <Frame
        product={product}
        variant={variant}
        sizes={sizes}
        colors={colors}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
        setSelectedSize={setSelectedSize}
        setSelectedColor={setSelectedColor}
        hasStyles={hasStyles}
        stock={stock}
      />
    )
  }

 

  return (
    <Grid
      item
      container
      alignItems={matchesSM ? 'center' : undefined}
      direction={matchesSM ? "column" : "row"}
      classes={{ root: classes.productContainer }}
    >
      {content
        .slice((page - 1) * productsPerPage, page * productsPerPage)
        .map(item => (
          <FrameHelper
            key={item.variant.id}
            Frame={layout === "grid" ? ProductFrameGrid : ProductFrameList}
            variant={item.variant}
            product={products[item.product]}
          />
        ))}
    </Grid>
  )
}