import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import '../../App.css';
import { HomeOutlined, ReadFilled, LogoutOutlined, SettingOutlined} from '@ant-design/icons';

function Header(props) {
  return (
    <header style={styles.header}>
      <nav style={styles.nav} >
        <ul style={styles.group} >
          <Link to="/screensource"style={styles.item} > <HomeOutlined /> Sources</Link>
          <Link to="/screenmyarticles"style={styles.item} ><ReadFilled /> ({props.wishList.length})My Articles</Link>
        </ul>

        <ul style={styles.group} >
          <Link to={`/user/${props.username}`} style={styles.item} ><SettingOutlined /> My account</Link>
          <Link to="/logout" style={styles.item}><LogoutOutlined /> ({props.username})Logout</Link>
        </ul>
      </nav>
    </header>
  );
}

function mapStateToProps(state){
  return {
    username: state.userName,
    wishList: state.wishList
  }
}

export default connect(mapStateToProps, null)(Header)

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
  group: {
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