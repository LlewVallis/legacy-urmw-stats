import React, { Component } from "react"
import TeamSelection from "./team-selection"
import { primaryColor } from "../theme"
import { Rating, TrueSkill } from "ts-trueskill"

class MatchData extends Component {
    constructor(props) {
        super(props)

        this.state = {
            enteredTeam1: null,
            enteredTeam2: null,
            team1: null,
            team2: null,
        }
    }

    render() {
        const data = this.props.data

        const team1 = this.state.team1
        const team2 = this.state.team2

        const trueskillEnv = new TrueSkill(1550, null, null, null, 0.05)

        // These cannot be set in the constructor due to a buggy implementation
        trueskillEnv.sigma = 100
        trueskillEnv.beta = 50
        trueskillEnv.tau = 10

        let team1WinDeltas = []
        let team2WinDeltas = []
        let drawDeltas = []

        if (team1 !== null && team2 !== null) {
            const createRatings = team => team.map(name => {
                const { trueskill, rd } = data.playerData[name]
                return new Rating(trueskill + 3 * rd, rd)
            })

            const generateTrueskillInfo = (team1NewRatings, team2NewRatings, elementList) => {
                for (let i = 0; i < team1.concat(team2).length; i++) {
                    const name = team1.concat(team2)[i]

                    const { trueskill: oldTrueskill, rd: oldRd } = data.playerData[name]
                    let { mu: newMu, sigma: newRd } = team1NewRatings.concat(team2NewRatings)[i]

                    const newTrueskill = Math.ceil(newMu - 3 * newRd)
                    newRd = Math.ceil(newRd)

                    let deltaTrueskill = newTrueskill - oldTrueskill
                    deltaTrueskill = deltaTrueskill > 0 ? "+" + deltaTrueskill.toString() : deltaTrueskill.toString()

                    let deltaRd = newRd - oldRd
                    deltaRd = deltaRd > 0 ? "+" + deltaRd.toString() : deltaRd.toString()

                    elementList.push(<Figure name={name} value={
                        `${newTrueskill} (${deltaTrueskill}), ${newRd} (${deltaRd})`
                    } />)
                }
            }

            const team1Ratings = createRatings(team1)
            const team2Ratings = createRatings(team2)

            const [ team1Win, team2Lose ] = trueskillEnv.rate([team1Ratings, team2Ratings], [0, 1])
            const [ team1Lose, team2Win ] = trueskillEnv.rate([team1Ratings, team2Ratings], [1, 0])
            const [ team1Draw, team2Draw ] = trueskillEnv.rate([team1Ratings, team2Ratings], [0, 0])

            generateTrueskillInfo(team1Win, team2Lose, team1WinDeltas)
            generateTrueskillInfo(team1Lose, team2Win, team2WinDeltas)
            generateTrueskillInfo(team1Draw, team2Draw, drawDeltas)
        }

        return (
            <div>
                <h1>{(team1 === null || team2 === null) ? "Match info" : (() =>
                    `${team1.join(", ")} vs ${team2.join(", ")}`
                )()}</h1>

                <form style={{
                    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
                }} onSubmit={e => this.onSubmit(e)}>
                    <div style={{
                        display: "flex",
                        marginTop: "3em",
                        marginBottom: "2em",
                    }}>
                        <div style={{
                            flexGrow: "1",
                        }} />

                        <div>
                            <h3>Team 1</h3>
                            <TeamSelection onPlayerNameChange={names => {
                                this.setState({
                                    team1: names,
                                })
                            }} data={data} />
                        </div>

                        <div style={{
                            fontSize: "100%",
                            fontWeight: "bold",
                            fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
                            margin: "auto 2em 0.2em 2em",
                        }}>
                            VS
                        </div>

                        <div>
                            <h3>Team 2</h3>
                            <TeamSelection onPlayerNameChange={names => {
                                this.setState({
                                    team2: names,
                                })
                            }} data={data} />
                        </div>

                        <div style={{
                            flexGrow: "1",
                        }} />
                    </div>
                </form>

                {(team1 === null || team2 === null) ? <div /> : (
                    <div style={{
                        marginTop: "5em",
                    }}>
                        <h3 style={{
                            fontSize: "110%",
                            marginBottom: "0.5em",
                        }}>If team 1 wins</h3>
                        <FigureSet>
                            {team1WinDeltas}
                        </FigureSet>

                        <Rule />

                        <h3 style={{
                            fontSize: "110%",
                            marginBottom: "0.5em",
                        }}>If team 2 wins</h3>
                        <FigureSet>
                            {team2WinDeltas}
                        </FigureSet>

                        <Rule />

                        <h3 style={{
                            fontSize: "110%",
                            marginBottom: "0.5em",
                        }}>If both teams draw</h3>
                        <FigureSet>
                            {drawDeltas}
                        </FigureSet>
                    </div>
                )}
            </div>
        )
    }

  onSubmit(e) {
    e.preventDefault()
  }
}

const Rule = () => (
    <hr style={{
        width: "50%",
        backgroundColor: "white",
        margin: "2em auto",
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

export default MatchData