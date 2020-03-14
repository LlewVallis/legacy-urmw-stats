import React, { Component } from "react"
import Chart from "chart.js"

import { primaryColor, secondaryColor, tertiaryColor } from "../theme"

class MatchHistoryChart extends Component {
  constructor(props) {
    super(props)
    this.canvasRef = React.createRef()

    this.state = {
      shouldRender: false,
    }
  }

  render() {
    return (
      <div style={{
          backgroundColor: "white",
          color: "rgba(0, 0, 0, 0.8)",
          padding: "3em",
          borderRadius: "0.5em",
          display: this.state.shouldRender ? "block" : "none",
          marginTop: "5em",
      }}>
        <h1>Match history</h1>

        <canvas ref={this.canvasRef} />
      </div>
    )
  }

  arrayEquals(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      return false
    }

    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false
      }
    }

    return true
  }

  getDatasetsAndLabels() {
    let team1Wins = 0
    let team2Wins = 0
    let draws = 0

    for (const match of this.props.data.matchData) {
      const matchTeam1 = match.team1.map(player => player.name)
      const matchTeam2 = match.team2.map(player => player.name)

      if (this.arrayEquals(this.props.team1, matchTeam1) && this.arrayEquals(this.props.team2, matchTeam2)) {
        if (match.winner === "team1") {
          team1Wins += 1
        } else if (match.winner === "team2") {
          team2Wins += 1
        } else {
          draws += 1
        }
      } else if (this.arrayEquals(this.props.team2, matchTeam1) && this.arrayEquals(this.props.team1, matchTeam2)) {
        if (match.winner === "team1") {
          team2Wins += 1
        } else if (match.winner === "team2") {
          team1Wins += 1
        } else {
          draws += 1
        }
      }
    }

    const values = [team1Wins, team2Wins, draws]
    const labels = ["Team 1 wins", "Team 2 wins", "Draws"]
    const colors = [primaryColor, secondaryColor, tertiaryColor]

    return {
      datasets: [{
        data: values,
        backgroundColor: colors,
        barPercentage: 0.675,
        label: "Matches",
      }],
      labels: labels,
      shouldRender: team1Wins > 0 || team2Wins > 0 || draws > 0,
    }
  }

  componentDidMount() {
    const canvas = this.canvasRef.current

    const { datasets, labels, shouldRender } = this.getDatasetsAndLabels()

    this.chart = new Chart(canvas, {
			type: "bar",
			data: {
        datasets: datasets,
        labels: labels,
      },
      options: {
        legend: {
          display: false,
        },
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: "Matches",
            },
            ticks: {
              beginAtZero: true,
              precision: 0,
            },
          }],
        },
      },
    })

    if (this.state.shouldRender !== shouldRender) {
      this.setState({ shouldRender: shouldRender })
    }
  }

  componentDidUpdate() {
    const { datasets, labels, shouldRender } = this.getDatasetsAndLabels()

    this.chart.data.datasets = datasets
    this.chart.data.labels = labels
    this.chart.update()

    if (this.state.shouldRender !== shouldRender) {
      this.setState({ shouldRender: shouldRender })
    }
  }
}

export default MatchHistoryChart
