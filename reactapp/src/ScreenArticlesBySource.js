import './App.css';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {connect} from 'react-redux';
import { Card, Modal } from 'antd';
import { LikeOutlined, ReadOutlined, CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import Nav from './Nav';
import {  message } from 'antd';
const { Meta } = Card;

const API = '8d52780b5b85441cb744880fdd40412d';

function ArticleCard(props) {
  const [buttonHover, setButtonHover] = useState(false)
  const [visible, setVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  var showModal = (title, content) => {
    setVisible(true)
    setTitle(title)
    setContent(content)  
  }
  var handleOk = e => {setVisible(false)}
  var handleCancel = e => {setVisible(false)}
  var onHoverIn = () => {setButtonHover(true)}
  var onHoverOut = () => {setButtonHover(false)}


  var checkLike = false
  props.wishList.map((wishListarticle, i) => { 
    if(wishListarticle.title === props.article.title){
      checkLike = true
    }
  })
  var buttonHovered = <CheckOutlined style={{ fontSize: '16px', color: '#16d200' }} onMouseEnter={()=> onHoverIn()} onMouseLeave={()=> onHoverOut()} />
  if(!buttonHover){
    buttonHovered = <CheckOutlined style={{ fontSize: '16px', color: '#16d200' }} onMouseEnter={()=> onHoverIn()} onMouseLeave={()=> onHoverOut()} />
  } else if(buttonHover) {
    buttonHovered = <DeleteOutlined style={{ fontSize: '16px', color: '#d22300' }} onMouseLeave={()=> onHoverOut()} onClick={() => props.delArticle(props.article.title)} />
  }

  var articleCover
  if(props.article.urlToImage){
    articleCover = props.article.urlToImage
  } else{
    articleCover = process.env.PUBLIC_URL + '/images/generic.jpg'
  }

  return (
    <div style={styles.article}>
      <Card
        style={styles.card}
        cover={ <img alt="example" src={articleCover}/> }
        actions={[
          <ReadOutlined key="ellipsis2" onClick={() => showModal(props.article.title, props.article.content)} />,
          checkLike
          ? buttonHovered
          : <LikeOutlined key="ellipsis" onClick={() => props.likedArticle(props.article)} />
          
        ]}>
        <Meta title={props.article.title} description={props.article.description}/>
      </Card>
      <Modal title={title} open={visible} onOk={handleOk} onCancel={handleCancel}>
        <p>{content}</p>
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
    }
    const findArticles = async () => {
      const data = await fetch(`https://newsapi.org/v2/top-headlines?sources=${id}&apiKey=${API}`)
      const body = await data.json()
      setArticleList(body.articles)
    }
    findArticles()
  }, [])

  var likedArticle = async (article) => {
    var response = await fetch('/add-article', {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: `token=${props.token}&articleTitle=${article.title}&articleDescr=${article.description}&articleImg=${article.urlToImage}`
    })
    var data = await response.json()
    if(data){
      props.addToWishList(article)
      success('add')
    }
  }

  var delArticle = async (articleTitle) => {
    var response = await fetch(`/del-article`, {
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


  var articles = articleList.map((article, i) => {
    return(<ArticleCard key={i} article={article} likedArticle={likedArticle} delArticle={delArticle} wishList={props.wishList} />)
  })

  return (
    <div>
      {contextHolder}
      <Nav />
      <div className="Banner" />
      <div className="Card">
        {articles}
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

const styles = {
  card: {
    width: 300,
    margin: '15px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  article: {
    display: 'flex',
    justifyContent: 'center'
  }
  ,
  articleFadeOut: {
    display: 'flex',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.5s ease'
  }
}

export default connect( mapStateToProps, mapDispatchToProps)(ScreenArticlesBySource);