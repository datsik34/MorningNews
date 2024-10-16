import '../App.css';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {connect} from 'react-redux';
import Header from '../components/header/Header';
import { Card, Modal, Button } from 'antd';
import { LikeOutlined, ReadOutlined, CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import {  message } from 'antd';
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
  var checkStyle = <CheckOutlined style={{ fontSize: '16px', color: '#16d200' }} onMouseEnter={()=> onHoverIn()} onMouseLeave={()=> onHoverOut()} />
  var buttonHovered = checkStyle
  if(!buttonHover){
    buttonHovered = checkStyle
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
        cover={<img alt={props.article.title} src={articleCover} onClick={() => showModal(props.article.title, props.article.content, props.article.description)}/>}
        actions={[
          <ReadOutlined key="ellipsis2" onClick={() => handleOk(props.article.url)} />,
          checkLike
          ? buttonHovered
          : <LikeOutlined key="ellipsis" onClick={() => props.likedArticle(props.article)} />
      ]}>
      <Meta
        style={{cursor: 'pointer'}}
        title={props.article.title}
        description={props.article.description}
        onClick={() => showModal(props.article.title, props.article.content, props.article.description)}
      />
      </Card>
      <Modal open={visible} onCancel={handleCancel} centered style={{minWidth: '60%'}} footer={(_, { CancelBtn }) => (
          <>
            <CancelBtn />
            <Button type="primary" onClick={() => handleOk(props.article.url)} >Continue reading</Button>
          </>
        )} 
      >
        <p style={{fontWeight: 'bold', fontSize: 40, margin: 0}}>{title}</p>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <img alt={props.article.title} src={articleCover} style={{minWidth: '100%', minHeight: '100%'}}/>
        </div>
        <div style={{display: 'flex', justifyContent:'center'}}>
          <p style={{maxWidth: '80%', display: 'flex', justifyContent:'center'}}>{content}</p>
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
      const data = await fetch(`https://newsapi.org/v2/top-headlines?sources=${id}&apiKey=${API}`)
      const body = await data.json()
      setArticleList(body.articles)
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


  var articles = articleList.map((article, i) => {
    return(<ArticleCard key={i} article={article} likedArticle={likedArticle} delArticle={delArticle} wishList={props.wishList} />)
  })

  return (
    <div>
      {contextHolder}
      <Header />
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
    justifyContent: 'space-between',
    cursor: 'pointer'
  },
  article: {
    display: 'flex',
    justifyContent: 'center'
  }
}

export default connect( mapStateToProps, mapDispatchToProps)(ScreenArticlesBySource);