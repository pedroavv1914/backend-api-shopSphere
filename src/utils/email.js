const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
  secure: false, // true para 465, false para outros
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function sendOrderConfirmation(to, order) {
  const itemsHtml = order.items.map(item =>
    `<li>${item.quantity}x ${item.product.name} - R$ ${(item.price * item.quantity).toFixed(2)}</li>`
  ).join('');
  const html = `
    <h2>Pedido confirmado!</h2>
    <p>Seu pedido #${order.id} foi confirmado e está com status <b>${order.status}</b>.</p>
    <ul>${itemsHtml}</ul>
    <p>Total: <b>R$ ${order.total.toFixed(2)}</b></p>
  `;
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: `Confirmação do Pedido #${order.id}`,
    html
  });
}

module.exports = { sendOrderConfirmation };
