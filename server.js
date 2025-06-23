const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.get('/pdf', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send('URL não fornecida.');
  }

  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox']
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        bottom: '20px',
        left: '10px',
        right: '10px'
      }
    });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=pagina.pdf`,
    });

    res.send(pdfBuffer);

  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao gerar PDF.');
  }
});

app.get('/', (req, res) => {
  res.send('API de geração de PDF está funcionando.');
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

