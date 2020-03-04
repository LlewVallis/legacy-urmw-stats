import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

import trueskillData from "../trueskill-data.json"
import TrueskillChart from "../components/trueskill-chart"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <h1>Heading</h1>
    <TrueskillChart data={trueskillData} />
  </Layout>
)

export default IndexPage
