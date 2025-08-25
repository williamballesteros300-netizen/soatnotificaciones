const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

app.post('/notificar', async (req, res) => {
  const datos = req.body;
  console.log("📩 Datos recibidos:", datos); // ← Para ver los datos en los logs

  let mensaje = "";

  // 👀 Visita al sitio (página SOAT)
  if (datos.tipo === "visita") {
    mensaje = "👀 *Nuevo visitante ingresó al sitio de ventas SOAT*";

  // 🖥️ Visita al panel (página nueva)
  } else if (datos.tipo === "visita_panel") {
    mensaje = "🖥️ *Nuevo acceso al panel de administración (página nueva)*";

  // 📲 Clic en WhatsApp (página nueva)
  } else if (datos.tipo === "whatsapp") {
    mensaje = "📲 *Un usuario hizo clic en el botón de WhatsApp (página nueva)*";

  // 📊 Cotización (SOAT)
  } else if (datos.tipo === "cotizacion") {
    mensaje = `
📊 *Nueva cotización de SOAT:*
🚗 *Placa:* ${datos.placa || 'No proporcionada'}
📄 *Clase:* ${datos.clase || 'N/A'}
📌 *Subtipo:* ${datos.subtipo || 'N/A'}
🎂 *Edad vehículo:* ${datos.edad || 'N/A'}
💰 *Valor estimado:* ${datos.valor || '$0'}
`.trim();

  // 🟡 Clic en Pagar (SOAT)
  } else if (datos.tipo === "pago") {
    mensaje = `
🟡 *Clic en Pagar (SOAT)*
📧 *Correo:* ${datos.correo || 'N/A'}
🚗 *Placa:* ${datos.placa || 'N/A'}
💵 *Valor:* ${datos.valor || '$0'}
`.trim();

  // 📥 Envío de formulario completo (SOAT)
  } else if (datos.tipo === "solicitud") {
    mensaje = `
📥 *Nueva solicitud de SOAT*:
🚗 *Placa:* ${datos.placa || 'No proporcionada'}
💵 *Valor estimado:* ${datos.valor || '$0'}

👤 *Nombre:* ${datos.nombres || 'No indicado'}
🆔 *Tipo de documento:* ${datos.tipoDocumento || 'N/A'}
🔢 *Número de documento:* ${datos.documento || 'N/A'}
📅 *Fecha expedición:* ${datos.fechaExpedicion || 'N/A'}
📧 *Email:* ${datos.email || 'N/A'}
📱 *Celular:* ${datos.celular || 'N/A'}
🏠 *Dirección:* ${datos.direccion || 'N/A'}
🏙️ *Ciudad:* ${datos.ciudad || 'N/A'}

🛞 *Marca:* ${datos.marca || 'N/A'}
📆 *Modelo:* ${datos.modelo || 'N/A'}
📆 *Inicio vigencia:* ${datos.inicioVigencia || 'N/A'}

🧾 *Clase:* ${datos.clase || 'N/A'}
📌 *Subtipo:* ${datos.subtipo || 'N/A'}
🎂 *Edad vehículo:* ${datos.edad || 'N/A'}
`.trim();

  // 🚫 Si llega algo desconocido (ej: desde la página nueva sin tipo)
  } else {
    mensaje = "ℹ️ *Notificación recibida de la página nueva (sin tipo definido)*";
  }

  try {
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: mensaje,
      parse_mode: "Markdown"
    });

    res.status(200).json({ ok: true, msg: 'Notificación enviada a Telegram' });
  } catch (error) {
    console.error('❌ Error enviando a Telegram:', error.message);
    res.status(500).json({ ok: false, msg: 'Error enviando a Telegram' });
  }
});

// Ruta de prueba para verificar si el servidor está corriendo
app.get('/', (req, res) => {
  res.send('🟢 Servidor de notificación funcionando');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});




