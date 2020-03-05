import React, { Component } from "react"
import { primaryColor, secondaryColor } from "../theme"
import Chart from "chart.js"

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
    const maxTrueskills = []
    const labels = []

    for (let i = 0; i < playerData.length; i++) {
      const player = playerData[i]

      trueskills.push(player.trueskill)
      maxTrueskills.push(player.maxTrueskill)
      labels.push(player.name)

    }

    new Chart(canvas, {
      type: "bar",
      data: {
        datasets: [
          {
            data: maxTrueskills,
            backgroundColor: primaryColor,
            label: "Highest Trueskill",
          },
          {
            data: trueskills,
            backgroundColor: secondaryColor,
            label: "Current Trueskill",
          },
        ],
        labels: labels,
      },
    })
  }
}

export default GlobalTrueskillChart
