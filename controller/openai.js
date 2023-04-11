const { response } = require('express');
const bcrypt = require('bcryptjs');

const { dbCConnection } = require('../database/config');
const { PreguntaUsr } = require('../models/preguntausr');
const { Configuration, OpenAIApi } = require("openai");

const postQuestiontoOpenAI =  async  (usuario, preguntausr) => {
    try {
        const { Configuration, OpenAIApi } = require("openai");

        const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);

        const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: "Provide personal feedback for me and give me tips: " + preguntausr,
        });

        console.log(JSON.stringify(completion)); //.data.choices[0].text);

        return JSON.stringify({
            respuesta: respuesta.data.choices[0].text
        });

    } catch (error) {
        console.error("Error en postQuestiontoOpenAI = " + error.message);
    }
}

const postQuestiontoOpenAIBK =  async  (usuario, preguntausr) => {
    try {

        //configurar la api key openAI
        const api_key = process.env.OPENAI_API_KEY.replaceAll("'","");
        const configuration = new Configuration({
            apiKey: api_key,
        });

        const openai = new OpenAIApi(configuration);

        console.log("IAIAIAIAIAIAIAIAIAIAIAIAIAIAIAIAI");
        console.log("usuario = " + usuario);
        console.log("preguntausr = " + preguntausr);

        const respuesta = await openai.createCompletion({
            model: "text-davinci-002",
            prompt: "Provide personal feedback for me and give me tips: " + preguntausr,
            temperature: 1,
            max_tokens: 150,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });
    
        console.log("respuesta from openai = " + JSON.stringify(respuesta));
        console.log("IAIAIAIAIAIAIAIAIAIAIAIAIAIAIAIAI");
        // Enviar la pregunta al modelo de lenguaje
        /*
        const respuesta = await openai.complete({
                                                engine: 'davinci',
                                                prompt: preguntausr,
                                                maxTokens: 1024,
                                                });
        */

        // Guardar la pregunta y la respuesta en la base de datos
        /*
        dbCConnection();
        const nuevaPregunta = new PreguntaUsr({
                                user: usuario,
                                body_question: preguntausr,
                                body_answer: respuesta.data.choices[0].text,
                                });

        PreguntaUsr.save();
        */
        // Devolver la respuesta al cliente
        return JSON.stringify({
            respuesta: respuesta.data.choices[0].text
        });

        //res.json({ respuesta: respuesta.data.choices[0].text });

    } catch (error) {
        console.error("Error en postQuestiontoOpenAI = " + error.message);
        //res.status(500).json({ error: 'Ha ocurrido un error al solicitar respuesta IA' });
    }
}

module.exports = {
    postQuestiontoOpenAI
};