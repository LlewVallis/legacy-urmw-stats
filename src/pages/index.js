import React, { Component } from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

import trueskillData from "../trueskill-data.json"
import GlobalTrueskillChart from "../components/global-trueskill-chart"
import LastTournamentRankings from "../components/last-tournament-rankings"
import GlobalTournamentWinRateChart from "../components/global-tournament-win-rate-chart"
import PlayerData from "../components/player-data"
import { primaryColor } from "../theme"
import MatchData from "../components/match-data"

class IndexPage extends Component {
  render() {
    return (
      <Layout>
        <SEO title="Home" />
        <div style={{
          textAlign: "center",
        }}>
          <div
            style={{
              margin: `0 auto`,
              maxWidth: 960,
            }}
          >
            <Breaker />

            <h1>What is this?</h1>
            <p>
              Welcome to URMW Stats, an unofficial site dedicated tracking statistics from ranked Missile Wars matches and tournaments.
              URMW Stats parses the <code>#trueskill-urmwbot</code> channel in order to provide up to date figures and charts for your consumption.
              For feature requests and bug reports, contact <code>Llew Vallis#5734</code> on Discord.
            </p>

            <Breaker />

            <h1>Last tournament rankings</h1>
            <LastTournamentRankings data={trueskillData} />

            <Breaker />
            
            <h1>Global trueskill ratings</h1>
            <GlobalTrueskillChart data={trueskillData} />

            <Breaker />

            <h1>Global tournament win rates</h1>
            <GlobalTournamentWinRateChart data={trueskillData} />

            <Breaker />
          </div>

          <div style={{
            backgroundColor: primaryColor,
            color: "white",
          }}>
            <div style={{
              margin: `0 auto`,
              maxWidth: 960,
            }}>
              <Breaker />

              <PlayerData data={trueskillData} />

              <Breaker />
            </div>
          </div>

          <div
            style={{
              margin: `0 auto`,
              maxWidth: 960,
            }}
          >
            <Breaker />

            <MatchData data={trueskillData} />
          </div>
        </div>
      </Layout>
    )
  }
}

const Breaker = () => <div style={{
  height: "5em",
}} />

export default IndexPage
