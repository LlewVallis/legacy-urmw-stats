import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

import trueskillData from "../trueskill-data.json"
import GlobalTrueskillChart from "../components/global-trueskill-chart"
import LastTournamentRankings from "../components/last-tournament-rankings"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <div style={{
      textAlign: "center",
    }}>
      <h1>Last tournament rankings</h1>
      <LastTournamentRankings data={trueskillData}/>

      <Breaker />
      
      <h1>Server wide trueskill</h1>
      <GlobalTrueskillChart data={trueskillData} />
    </div>
  </Layout>
)

const Breaker = () => <div style={{
  height: "5em",
}} />

export default IndexPage
