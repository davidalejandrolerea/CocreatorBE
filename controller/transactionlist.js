const { response } = require('express');
const bcrypt = require('bcryptjs');
const { dbCConnection } = require('../database/config');
const {Token} = require('../models/quickbooks/token');
const OAuthClient = require('intuit-oauth');
const { refreshMyToken } = require('../middlewares/obtener-qbtoken');

const body = {};

//get getTransactionList

const getTransactionList = async (req, res = response) => {
  // /api/transactionlist?user=4620816365270088910
  // En el request viene el id de usuario
  var query = req.query;
  
  if (query.hasOwnProperty("user")){
    query["user"] = query.user; 
  }
  //
  const obj = await refreshMyToken(query);
  var tokens = JSON.parse(obj);
  //
  /*
  console.log('**************************************************');
  console.log('after refreshMyToken = ' + tokens.refresh_token);
  console.log('after refreshMyToken = ' + tokens.access_token );
  console.log('**************************************************');
  */
  const oauthClient = new OAuthClient({
    clientId: 'ABRujt5lfueenXUH1FLzzh81qajIXomwx0VeytowOmErmbW1NF',
    clientSecret: 'zQNUe2kk2VS3vI0LDlhhHWE9hEdQBqBh00lduJDi',
    environment: 'sandbox', // || 'production',
    redirectUri: 'https://programainformatico.sanluis.gob.ar/',
  });

  oauthClient.getToken().setToken({
    "token_type": "bearer",
    "expires_in": 3600,
    "refresh_token":tokens.refresh_token,
    "x_refresh_token_expires_in":15552000,
    "access_token": tokens.access_token
  });
 

  var qbtransactionlist;
  var responseJson;
  var jsonTransactionlist = [{}];

  var jsonTransactionlist = {
    transactions: []
  };



      oauthClient
        .makeApiCall({
          url: 'https://sandbox-quickbooks.api.intuit.com/v3/company/'+ query["user"] + '/reports/TransactionList?date_macro=Last Fiscal Year&minorversion=65',
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.3',
          },
          body: JSON.stringify(body),
        })
        .then(function (response) {

            responseJson = response.getJson();
            //
            console.log('qbtransactionlist : ' + JSON.stringify( responseJson.Rows.Row.length  ));
            for(i=0;i<responseJson.Rows.Row.length ;i++){

              oneTransaction = {
                'date': JSON.stringify( responseJson.Rows.Row[i].ColData[0].value ),
                'title': JSON.stringify(responseJson.Rows.Row[i].ColData[1].value + '-' + responseJson.Rows.Row[i].ColData[4].value),
                'value': JSON.stringify(responseJson.Rows.Row[i].ColData[8].value),
              };

              jsonTransactionlist.transactions.push(oneTransaction);

            }

            res.json({
              transactionlist: jsonTransactionlist.transactions
            });

        }) // end then balance
        .catch(function (e) {
          console.log('The error in getTransactionList makeApiCall is ' + JSON.stringify(e));
        })

  //console.log('jsonBalance : ' + JSON.stringify(jsonBalance) ); 
};

module.exports = {
  getTransactionList
};