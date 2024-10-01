import React, {useState} from 'react';
import { connect } from 'react-redux';
import './App.css';
import { Card, message, Modal } from 'antd';
import { ReadOutlined, DeleteOutlined } from '@ant-design/icons';
import Nav from './Nav'
import {Link} from 'react-router-dom'

const { Meta } = Card;

function ArticleCard(props) {
  const [visible, setVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  var showModal = (title, content) => {
    setVisible(true)
    setTitle(title)
    setContent(content)  
  }
  var handleOk = (url) => {window.open(url, '_blank')}
  var handleCancel = e => {setVisible(false)}

  var articleCover
  if(props.article.urlToImage){
    articleCover = props.article.urlToImage
  } else{
    articleCover = process.env.PUBLIC_URL + '/images/generic.jpg'
  }

  console.log(props.article.content);
  

  
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Card
          style={styles}
          cover={<img alt="example" src={articleCover} />}
          actions={[
            <ReadOutlined key="ellipsis2" onClick={() => showModal(props.article.title, props.article.content)} />,
            <DeleteOutlined key="ellipsis" onClick={() => props.delArticle(props.article.title)} />
          ]}
        >
          <Meta
            title={props.article.title}
            description={props.article.description}
          />
        </Card>
        <Modal title={title} open={visible} onOk={() => handleOk(props.article.url)} onCancel={handleCancel} >
        <p>{content}</p>
      </Modal>
      </div>
  )
}


function ScreenMyArticles(props) {
  const [messageApi, contextHolder] = message.useMessage();
  const success = () => {
    messageApi.open({
      type: 'success',
      content: 'article removed from favorites',
    });
  };

  
  var delArticle = async (articleTitle) => {
    var response = await fetch(`/del-article`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `token=${props.token}&title=${articleTitle}`
    })
    var data = await response.json();
    if(data){
      props.deleteArticle(articleTitle);
      success();
    }
  }

  var articles = props.wishList.map((article, i) => {
    return (
      <ArticleCard key={i} article={article} delArticle={delArticle} />
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