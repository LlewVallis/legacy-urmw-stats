import React, { Component } from "react"
import Chart from "chart.js"
import { interpolateWarm } from "d3-scale-chromatic"

class GlobalWinRateChart extends Component {
  constructor(props) {
    super(props)
    this.canvasRef = React.createRef()
  }

  render() {
    return (
      <div>
        <canvas ref={this.canvasRef} />
        <div style={{
          marginTop: "0.4em",
          fontStyle: "italic",
        }}>
          Wins in a team award fractional points
        </div>
      </div>
    )
  }

  componentDidMount() {
    const canvas = this.canvasRef.current

    const wins = {
      Draw: 0,
    }

    for (const match of this.props.data.matchData) {
      if (match.winner === "draw") {
        wins["Draw"] += 1
      } else {
        const winners = match[match.winner]

        for (const { name } of winners) {
          if (wins[name] === undefined) {
            wins[name] = 0
          }

          wins[name] += 1 / winners.length
        }
      }
    }

    const winsList = Object.entries(wins)
    winsList.sort(([_name_a, a], [_name_b, b]) => b - a)

    let totalWins = 0
    for (const [, value] of winsList) {
      totalWins += value
    }

    const values = []
    const labels = []
    const colors = []

    let winsProcessed = 0
    for (const [label, value] of winsList) {
      values.push(value)
      colors.push(interpolateWarm((winsProcessed / totalWins) * 0.75))
      labels.push(label)

      winsProcessed += value
    }

    new Chart(canvas, {
      type: "doughnut",
      data: {
        datasets: [{
          data: values,
          backgroundColor: colors,
        }],
        labels: labels,
      },
      options: {
        legend: {
          position: "bottom"
        },
      },
    })
  }
}

export default GlobalWinRateChart
