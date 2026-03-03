import React from 'react'
import Layout from '../common/Layout'
import Hero from '../common/Hero'
import FeaturedCategories from '../common/FeaturedCategories'
import FeaturedCourses from '../common/FeaturedCourses'
import HomeStats from '../common/HomeStats'

const Home = () => {
  return (
    <Layout>
         <Hero />
         
          <HomeStats />
         <FeaturedCategories />
         <FeaturedCourses />
       
    </Layout>
  )
}
  
export default Home