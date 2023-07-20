import React, { Component } from "react";
import ReactGA from "react-ga";
import $ from "jquery";
// import "./App.css";
import '../assets/styles/custom.scss';
import Header from "../Components1/Header";
import Footer from "../Components1/Footer";
import About from "../Components1/About";
import Resume from "../Components1/Resume";
import Contact from "../Components1/Contact";
import Portfolio from "../Components1/Portfolio";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            foo: "bar",
            resumeData: {}
        };

        ReactGA.initialize("UA-110570651-1");
        ReactGA.pageview(window.location.pathname);
    }

    getResumeData() {
        $.ajax({
            url: "./resumeData.json",
            dataType: "json",
            cache: false,
            success: function (data) {
                this.setState({ resumeData: data });
                console.log('Duy')
            }.bind(this),
            error: function (xhr, status, err) {
                console.log(err);
                alert(err);
            }
        });
    }

    componentDidMount() {
        this.getResumeData();
    }

    render() {
        return (
            <div className="App home-page">
                <Header data={this.state.resumeData.main} />
                <About data={this.state.resumeData.main} />
                <Resume data={this.state.resumeData.resume} />
                <Portfolio data={this.state.resumeData.portfolio} />
                <Contact data={this.state.resumeData.main} />
                <Footer data={this.state.resumeData.main} />
            </div>
        );
    }
}

export default Home;
