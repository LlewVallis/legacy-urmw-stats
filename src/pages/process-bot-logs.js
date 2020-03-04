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
    }

    render() {
        return (
            <Layout>
                <SEO title="Process Bot Logs" />
                <h1>Process bot logs</h1>
                <p>
                    Upload and process a json export of the <code>#trueskill-history-urmw</code> channel below.
                </p>

                <form onSubmit={e => this.onSubmit(e)}>
                    <label htmlFor="gitHubUsername">GitHub username</label>
                    <input ref={this.gitHubUsernameRef} name="gitHubUsername" type="text"></input>

                    <br />

                    <label htmlFor="gitHubPassword">GitHub password</label>
                    <input ref={this.gitHubPasswordRef} name="gitHubPassword" type="password"></input>

                    <br />

                    <input ref={this.fileUploadRef} type="file"></input>

                    <br />

                    <button type="submit">Update and process</button>
                </form>
            </Layout>
        )
    }

    onSubmit(e) {
        e.preventDefault()

        const gitHubUsername = this.gitHubUsernameRef.current.value
        const gitHubPassword = this.gitHubPasswordRef.current.value
        const file = this.fileUploadRef.current.files[0]

        if (file !== undefined) {
            this.readDataFromFile(file)
                .then(data => this.uploadData(data, gitHubUsername, gitHubPassword))
        }
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
        return [
            {
                "name": "Player1",
                "trueskill": [
                    {
                        "time": 0,
                        "trueskill": 1
                    },
                    {
                        "time": 1,
                        "trueskill": 1
                    }
                ]
            }
        ]          
    }

    uploadData(data, username, password) {
        const api = new GitHub({
            username: username,
            password: password,
        })

        const repo = api.getRepo("LlewVallis", "urmw-stats")

        repo.getRef("heads/master").then(currentRef => {
            const currentCommitSha = currentRef.data.object.sha

            repo.getCommit(currentCommitSha).then(currentCommit => {
                const currentTreeSha = currentCommit.data.tree.sha

                const content = JSON.stringify(data)
                repo.createBlob(content).then(blob => {
                    const blobSha = blob.data.sha

                    repo.createTree([{
                        sha: blobSha,
                        path: "src/trueskill-data.json",
                        mode: "100644",
                        type: "blob",
                    }], currentTreeSha).then(newTree => {
                        const newTreeSha = newTree.data.sha

                        repo.commit(currentCommitSha, newTreeSha, "Update trueskill data").then(newCommit => {
                            const newCommitSha = newCommit.data.sha
                            repo.updateHead("heads/master", newCommitSha).then(() => {
                                alert("Successfully pushed data to master")
                            })
                        })
                    })
                })
            })
        })
    }
}

export default ProcessBotLogsPage