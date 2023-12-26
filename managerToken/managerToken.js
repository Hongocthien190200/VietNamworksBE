const lark = require('@larksuiteoapi/node-sdk');
const client = new lark.Client({
    appId: process.env.APPID_LARKSUITE,
    appSecret: process.env.APPSECRECT_LARKSUITE,
    disableTokenCache: true
});

//set get Token
let userAccessToken = '';

function setUserAccessToken(token) {
    userAccessToken = token;
}
function getUserAccessToken() {
    return userAccessToken;
}

//BEGIN hanlde get token || handle refresh token
async function getAppAccessToken() {
    const response = await fetch('https://open.larksuite.com/open-apis/auth/v3/app_access_token/internal', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            app_id: process.env.APPID_LARKSUITE,
            app_secret: process.env.APPSECRECT_LARKSUITE,
        }),
    });
    const data = await response.json();
    return data.app_access_token;
}
async function handleGetAccessToken() {
    const appToken = await getAppAccessToken();
    const now = Date.now();
    return await client.authen.accessToken.create({
        data: {
            grant_type: 'authorization_code',
            code: 'f7cp6a7916c94a6bb06b63e3d8h613vb',
        },
    },
        lark.withTenantToken(appToken)
    ).then(res => {
        const timeGetToken = now;
        setUserAccessToken({
            token: res.data.access_token,
            refresh_token: res.data.refresh_token,
            expires_in: res.data.expires_in,
            timeGetToken: timeGetToken
        });
    })
}

async function handleGetNewAccessToken() {
    const appToken = await getAppAccessToken();
    const now = Date.now();
    const refreshToken =  getUserAccessToken();
    client.authen.refreshAccessToken.create({
        data: {
            grant_type: "refresh_token",
            refresh_token: refreshToken.refresh_token
        },
    },
        lark.withTenantToken(appToken)
    ).then(res => {
        const timeGetToken = now;
        setUserAccessToken({
            token: res.data.access_token,
            refresh_token: res.data.refresh_token,
            expires_in: res.data.expires_in,
            timeGetToken: timeGetToken
        });
    });
};
//END hanlde get token || handle refresh token


//BEGIN handle Data From Larksuite
async function fetchTableData(tableId) {
    const tenantToken =  getUserAccessToken();
    return client.bitable.appTableRecord.list({
        path: {
            app_token: 'R8qjb9S2ualuZCs8E66l1JCUgYc',
            table_id: tableId,
        }
    }, lark.withUserAccessToken(tenantToken.token));
}

module.exports = {
    getUserAccessToken,
    handleGetAccessToken,
    handleGetNewAccessToken,
    fetchTableData,
};
