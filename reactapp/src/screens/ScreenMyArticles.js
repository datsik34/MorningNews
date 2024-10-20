import React, {useState} from 'react';
import { connect } from 'react-redux';
import '../App.css';
import { Card, message, Modal, Button } from 'antd';
import { ReadOutlined, DeleteOutlined } from '@ant-design/icons';
import {Link} from 'react-router-dom';

const { Meta } = Card;

function ArticleCard(props) {
  const [visible, setVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  var showModal = (title, content, description) => {
    if(content === null || content === 'null'){
      content = description
    }
    setVisible(true)
    setTitle(title)
    setContent(content)  
  }
  var handleOk = (url) => {window.open(url, '_blank')}
  var handleCancel = e => {setVisible(false)}

  var articleCover = props.article.urlToImage
  if(props.article.urlToImage === null || props.article.urlToImage === 'null'){
    articleCover = process.env.PUBLIC_URL + '/images/generic.jpg'
  }
  
  return (
    <div className='wishlist-container'>
        <Card
          className='card-container'
          cover={<img alt={props.article.title} src={articleCover} className='card-image' onClick={() => showModal(props.article.title, props.article.content, props.article.description)}/>}
          actions={[
            <ReadOutlined key="ellipsis2" onClick={() => handleOk(props.article.url)} />,
            <DeleteOutlined key="ellipsis" onClick={() => props.delArticle(props.article.title)} />
          ]}
        >
          <Meta
            className='article-meta'
            title={props.article.title}
            description={props.article.description}
            onClick={() => showModal(props.article.title, props.article.content, props.article.description)}
          />
        </Card>
        <Modal open={visible} onCancel={handleCancel} centered className='article-modal' footer={(_, { CancelBtn }) => (
          <>
            <CancelBtn />
            <Button type="primary" onClick={() => handleOk(props.article.url)} >Continue reading</Button>
          </>
        )} 
        >
            <p className='article-modal-title'>{title}</p>
            <div className='article-modal-div-img'>
              <img alt={props.article.title} src={articleCover} className='article-modal-img'/>
            </div>
            <div className='article-modal-div-content'>
              <p className='article-modal-content'>{content}</p>
            </div>
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
    var response = await fetch(`/article/delete`, {
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

  var flushArticles = async () => {
    var response = await fetch(`/article/delete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `token=${props.token}`
    })
    var data = await response.json();
    if(data){
      props.resetWishlist();
      success();
    }
  }

  var articles = props.wishList.map((article, i) => {
    return (
      <ArticleCard key={i} article={article} delArticle={delArticle} />
      )
  })

  var noArticle =
    <div className='empty-container'>
      <h2>no articles</h2>
      <img src={`${process.env.PUBLIC_URL}/images/empty.png`} className='empty-img' />
      <h2> <Link to="/screensource">dig some infos here</Link> </h2>
    </div>
    
  return (
    <div>
      {contextHolder}
      <div className="Banner" />
        {
          articles.length > 0 
          ? 
          <div>
            <FlushButton handleClickParent={flushArticles} />
            <div className="card">
              {articles}
            </div>
            <FlushButton handleClickParent={flushArticles} />
          </div>
          : noArticle}
    </div>
  )
}

function FlushButton(props){
  const [flushArticlesModal, setFlushArticlesModal] = useState(false);

  const showModalFlush = () => {
    setFlushArticlesModal(true);
  };
  const handleFlushOk = () => {
    props.handleClickParent();
    setFlushArticlesModal(false);
  };
  const handleFlushCancel = () => {
    setFlushArticlesModal(false);
  };

  return (
    <div className='remove-container'>
    <Button type="primary" danger onClick={showModalFlush}>
      Remove all articles
    </Button>
    <Modal title="Caution" open={flushArticlesModal} onOk={handleFlushOk} onCancel={handleFlushCancel}>
      <p>You're about to delete all articles in your wishlist.</p>
      <p>Do you wish to continue ?</p>
    </Modal>
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
    },
    resetWishlist: function(){
      dispatch({type: 'RESET_ARTICLES'})
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScreenMyArticles);