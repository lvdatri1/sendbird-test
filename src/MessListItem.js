import React, { Component } from 'react'

export default class MessListItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { darker, message, timeReceived, imgSource } = this.props;
        var styleX = 'container';
        if (darker) styleX = "darker container"
        return (
            <div className={styleX}>
                <img src={imgSource} alt="Avatar" className={darker ? "right" : null} />
                <p className={darker ? 'p-right' : null}>{message}</p>
                <span className={darker ? "time-left" : "time-right"}>{timeReceived}</span>
            </div>
        )
    }
}
