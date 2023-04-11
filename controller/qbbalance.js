const { response } = require('express');
const bcrypt = require('bcryptjs');

const { Root } = require('../models/quickbooks/root');

const { refreshMyToken } = require('../middlewares/obtener-qbtoken');
const { postQuestiontoOpenAI } = require('../controller/openai');

const { dbCConnection } = require('../database/config');

const { readQuestionFromDB } = require('../controller/pregunta');
const { getUserFromDb } = require('../controller/usuarios');

const {Token} = require('../models/quickbooks/token');

const OAuthClient = require('intuit-oauth');
const { Configuration, OpenAIApi } = require("openai");
const { PreguntaUsr } = require('../models/preguntausr');
/*
const oauthClient = new OAuthClient({
  clientId: 'ABRujt5lfueenXUH1FLzzh81qajIXomwx0VeytowOmErmbW1NF',
  clientSecret: 'zQNUe2kk2VS3vI0LDlhhHWE9hEdQBqBh00lduJDi',
  environment: 'sandbox', // || 'production',
  redirectUri: 'https://developer.intuit.com/v2/OAuth2Playground/RedirectUrl/',
  logging: true
});
*/

const body = {};

//get Balance

const getBalance = async (req, res = response) => {
  //  /api/qbbalance?user=4620816365270088910
  //
  /* Buscar pregunta en la DB */
  const queryPregunta = process.env.QUESTION_CODE;
  const dbpregunta = await readQuestionFromDB(queryPregunta);
  const jsonDbpregunta = JSON.parse(dbpregunta);
  //console.log("jsonDbpregunta = " + jsonDbpregunta[0].body_question.replace('"',''));
  //
  var query = req.query;
  //
  /* Buscar industria en la DB */
  const dbUserBussines = await getUserFromDb(query);
  const jsonDbUserBussines = JSON.parse(dbUserBussines);

  var business_type = jsonDbUserBussines[0].businessType;
  var business_industry = jsonDbUserBussines[0].businessIndustry;
  //
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

    //return JSON.stringify(obj);
    
    /*
    // Con el id de usuario buscamos el token
    var dbToken = new Token({});
    // Desde el token de base de datos obtenemos el refresh token
    var refreshToken;
    var accessToken;
    dbCConnection();
    try {
      dbToken = await Token.find(query, function(err, token) {
        if (err) throw err;
        // 'token' is an array of the Token objects retrieved.
        token.forEach(function(token) {
          // Do something with the password.
          // The refreshtoken is stored in Token.refreshhtoken
          refreshToken = token.refreshtoken;
          accessToken  = token.token;
        });
      } ).sort({"_id": -1}).limit(1);
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
      "refresh_token":refreshToken,
      "x_refresh_token_expires_in":15552000,
      "access_token": accessToken
    });

    if(oauthClient.isAccessTokenValid()) {
      console.log("The access_token is valid");
    }
  
    if(oauthClient.isAccessTokenValid()){

      console.log('========================== ' );
      console.log('Try to refresh accessToken ' );
      console.log('========================== ' );

      const oauthClientTmp = new OAuthClient({
        clientId: 'ABRujt5lfueenXUH1FLzzh81qajIXomwx0VeytowOmErmbW1NF',
        clientSecret: 'zQNUe2kk2VS3vI0LDlhhHWE9hEdQBqBh00lduJDi',
        environment: 'sandbox', // || 'production',
        redirectUri: 'https://developer.intuit.com/v2/OAuth2Playground/RedirectUrl/',
        logging: true
      });

      await oauthClientTmp
      .refreshUsingToken(refreshToken )
        .then(function(authResponse) {
            console.log('Tokens refreshed : ' + JSON.stringify(authResponse.json()));
      })
      .catch(function(e) {
            console.error("The error message refreshing token is :"+e.originalMessage + " " + JSON.stringify(e));
            console.error(e.intuit_tid);
      });
      
      dbToken.token = oauthClientTmp.getToken().getToken().access_token;
      dbToken.refreshtoken = oauthClientTmp.getToken().getToken().refresh_token;

      console.log('refreshed accessToken = ' + oauthClientTmp.getToken().getToken().access_token);
      console.log('refreshed refreshToken = ' + oauthClientTmp.getToken().getToken().refresh_token);

      update = { 
          "$set": {
              "token": oauthClientTmp.getToken().getToken().access_token,
              "refreshtoken": oauthClientTmp.getToken().getToken().refresh_token
          }
      },
      options = { 
          "multi": true
      };

      Token.update(query, update, options);

      //oauthClient = oauthClientTmp;

      oauthClient.getToken().setToken({
        "token_type": "bearer",
        "expires_in": 3600,
        "refresh_token": oauthClientTmp.getToken().getToken().refresh_token,
        "x_refresh_token_expires_in":15552000,
        "access_token": oauthClientTmp.getToken().getToken().access_token
      });

    }
    */
    // To get the tokens
    //oauthClient.getToken().getToken();

  var total_accounts_receivable = 0;
  var total_current_assets = 0;
  var total_liabilities = 0;
  var total_equity = 0;
  var total_accounts_payable = 0;
  var total_current_liabilities = 0;
  var total_cost_of_goods_sold = 1;
  var net_income = 0;
  var net_income_previous_year = 0;
  var total_income = 0;
  var total_inventory = 0;
  var start_period;
  var end_period;
  var diffDays = 0;
  var days_pays_outstanding = 0;
  var days_sales_outstanding = 0;
  var days_inventory_held = 0;
  var current_ratio = 0;
  var depreciation_amortization = 0;
  var interest_expense = 0;
  var taxes = 0;
  var ebitda = 0;
  var net_cash_balance = 0;
  var company_name = '';
  var company_state_address = '';
  var dummy = 0;
  var qbbalance;
  var qbcashflow;
  var qbprofitandloss;
  var jsonBalance = {};
    /*
    oauthClient
    .refreshUsingToken(refreshToken)
    .then(function (authResponse) {
    */
      //console.log('Tokens refreshed : ' + JSON.stringify(authResponse.json()  )); //  .getJson()));
      /* BalanceSheet */
    await  oauthClient
        .makeApiCall({
          url: 'https://sandbox-quickbooks.api.intuit.com/v3/company/'+ query["user"] +'/reports/BalanceSheet?date_macro=This Fiscal Year-to-date&minorversion=65',
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.3',
          },
          body: JSON.stringify(body),
        })
        .then(function (response) {
          
          var jsonqbbalance = response.getJson();
          var strqbbalance = JSON.stringify(jsonqbbalance) ;
          strqbbalance = strqbbalance.replace(/\n/g, ''); //.replace(/(\r\n|\n|\r)/gm, "") ;
          qbbalance = JSON.parse(strqbbalance);
          /*
          console.log('========================================================');
          console.log('qbbalance = ' + JSON.stringify(qbbalance));
          console.log('========================================================');
          */
          //
          for(i=0;i<qbbalance.Rows.Row.length ;i++){
            //
            start_period = qbbalance.Header.StartPeriod;
            end_period = qbbalance.Header.EndPeriod;
            const start_period_date = new Date(start_period);
            const end_period_date = new Date(end_period);
            const diffTime = Math.abs(end_period_date - start_period_date);
            diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

            //
            for(j=0;j<qbbalance.Rows.Row[i].Rows.Row.length ;j++){
 
              if(qbbalance.Rows.Row[i].Rows.Row[j] != undefined && qbbalance.Rows.Row[i].Rows.Row[j].Summary.ColData[0].value == "Total Current Assets") {
                total_current_assets = qbbalance.Rows.Row[i].Rows.Row[j].Summary.ColData[1].value;
                console.log("total_current_assets =" + total_current_assets);
              }

              if(qbbalance.Rows.Row[i].Rows.Row[j] != undefined && qbbalance.Rows.Row[i].Rows.Row[j].Summary.ColData[0].value == "Total Liabilities") {
                total_liabilities = qbbalance.Rows.Row[i].Rows.Row[j].Summary.ColData[1].value;
                console.log("total_liabilities =" + total_liabilities);
              }

              if(qbbalance.Rows.Row[i].Rows.Row[j] != undefined && qbbalance.Rows.Row[i].Rows.Row[j].Summary.ColData[0].value == "Total Equity") {
                total_equity = qbbalance.Rows.Row[i].Rows.Row[j].Summary.ColData[1].value;
                console.log("total_equity =" + total_equity);
              }
              //
              for(k=0;k<qbbalance.Rows.Row[i].Rows.Row[j].Rows.Row.length ;k++){
                //
                if(qbbalance.Rows.Row[i].Rows.Row[j].Rows.Row[k].Summary != undefined && qbbalance.Rows.Row[i].Rows.Row[j].Rows.Row[k].Summary.ColData[0].value == "Total Accounts Receivable") {
                  total_accounts_receivable = qbbalance.Rows.Row[i].Rows.Row[j].Rows.Row[k].Summary.ColData[1].value;
                  console.log("total_accounts_receivable =" + total_accounts_receivable);
                }
                if(qbbalance.Rows.Row[i].Rows.Row[j].Rows.Row[k].Summary != undefined && qbbalance.Rows.Row[i].Rows.Row[j].Rows.Row[k].Summary.ColData[0].value == "Total Current Liabilities") {
                  total_current_liabilities = qbbalance.Rows.Row[i].Rows.Row[j].Rows.Row[k].Summary.ColData[1].value;
                  console.log("total_current_liabilities =" + total_current_liabilities);
                }

                if (qbbalance.Rows.Row[i].Rows.Row[j].Rows.Row[k].Rows != undefined) {
                  for(l=0;l<qbbalance.Rows.Row[i].Rows.Row[j].Rows.Row[k].Rows.Row.length ;l++){
                    if(qbbalance.Rows.Row[i].Rows.Row[j].Rows.Row[k].Rows.Row[l].Summary != undefined && qbbalance.Rows.Row[i].Rows.Row[j].Rows.Row[k].Rows.Row[l].Summary.ColData[0].value == "Total Accounts Payable") {
                      total_accounts_payable = qbbalance.Rows.Row[i].Rows.Row[j].Rows.Row[k].Rows.Row[l].Summary.ColData[1].value;
                      console.log("total_accounts_payable =" + total_accounts_payable);
                    }           
                  }
                }
              }
            }
          }


          /* ProfitAndLoss previous year */
          oauthClient
          .makeApiCall({
            url: 'https://sandbox-quickbooks.api.intuit.com/v3/company/' + query["user"] + '/reports/ProfitAndLoss?date_macro=Last Fiscal Year&minorversion=65',
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.3',
            },
            body: JSON.stringify(body),
          })
          .then(function (response) {
              qbprofitandloss = response.getJson();
            //
            for(i=0;i<qbprofitandloss.Rows.Row.length ;i++){

              if(qbprofitandloss.Rows.Row[i] != undefined && qbprofitandloss.Rows.Row[i].Summary.ColData[0].value == "Net Income") {
                net_income_previous_year = qbprofitandloss.Rows.Row[i].Summary.ColData[1].value;
                console.log("net_income_previous_year =" + net_income_previous_year);
              }
            }
          }) // end then ProfitAndLoss previous year
          .catch(function (e) {
            console.log('The message error in ProfitAndLoss previous year makeApiCall is : ' + e.message);
          });



          /* ProfitAndLoss */
          oauthClient
          .makeApiCall({
            //url: 'https://sandbox-quickbooks.api.intuit.com/v3/company/' + query["user"] + '/reports/ProfitAndLoss?date_macro=This Fiscal Year-to-date&minorversion=65',
            url: 'https://sandbox-quickbooks.api.intuit.com/v3/company/' + query["user"] + '/reports/ProfitAndLoss?date_macro=Last Fiscal Year&minorversion=65',
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.3',
            },
            body: JSON.stringify(body),
          })
          .then(function (response) {

            qbprofitandloss = response.getJson();
            /** */
            console.log('========================================================');
            console.log('qbprofitandloss = ' + JSON.stringify(qbprofitandloss));
            console.log('========================================================');
            /**/
            //
            for(i=0;i<qbprofitandloss.Rows.Row.length ;i++){
              if(qbprofitandloss.Rows.Row[i] != undefined && qbprofitandloss.Rows.Row[i].Summary.ColData[0].value == "Total Cost of Goods Sold") {
                total_cost_of_goods_sold = qbprofitandloss.Rows.Row[i].Summary.ColData[1].value;
                console.log("total_cost_of_goods_sold =" + total_cost_of_goods_sold);
              }
              if(qbprofitandloss.Rows.Row[i] != undefined && qbprofitandloss.Rows.Row[i].Summary.ColData[0].value == "Net Income") {
                net_income = qbprofitandloss.Rows.Row[i].Summary.ColData[1].value;
                console.log("net_income =" + net_income);
              }
              if(qbprofitandloss.Rows.Row[i] != undefined && qbprofitandloss.Rows.Row[i].Summary.ColData[0].value == "Total Income") {
                total_income = qbprofitandloss.Rows.Row[i].Summary.ColData[1].value;
                if(total_income == '') {total_income = 1}
                console.log("total_income =" + total_income);
              }
              /*
              if (qbprofitandloss.Rows.Row[i].Rows != undefined) {
                for(j=0;j<qbprofitandloss.Rows.Row[i].Rows.Row.length ;j++){
                  if(qbprofitandloss.Rows.Row[i].Rows.Row[j] != undefined && qbprofitandloss.Rows.Row[i].Rows.Row[j].Summary.ColData[0].value == "dummy") {
                    dummy = qbprofitandloss.Rows.Row[i].Rows.Row[j].Summary.ColData[1].value;
                    console.log("dummy =" + dummy);
                  }
                  //
                  if (qbprofitandloss.Rows.Row[i].Rows.Row[j].Rows != undefined) {
                    for(k=0;k<qbprofitandloss.Rows.Row[i].Rows.Row[j].Rows.Row.length ;k++){
                      //
                      if(qbprofitandloss.Rows.Row[i].Rows.Row[j].Rows.Row[k].Summary != undefined && qbprofitandloss.Rows.Row[i].Rows.Row[j].Rows.Row[k].Summary.ColData[0].value == "dummy") {
                        dummy = qbprofitandloss.Rows.Row[i].Rows.Row[j].Rows.Row[k].Summary.ColData[1].value;
                        console.log("dummy =" + dummy);
                      }
                      
                      if (qbprofitandloss.Rows.Row[i].Rows.Row[j].Rows.Row[k].Rows != undefined) {
                        for(l=0;l<qbprofitandloss.Rows.Row[i].Rows.Row[j].Rows.Row[k].Rows.Row.length ;l++){
                          if(qbprofitandloss.Rows.Row[i].Rows.Row[j].Rows.Row[k].Rows.Row[l].Summary != undefined && qbprofitandloss.Rows.Row[i].Rows.Row[j].Rows.Row[k].Rows.Row[l].Summary.ColData[0].value == "dummy") {
                            dummy = qbprofitandloss.Rows.Row[i].Rows.Row[j].Rows.Row[k].Rows.Row[l].Summary.ColData[1].value;
                            console.log("dummy =" + dummy);
                          }           
                        }
                      }
                    }
                  }
                }
              }
              */
            }
            //


                /* Company Info */
                oauthClient
                .makeApiCall({
                  url: 'https://sandbox-quickbooks.api.intuit.com/v3/company/' + query["user"] + '/companyinfo/' + query["user"] + '?minorversion=65',
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.3',
                  },
                  body: JSON.stringify(body),
                })
                .then(function (response) {

                  var qbcompany = response.getJson();

                  company_name = qbcompany.CompanyInfo.CompanyName;
                  //company_state_address = qbcompany.CompanyInfo.CompanyAddr.Line1 + ' - ' + qbcompany.CompanyInfo.CompanyAddr.City + ' - ' + qbcompany.CompanyInfo.CompanyAddr.CountrySubDivisionCode + ' - ' + qbcompany.CompanyInfo.Country ;
                  company_state_address = qbcompany.CompanyInfo.CompanyAddr.City + ' - ' + qbcompany.CompanyInfo.CompanyAddr.CountrySubDivisionCode ;
                }) // end then Company Info
                .catch(function (e) {
                  console.log('The message error in company Info makeApiCall is : ' + e.message);
                });


              /* InventoryValuationSummary */
              oauthClient
              .makeApiCall({
                url: 'https://sandbox-quickbooks.api.intuit.com/v3/company/' + query["user"] + '/reports/InventoryValuationSummary?date_macro=This Fiscal Year-to-date&minorversion=65',
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                  'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.3',
                },
                body: JSON.stringify(body),
              })
              .then(function (response) {

                qbinventory = response.getJson();
                /*
                console.log('========================================================');
                console.log('InventoryValuationSummary = ' + JSON.stringify(qbinventory));
                console.log('========================================================');
                */
                //
                for(i=0;i<qbinventory.Rows.Row.length ;i++){
                  if(qbinventory.Rows.Row[i] != undefined && qbinventory.Rows.Row[i].ColData[0].value == "TOTAL") {
                    total_inventory = qbinventory.Rows.Row[i].ColData[3].value;
                    console.log("total_inventory =" + total_inventory);
                  }
                }
                // total_income y total_cost_of_goods_sold verificarlos
                // Formulas
                days_sales_outstanding = (total_accounts_receivable / total_income) * diffDays;
                days_pays_outstanding = (total_accounts_payable / total_cost_of_goods_sold) * diffDays;
                days_inventory_held = (total_inventory / total_cost_of_goods_sold) * diffDays;
                current_ratio = total_current_assets / total_current_liabilities;
                ebitda = net_income + depreciation_amortization + interest_expense + taxes;
                // Net Income + Depreciation Amortization + Interest Expense + Taxes = ebitda

                total_liabilities=  parseFloat(total_liabilities).toFixed(2);
                total_current_liabilities = parseFloat(total_current_liabilities).toFixed(2);
                total_equity = parseFloat(total_equity).toFixed(2);
                total_current_assets = parseFloat(total_current_assets).toFixed(2);
                total_accounts_receivable = parseFloat(total_accounts_receivable).toFixed(2);
                total_accounts_payable= parseFloat(total_accounts_payable).toFixed(2);
                total_cost_of_goods_sold= parseFloat(total_cost_of_goods_sold).toFixed(2);
                net_income = parseFloat(net_income).toFixed(2);
                total_income= parseFloat(total_income).toFixed(2);
                total_inventory= parseFloat(total_inventory).toFixed(2);
                days = parseFloat(diffDays).toFixed(2);
                days_sales_outstanding = parseFloat(days_sales_outstanding).toFixed(2);
                days_pays_outstanding = parseFloat(days_pays_outstanding).toFixed(2);
                days_inventory_held = parseFloat(days_inventory_held).toFixed(2);
                current_ratio = parseFloat(current_ratio).toFixed(2);
                ebitda= parseFloat(ebitda).toFixed(2);
                depreciation_amortization= parseFloat(depreciation_amortization).toFixed(2);
                interest_expense= parseFloat(interest_expense).toFixed(2);
                taxes = parseFloat(taxes).toFixed(2);
                net_income_previous_year= parseFloat(net_income_previous_year).toFixed(2);
                net_cash_balance= parseFloat(net_cash_balance).toFixed(2);

                // Armo json final
                jsonBalance = {
                  'total_liabilities':  total_liabilities,
                  'total_current_liabilities' : total_current_liabilities,
                  'total_equity' : total_equity,
                  'total_current_assets' : total_current_assets,
                  'total_accounts_receivable' : total_accounts_receivable,
                  'total_accounts_payable': total_accounts_payable,
                  'total_cost_of_goods_sold': total_cost_of_goods_sold,
                  'net_income' : net_income,
                  'total_income': total_income,
                  'total_inventory': total_inventory,
                  'start_period': start_period,
                  'end_period': end_period,
                  'days' : diffDays,
                  'days_sales_outstanding' : days_sales_outstanding,
                  'days_pays_outstanding' : days_pays_outstanding,
                  'days_inventory_held' : days_inventory_held,
                  'current_ratio' : current_ratio,
                  'ebitda': ebitda,
                  'depreciation_amortization': depreciation_amortization,
                  'interest_expense': interest_expense,
                  'taxes' : taxes,
                  'company_name' : company_name,
                  'company_state_address': company_state_address,
                  'business_type': business_type,
                  'business_industry' : business_industry,
                  'net_income_previous_year': net_income_previous_year,
                  'net_cash_balance': net_cash_balance,
                };

                //console.log('jsonBalance = ' + JSON.stringify(jsonBalance));
                var question = '';
                
                //
                //var question = `I have  ${total_liabilities} of total_liabilities and  ${total_current_liabilities} of total_current_liabilities and  ${total_equity} of total_equity and  ${total_current_assets} of total_current_assets and ${total_accounts_receivable} of total_accounts_receivable and  ${total_accounts_payable} of total_accounts_payable and  ${total_cost_of_goods_sold} of total_cost_of_goods_sold and  ${net_income} of net_income and  ${total_income} of total_income and  ${total_inventory} of total_income`;
                question = jsonDbpregunta[0].body_question.replace('"','');
                question = eval(question) ;
                console.log('question = ' + question);

                //
                //const answerFromAI = postQuestiontoOpenAI(query["user"], question);

                var answerFromAI;
                const { Configuration, OpenAIApi } = require("openai");

                const configuration = new Configuration({
                apiKey: process.env.OPENAI_API_KEY,
                });
                const openai = new OpenAIApi(configuration);

                const completionFunction = async () => {
                  const completion = await openai.createCompletion({
                    model: "text-davinci-002",
                    prompt: "input:" + question,
                    temperature: 0.2,
                    max_tokens: 500,
                    top_p: 1,
                    frequency_penalty: 0,
                    presence_penalty: 0,
                    stop: ["input:"],
                    //prompt_tokens:125,
                    //completion_tokens:100,
                    //total_tokens:225
                    /*"usage":{"prompt_tokens":125,"completion_tokens":100,"total_tokens":225} */
                  });

                  //answerFromAI = { respuesta: completion.data.choices[0].text };

                  //console.log("completion = " + JSON.stringify(completion.data));

                  //console.log("completion.data.choices.length = " + completion.data.choices.length);
                  for(i=0;i<completion.data.choices.length ;i++){
                    console.log(completion.data.choices[i].text);
                  }
                  // Guardar la pregunta y la respuesta en la base de datos
                  dbCConnection();
                  const nuevaPregunta = new PreguntaUsr({
                                          user: query["user"],
                                          body_question: question,
                                          body_answer: completion.data.choices[0].text,
                                          });

                  nuevaPregunta.save();
                  var mongoObjectId = nuevaPregunta._id;
                  //var jsonIARespuesta = JSON.parse(answerFromAI);
                  //console.log("jsonIARespuesta = " + jsonIARespuesta);
                  //
                  res.json({
                    ok: true,
                    balance: jsonBalance,
                    _id: mongoObjectId,
                    question: question,
                    respuesta: completion.data.choices[0].text,
                  });

                };
                completionFunction();

                //console.log('jsonBalance : ' + JSON.stringify(jsonBalance) ); 
            }) // end then InventoryValuationSummary
            .catch(function (e) {
              console.log('The message error in InventoryValuationSummary makeApiCall is : ' + e.message);
            });

          }) // end then ProfitAndLoss
          .catch(function (e) {
            console.log('The message error in ProfitAndLoss makeApiCall is : ' + e.message);
          });

        }) // end then balance
        .catch(function (e) {
          console.log('The message error in BalanceSheet makeApiCall is : ' + e.message);
          res.json({
            ok: false,
            error: JSON.stringify(e)
          });
        });
    /*
    }) // end then refresh
    .catch(function (e) {
      console.error('The error message in refreshUsingToken is :' + e.originalMessage);
      console.error('intuit_tid = ' + e.intuit_tid);
    });
    */
};

const saveQuickBookToken = async (req, res = response) => {
  // recibir token...usuario
  try {
    const root = await Root.find();
    res.json(root);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

const passthrouQB = async (req, res = response) => {
  // lo que viene de QB pasarlo
  try {
    const root = await Root.find();
    res.json(root);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

module.exports = {
  getBalance
};

/*
oauthClient
  .makeApiCall({
    //url: 'https://sandbox-quickbooks.api.intuit.com/v3/company/4620816365270088910/reports/CashFlow?minorversion=65',
    url: 'https://sandbox-quickbooks.api.intuit.com/v3/company/' + query["user"] + '/reports/CashFlow?minorversion=65',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.3',
    },
    body: JSON.stringify(body),
  })
  .then(function (response) {

    qbcashflow = response.getJson();


  }) // end then CashFlow
  .catch(function (e) {
    console.log('The error in CashFlow makeApiCall is ' + JSON.stringify(e));
    res.json({
      ok: false,
      error: JSON.stringify(e)
    });
  })
  */