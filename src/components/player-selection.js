import React, { Component } from "react"

import FuseJS from "fuse.js"

import { secondaryColor } from "../theme"

class PlayerSelection extends Component {
    constructor(props) {
        super(props)
        this.playerInputRef = React.createRef()
    }

    render() {
        return (
            <form style={{
                fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
            }} onSubmit={e => this.onSubmit(e)}>
                <input style={{
                    margin: "0 0.5em",
                    height: "2em",
                }} ref={this.playerInputRef} type="text" placeholder="Player name..." />

                <button style={{
                    margin: "0 0.5em",
                    height: "2em",
                    backgroundColor: secondaryColor,
                    color: "white",
                    fontWeight: "bold",
                    border: "none",
                    borderRadius: "0.2em",
                    cursor: "pointer",
                }} type="submit">Search</button>
            </form>
        )
    }

    onSubmit(e) {
        e.preventDefault()

        const fuzzyPlayerName = this.playerInputRef.current.value
        const availablePlayerNames = Object.keys(this.props.data.playerData)

        const index  = new FuseJS(availablePlayerNames, {
            shouldSort: true,
            threshold: 0.3,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: [],
        }).search(fuzzyPlayerName)[0]

        if (index !== undefined) {
            this.props.onPlayerNameChange(availablePlayerNames[index])
        }
    }
}

export default PlayerSelection