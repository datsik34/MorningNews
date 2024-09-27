import React from 'react';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import './App.css';
import {Menu} from 'antd';
import { HomeOutlined, ReadFilled, LogoutOutlined, SettingOutlined} from '@ant-design/icons';

function Nav(props) {

  return (
    <header style={styles.header}>
      <nav style={styles.nav} >
        <ul style={styles.leftGroup} >
        <Link to="/screensource"style={styles.item} > <HomeOutlined /> Sources</Link>
        <Link to="/screenmyarticles"style={styles.item} ><ReadFilled /> My Articles</Link>
        </ul>

        <ul style={styles.rightGroup} >
        <Link to={`/user/${props.username}`} style={styles.item} ><SettingOutlined /> My account</Link>
        <Link to="/" style={styles.item}><LogoutOutlined /> ({props.username})Logout</Link>
        </ul>
      </nav>
    </header>
  );
}




function mapStateToProps(state){
  return {
    username: state.userName
  }
}


export default connect(mapStateToProps, null)(Nav)

const styles = {
  header: {
    backgroundColor: 'rgba(0, 21, 41, 0.8)',
    backdropFilter: 'blur(10px)',
    position: 'fixed',
    width: '100%',
    zIndex: 1000
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  leftGroup: {
    listStyleType: 'none',
    display: 'flex',
    padding: 0,
    margin: 0

  },
  rightGroup: {
    listStyleType: 'none',
    display: 'flex',
    padding: 0,
    margin: 0
  },
  item: {
    padding: 20,
    textDecoration: 'none',
    color: '#c3c3c3',
    fontSize: 15
  }
}







/*
import React from 'react';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import './App.css';
import {Menu} from 'antd';
import { HomeOutlined, ReadFilled, LogoutOutlined, SettingOutlined} from '@ant-design/icons';

function Nav(props) {

  return (
    <nav>
      <Menu mode="horizontal" theme="dark">

        <Menu.Item key="mail">
          <Link to="/screensource"> <HomeOutlined />Sources</Link>
        </Menu.Item>

        <Menu.Item key="test">
          <Link to="/screenmyarticles"><ReadFilled />My Articles</Link>
        </Menu.Item>

        <Menu.Item key="settings">
          <Link to={`/user/${props.username}`}><SettingOutlined />My account</Link>
        </Menu.Item>

        <Menu.Item key="app">
          <Link to="/"><LogoutOutlined />({props.username})Logout</Link>
        </Menu.Item>
        
      </Menu>
    </nav>
  );
}

function mapStateToProps(state){
  return {
    username: state.userName
  }
}

export default connect(mapStateToProps, null)(Nav)
*/