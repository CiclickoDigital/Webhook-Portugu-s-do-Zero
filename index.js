const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Servidor ativo');
});

app.post('/webhook/hotmart', async (req, res) => {
  const { email, name, product_name, status } = req.body;

  if (product_name === 'Português do Zero' && status === 'approved') {
    try {
      await axios.post('https://api.rd.services/platform/conversions', {
        event_type: 'CONVERSION',
        event_family: 'CDP',
        payload: {
          email,
          name,
          conversion_identifier: 'Compra Aprovada - Português do Zero'
        }
      }, {
        headers: {
          Authorization: `Bearer ${process.env.RDSTATION_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      return res.status(200).send('Lead enviado ao RD Station');
    } catch (error) {
      console.error('Erro no envio ao RD:', error.response?.data || error.message);
      return res.status(500).send('Erro ao enviar lead');
    }
  }

  res.status(200).send('Evento ignorado');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
