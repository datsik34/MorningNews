import '../App.css';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {connect} from 'react-redux';
import { Card, Modal, Button } from 'antd';
import { LikeOutlined, ReadOutlined, CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import { message } from 'antd';
import ErrorApiFeedback from '../components/errorapifeedback/ErrorApiFeedback';
const { Meta } = Card;
var API = process.env.REACT_APP_NEWS_API_SECRET


function ArticleCard(props) {
  const [buttonHover, setButtonHover] = useState(false)
  const [visible, setVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  var showModal = (title, content, description) => {
    if(content === null){
      content = description
    }
    setVisible(true)
    setTitle(title)
    setContent(content)  
  }
  var handleOk = (url) => {window.open(url, '_blank')}
  var handleCancel = e => {setVisible(false)}
  var onHoverIn = () => {setButtonHover(true)}
  var onHoverOut = () => {setButtonHover(false)}


  var checkLike = false
  props.wishList.map((wishListarticle, i) => { 
    if(wishListarticle.title === props.article.title){
      checkLike = true
    }
  })

  var checkStyle = <CheckOutlined className='article-icon-check' onMouseEnter={()=> onHoverIn()} onMouseLeave={()=> onHoverOut()} />
  var buttonHovered = checkStyle
  if(!buttonHover){
    buttonHovered = checkStyle
  } else if(buttonHover) {
    buttonHovered = <DeleteOutlined className='article-icon-delete' onMouseLeave={()=> onHoverOut()} onClick={() => props.delArticle(props.article.title)} />
  }

  var articleCover
  if(props.article.urlToImage){
    articleCover = props.article.urlToImage
  } else{
    articleCover = process.env.PUBLIC_URL + '/images/generic.jpg'
  }

  return (
    <div className='articles-by-source-container'>
      <Card
        className='card-container'
        cover={<img alt={props.article.title} src={articleCover} className='card-image' onClick={() => showModal(props.article.title, props.article.content, props.article.description)}/>}
        actions={[
          <ReadOutlined key="ellipsis2" onClick={() => handleOk(props.article.url)} />,
          checkLike
          ? buttonHovered
          : <LikeOutlined key="ellipsis" onClick={() => props.likedArticle(props.article)} />
      ]}>
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
      )}>
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

function ScreenArticlesBySource(props) {
  
  const [articleList, setArticleList] = useState([])
  var { id } = useParams();
  const [messageApi, contextHolder] = message.useMessage();

  var content
  const success = (action) => {
    action === 'add' ? content = 'article added to favorites' : action==='delete' ? content = 'article removed from favorites' : content = ''
    messageApi.open({type: 'success', content: content});
  };

  useEffect(() => {
    if(props.APIkey.length !== 0){  
      API = props.APIkey
    } else {
      API = process.env.REACT_APP_API_SECRET
    }
    const findArticles = async () => {
      const response = await fetch(`https://newsapi.org/v2/top-headlines?sources=${id}&apiKey=${API}`)
      const data = await response.json()

      if(data.code === 'rateLimited' || data.code === 'apiKeyInvalid'){
        messageApi.open({type: 'error', content: 'API key is invalid or has reached its requests limits.'});
      } else {
        setArticleList(data.articles)
      }
    }
    findArticles()
  }, [])

  var likedArticle = async (article) => {
    var response = await fetch('/article/add', {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: `token=${props.token}&articleTitle=${article.title}&articleDescr=${article.description}&articleImg=${article.urlToImage}&articleContent=${article.content}&articleUrl=${article.url}`
    })
    var data = await response.json()
    if(data){
      props.addToWishList(article)
      success('add')
    }
  }

  var delArticle = async (articleTitle) => {
    var response = await fetch(`/article/delete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `token=${props.token}&title=${articleTitle}`
    })
    var data = await response.json();
    if(data){
      props.deleteArticle(articleTitle);
      success('delete')
    }
  }

if(articleList.length) {
  var articles = articleList.map((article, i) => {
    return(<ArticleCard key={i} article={article} likedArticle={likedArticle} delArticle={delArticle} wishList={props.wishList} />)
  })
}

  return (
    <div>
      {contextHolder}
      <div className="Banner" />
      <div className="card">
        {articles ? articles : <ErrorApiFeedback/>}
      </div>
    </div>
  );
}

function mapStateToProps(state) { 
  return {
    wishList: state.wishList,
    token: state.userToken,
    APIkey: state.apiKey
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addToWishList: function(article) {
      dispatch(
        {type: 'addArticle', articleLiked: article}
      )
    },
    deleteArticle: function(article) {
      dispatch({type: 'suprArticle', articleDeleted: article})
    }
  }
}

export default connect( mapStateToProps, mapDispatchToProps)(ScreenArticlesBySource);