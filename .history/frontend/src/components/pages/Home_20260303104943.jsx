import React from 'react'
import Layout from '../common/Layout'
import Hero from '../common/Hero'
import FeaturedCategories from '../common/FeaturedCategories'
import FeaturedCourses from '../common/FeaturedCourses'
import HomeStats from '../common/HomeStats'
import TrendingInnovation from "../common/TrendingInnovation";
import HomeLeaderboard from "../common/HomeLeaderboard";

const Home = () => {
  return (
    <Layout>
         <Hero />
         
          <HomeStats />
          <HomeLeaderboard limit={5} />
         <FeaturedCategories />
         <FeaturedCourses />
         <TrendingInnovation limit={6} />
       
    </Layout>
  )
}
  
export default Home