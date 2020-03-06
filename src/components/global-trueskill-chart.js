import React, { Component } from "react"
import Chart from "chart.js"
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
      playerData.push({
        name: name,
        ...data,
      })
    }

    playerData.sort((a, b) => b.trueskill - a.trueskill)

    const trueskills = []
    const labels = []
    const colors = []

    for (let i = 0; i < playerData.length; i++) {
      const player = playerData[i]

      trueskills.push(player.trueskill)
      labels.push(player.name)

      colors.push(interpolateWarm((i + 1) / playerData.length * 0.75))
    }

    new Chart(canvas, {
      type: "bar",
      data: {
        datasets: [
          {
            data: trueskills,
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
          }],
        },
      },
    })
  }
}

export default GlobalTrueskillChart
