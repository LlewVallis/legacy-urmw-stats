import React, { Component } from "react"

import ReactJson from "react-json-view"
import { primaryColor } from "../theme"
import jmespath from "jmespath"

class JsonQuery extends Component {
    constructor(props) {
        super(props)

        this.queryInput = React.createRef()
        this.state = {
            query: "",
        }
    }

    render() {
        let viewed

        if (this.state.query.trim() === "") {
            viewed = this.props.data
        } else {
            try {
                viewed = jmespath.search(this.props.data, this.state.query)
            } catch (e) {
                viewed = { "ERROR": e.message }
            }
        }

        if (typeof viewed !== "object" || viewed === null) {
            viewed = { value: viewed }
        }

        return (
            <div>
                <h1>More data</h1>

                <p>
                    Find a copy of the JSON data backing the website <a href="https://raw.githubusercontent.com/LlewVallis/urmw-stats/master/src/trueskill-data.json" style={{
                        color: "white",
                    }}>here</a>,
                    or explore it directly below using a <a href="https://jmespath.org/" style={{
                        color: "white",
                    }}>JMESPath query</a>.
                </p>

                <div style={{
                    height: "2em",
                }} />

                <form onSubmit={e => this.onSubmit(e)} style={{
                    display: "flex",
                }}>
                    <input ref={this.queryInput} type="text" placeholder="Query..." autoComplete="off" style={{
                        flexGrow: "1",
                    }} />

                    <button style={{
                        margin: "0 0.5em",
                        height: "2em",
                        backgroundColor: primaryColor,
                        color: "white",
                        fontWeight: "bold",
                        border: "none",
                        borderRadius: "0.2em",
                        cursor: "pointer",
                        fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
                    }}>Execute</button>
                </form>

                <div style={{
                    backgroundColor: "white",
                    color: "rgba(0, 0, 0, 0.8)",
                    padding: "3em",
                    borderRadius: "0.5em",
                    textAlign: "left",
                }}>
                    <ReactJson name="data" src={viewed} collapsed={true} />
                </div>
            </div>
        )
    }

    onSubmit(e) {
        e.preventDefault()

        this.setState({
            query: this.queryInput.current.value
        })
    }
}

export default JsonQuery