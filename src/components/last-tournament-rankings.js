import React, { Component } from "react";
import { primaryColor, secondaryColor, tertiaryColor } from "../theme";

class LastTournamentRankings extends Component {
    render() {
        const tournamentData = this.props.data.tournamentData
        const {time, first, second, third} = tournamentData[tournamentData.length - 1]

        const date = new Date(time)
        const dateString = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`

        return (
            <div>
                <div style={{
                    display: "flex",
                    alignItems: "end",
                    justifyContent: "center",
                }}>
                    <PodiumPole name={second} rankName="Second" color={secondaryColor} height="17.5vw" />
                    <PodiumPole name={first} rankName="First" color={primaryColor} height="25vw" />
                    <PodiumPole name={third} rankName="Third" color={tertiaryColor} height="10vw" />
                </div>
                <div style={{
                    fontStyle: "italic",
                    marginTop: "1em",
                }}>
                    {dateString}
                </div>
            </div>
        )
    }
}

class PodiumPole extends Component {
    render() {
        return (
            <div style={{
                width: "12.5vw",
                margin: "0 0.5vw",
            }}>
                <div style={{
                    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
                    fontWeight: "bold",
                    fontSize: "110%",
                    margin: "0 5%",
                    textDecoration: "underline",
                }}>
                    {this.props.name.join(", ")}
                </div>
                <div style={{
                    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
                    fontSize: "90%",
                }}>
                    {this.props.rankName}
                </div>
                <div style={{
                    marginTop: "0.5em",
                    backgroundColor: this.props.color,
                    height: this.props.height,
                    borderRadius: "0.75em",
                }} />
            </div>
        )
    }
}

export default LastTournamentRankings