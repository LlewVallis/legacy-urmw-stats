import React, { Component } from "react"
import Chart from "chart.js"
import { primaryColor, secondaryColor } from "../theme"

class TrueskillHistoryChart extends Component {
  constructor(props) {
    super(props)
    this.canvasRef = React.createRef()
  }

  render() {
    return <canvas ref={this.canvasRef} />
  }

  getDatasets() {
    const data = []

    for (const match of this.props.data.matchData) {
      for (const player of match.team1.concat(match.team2)) {
        if (player.name === this.props.name) {
          data.push({
            time: new Date(match.time),
            trueskill: player.newTrueskill,
            rd: player.newRd,
          })
        }
      }
    }

    data.reverse()

    for (let i = 1; i < data.length; i++) {
      const nextTime = data[i - 1].time
      const currentTime = data[i].time

      if (nextTime - currentTime < 1000 * 60 * 60 * 6) {
        data.splice(i, 1)
        i--
      }
    }

    data.reverse()

    const trueskillData = []
    const rdData = []

    for (const { time, trueskill, rd } of data) {
      trueskillData.push({
        x: time,
        y: trueskill,
      })

      rdData.push({
        x: time,
        y: rd,
      })
    }

    return [{
      data: trueskillData,
      showLine: true,
      fill: false,
      yAxisID: "trueskill",
      label: "Trueskill",
      borderColor: primaryColor,
    }, {
      data: rdData,
      showLine: true,
      fill: false,
      yAxisID: "rd",
      label: "Rating Deviation",
      borderColor: secondaryColor,
    }]
  }

  componentDidMount() {
    const canvas = this.canvasRef.current

    const datasets = this.getDatasets()

    let maxTrueskill = -Infinity
    let minTrueskill = Infinity

    for (const player of Object.values(this.props.data.playerData)) {
      if (player.trueskill > maxTrueskill) {
        maxTrueskill = player.trueskill
      }
      
      if (player.trueskill < minTrueskill) {
        minTrueskill = player.trueskill
      }
    }

    maxTrueskill = Math.ceil(maxTrueskill / 50) * 50
    minTrueskill = Math.floor(minTrueskill / 50) * 50

    this.chart = new Chart(canvas, {
			type: "line",
			data: {
				datasets: datasets,
      },
      options: {
        legend: {
          position: "bottom"
        },
        scales: {
          xAxes: [{
            type: "time",
          }],
          yAxes: [{
            id: "trueskill",
            ticks: {
              min: minTrueskill,
              max: maxTrueskill,
            },
            scaleLabel: {
              display: true,
              labelString: "Trueskill",
            },
          }, {
            id: "rd",
            position: "right",
            ticks: {
              min: 0,
              max: 100,
            },
            scaleLabel: {
              display: true,
              labelString: "Rating Deviation",
            },
          }]
        },
      },
    })
  }

  componentDidUpdate() {
    this.chart.data.datasets = this.getDatasets()
    this.chart.update()
  }
}

export default TrueskillHistoryChart
