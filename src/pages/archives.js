import React, { Component } from "react"
import Layout from "../components/layout"

class ArchivesPage extends Component {
  render() {
    return (
      <Layout>
        <div style={{
          margin: `0 auto`,
          marginTop: "5rem",
          maxWidth: 960,
        }}>
          <h1>Check out our archives here</h1>

          <ul>
            <li><a href="/archives/season3.html">Season 3</a></li>
            <li><a href="/archives/season3-history.html">Season 3 history</a></li>
            <li><a href="/archives/season4.html">Season 4</a></li>
            <li><a href="/archives/season4-history.html">Season 4 history</a></li>
            <li><a href="/archives/season5.html">Season 5</a></li>
            <li><a href="/archives/season5-history.html">Season 5 history</a></li>
            <li><a href="/archives/logo-contest-2019.html">Logo contest 2019</a></li>
            <li><a href="/archives/logo-contest-2020.html">Logo contest 2020</a></li>
          </ul>
        </div>
      </Layout>
    )
  }
}

export default ArchivesPage