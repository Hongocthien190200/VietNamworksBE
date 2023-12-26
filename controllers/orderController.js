const fetchTableData = require('../managerToken/managerToken');

const lark = require('@larksuiteoapi/node-sdk');
const client = new lark.Client({
    appId: process.env.APPID_LARKSUITE,
    appSecret: process.env.APPSECRECT_LARKSUITE,
});


class OrderController {
    create = async (req, res) => {
        const userToken = fetchTableData.getUserAccessToken();
        client.bitable.appTableRecord.create({
            path: {
                app_token: 'R8qjb9S2ualuZCs8E66l1JCUgYc',
                table_id: 'tblGIKia7qvBbDBx',
            },
            data: {
                "fields": {
                    "Date": req.body.Date,
                    "email": req.body.email,
                    "item": req.body.item,
                    "oderId": req.body.oderId,
                    "phoneNumber": req.body.phoneNumber,
                    "total": req.body.total,
                    "customerName": req.body.customerName
                }
            },
        },
            lark.withUserAccessToken(userToken.token)
        ).then(response => {
            console.log(response)
            res.json('Create Successful')
        }).catch(error => {
            console.error('Error creating table record:', error);
        });
    }
}

module.exports = new OrderController;