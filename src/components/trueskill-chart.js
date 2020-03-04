import React, { Component } from "react"
import Chart from "chart.js"

class TrueskillChart extends Component {
  constructor(props) {
    super(props)
    this.canvasRef = React.createRef()
    this.graphData = this.createGraphData(props.data)
  }

  render() {
    return <canvas ref={this.canvasRef} />
  }

  componentDidMount() {
    const canvas = this.canvasRef.current

    console.log(this.graphData)

    new Chart(canvas, {
      type: "line",
      data: this.graphData,
    })
  }

  createGraphData(trueskillData) {
    const graphData = []

    for (const player of trueskillData) {
      const graphPoints = []

      for (const { time, trueskill } of player.trueskill) {
        graphPoints.push({
          x: time,
          y: trueskill,
        })
      }

      graphData.push({
        label: player.name,
        data: graphPoints,
      })
    }

    return {
      datasets: graphData,
    }
  }
}

export default TrueskillChart
