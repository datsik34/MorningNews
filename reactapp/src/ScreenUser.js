import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import Nav from './Nav'
import { Input, Space, Button, Alert, message } from 'antd';
import { connect } from 'react-redux';
import { CloseOutlined } from '@ant-design/icons';

function ScreenUser(props) {
    const [messageApi, contextHolder] = message.useMessage();
    var [APIkey, setAPIkey] = useState('');
    var [currentAPIkey, setCurrentAPIkey] = useState('');

    var inputOption = 'outlined';
    var inputValue;

    useEffect(() => {
        if(props.APIkey.length !== 0) {
            setCurrentAPIkey(props.APIkey)
        }
    },[])

    const success = (message) => {
        messageApi.open({
          type: 'success',
          content: message,
        });
      };

    var  addingAPIkey =  async () => {
        var response = await fetch('/addAPIkey', {
            method: 'POST',
            headers: {'Content-Type':'application/x-www-form-urlencoded'},
            body: `token=${props.token}&apikey=${APIkey}`
        })
        const data = await response.json();
        if(data){
            props.addAPI(data.APIkey)
            setCurrentAPIkey(data.APIkey)
            success('API key successfully added')
        }
    }

    var  deleteAPIkey =  async () => {
        var response = await fetch('/addAPIkey', {
            method: 'POST',
            headers: {'Content-Type':'application/x-www-form-urlencoded'},
            body: `token=${props.token}&apikey=`
        })
        const data = await response.json();
        if(data){
            props.addAPI(data.APIkey)
            setCurrentAPIkey(data.APIkey)
            success('API key successfully removed')
        }
    }


    var buttonDeleteAPI = <Button ghost disabled><CloseOutlined /></Button>

    if(props.APIkey.length !== 0){
        inputValue = currentAPIkey
        inputOption = 'filled';
        buttonDeleteAPI = <Button danger onClick={() => deleteAPIkey()} ><CloseOutlined /></Button>
    }


    return (
        <div>
            {contextHolder}
            <Nav />
            <div className="Banner" />
            <div style={styles.mainCont} >
                <div style={styles.titleCont} >
                    <h1>Settings({props.username})</h1>

                    <div style={styles.Hspacer} />

                </div>
                <div style={styles.cont} >
                    <div style={styles.userCont} >
                        <h2>User</h2>
                        <div style={styles.subCount} >
                            <Space.Compact style={{ width: '80%'}} >
                                <Input addonBefore="Change Name" variant="filled" placeholder='UserName' />
                                <Button type="primary">Submit</Button>
                            </Space.Compact>
                        </div>
                        <div style={styles.subCount} >
                            <Space.Compact style={{ width: '80%'}} >
                                <Input addonBefore="Change Email" variant="filled" placeholder='User@Email.com' />
                                <Button type="primary">Submit</Button>
                            </Space.Compact>
                        </div>
                        <div style={styles.subCount} >
                            Language preferences: 
                        </div>
                    </div>

                    <div style={styles.Vspacer} />

                    <div style={styles.userCont} >
                        <h2>API</h2>
                        <div style={styles.subCount} >
                            <Alert style={styles.alert} message={text.alert} type="info" action={
                                    <Space>
                                      <Button type="text" size="small">
                                      <Link to={{pathname: "https://newsapi.org/register"}} target="_blank">Get API</Link>
                                      </Button>
                                    </Space>
                                }/>
                        </div>
                        <div style={styles.subCount} >
                            <Space.Compact style={{ width: '80%'}} >
                                <Input
                                    addonBefore="Current API" 
                                    variant='filled'
                                    value={inputValue}
                                    disabled
                                />
                                {buttonDeleteAPI}
                            </Space.Compact>
                        </div>
                        <div style={styles.subCount} >
                            <Space.Compact style={{ width: '80%'}} >
                                <Input
                                    addonBefore="Set new API" 
                                    placeholder='Add your API here'
                                    onChange={(e) => setAPIkey(e.target.value)}
                                    allowClear={true}
                                    maxLength={33}
                                    />
                                <Button type="primary" onClick={() => addingAPIkey()} >Submit</Button>
                            </Space.Compact>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function mapStateToProps(state){
    return {
        token: state.userToken,
        APIkey: state.apiKey,
        username: state.userName
    }
  }

  

function mapDispatchToProps(dispatch){
    return {
      addAPI: function(API){
        dispatch({type: 'addAPI', APIadded: API})
      }
    }
  }


export default connect(mapStateToProps, mapDispatchToProps)(ScreenUser)

const styles = {
    mainCont: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 50
    },
    titleCont: {
        width: '65%',
        display:'flex',
        flexDirection: 'column',
    },
    cont: {
        width: '65%',
        height: 400,
        display: 'flex',
        flexDirection: 'center',
    },
    userCont: {
        display: 'flex',
        minWidth: '50%',
        flexDirection: 'column',
    },
    subCount: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30
    },
    colCont: {
        display: 'flex',
        flexDirection: 'column'
    },
    Hspacer: {
        width: '100%',
        borderTop: '1px solid #8f8f8f',
    },
    Vspacer: {
        height: '80%',
        borderLeft: '1px solid #8f8f8f',
        marginLeft: 30,
        marginTop: 30,
        marginRight: 30
    },
    alert: { width: '90%'}
}

const text = {
    alert: 'You will need to visit NewsAPI to get yourself a free API key in case my personnal free API key has reached its limited number of requests.'
}