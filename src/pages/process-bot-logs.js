import React, { Component } from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

import GitHub from "github-api"
import FuseJs from "fuse.js"

import playerRenames from "../player-renames.json"

class ProcessBotLogsPage extends Component {
  constructor(props) {
    super(props)

    this.gitHubTokenRef = React.createRef()

    this.fileUploadRef = React.createRef()

    this.state = {
      dryRun: true,
    }
  }

  render() {
    return (
      <Layout>
        <SEO title="Process Bot Logs" />
        <h1>Process bot logs</h1>
        <p>
          Upload and process a json export of the{" "}
          <code>#trueskill-history-urmw</code> channel below.
        </p>

        <form
          onSubmit={e => this.onSubmit(e)}
          style={{
            borderStyle: "solid",
            borderWidth: "1px",
            padding: "0.75em",
          }}
        >
          <label htmlFor="gitHubToken">GitHub token</label>
          <input
            ref={this.gitHubTokenRef}
            name="gitHubToken"
            type="password"
          />

          <br />
          <br />

          <label htmlFor="dryRun">Dry run </label>
          <input
            onChange={e =>
              this.setState({
                dryRun: e.target.checked,
              })
            }
            type="checkbox"
            defaultChecked
          />

          <br />
          <br />

          <input ref={this.fileUploadRef} type="file" />

          <br />
          <br />

          <button type="submit">Upload</button>
        </form>
      </Layout>
    )
  }

  onSubmit(e) {
    e.preventDefault()

    this.performSubmission()
      .then(() => {
        alert("Successfully completed the operation")
      })
      .catch(e => {
        alert(`Failed to upload data:\n${e}`)
      })
  }

  async performSubmission() {
    const gitHubToken = this.gitHubTokenRef.current.value
    const file = this.fileUploadRef.current.files[0]

    if (file !== undefined) {
      const data = await this.readDataFromFile(file)

      if (this.state.dryRun) {
        this.sendDryRunData(data)
      } else {
        await this.uploadData(data, gitHubToken)
      }
    } else {
      throw new Error("no file was selected")
    }
  }

  sendDryRunData(data) {
    const anchor = document.createElement("a")

    anchor.setAttribute(
      "href",
      "data:application/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(data))
    )
    anchor.setAttribute("download", "trueskill-data.json")

    anchor.style.display = "none"

    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
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
    const matchData = []
    const tournamentData = []

    for (const { timestamp, content } of messageData.messages) {
      // Tournament podium
      if (/\s*\**\s*result(s?)\s*\**\s*\n/i.test(content)) {
        const firstNames = /first(\s*place)?\s*:?\s*(\w+(\s*[,&]\s*\w+)?)/i.exec(
          content
        )[2]
        const secondNames = /second(\s*place)?\s*:?\s*(\w+(\s*[,&]\s*\w+)?)/i.exec(
          content
        )[2]
        const thirdNames = /third(\s*place)?\s*:?\s*(\w+(\s*[,&]\s*\w+)?)/i.exec(
          content
        )[2]

        console.log(firstNames, secondNames, thirdNames)

        tournamentData.push({
          time: timestamp,
          first: this.cleanResultTeamList(firstNames),
          second: this.cleanResultTeamList(secondNames),
          third: this.cleanResultTeamList(thirdNames),
        })
        // Match
      } else if (
        /(\s*-\s*\n)?\s*(\w+\s*\([^)]+\)\s*,?\s*)+\s+vs\s+(\w+\s*\([^)]+\)\s*,?\s*)+/i.test(
          content
        )
      ) {
        const team1String = /\s*((\w+\s*\([^)]+\)\s*,?\s*)+)\s+vs\s+/i.exec(
          content
        )[1]

