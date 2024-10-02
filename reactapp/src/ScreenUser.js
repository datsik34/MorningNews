import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import Nav from './Nav'
import { Input, Space, Button, Alert, message, Form } from 'antd';
import { connect } from 'react-redux';
import { CloseOutlined } from '@ant-design/icons';

function ScreenUser(props) {
    const [messageApi, contextHolder] = message.useMessage();
    var [APIkey, setAPIkey] = useState('');
    var [username, setUsername] = useState('');
    var [email, setEmail] = useState('');
    var [password, setPassword] = useState('');
    var [currentAPIkey, setCurrentAPIkey] = useState('');

    const [formAPI] = Form.useForm();
    const [formUsername] = Form.useForm();
    const [formEmail] = Form.useForm();

    var inputValue;

    useEffect(() => {
        if(props.APIkey.length !== 0) {
            setCurrentAPIkey(props.APIkey)
        }
    },[])

    const popUp = (type, message) => {
        messageApi.open({
          type: type,
          content: message,
        });
      };

    const onFinishFailed = () => {
        popUp('error', 'Submit failed')
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
            formAPI.resetFields();
            popUp('success', 'API key successfully added')
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
            popUp('success', 'API key successfully removed')
        }
    }

    var changingUserSettings = async (type) => {
        var input
        if(type === 'Username'){input = `username=${username}`}
        else if(type === 'Email'){input = `email=${email}`}
        else if(type === 'Password'){input = `password=${password}`}

        var response = await fetch('/user-settings', {
            method: 'PUT',
            headers: {'Content-Type':'application/x-www-form-urlencoded'},
            body: `token=${props.token}&${input}`
        })
        const data = await response.json();
        if(data.success){
            if(type === 'Username'){
                props.changeUsername(data.output)
                formUsername.resetFields();
            }
            if(type === 'Email'){
                props.changeEmail(data.output)
                formEmail.resetFields();
            }
            popUp('success', `${type} successfully changed`)
        }
    }

    var buttonDeleteAPI = <Button ghost disabled><CloseOutlined /></Button>
    var textConfirmAPI

    if(props.APIkey.length !== 0){
        inputValue = currentAPIkey
        textConfirmAPI = 'Your custom API is set'
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
                            <Alert style={styles.alert} message={text.alertUser} type="info"/>
                        </div>

                        <Form form={formUsername} layout="vertical" onFinish={() => changingUserSettings('Username')} onFinishFailed={onFinishFailed} autoComplete="off" >
                            <Form.Item name="Username" rules={[{required: true},{type: 'string',min: 3}]}>
                                <Space.Compact style={{ width: '80%'}} >
                                    <Input 
                                        addonBefore="Change Username"
                                        variant="filled"
                                        placeholder={props.username}
                                        allowClear={true}
                                        maxLength={20}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                    <Button type="primary"  htmlType="submit">Submit</Button>
                                </Space.Compact>
                            </Form.Item>
                        </Form>

                        <Form form={formEmail} layout="vertical" onFinish={() => changingUserSettings('Email')} onFinishFailed={onFinishFailed} autoComplete="off" >
                            <Form.Item name="Username" rules={[{required: true},{type: 'email'}]}>
                                <Space.Compact style={{ width: '80%'}} >
                                    <Input 
                                        addonBefore="Change Email"
                                        variant="filled"
                                        placeholder={props.email}
                                        allowClear={true}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <Button type="primary"  htmlType="submit">Submit</Button>
                                </Space.Compact>
                            </Form.Item>
                        </Form>

                        <div style={styles.subCount} >
                            <Button danger>Change password</Button>
                        </div>
                        <div style={styles.subCount} >
                            <Button type="primary" danger>Delete Account</Button>
                        </div>
                        

                    </div>

                    <div style={styles.Vspacer} />

                    <div style={styles.userCont} >
                        <h2>API</h2>
                        <div style={styles.subCount} >
                            <Alert style={styles.alert} message={text.alertAPI} type="info" action={
                                    <Space>
                                      <Button type="text" size="small">
                                      <Link to={{pathname: "https://newsapi.org/register"}} target="_blank">Get API</Link>
                                      </Button>
                                    </Space>
                                }/>
                        </div>
                        <p style={styles.APIset}>{textConfirmAPI}</p>
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
                        <Form form={formAPI} layout="vertical" onFinish={addingAPIkey} onFinishFailed={onFinishFailed} autoComplete="off" >
                            <Form.Item name="API" rules={[{required: true},{type: 'string',min: 32}]}>
                                <Space.Compact style={{ width: '80%'}} >
                                    <Input
                                        addonBefore="Set new API"
                                        placeholder='Add your API here'
                                        allowClear={true}
                                        maxLength={32}
                                        onChange={(e) => setAPIkey(e.target.value)}
                                    />
                                    <Button type="primary" htmlType="submit"> Submit </Button>
                                </Space.Compact>
                            </Form.Item>
                        </Form>
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
        username: state.userName,
        email: state.email
    }
  }

function mapDispatchToProps(dispatch){
    return {
      addAPI: function(API){
        dispatch({type: 'addAPI', APIadded: API})
      },
      changeUsername: function(userName){
        dispatch({type: 'changeUsername', usernameAdded: userName})
      },
      changeEmail: function(email){
        dispatch({type: 'changeEmail', emailAdded: email})
      },
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
    alert: {
        width: '90%',
        whiteSpace: 'pre-line'
        },
    APIset: {
        marginTop: 0,
        color: 'green',
        fontSize: '13px'
    }
}

const text = {
    alertAPI: 'You will need to visit NewsAPI to get yourself a free API key in case my personnal free API key has reached its limited number of requests.',
    alertUser: 'You can change your username, email or password only once a day (24 hours).\nDouble check your choice(s) before submitting.'
}