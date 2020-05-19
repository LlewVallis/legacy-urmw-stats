import React, { Component } from "react"
import Chart from "chart.js"
import ChartErrorBars from "chartjs-plugin-error-bars"
import { interpolateWarm } from "d3-scale-chromatic"

class GlobalTrueskillChart extends Component {
  constructor(props) {
    super(props)
    this.canvasRef = React.createRef()
  }

  render() {
    return <canvas ref={this.canvasRef} />
  }

  componentDidMount() {
    const canvas = this.canvasRef.current

    const playerData = []
    for (const [name, data] of Object.entries(this.props.data.playerData)) {
      if (name !== "Diffy") {
        playerData.push({
          name: name,
          ...data,
        })
      }
    }

    playerData.sort((a, b) => b.trueskill - a.trueskill)

    const trueskills = []
    const errors = {}
    const labels = []
    const colors = []

    let minPoint = Infinity
    let maxPoint = 0

    for (let i = 0; i < playerData.length; i++) {
      const player = playerData[i]

      trueskills.push(player.trueskill)
      labels.push(player.name)

      errors[player.name] = { plus: player.rd, minus: -player.rd }

      colors.push(interpolateWarm((i + 1) / playerData.length * 0.6 * 0.6 + 0.4))

      if (minPoint > player.trueskill - player.rd) {
        minPoint = player.trueskill - player.rd
      }

      if (maxPoint < player.trueskill + player.rd) {
        maxPoint = player.trueskill + player.rd
      }
    }

    new Chart(canvas, {
      type: "bar",
      data: {
        datasets: [
          {
            data: trueskills,
            borderColor: "#666",
            errorBars: errors,
            backgroundColor: colors,
            label: "Current Trueskill",
          },
        ],
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
              labelString: "Trueskill",
            },
            ticks: {
              suggestedMin: minPoint,
              suggestedMax: maxPoint,
            },
          }],
          xAxes: [{
            ticks: {
              autoSkip: false,
            }
          }],
        },
      },
      plugins: [ChartErrorBars],
    })
  }
}

export default GlobalTrueskillChart
