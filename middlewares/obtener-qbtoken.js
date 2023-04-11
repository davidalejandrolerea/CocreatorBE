const { response } = require('express');
const { Root } = require('../models/quickbooks/root');
const { dbCConnection } = require('../database/config');
const { Token } = require('../models/quickbooks/token');
const OAuthClient = require('intuit-oauth');

const refreshMyToken = async (query) => {

    var dbToken; // = new Token({});
    var refreshed = false;
    var refreshToken;
    var accessToken;
    dbCConnection();
    try {
        // Con el id de usuario buscamos el token
        const dbToken = await Token.find(query, function (err, tokens) {
            if (err) { console.log("err find " + err) }
            //throw err;
            if (tokens) {
                // 'token' is an array of the Token objects retrieved.
                tokens.forEach(function (token) {
                    // Desde el token de base de datos obtenemos el refresh token
                    refreshToken = token.refreshtoken;
                    accessToken = token.token;
                });
            }
        }).sort({ "_id": -1 }).limit(1);
    } catch (e) {
        console.log('error = ' + e.message);
        //res.status(500).json({ error: e.message });
    }
    /*
    console.log('========================== ');
    console.log(' MongoDB ');
    console.log('DB refresh_token = ' + refreshToken);
    console.log('DB accessToken = ' + accessToken);
    console.log('========================== ');
    */
    // Con la informacion de la base de datos accedemos a Quickbooks para hacer refresh del token

    const oauthClient = new OAuthClient({
        clientId: 'ABRujt5lfueenXUH1FLzzh81qajIXomwx0VeytowOmErmbW1NF',
        clientSecret: 'zQNUe2kk2VS3vI0LDlhhHWE9hEdQBqBh00lduJDi',
        environment: 'sandbox', // || 'production',
        redirectUri: 'https://programainformatico.sanluis.gob.ar/',
    });
    const body = {};
    //console.log("query[user]=" + query["user"])
    oauthClient.getToken().setToken({
        "realmId": query["user"],
        "token_type": "bearer",
        "expires_in": 3600,
        "refresh_token": refreshToken,
        "x_refresh_token_expires_in": 15552000,
        //"latency":55555,
        "access_token": accessToken
    });

    if (oauthClient.isAccessTokenValid()) {
        console.log("The access_token is valid");
    }

    if (oauthClient.isAccessTokenValid()) {
        /*
        console.log('========================== ');
        console.log('Try to refresh accessToken ');
        console.log('  oauthClient.getToken().getToken().refresh_token = ' + oauthClient.getToken().getToken().refresh_token);
        console.log('  oauthClient.clientId = ' + oauthClient.clientId);
        console.log('========================== ');
        */
        await oauthClient
            .refreshUsingToken(refreshToken)
            //.refresh()
            .then(function (authResponse) {
                refreshed = true;
                //console.log(' ===== Tokens refreshed ====== : ' + JSON.stringify(authResponse.json()));
            })
            .catch(function (e) {
                //console.error("The error message refreshing token is :" + JSON.stringify(e.authResponse.json));
                console.error("The error message refreshing token is :" + JSON.stringify(e));
                /*return {
                    ok: refreshed,
                    error: e,
                };
                */
            });
        if (refreshed == true) {
            //Si se pudo refrescar el token entonces lo grabamos en la base de datos
            accessToken = oauthClient.getToken().getToken().access_token;
            refreshToken = oauthClient.getToken().getToken().refresh_token;
            /*
            console.error("new refreshToken :" + refreshToken);
            console.error("new accessToken :" + accessToken);
            */
            filter = { user: query["user"] };
            update = {
                "$set": {
                    "token": oauthClient.getToken().getToken().access_token,
                    "refreshtoken": oauthClient.getToken().getToken().refresh_token
                }
            };

            try {
                await Token.updateOne(filter, update);
            } catch (e) {
                console.log('updateOne error = ' + e.message);
                //res.status(500).json({ error: e.message });
            }
        }

        //return oauthClient;
        
        return JSON.stringify({
            ok: refreshed,
            access_token: oauthClient.getToken().getToken().access_token,
            refresh_token: oauthClient.getToken().getToken().refresh_token,
        });
        
    }
}

