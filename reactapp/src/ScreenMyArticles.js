import React from 'react';
import { connect } from 'react-redux';
import './App.css';
import { Card, message } from 'antd';
import { ReadOutlined, DeleteOutlined } from '@ant-design/icons';
import Nav from './Nav'
import {Link} from 'react-router-dom'

const { Meta } = Card;

function ScreenMyArticles(props) {
  const [messageApi, contextHolder] = message.useMessage();
  const success = () => {
    messageApi.open({
      type: 'success',
      content: 'article removed from favorites',
    });
  };



  var articles = props.wishList.map((article, i) => {
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }} key={i}>
        <Card
          style={styles}
          cover={<img alt="example" src={article.urlToImage} />}
          actions={[
            <ReadOutlined key="ellipsis2" />,
            <DeleteOutlined key="ellipsis" onClick={() => delArticle(article.title)} />
          ]}
        >
          <Meta
            title={article.title}
            description={article.description}
          />
        </Card>
      </div>
      )
  })

  var noArticle =
    <div style={{marginTop: 140, display: 'flex', flexDirection:'column', alignItems: 'center'}}>
      <h2> no articles </h2>
      <h2> <Link to="/screensource">dig some infos here</Link> </h2>
    </div>
    
  return (
    <div>
      {contextHolder}
      <Nav />
      <div className="Banner" />
      <div className="Card">
        {articles.length > 0 ? articles : noArticle}
      </div>
    </div>
  )
}

function mapStateToProps(state) {
  return { 
    wishList: state.wishList, 
    token: state.userToken
  };
}

function mapDispatchToProps(dispatch){
  return {
    deleteArticle: function(article) {
      dispatch({type: 'suprArticle', articleDeleted: article})
    }
  }
}

const styles = {
  width: 300,
  margin: '15px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
}

export default connect(mapStateToProps, mapDispatchToProps)(ScreenMyArticles);