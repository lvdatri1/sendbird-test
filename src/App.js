import React, { Component } from 'react';
import './App.css';
import * as SendBird from 'sendbird';
import MessageListItem from './MessListItem';

const SB_APP_ID = 'D0040096-E173-4232-A941-40ACA136FDF7';
const SB_CHANNEL = 'sendbird_open_channel_47637_cfac949ab329445335b69011724fac6549a9919d';


class App extends Component {

  constructor(props) {
    super(props);
    this.state = ({
      txtName: 'conkhi',
      txtChatID: 'xyz123',
      txtChannel: '1',
      avatar: 'https://via.placeholder.com/150',
      txtMessage: '',
      openC: null,
      sb: null,
      messageList: [],
      isLoading: false,
    });
    this.onJoinAction = this.onJoinAction.bind(this);
    this.onJoinChannelAction = this.onJoinChannelAction.bind(this);
    this.onSendMessage = this.onSendMessage.bind(this);
    this.onHandleChangeMessage = this.onHandleChangeMessage.bind(this);
    this.onHandleChatID = this.onHandleChatID.bind(this);
    this.onHandleName = this.onHandleName.bind(this);
    this.onHandleChangeChannel = this.onHandleChangeChannel.bind(this);
  }
  onHandleChangeMessage(event) {
    this.setState({
      txtMessage: event.target.value
    });
  }
  onHandleChatID(event) {
    this.setState({
      txtChatID: event.target.value
    });
  }
  onHandleChangeChannel(event) {
    this.setState({
      txtChannel: event.target.value
    });
  }
  onHandleName(event) {
    this.setState({
      txtName: event.target.value
    });
  }
  onJoinChannelAction() {
    // alert('joined channel');
    this.setState({ isLoading: true });

    this.state.sb.OpenChannel.getChannel(SB_CHANNEL, (openChannel, error) => {
      if (error) {
        return;
      }
      this.setState({ openC: openChannel });
      openChannel.enter((response, error) => {
        if (error) {
          return;
        }
        // alert('connected to defined channel');
        console.log('channeld are in', response);
      });
      var messList = openChannel.createPreviousMessageListQuery();
      messList.limit = 30;
      messList.reverse = true;
      messList.load((messL, error) => {
        if (error) {
          alert(error);
          return;
        }
        console.log(messL);
        this.setState({ messageList: messL, isLoading: false });

        console.log(this.state.messageList);
      });

      // openChannel.sendUserMessage('hello', 'DATA', 'CUSTOM_TYPE', function (message, error) {
      //   if (error) {

      //     return;
      //   };
      //   alert('sent');
      //   console.log(message);
      // });
    });

  }
  componentDidMount() {
    var temp = new SendBird({ appId: SB_APP_ID });
    this.setState({ sb: temp });

  }
  onSendMessage() {
    this.state.openC.sendUserMessage(this.state.txtMessage, 'DATA', 'CUSTOM_TYPE', (message, error) => {
      if (error) {

        return;
      };
      // alert('sent');
      this.setState({ txtMessage: '' });
      console.log(message);
      var messList = this.state.openC.createPreviousMessageListQuery();
      messList.limit = 30;
      messList.reverse = true;
      messList.load((messL, error) => {
        if (error) {
          alert(error);
          return;
        }
        console.log(messL);
        this.setState({ messageList: messL });
        console.log(this.state.messageList);

      });

    });

  }
  onJoinAction() {
    // var sb = new SendBird({ appId: SB_APP_ID });
    this.setState({ isLoading: true });
    this.state.sb.connect(this.state.txtChatID, (user, error) => {
      if (error) {
        alert('error now');
      }
      // alert('connect is done');
      console.log('our user is', user);
      this.setState({ avatar: user.profileUrl });
      var ChannelHandler = new this.state.sb.ChannelHandler();

      ChannelHandler.onMessageReceived = (channel, message) => {
        console.log(channel, message);

        var newMess = [message].concat(this.state.messageList);

        // this.state.messageList.push(message);
        console.log(this.state.messageList);
        this.setState({ ...this.state, messageList: newMess });
      };

      this.state.sb.addChannelHandler('channel1', ChannelHandler);
      this.setState({ isLoading: false });
      this.onJoinChannelAction();

    });
    // alert('all are good at end');
  }

  render() {
    return (
      <div className="App">
        <div> hello world
        <label>
            chat ID:
        </label>
          <input type='text' value={this.state.txtChatID} onChange={this.onHandleChatID}></input>
          <label>
            name:
        </label>
          <input type='text' value={this.state.txtName} onChange={this.onHandleName}></input>
          <button onClick={this.onJoinAction}>join</button>
          <div>
            <label>
              Channel:
        </label>
            <input type='text' value={this.state.txtChannel} onChange={this.onHandleChangeChannel}></input>
            <button onClick={this.onJoinChannelAction}>join channel</button>
          </div>
          <div>
            <label>
              Message:
        </label>
            <input type='text' value={this.state.txtMessage} onChange={this.onHandleChangeMessage} onKeyUp={(event) => {
              if (event.keyCode === 13) {
                this.onSendMessage();
              }
            }}></input>
            <button onClick={this.onSendMessage}>send message</button>
          </div>
        </div>
        <p>
          <img src={this.state.avatar} alt='avatar' ></img>
        </p>
        <div>
          {this.state.messageList.map((item, index) => {
            return <MessageListItem
              key={index}
              message={item.message}
              timeReceived={new Date(item.createdAt).toLocaleString('en-Us')}
              imgSource={item._sender.profileUrl}
              darker={item._sender.userId === this.state.txtChatID}
            />
          })}
        </div>
        {this.state.isLoading ? <div className="loading">Loading&#8230;</div> : null}
      </div>
    );
  }
}

export default App;
