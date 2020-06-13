import React, { Component } from "react"
import Layout from "../components/layout"

import pic1 from "../doggos/1.jpg"
import pic2 from "../doggos/2.jpg"
import pic3 from "../doggos/3.jpg"
import pic4 from "../doggos/4.jpg"
import pic5 from "../doggos/5.jpg"
import pic6 from "../doggos/6.jpg"
import pic7 from "../doggos/7.jpg"
import pic8 from "../doggos/8.jpg"
import pic9 from "../doggos/9.jpg"
import pic10 from "../doggos/10.jpg"
import pic11 from "../doggos/11.jpg"
import pic12 from "../doggos/12.jpg"
import pic13 from "../doggos/13.jpg"
import pic14 from "../doggos/14.jpg"
import pic15 from "../doggos/15.jpg"
import pic16 from "../doggos/16.jpg"
import pic17 from "../doggos/17.jpg"
import pic18 from "../doggos/18.jpg"
import pic19 from "../doggos/19.jpg"
import pic20 from "../doggos/20.jpg"
import pic21 from "../doggos/21.jpg"
import pic22 from "../doggos/22.jpg"
import pic23 from "../doggos/23.jpg"
import pic24 from "../doggos/24.jpg"
import pic25 from "../doggos/25.jpg"
import pic26 from "../doggos/26.jpg"
import pic27 from "../doggos/27.jpg"
import pic28 from "../doggos/28.jpg"
import pic29 from "../doggos/29.jpg"
import pic30 from "../doggos/30.jpg"
import pic31 from "../doggos/31.jpg"
import pic32 from "../doggos/32.jpg"
import pic33 from "../doggos/33.jpg"
import pic34 from "../doggos/34.jpg"
import pic35 from "../doggos/35.jpg"
import pic36 from "../doggos/36.jpg"
import pic37 from "../doggos/37.jpg"
import pic38 from "../doggos/38.jpg"
import pic39 from "../doggos/39.jpg"
import pic40 from "../doggos/40.jpg"
import pic41 from "../doggos/41.jpg"
import pic42 from "../doggos/42.jpg"
import pic43 from "../doggos/43.jpg"
import pic44 from "../doggos/44.jpg"
import pic45 from "../doggos/45.jpg"
import pic46 from "../doggos/46.jpg"
import pic47 from "../doggos/47.jpg"
import pic48 from "../doggos/48.jpg"
import pic49 from "../doggos/49.jpg"
import pic50 from "../doggos/50.jpg"
import pic51 from "../doggos/51.jpg"
import pic52 from "../doggos/52.jpg"
  
import vid1 from "../doggos/1.mp4"
import vid2 from "../doggos/2.mp4"
import vid3 from "../doggos/3.mp4"

const pics = [ 
  pic1, pic2, pic3, pic4, pic5, pic6,
  pic7, pic8, pic9, pic10, pic11, pic12, pic13,
  pic14, pic15, pic16, pic17, pic18, pic19, pic20,
  pic21, pic22, pic23, pic24, pic25, pic26, pic27,
  pic28, pic29, pic30, pic31, pic32, pic33, pic34,
  pic35, pic36, pic37, pic38, pic39, pic40, pic41,
  pic42, pic43, pic44, pic45, pic46, pic47, pic48,
  pic49, pic50, pic51, pic52,
]; 

class DoggosPage extends Component {
  render() {
    const picsClone = [...pics];

    // Some unreadable shuffle algorithm I definitely didn't steal from SO
    for (let i = picsClone.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [picsClone[i], picsClone[j]] = [picsClone[j], picsClone[i]];
    }

    const picElements = [];
    for (let i = 0; i < picsClone.length; i++) {
      picElements.push(<Picture src={picsClone[i]} key={i} />)
    }

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
            {picElements}

            <div style={{
              height: "10rem",
            }} />

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
      width: "15rem",
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