import React, {Component} from 'react'
import {Card, Col, Row, Layout, Alert, message, Button} from 'antd';

import Common from './Common';

class Employer extends Component {
    checkEmployee = () => {
        const {payroll, account, web3} = this.props;
        payroll.getEmployeeInfoById.call(account, {
            from: account
        }).then((ret) => {
            const info = {
                salary: web3.fromWei(ret[0].toNumber()),
                lastPaidDate: new Date(ret[1].toNumber() * 1000).toString(),
                balance: web3.fromWei(ret[2].toNumber()),
            }
            this.setState(info);
        }).catch((error) => {
            console.log(error);
            message.error(error.message);
        });
    }

    getPaid = () => {
        const {payroll, account} = this.props;
        payroll.getPaid({
            from: account,
        }).then((ret) => {
            this.checkEmployee();
        }).catch((error) => {
            message.error(error.message);
        });
    }

    constructor(props) {
        super(props);
        this.state = {
            salary: 0,
            lastPaidDate: '',
            balance: false,
        };
    }

    componentDidMount() {
        const {payroll} = this.props;
        const updateEmployeeInfo = (error, result) => {
            if(!error) {
                this.checkEmployee();
            }
        }
        
        // 雇员 getPaid 之后也应该刷新自己余额
        this.getPaidByEmployee = payroll.GetPaid(updateEmployeeInfo);

        this.checkEmployee();
    }

    componentWillUnmount() {
        this.getPaidByEmployee.stopWatching();
    }

    renderContent() {
        const {salary, lastPaidDate, balance} = this.state;

        if (!salary || salary === '0') {
            return <Alert message="你不是员工" type="error" showIcon/>;
        }

        return (
            <div>
                <Row gutter={16}>
                    <Col span={8}>
                        <Card title="薪水">{salary} Ether</Card>
                    </Col>
                    <Col span={8}>
                        <Card title="上次支付">{lastPaidDate}</Card>
                    </Col>
                    <Col span={8}>
                        <Card title="帐号金额">{balance} Ether</Card>
                    </Col>
                </Row>

                <Button
                    type="primary"
                    icon="bank"
                    onClick={this.getPaid}
                >
                    获得酬劳
                </Button>
            </div>
        );
    }

    render() {
        const {account, payroll, web3} = this.props;

        return (
            <Layout style={{padding: '0 24px', background: '#fff'}}>
                <Common account={account} payroll={payroll} web3={web3}/>
                <h2>个人信息</h2>
                {this.renderContent()}
            </Layout>
        );
    }
}

export default Employer
