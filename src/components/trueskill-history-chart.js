import React, { Component } from "react"
import Chart from "chart.js"
import { primaryColor, secondaryColor } from "../theme"

class TrueskillHistoryChart extends Component {
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
          display: this.state.shouldRender ? "block" : "none",
          marginBottom: "5em",
      }}>
        <h1>Trueskill history</h1>

        <canvas ref={this.canvasRef} />
      </div>
    )
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

    data.push({
      time: new Date(),
      trueskill: this.props.data.playerData[this.props.name].trueskill,
      rd: this.props.data.playerData[this.props.name].rd,
    })

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

    return {
      datasets: [{
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
      }],
      shouldRender: data.length > 1,
    }
  }

  componentDidMount() {
    const canvas = this.canvasRef.current

    const { datasets, shouldRender } = this.getDatasets()

    let maxTrueskill = -Infinity
    let minTrueskill = Infinity

    for (const [name, player] of Object.entries(this.props.data.playerData)) {
      if (name === "Diffy") {
        continue
      }

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

    if (this.state.shouldRender !== shouldRender) {
      this.setState({ shouldRender: shouldRender })
    }
  }

  componentDidUpdate() {
    const { datasets, shouldRender } = this.getDatasets()

    this.chart.data.datasets = datasets
    this.chart.update()

    if (this.state.shouldRender !== shouldRender) {
      this.setState({ shouldRender: shouldRender })
    }
  }
}

export default TrueskillHistoryChart
