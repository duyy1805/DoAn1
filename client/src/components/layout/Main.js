/*!
  =========================================================
  * Muse Ant Design Dashboard - v1.0.0
  =========================================================
  * Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
  * Copyright 2021 Creative Tim (https://www.creative-tim.com)
  * Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
  * Coded by Creative Tim
  =========================================================
  * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Layout, Drawer, Affix } from "antd";
import ParticlesBg from "particles-bg";
import Sidenav from "./Sidenav";
import Header from "./Header";
import Footer from "../../Components1/Footer";
import { Fade, Slide, Zoom, LightSpeed, Bounce } from "react-reveal";
import $ from "jquery";
// import anime from "F:/AEP/Data chuẩn bị/vermeil1.mp4"
const { Header: AntHeader, Content, Sider } = Layout;

function Main({ children }) {
  const [visible, setVisible] = useState(false);
  const [placement, setPlacement] = useState("right");
  const [sidenavColor, setSidenavColor] = useState("#1890ff");
  const [sidenavType, setSidenavType] = useState("ffffff");
  const [fixed, setFixed] = useState(false);
  const [resume, setResume] = useState([]);

  const openDrawer = () => setVisible(!visible);
  const handleSidenavType = (type) => setSidenavType(type);
  const handleSidenavColor = (color) => setSidenavColor(color);
  const handleFixedNavbar = (type) => setFixed(type);

  const getResumeData = () => {
    $.ajax({
      url: "./resumeData.json",
      dataType: "json",
      cache: false,
      success: function (data) {
        setResume(data.main.social);
      }.bind(this),
      error: function (xhr, status, err) {
        console.log(err);
        alert(err);
      }
    });
  }

  const networks = resume.map(function (network) {
    return (
      <li key={network.name}>
        <a href={network.url}>
          <i className={network.className}></i>
        </a>
      </li>
    );
  });

  let { pathname } = useLocation();
  pathname = pathname.replace("/", "");

  useEffect(() => {
    getResumeData();
    if (pathname === "rtl") {
      setPlacement("left");
    } else {
      setPlacement("right");
    }
  }, [pathname]);
  const GradientBackground = () => (
    <div className="gradient-background">
      {/* Nội dung của thành phần */}
    </div>
  );
  return (
    <Layout
      className={`layout-dashboard ${pathname === "profile" ? "layout-profile" : ""
        } ${pathname === "rtl" ? "layout-dashboard-rtl" : ""}`}
    >
      {/* <video style={{ position: "absolute", width: '100%' }} src={anime} autoPlay loop muted /> */}
      {/* <GradientBackground /> */}

      {/* <ParticlesBg type="circle" bg={true} style={{ position: "absolute", width: '100%' }} /> */}
      <nav id="nav-wrap" style={{ backgroundColor: "#333" }}>
        <a className="mobile-btn" href="#nav-wrap" title="Show navigation">
          Show navigation
        </a>
        <a className="mobile-btn" href="#home" title="Hide navigation">
          Hide navigation
        </a>

        <ul id="nav" className="nav">
          <li className="current">
            <a href="/">
              Home
            </a>
          </li>

          <li>
            <a href="/#about">
              About
            </a>
          </li>

          <li>
            <a href="/#resume">
              Resume
            </a>
          </li>

          <li>
            <a href="/#portfolio">
              Demo
            </a>
          </li>

          <li>
            <a href="/#contact">
              Project
            </a>
          </li>
        </ul>
      </nav>
      <Drawer
        title={false}
        placement={placement === "right" ? "left" : "right"}
        closable={false}
        onClose={() => setVisible(false)}
        visible={visible}
        key={placement === "right" ? "left" : "right"}
        width={250}
        className={`drawer-sidebar ${pathname === "rtl" ? "drawer-sidebar-rtl" : ""
          } `}
      >
        <Layout
          className={`layout-dashboard ${pathname === "rtl" ? "layout-dashboard-rtl" : ""
            }`}
        >
          <Sider
            trigger={null}
            width={250}
            theme="light"
            className={`sider-primary ant-layout-sider-primary ${sidenavType === "#fff" ? "active-route" : ""
              }`}
            style={{ background: sidenavType }}
          >
            <Sidenav color={sidenavColor} />
          </Sider>
        </Layout>
      </Drawer>
      <img src="https://antley.biz/wp-content/uploads/coffee-work-desk-mug-keyboard-162616.jpg" style={{ position: "absolute", width: '100%', filter: 'brightness(70%) contrast(120%)' }} />
      <img src="https://antley.biz/wp-content/uploads/coffee-work-desk-mug-keyboard-162616.jpg" style={{ position: "absolute", marginTop: 1260, width: '100%', filter: 'brightness(70%) contrast(120%)', transform: 'scaleY(-1)' }} />
      {/* <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
        trigger={null}
        width={250}
        theme="light"
        className={`sider-primary ant-layout-sider-primary ${sidenavType === "#fff" ? "active-route" : ""
          }`}
        style={{ background: sidenavType }}
      >
        <Sidenav color={sidenavColor} />
      </Sider> */}
      <Layout>
        {fixed ? (
          <Affix>
            <AntHeader className={`${fixed ? "ant-header-fixed" : ""}`}>
              <Header
                onPress={openDrawer}
                name={pathname}
                subName={pathname}
                handleSidenavColor={handleSidenavColor}
                handleSidenavType={handleSidenavType}
                handleFixedNavbar={handleFixedNavbar}
              />
            </AntHeader>
          </Affix>
        ) : (
          <AntHeader className={`${fixed ? "ant-header-fixed" : ""}`}>
            <Header
              onPress={openDrawer}
              name={pathname}
              subName={pathname}
              handleSidenavColor={handleSidenavColor}
              handleSidenavType={handleSidenavType}
              handleFixedNavbar={handleFixedNavbar}
            />
          </AntHeader>
        )}
        <Content className="content-ant">{children}</Content>
        <div className="footer-css" style={{ backgroundColor: '#000' }}>
          <div className="row">
            <Fade bottom>
              <div className="twelve columns">
                <ul className="social-links" style={{ display: "flex", justifyContent: 'center' }}>{networks}</ul>

                <ul className="copyright" >
                  <li>&copy; Copyright 2023 Diễm Linh Cơ</li>
                  <li>
                    Design by{" Diễm Linh Cơ "}
                    <a title="Styleshout" href="http://www.styleshout.com/">
                      Styleshout
                    </a>
                  </li>
                </ul>
              </div>
            </Fade>

            <div id="go-top">
              <a className="smoothscroll" title="Back to Top" href="#home">
                <i className="icon-up-open"></i>
              </a>
            </div>
          </div>
        </div>
      </Layout>
    </Layout>
  );
}

export default Main;
