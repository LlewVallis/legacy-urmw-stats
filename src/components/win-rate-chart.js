import React, { Component } from "react"
import Chart from "chart.js"
import { primaryColor, secondaryColor, tertiaryColor } from "../theme"

class WinRateChart extends Component {
  constructor(props) {
    super(props)
    this.canvasRef = React.createRef()
  }

  render() {
    return <canvas ref={this.canvasRef} />
  }

  getDatasets() {
    const playerData = this.props.playerData

    const values = [playerData.wins, playerData.losses, playerData.draws]
    const colors = [primaryColor, secondaryColor, tertiaryColor]

    return [{
      data: values,
      backgroundColor: colors,
    }]
  }

  componentDidMount() {
    const canvas = this.canvasRef.current

    const labels = ["Wins", "Losses", "Draws"]

    this.chart = new Chart(canvas, {
      type: "doughnut",
      data: {
        datasets: this.getDatasets(),
        labels: labels,
      },
      options: {
        legend: {
          position: "bottom"
        },
      },
    })
  }

  componentDidUpdate() {
    this.chart.data.datasets = this.getDatasets()
    this.chart.update()
  }
}

export default WinRateChart
