import React from 'react';
import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';

const ScreenAccDeleted = () => (
    <div style={styles}>
            <Result
                status="success"
                title="Successfully deleted your account"
                extra={
                    <Link to={"/"}>
                        <Button type="primary" key="console">
                            Go to SignIn/SignUp
                        </Button>
                    </Link>
                }
            />
    </div>
);
const styles = {display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh'}

export default ScreenAccDeleted;