        const team2String = /\s+vs\s+((\w+\s*\([^)]+\)\s*,?\s*)+)/i.exec(
          content
        )[1]

        const team1 = this.cleanMatchTeamList(team1String)
        const team2 = this.cleanMatchTeamList(team2String)

        for (const player of team1.concat(team2)) {
          const contentWithoutDifferences = content.replace(/[+-]\d+/g, "")

          const newRatingGroupsRegex = new RegExp(
            `new(.|\\n)*?${player.name}.*?(\\d+).*?(\\d+)`,
            "i"
          )
          const newRatingGroups = newRatingGroupsRegex.exec(
            contentWithoutDifferences
          )

          player.newTrueskill = parseInt(newRatingGroups[2])
          player.newRd = parseInt(newRatingGroups[3])
        }

        let winner = null

        if (/\w+\s+and\s+\w+\s+draw/i.test(content)) {
          winner = "draw"
        } else {
          const winnerString = /(\w+)\s+wins/i.exec(content)[1]
          if (winnerString === "1") {
            winner = "team1"
          } else if (winnerString === "2") {
            winner = "team2"
          } else if (team1.some(player => winnerString.includes(player.name))) {
            winner = "team1"
          } else if (team2.some(player => winnerString.includes(player.name))) {
            winner = "team2"
          } else {
            throw new Error(`failed to match player ${winnerString}`)
          }
        }

        const applyRenames = team => {
          for (const player of team) {
            if (playerRenames[player.name] !== undefined) {
              player.name = playerRenames[player.name]
            }
          }
        }

        applyRenames(team1)
        applyRenames(team2)

        matchData.push({
          time: timestamp,
          team1: team1,
          team2: team2,
          winner: winner,
        })
      }
    }

    const playerData = {
      "Diffy": {
        wins: 0,
        losses: 0,
        draws: 0,
        trueskill: 9001,
        rd: 0,
        maxTrueskill: 9001,
        tournamentFirsts: 0,
        tournamentSeconds: 0,
        tournamentThirds: 0,
        winsAgainst: {},
        lossesAgainst: {},
        drawsAgainst: {},
      }
    }

    for (const match of matchData) {
      for (const player of match.team1.concat(match.team2)) {
        if (playerData[player.name] === undefined) {
          playerData[player.name] = {
            wins: 0,
            losses: 0,
            draws: 0,

            winsAgainst: {},
            lossesAgainst: {},
            drawsAgainst: {},

            tournamentFirsts: 0,
            tournamentSeconds: 0,
            tournamentThirds: 0,

            trueskill: 1250,
            maxTrueskill: 1250,
            rd: 100,
          }
        }

        playerData[player.name].trueskill = player.newTrueskill
        playerData[player.name].rd = player.newRd

        if (player.newTrueskill > playerData[player.name].maxTrueskill) {
          playerData[player.name].maxTrueskill = player.newTrueskill
        }
      }

      if (match.winner === "draw") {
        this.updateDrawTotalsForTeam1(playerData, match.team1, match.team2)
        this.updateDrawTotalsForTeam1(playerData, match.team2, match.team1)
      } else if (match.winner === "team1") {
        this.updateWinTotalsForTeam1(playerData, match.team1, match.team2)
        this.updateLossTotalsForTeam1(playerData, match.team2, match.team1)
      } else if (match.winner === "team2") {
        this.updateWinTotalsForTeam1(playerData, match.team2, match.team1)
        this.updateLossTotalsForTeam1(playerData, match.team1, match.team2)
      } else {
        throw new Error(`invalid match status: ${match.winner}`)
      }
    }

    const allPlayers = Object.keys(playerData).concat(Object.keys(playerRenames))
    const fuse = new FuseJs(allPlayers, {
      shouldSort: true,
      threshold: 0.6,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: [],
    })

    for (const tournament of tournamentData) {
      tournament.first = this.correctTournamentPlayerNames(
        tournament.first,
        fuse,
        allPlayers,
      )
      tournament.second = this.correctTournamentPlayerNames(
        tournament.second,
        fuse,
        allPlayers,
      )
      tournament.third = this.correctTournamentPlayerNames(
        tournament.third,
        fuse,
        allPlayers,
      )

      for (const player of tournament.first) {
        playerData[player].tournamentFirsts += 1
      }

      for (const player of tournament.second) {
        playerData[player].tournamentSeconds += 1
      }

      for (const player of tournament.third) {
        playerData[player].tournamentThirds += 1
      }
    }

    return {
      playerData: playerData,
      matchData: matchData,
      tournamentData: tournamentData,
    }
  }

  correctTournamentPlayerNames(playerList, fuse, allPlayers) {
    return playerList.map(fuzzyName => {
      const index = fuse.search(fuzzyName)[0]

      if (index === undefined) {
        throw new Error(`couldn't match name ${fuzzyName} in tournament`)
      }

      const name = allPlayers[index]
      if (name in playerRenames) {
        return playerRenames[name]
      } else {
        return name
      }
    })
  }

  updateDrawTotalsForTeam1(playerData, team1, team2) {
    for (const player of team1) {
      playerData[player.name].draws += 1
      for (const opponent of team2) {
        const previousDraws =
          playerData[player.name].drawsAgainst[opponent.name]
        playerData[player.name].drawsAgainst[opponent.name] =
          (previousDraws === undefined ? 0 : previousDraws) + 1
      }
    }
  }

  updateWinTotalsForTeam1(playerData, team1, team2) {
    for (const player of team1) {
      playerData[player.name].wins += 1
      for (const opponent of team2) {
        const previousWins = playerData[player.name].winsAgainst[opponent.name]
        playerData[player.name].winsAgainst[opponent.name] =
          (previousWins === undefined ? 0 : previousWins) + 1
      }
    }
  }

  updateLossTotalsForTeam1(playerData, team1, team2) {
    for (const player of team1) {
      playerData[player.name].losses += 1
      for (const opponent of team2) {
        const previousLosses =
          playerData[player.name].lossesAgainst[opponent.name]
        playerData[player.name].lossesAgainst[opponent.name] =
          (previousLosses === undefined ? 0 : previousLosses) + 1
      }
    }
  }

  cleanMatchTeamList(names) {
    const minimal = names
      .trim()
      .replace(/,/gi, "")
      .replace(/\srd\s/gi, " ")

    const playerMatchStrings = minimal.matchAll(/(\w+)\s*\((\d+)\s*(\d+)\)/gi)
    const playerMatches = []

    for (const groups of playerMatchStrings) {
      playerMatches.push({
        name: groups[1],
        oldTrueskill: parseInt(groups[2]),
        oldRd: parseInt(groups[3]),
      })
    }

    return playerMatches
  }

  cleanResultTeamList(names) {
    const trimmed = names.trim()
    return trimmed.split(/\s*[,&]\s*/)
  }

  async uploadData(data, token) {
    const api = new GitHub({
      token: token,
    })

    const repo = api.getRepo("LlewVallis", "urmw-stats")

    const currentRef = await repo.getRef("heads/master")
    const currentCommitSha = currentRef.data.object.sha

    const currentCommit = await repo.getCommit(currentCommitSha)
    const currentTreeSha = currentCommit.data.tree.sha

    const content = JSON.stringify(data)
    const blob = await repo.createBlob(content)
    const blobSha = blob.data.sha

    const newTree = await repo.createTree(
      [
        {
          sha: blobSha,
          path: "src/trueskill-data.json",
          mode: "100644",
          type: "blob",
        },
      ],
      currentTreeSha
    )

    const newTreeSha = newTree.data.sha

    const newCommit = await repo.commit(
      currentCommitSha,
      newTreeSha,
      "Update trueskill data"
    )
    const newCommitSha = newCommit.data.sha

    await repo.updateHead("heads/master", newCommitSha)
  }
}

export default ProcessBotLogsPage
