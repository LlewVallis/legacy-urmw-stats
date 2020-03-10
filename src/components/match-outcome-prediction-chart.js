import React, { Component } from "react"
import Chart from "chart.js"
import { primaryColor, secondaryColor, tertiaryColor } from "../theme"

class MatchOutcomePredictionChart extends Component {
    constructor(props) {
        super(props)
        this.canvasRef = React.createRef()
    }

    render() {
        return <canvas ref={this.canvasRef} />
    }

    getDatasets() {
        const values = 
            [this.props.team1Chance, this.props.team2Chance, this.props.drawChance]
                .map(chance => (chance * 100).toFixed(0))

        const colors = [primaryColor, secondaryColor, tertiaryColor]

        return [{
            data: values,
            backgroundColor: colors,
        }]
    }

    componentDidMount() {
        const canvas = this.canvasRef.current

        const labels = ["Team 1 dominates", "Team 2 dominates", "Even match"]

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

export default MatchOutcomePredictionChart