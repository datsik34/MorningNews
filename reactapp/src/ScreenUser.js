import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import Nav from './Nav'
import { Input, Space, Button, Alert, message, Form, Modal } from 'antd';
import { connect } from 'react-redux';
import { CloseOutlined } from '@ant-design/icons';

function ScreenUser(props) {
    const [messageApi, contextHolder] = message.useMessage();
    var [APIkey, setAPIkey] = useState('');
    var [username, setUsername] = useState('');
    var [email, setEmail] = useState('');
    var [currentPassword, setCurrentPassword] = useState('');
    var [newPassword, setNewPassword] = useState('');
    var [currentAPIkey, setCurrentAPIkey] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formAPI] = Form.useForm();
    const [formUsername] = Form.useForm();
    const [formEmail] = Form.useForm();
    const [formPassword] = Form.useForm();

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

    const showModal = () => {setIsModalOpen(true)};
    const handleCancel = () => {setIsModalOpen(false)};

    const onFinishFailed = () => {
        popUp('error', 'Submit failed');
        formPassword.resetFields();
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

    var changeUsername = async () => {
        var response = await fetch('/user-settings', {
            method: 'PUT',
            headers: {'Content-Type':'application/x-www-form-urlencoded'},
            body: `token=${props.token}&username=${username}`
        })
        const data = await response.json();
        if(data.success){
            props.changeUsername(data.output)
            popUp('success', 'Username successfully changed')
            formUsername.resetFields();
        }
    }

    var changeEmail = async () => {
        var response = await fetch('/user-settings', {
            method: 'PUT',
            headers: {'Content-Type':'application/x-www-form-urlencoded'},
            body: `token=${props.token}&email=${email}`
        })
        const data = await response.json();
        if(data.success){
            props.changeEmail(data.output)
            formEmail.resetFields();
            popUp('success', 'Email successfully changed')
        }
    }
    var changePassword = async () => {
        var response = await fetch('/user-settings', {
            method: 'PUT',
            headers: {'Content-Type':'application/x-www-form-urlencoded'},
            body: `token=${props.token}&currentPassword=${currentPassword}&newPassword=${newPassword}`
        })
        const data = await response.json();
        if(data.success){
            props.addToken(data.output)
            popUp('success', 'Password successfully changed')
            setIsModalOpen(false)
        } else {
            popUp('error', 'Password is not correct. Try again providing correct current password')
            formPassword.resetFields();
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

                        {/* C H A N G E    U S E R N A M E   &   E M A I L */}
                        {/* U S E R N A M E*/}
                        <Form form={formUsername} layout="vertical" onFinish={() => changeUsername()} onFinishFailed={onFinishFailed} autoComplete="off" >
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

                        {/* E M A I L */}
                        <Form form={formEmail} layout="vertical" onFinish={() => changeEmail()} onFinishFailed={onFinishFailed} autoComplete="off" >
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

                        {/* P A S S W O R D    M O D A L */}
                        <div style={styles.subCount} >
                            <Button danger onClick={showModal}>Change password</Button>
                        </div>

                        <Modal
                            title="Change your password"
                            centered open={isModalOpen}
                            onCancel={handleCancel}
                            footer={(_, { CancelBtn }) => (<><CancelBtn /></>)}
                        >
                            <Alert style={styles.alert} message={text.changePassword} type="info"/>
                            <Form form={formPassword} layout="vertical" onFinish={() => changePassword()} style={{marginTop: 30}} >
                                <input hidden type='text' name='username' autoComplete='username' />
                                <Form.Item name="Current password" label="Current password" rules={[{required: true},{type: 'string',min: 8}]} style={{ width: '70%'}} >
                                    <Input
                                        type="password"
                                        allowClear={true}
                                        maxLength={32}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        autoComplete="password"
                                    />
                                </Form.Item>
                                <Form.Item name="New password" label="Set new password" rules={[{required: true},{type: 'string',min: 8}]} style={{ width: '70%'}} >
                                    <Input
                                        type="password"
                                        allowClear={true}
                                        maxLength={32}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        autoComplete="new-password"
                                    />
                                </Form.Item>
                                <Button type="primary" htmlType="submit">Submit</Button>
                            </Form>
                        </Modal>

                        {/* D E L E T E  A C C O U N T    M O D A L */}
                        <div style={styles.subCount} >
                            <Button type="primary" danger>Delete Account</Button>
                        </div>
                    </div>

                    <div style={styles.Vspacer} />

                    {/* A P I    S E T T I N G S  */}
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
      addToken: function(token){
        dispatch({type: 'addToken', tokenAdded: token})
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
    alertUser: 'You can change your username, email or password only once a day (24 hours).\nDouble check your choice(s) before submitting.',
    changePassword: 'Your password should be composed of at least 8 characters'
}