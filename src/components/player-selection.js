import React, { Component } from "react"

import StringSimilarity from "string-similarity"

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
                }} type="submit">Apply</button>
            </form>
        )
    }

    onSubmit(e) {
        e.preventDefault()

        const fuzzyPlayerName = this.playerInputRef.current.value
        if (/^\s*$/.test(fuzzyPlayerName)) {
            return
        }

        const availablePlayerNames = Object.keys(this.props.data.playerData)

        let playerName = availablePlayerNames.find(name => name.toLowerCase().startsWith(fuzzyPlayerName.toLowerCase()))

        if (playerName === undefined) {
            playerName = availablePlayerNames.find(name => name.toLowerCase().includes(fuzzyPlayerName.toLowerCase()))
        }

        if (playerName === undefined) {
            playerName = StringSimilarity.findBestMatch(fuzzyPlayerName, availablePlayerNames).bestMatch.target
        }

        this.props.onPlayerNameChange(playerName)
    }
}

export default PlayerSelection