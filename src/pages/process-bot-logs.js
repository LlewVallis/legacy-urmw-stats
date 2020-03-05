import React, { Component } from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

import GitHub from "github-api"

class ProcessBotLogsPage extends Component {
    constructor(props) {
        super(props)

        this.gitHubUsernameRef = React.createRef()
        this.gitHubPasswordRef = React.createRef()

        this.fileUploadRef = React.createRef()

        this.dryRunRef = React.createRef()
    }

    render() {
        return (
            <Layout>
                <SEO title="Process Bot Logs" />
                <h1>Process bot logs</h1>
                <p>
                    Upload and process a json export of the <code>#trueskill-history-urmw</code> channel below.
                </p>

                <form onSubmit={e => this.onSubmit(e)} style={{
                    borderStyle: "solid",
                    borderWidth: "1px",
                    padding: "0.75em",
                }}>
                    <label htmlFor="gitHubUsername">GitHub username </label>
                    <input ref={this.gitHubUsernameRef} name="gitHubUsername" type="text"></input>

                    <br />
                    <br />

                    <label htmlFor="gitHubPassword">GitHub password </label>
                    <input ref={this.gitHubPasswordRef} name="gitHubPassword" type="password"></input>

                    <br />
                    <br />

                    <label htmlFor="dryRun">Dry run </label>
                    <input ref={this.dryRunRef} type="checkbox" defaultChecked></input>

                    <br />
                    <br />

                    <input ref={this.fileUploadRef} type="file"></input>

                    <br />
                    <br />

                    <button type="submit">Upload</button>
                </form>
            </Layout>
        )
    }

    onSubmit(e) {
        e.preventDefault()

        this.performSubmission().then(() => {
            alert("Successfully completed the operation")
        }).catch(e => {
            alert(`Failed to upload data:\n${e}`)
        })
    }

    async performSubmission() {
        const gitHubUsername = this.gitHubUsernameRef.current.value
        const gitHubPassword = this.gitHubPasswordRef.current.value
        const file = this.fileUploadRef.current.files[0]

        if (file !== undefined) {
            const data = await this.readDataFromFile(file)

            if (this.dryRunRef.current.value) {
                this.sendDryRunData(data)
            } else {
                await this.uploadData(data, gitHubUsername, gitHubPassword)
            }
        } else {
            throw new Error("no file was selected")
        }
    }

    sendDryRunData(data) {
        const anchor = document.createElement("a");

        anchor.setAttribute("href", "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data)));
        anchor.setAttribute("download", "trueskill-data.json");
      
        anchor.style.display = "none";

        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
      }

    readDataFromFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()

            reader.onload = _result => {
                const messageJson = reader.result
                const messageData = JSON.parse(messageJson)
                const data = this.cleanMessageData(messageData)

                resolve(data)
            }
            
            reader.onerror = _error => {
                reject(reader.error)
            }

            reader.readAsText(file)
        })
    }

    cleanMessageData(messageData) {
        const matchData = [];
        const tournamentData = [];

        for (const {timestamp, content} of messageData.messages) {
            // Tournament podium
            if (/^\s*\**\s*result(s?)\s*\**\s*\n/i.test(content)) {
                const firstNames = /first(\s*place)?\s*:?\s*(\w+(\s*,\s*\w+)?)/i.exec(content)[2]
                const secondNames = /second(\s*place)?\s*:?\s*(\w+(\s*,\s*\w+)?)/i.exec(content)[2]
                const thirdNames = /third(\s*place)?\s*:?\s*(\w+(\s*,\s*\w+)?)/i.exec(content)[2]

                tournamentData.push({
                    time: timestamp,
                    first: this.cleanResultTeamList(firstNames),
                    second: this.cleanResultTeamList(secondNames),
                    third: this.cleanResultTeamList(thirdNames),
                })
            // Match
            } else if (/^(\s*-\s*\n)?\s*(\w+\s*\([^)]+\)\s*,?\s*)+\s+vs\s+(\w+\s*\([^)]+\)\s*,?\s*)+/i.test(content)) {
                const team1 = /\s*((\w+\s*\([^)]+\)\s*,?\s*)+)\s+vs\s+/i.exec(content)[1]
                const team2 = /\s+vs\s+((\w+\s*\([^)]+\)\s*,?\s*)+)/i.exec(content)[1]

                matchData.push({
                    team1: this.cleanMatchTeamList(team1),
                    team2: this.cleanMatchTeamList(team2),
                })
            }
        }

        return {
            matchData: matchData,
            tournamentData: tournamentData,
        };
    }

    cleanMatchTeamList(names) {
        const minimal = names
            .trim()
            .replace(/,/ig, "")
            .replace(/\srd\s/ig, " ")
        
        const playerMatchStrings = minimal.matchAll(/(\w+)\s*\((\d+)\s*(\d+)\)/ig)
        const playerMatches = []

        for (const groups of playerMatchStrings) {
            playerMatches.push({
                name: groups[1],
                previousTrueskill: groups[2],
                previousRd: groups[3],
            })
        }

        return playerMatches
    }

    cleanResultTeamList(names) {
        const trimmed = names.trim()
        return trimmed.split(/\s*,\s*/)
    }

    async uploadData(data, username, password) {
        const api = new GitHub({
            username: username,
            password: password,
        })

        const repo = api.getRepo("LlewVallis", "urmw-stats")

        const currentRef = await repo.getRef("heads/master")
        const currentCommitSha = currentRef.data.object.sha

        const currentCommit = await repo.getCommit(currentCommitSha)
        const currentTreeSha = currentCommit.data.tree.sha

        const content = JSON.stringify(data)
        const blob = await repo.createBlob(content)
        const blobSha = blob.data.sha

        const newTree = await repo.createTree([{
            sha: blobSha,
            path: "src/trueskill-data.json",
            mode: "100644",
            type: "blob",
        }], currentTreeSha)

        const newTreeSha = newTree.data.sha

        const newCommit = await repo.commit(currentCommitSha, newTreeSha, "Update trueskill data")
        const newCommitSha = newCommit.data.sha

        await repo.updateHead("heads/master", newCommitSha)
    }
}

export default ProcessBotLogsPage