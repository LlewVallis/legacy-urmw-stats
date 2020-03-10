import React, { Component } from "react"

import FuseJS from "fuse.js"

class TeamSelection extends Component {
    constructor(props) {
        super(props)
        this.playerInputRef = React.createRef()
    }

    render() {
        return (
            <input style={{
                margin: "0 0.5em",
                height: "2em",
            }} onChange={() => this.onChange()} ref={this.playerInputRef} type="text" placeholder="Player names..." />
        )
    }

    onChange() {
        const availablePlayerNames = Object.keys(this.props.data.playerData)
        const fuse = new FuseJS(availablePlayerNames, {
            shouldSort: true,
            threshold: 0.3,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: [],
        })

        const names = []

        for (const fuzzyPlayerName of this.playerInputRef.current.value.split(",")) {
            const index = fuse.search(fuzzyPlayerName.trim())[0]

            if (index !== undefined) {
                names.push(availablePlayerNames[index])
            } else {
                this.props.onPlayerNameChange(null)
                return
            }
        }

        this.props.onPlayerNameChange(names)
    }
}

export default TeamSelection