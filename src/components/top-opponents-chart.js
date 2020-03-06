import React, { Component } from "react"
import Chart from "chart.js"
import { interpolateWarm } from "d3-scale-chromatic"

class TopOpponentsChart extends Component {
  constructor(props) {
    super(props)
    this.canvasRef = React.createRef()
  }

  render() {
    return <canvas ref={this.canvasRef} />
  }

  getDatasetsAndLabels() {
    const playerData = this.props.playerData

    let opponents = Object.entries(playerData.lossesAgainst)
    opponents.sort(([nameA, lossesA], [nameB, lossesB]) => {
      let result = lossesB - lossesA
      
      if (result === 0) {
        const winsA = playerData.winsAgainst[nameA] || 0
        const winsB = playerData.winsAgainst[nameB] || 0

        result = winsA - winsB
      }

      if (result === 0) {
        const drawsA = playerData.drawsAgainst[nameA] || 0
        const drawsB = playerData.drawsAgainst[nameB] || 0

        result = drawsA - drawsB
      }

      return result
    })

    opponents = opponents.slice(0, 4)

    const values = []
    const colors = []
    const labels = []

    for (let i = 0; i < opponents.length; i++) {
      const [name, losses] = opponents[i]

      labels.push(name)
      values.push(losses)

      colors.push(interpolateWarm((i + 1) / opponents.length * 0.75))
    }

    return {
      datasets: [{
        data: values,
        backgroundColor: colors,
        label: "Losses against",
      }],
      labels: labels,
    }
  }

  componentDidMount() {
    const canvas = this.canvasRef.current

    const { datasets, labels } = this.getDatasetsAndLabels()

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
              labelString: "Losses against",
            },
            ticks: {
              beginAtZero: true,
              precision: 0,
            },
          }],
        },
      },
    })
  }

  componentDidUpdate() {
    const { datasets, labels } = this.getDatasetsAndLabels()

    this.chart.data.datasets = datasets
    this.chart.data.labels = labels
    this.chart.update()
  }
}

export default TopOpponentsChart