const generateMyFirstToken = async (parseRedirect, user) => {

    const oauthClient = new OAuthClient({
        clientId: 'ABRujt5lfueenXUH1FLzzh81qajIXomwx0VeytowOmErmbW1NF',
        clientSecret: 'zQNUe2kk2VS3vI0LDlhhHWE9hEdQBqBh00lduJDi',
        environment: 'sandbox', // || 'production',
        redirectUri: 'https://programainformatico.sanluis.gob.ar/',
    });

    //const parseRedirect = "https://programainformatico.sanluis.gob.ar/?code=AB11676672296Y9vRpama433XuqhRSZ61uEZayAr2kdjzxMJh9&state=security_token%3D138r5719ru3e1%26url%3Dhttps%3A%2F%2Fprogramainformatico.sanluis.gob.ar%2F&realmId=4620816365270088910"; //req.url;
    //const parseRedirect = "https://programainformatico.sanluis.gob.ar/?code=AB11676674649sDZTY0yZqVEeAd6FWTPdg505QEgjqar4AelJX&state=security_token%3D138r5719ru3e1%26url%3Dhttps%3A%2F%2Fprogramainformatico.sanluis.gob.ar%2F&realmId=4620816365270947900";
    // Exchange the auth code retrieved from the **req.url** on the redirectUri
    oauthClient
    .createToken(parseRedirect)
    .then(function (authResponse) {
        console.log('The Token is  ' + JSON.stringify(authResponse.getJson()));
    })
    .catch(function (e) {
        console.error('The error message is :' + JSON.stringify(e));
        console.error(e.intuit_tid);
    });

}
const obtenerDBtoken = (req, res, next) => {

    dbCConnection();

    var query = req.query;
    if (query.hasOwnProperty("user")) {
        query["user"] = query.user;
    }

    // Con el id de usuario buscamos el token
    var dbToken = new Token({});
    // Desde el token de base de datos obtenemos el refresh token
    var refreshToken;
    var accessToken;
    try {
        dbToken = Token.find(query, function (err, token) {
            if (err) throw err;
            // 'token' is an array of the Token objects retrieved.
            token.forEach(function (token) {
                // Do something with the password.
                // The refreshtoken is stored in Token.refreshhtoken
                refreshToken = token.refreshtoken;
                accessToken = token.token;
            });
        }).sort({ "_id": -1 }).limit(1);
    } catch (e) {
        console.log('error = ' + e.message);
        //res.status(500).json({ error: e.message });
    }

    console.log('dbToken = Token.find' + dbToken);
    console.log('DB refreshToken = ' + refreshToken);
    console.log('DB accessToken = ' + accessToken);
    console.log('****************************************************');

};


const obtenerQBtoken = (req, res, next) => {

    const oauthClient = new OAuthClient({});
    const body = {};
    dbCConnection();
    const token = req.header('x-token');

    var query = req.query;
    if (query.hasOwnProperty("user")) {
        query["user"] = query.user;
    }

    // Con el id de usuario buscamos el token
    var dbToken = new Token({});
    // Desde el token de base de datos obtenemos el refresh token
    var refreshToken;
    var accessToken;
    try {
        dbToken = Token.find(query, function (err, token) {
            if (err) throw err;
            // 'token' is an array of the Token objects retrieved.
            token.forEach(function (token) {
                // Do something with the password.
                // The refreshtoken is stored in Token.refreshhtoken
                refreshToken = token.refreshtoken;
                accessToken = token.token;
            });
        }).sort({ "_id": -1 }).limit(1);
    } catch (e) {
        console.log('error = ' + e.message);
        //res.status(500).json({ error: e.message });
    }

    console.log('DB refreshToken = ' + refreshToken);
    console.log('DB accessToken = ' + accessToken);
    console.log('****************************************************');

    oauthClient.getToken().setToken({
        "token_type": "bearer",
        "expires_in": 3600,
        "refresh_token": refreshToken,
        "x_refresh_token_expires_in": 15552000,
        "access_token": accessToken
    });

    if (oauthClient.isAccessTokenValid()) {
        console.log("The access_token is valid");
    }

    if (oauthClient.isAccessTokenValid()) {

        console.log('========================== ');
        console.log('Try to refresh accessToken ');
        console.log('========================== ');
        /*
        const oauthClientTmp = new OAuthClient({
            clientId: 'ABRujt5lfueenXUH1FLzzh81qajIXomwx0VeytowOmErmbW1NF',
            clientSecret: 'zQNUe2kk2VS3vI0LDlhhHWE9hEdQBqBh00lduJDi',
            environment: 'sandbox', // || 'production',
            redirectUri: 'https://developer.intuit.com/v2/OAuth2Playground/RedirectUrl/',
            logging: true
        });
        */
        oauthClient
            .refreshUsingToken(refreshToken)
            .then(function (authResponse) {
                console.log('Tokens refreshed : ' + JSON.stringify(authResponse.json()));
            })
            .catch(function (e) {
                console.error("The error message refreshing token is :" + e.originalMessage + " " + JSON.stringify(e));
                console.error(e.intuit_tid);
            });

        dbToken.token = oauthClient.getToken().getToken().access_token;
        dbToken.refreshtoken = oauthClient.getToken().getToken().refresh_token;

        console.log('refreshed accessToken = ' + oauthClient.getToken().getToken().access_token);
        console.log('refreshed refreshToken = ' + oauthClient.getToken().getToken().refresh_token);

        update = { /* the replacement object */
            "$set": {
                "token": oauthClient.getToken().getToken().access_token,
                "refreshtoken": oauthClient.getToken().getToken().refresh_token
            }
        },
            options = { /* update all records that match the query object, default is false (only the first one found is updated) */
                "multi": true
            };

        Token.update(query, update, options);
        /*
        oauthClient.getToken().setToken({
            "token_type": "bearer",
            "expires_in": 3600,
            "refresh_token": oauthClientTmp.getToken().getToken().refresh_token,
            "x_refresh_token_expires_in": 15552000,
            "access_token": oauthClientTmp.getToken().getToken().access_token
        });
        */
    }

    res.json({
        ok: true,
        token: oauthClient.getToken().getToken()
    });

};
module.exports = {
    obtenerDBtoken, obtenerQBtoken, refreshMyToken, generateMyFirstToken
};


/**
 *   if (!token) {
    return res.status(401).json({
      ok: false,
      msg: 'Token no suministrado',
    });
  }
 *  try {
    const { uid } = jwt.verify(token, process.env.JWT_KEY);
    req.uid = uid;

    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: 'Token no valido',
    });
  }
 */