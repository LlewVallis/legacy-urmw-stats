import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

import trueskillData from "../trueskill-data.json"
import GlobalTrueskillChart from "../components/global-trueskill-chart"
import LastTournamentRankings from "../components/last-tournament-rankings"
import GlobalWinRateChart from "../components/global-win-rate-chart"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <div style={{
      textAlign: "center",
    }}>
      <Breaker />

      <h1>What is this?</h1>
      <p>
        Welcome to URMW Stats, an unofficial site dedicated tracking statistics from ranked missile wars matches and tournaments.
        URMW Stats parses the <code>#trueskill-urmwbot</code> channel in order to provide up to date figures and charts for your consumption.
        For feature requests and bug reports, contact <code>Llew Vallis#5734</code> on Discord.
      </p>

      <Breaker />

      <h1>Last tournament rankings</h1>
      <LastTournamentRankings data={trueskillData} />

      <Breaker />
      
      <h1>Ratings</h1>
      <GlobalTrueskillChart data={trueskillData} />

      <Breaker />

      <h1>Win rates</h1>
      <GlobalWinRateChart data={trueskillData} />
    </div>
  </Layout>
)

const Breaker = () => <div style={{
  height: "5em",
}} />

export default IndexPage
