import React, { Component } from "react";
import Zmage from "react-zmage";
import Fade from "react-reveal";
import ReactPlayer from 'react-player';
// import anime from "F:/AEP/Data chuẩn bị/vermeil1.mp4"
import anime from "../assets/images/demo.mp4"

let id = 0;
class Portfolio extends Component {
  render() {
    if (!this.props.data) return null;

    const projects = this.props.data.projects.map(function (projects) {
      let projectImage = "images/portfolio/" + projects.image;

      return (
        <div key={id++} className="columns portfolio-item">
          <div className="item-wrap">
            <Zmage alt={projects.title} src={projectImage} />
            <div style={{ textAlign: "center" }}>{projects.title}</div>
          </div>
        </div>
      );
    });

    return (
      <section id="portfolio">
        <Fade left duration={1000} distance="40px">
          <div className="row">
            <div className="twelve columns collapsed">
              <h1>Check Out Some of My Works.</h1>

              <div
                id="portfolio-wrapper"
                className="bgrid-quarters s-bgrid-thirds cf"
              >
                <div >
                  <ReactPlayer
                    style={{ boxShadow: "0px 2px 6px 4px rgba(0, 0, 0, 0.3)" }}
                    url={anime} // Đường dẫn đến video
                    width="100%"
                    height={575}
                    playing={false} // Đặt giá trị false để tắt video ban đầu
                    loop="true"
                    controls // Hiển thị nút điều khiển video
                  />
                </div>
                {/* <video style={{ width: '100%' }} src={anime} autoPlay loop muted /> */}
              </div>
            </div>
          </div>
        </Fade>
      </section>
    );
  }
}

export default Portfolio;
