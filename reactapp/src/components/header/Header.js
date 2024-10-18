import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import './header.css';
import { HomeOutlined, ReadFilled, LogoutOutlined, SettingOutlined} from '@ant-design/icons';

function Header(props) {
  return (
    <header className='header'>
      <nav className='nav' >
        <ul style={styles.group} >
          <Link to="/screensource" className='item' > <HomeOutlined /> Sources</Link>
          <Link to="/screenmyarticles" className='item' ><ReadFilled /> ({props.wishList.length})My Articles</Link>
        </ul>

        <ul style={styles.group} >
          <Link to={`/user/${props.username}`} className='item' ><SettingOutlined /> My account</Link>
          <Link to="/logout" className='item'><LogoutOutlined /> ({props.username})Logout</Link>
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
  group: {
    listStyleType: 'none',
    display: 'flex',
    padding: 0,
    margin: 0
  }
}