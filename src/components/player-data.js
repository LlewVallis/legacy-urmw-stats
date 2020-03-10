import React, { Component } from "react"

import TrueskillHistoryChart from "./trueskill-history-chart"
import PlayerSelection from "./player-selection"
import WinRateChart from "./win-rate-chart"
import TopOpponentsChart from "./top-opponents-chart"

class PlayerData extends Component {
    constructor(props) {
        super(props)
        this.state = {
            playerName: null,
        }
    }

    render() {
        const playerName = this.state.playerName

        const player = (playerName === null) ? null : this.props.data.playerData[playerName]

        let rankIndex = 1
        if (player !== null) {
            for (const [, { trueskill }] of Object.entries(this.props.data.playerData)) {
                if (trueskill > player.trueskill) {
                    rankIndex++
                }
            }
        }

        let rank = null
        if (player !== null) {
            if (player.rd > 75) {
                rank = "Unranked"
            } else if (player.trueskill >= 1600) {
                if (rankIndex === 1) {
                    rank = "Grand champion"
                } else {
                    rank = "Champion"
                }
            } else if (player.trueskill >= 1510) {
                rank = "Diamond"
            } else if (player.trueskill >= 1430) {
                rank = "Platinum"
            } else if (player.trueskill >= 1350) {
                rank = "Gold"
            } else if (player.trueskill >= 1260) {
                rank = "Silver"
            } else {
                rank = "Bronze"
            }
        }

        let rankIndexString = player === null ? null : rankIndex.toString()
        if (player !== null) {
            if (rankIndexString.endsWith("1")) {
                rankIndexString += "st"
            } else if (rankIndexString.endsWith("2")) {
                rankIndexString += "nd"
            } else if (rankIndexString.endsWith("3")) {
                rankIndexString += "rd"
            } else {
                rankIndexString += "th"
            }
        }

        let streak = null
        let streakType = null
        if (playerName !== null) {
            const matches = this.props.data.matchData
            streak = 0

            for (let i = matches.length - 1; i >= 0; i--) {
                const match = matches[i]

                let currentType = ""
                if (match.winner === "draw") {
                    currentType = "Draw"
                } else if (match[match.winner].some(({ name }) => name === playerName)) {
                    currentType = "Win"
                } else {
                    const loser = match.winner === "team1" ? "team2" : "team1"
                    if (match[loser].some(({ name }) => name === playerName)) {
                        currentType = "Loss"
                    } else {
                        continue
                    }
                }

                if (streakType === null || streakType === currentType) {
                    streak += 1
                    streakType = currentType
                } else {
                    break
                }
            }
        }

        return (
            <div>
                <h1>
                    {(playerName === null) ? "Player info" : `${playerName}'s stats`}
                </h1>

                <PlayerSelection onPlayerNameChange={name => this.setState({ playerName: name })} data={this.props.data} />

                {(playerName === null) ? null : (
                    <div style={{
                        marginTop: "1em",
                    }}>
                        <FigureSet>
                            <Figure name="Trueskill" value={player.trueskill} />
                            <Figure name="Rating deviation" value={player.rd} />
                            <Figure name="Peak trueskill" value={player.maxTrueskill} />
                            <Figure name="Raw skill" value={player.trueskill + 3 * player.rd} />
                            <Figure name="Rank" value={rank} />
                            <Figure name="Ranking" value={rankIndexString} />
                        </FigureSet>

                        <Rule />

                        <FigureSet>
                            <Figure name="Times placed first" value={player.tournamentFirsts} />
                            <Figure name="Times placed second" value={player.tournamentSeconds} />
                            <Figure name="Times placed third" value={player.tournamentThirds} />
                        </FigureSet>

                        <Rule />

                        <FigureSet>
                            <Figure name="Total wins" value={player.wins} />
                            <Figure name="Total losses" value={player.losses} />
                            <Figure name="Total draws" value={player.draws} />
                            <Figure name={`${streakType} streak`} value={streak} />
                        </FigureSet>

                        <Breaker />

                        <div style={{
                            backgroundColor: "white",
                            color: "rgba(0, 0, 0, 0.8)",
                            padding: "3em",
                            borderRadius: "0.5em",
                        }}>
                            <TrueskillHistoryChart name={playerName} data={this.props.data} />

                            <TopOpponentsChart playerData={player} />

                            <h1>Win rate</h1>
                            <WinRateChart playerData={player} />
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

const Rule = () => (
    <hr style={{
        width: "50%",
        backgroundColor: "white",
        margin: "1.5em auto",
    }} />
)

const FigureSet = ({ children }) => (
    <table style={{
        width: "50%",
        margin: "0 auto",
        fontWeight: "bold",
        fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
    }}>
        <tbody>
            {children}
        </tbody>
    </table>
)

const Figure = ({ name, value }) => (
    <tr>
        <td style={{
            border: "none",
        }}>{name}</td>
        
        <td style={{
            border: "none",
            textAlign: "right",
        }}>{value}</td>
    </tr>
)

const Breaker = () => <div style={{
  height: "5em",
}} />

export default PlayerData
