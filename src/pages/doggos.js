import React, { Component } from "react"
import Layout from "../components/layout"

import pic1 from "../doggos/1.jpg"
import pic2 from "../doggos/2.jpg"
import pic3 from "../doggos/3.jpg"
import pic4 from "../doggos/4.jpg"
import pic5 from "../doggos/5.jpg"
import pic6 from "../doggos/6.jpg"
import pic7 from "../doggos/7.jpg"

import vid1 from "../doggos/1.mp4"
import vid2 from "../doggos/2.mp4"
import vid3 from "../doggos/3.mp4"

class DoggosPage extends Component {
  render() {
    return (
      <Layout>
        <div style={{
          margin: `0 auto`,
          marginTop: "5rem",
          maxWidth: 960,
        }}>
          <h1>Even Diffy is in awe</h1>

          <div style={{
            textAlign: "center",
            margin: "2rem 0",
          }}>
            <Picture src={pic1} />
            <Picture src={pic2} />
            <Picture src={pic3} />
            <Picture src={pic4} />
            <Picture src={pic5} />
            <Picture src={pic6} />
            <Picture src={pic7} />

            <Video src={vid1} />
            <Video src={vid2} />
            <Video src={vid3} />
          </div>
        </div>
      </Layout>
    )
  }
}

const Picture = ({ src }) => (
  <img 
    src={src}
    style={{
      backgroundColor: "#555",
      border: "2px solid #222",
      height: "20rem",
      minWidth: "10rem",
      margin: "1rem",
    }}
  />
)

const Video = ({ src }) => (
  <video 
    controls
    style={{
      backgroundColor: "#555",
      border: "2px solid #222",
      height: "20rem",
      margin: "1rem",
    }}
  >
    <source
      src={src}
      type="video/mp4"
    />
  </video>
)

export default DoggosPage