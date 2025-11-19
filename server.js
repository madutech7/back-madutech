const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARES
// ============================================
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ============================================
// CONFIGURATION NODEMAILER
// ============================================
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

// Vérifier la configuration du transporteur
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Erreur de configuration email:', error);
  } else {
    console.log('✅ Serveur email prêt à envoyer des messages');
  }
});

// ============================================
// ROUTES
// ============================================

// Route de test
app.get('/', (req, res) => {
  res.json({ 
    message: 'API MADU_TECH - Backend opérationnel ✅',
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

// Route santé
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Route principale : Envoi d'email de contact
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, budget, message } = req.body;

    // Validation des données
    if (!name || !email || !budget || !message) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont requis'
      });
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Format d\'email invalide'
      });
    }

    // Configuration de l'email pour VOUS (propriétaire)
    const mailToOwner = {
      from: `"MADU_TECH Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Votre email
      subject: `🔔 Nouveau message de ${name} - Budget: ${getBudgetLabel(budget)}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background-color: white;
              border-radius: 12px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .content {
              padding: 30px;
            }
            .info-box {
              background-color: #f8fafc;
              border-left: 4px solid #475569;
              padding: 15px;
              margin: 15px 0;
              border-radius: 4px;
            }
            .info-box strong {
              color: #1e293b;
            }
            .message-box {
              background-color: #f1f5f9;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              line-height: 1.6;
            }
            .footer {
              background-color: #f8fafc;
              padding: 20px;
              text-align: center;
              color: #64748b;
              font-size: 14px;
            }
            .badge {
              display: inline-block;
              padding: 6px 12px;
              background-color: #475569;
              color: white;
              border-radius: 20px;
              font-size: 14px;
              font-weight: bold;
              margin-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📧 Nouveau Message de Contact</h1>
              <div class="badge">${getBudgetLabel(budget)}</div>
            </div>
            
            <div class="content">
              <p style="font-size: 16px; color: #475569;">
                Vous avez reçu un nouveau message via le formulaire de contact de votre site web.
              </p>
              
              <div class="info-box">
                <strong>👤 Nom :</strong> ${name}
              </div>
              
              <div class="info-box">
                <strong>📧 Email :</strong> <a href="mailto:${email}">${email}</a>
              </div>
              
              <div class="info-box">
                <strong>💰 Budget estimé :</strong> ${getBudgetLabel(budget)}
              </div>
              
              <div style="margin-top: 25px;">
                <strong style="color: #1e293b; font-size: 16px;">💬 Message :</strong>
                <div class="message-box">
                  ${message.replace(/\n/g, '<br>')}
                </div>
              </div>
            </div>
            
            <div class="footer">
              <p>📅 Reçu le ${new Date().toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
              <p>MADU_TECH - Système de contact automatisé</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Configuration de l'email de confirmation pour le CLIENT
    const mailToClient = {
      from: `"MADU_TECH" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '✅ Message bien reçu - MADU_TECH',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background-color: white;
              border-radius: 12px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
              color: white;
              padding: 40px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
            }
            .content {
              padding: 40px 30px;
            }
            .checkmark {
              width: 80px;
              height: 80px;
              margin: 0 auto 20px;
              background-color: #22c55e;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 40px;
            }
            .highlight-box {
              background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
              padding: 25px;
              border-radius: 10px;
              margin: 25px 0;
              text-align: center;
            }
            .footer {
              background-color: #f8fafc;
              padding: 30px;
              text-align: center;
              color: #64748b;
            }
            .contact-info {
              margin: 20px 0;
              padding: 20px;
              background-color: #f8fafc;
              border-radius: 8px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="checkmark">✓</div>
              <h1>Message bien reçu !</h1>
            </div>
            
            <div class="content">
              <p style="font-size: 18px; color: #1e293b; margin-bottom: 20px;">
                Bonjour <strong>${name}</strong>,
              </p>
              
              <p style="font-size: 16px; color: #475569; line-height: 1.8;">
                Merci de nous avoir contactés ! Nous avons bien reçu votre message et nous vous en remercions.
              </p>
              
              <div class="highlight-box">
                <p style="font-size: 18px; color: #1e293b; margin: 0; font-weight: bold;">
                  ⏱️ Nous vous répondrons dans les <span style="color: #475569;">24 heures</span>
                </p>
              </div>
              
              <p style="font-size: 16px; color: #475569; line-height: 1.8;">
                Notre équipe examine actuellement votre demande concernant <strong>${getBudgetLabel(budget)}</strong> 
                et prépare une réponse personnalisée adaptée à vos besoins.
              </p>
              
              <div class="contact-info">
                <p style="margin: 10px 0; color: #475569;">
                  <strong>📧 Email :</strong> madutech0@gmail.com<br>
                  <strong>📱 Téléphone :</strong> +221 76 823 08 03<br>
                  <strong>⏰ Horaires :</strong> Lun - Sam: 8h - 20h
                </p>
              </div>
            </div>
            
            <div class="footer">
              <p style="font-size: 16px; color: #1e293b; margin-bottom: 10px;">
                <strong>MADU_TECH</strong>
              </p>
              <p style="font-size: 14px;">L'innovation au service du digital</p>
              <p style="font-size: 12px; margin-top: 15px;">
                Cet email a été envoyé automatiquement, merci de ne pas y répondre directement.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Envoi des deux emails
    await transporter.sendMail(mailToOwner);
    await transporter.sendMail(mailToClient);

    // Log pour le serveur
    console.log(`✅ Email envoyé avec succès de ${name} (${email})`);

    // Réponse au client Angular
    res.status(200).json({
      success: true,
      message: 'Votre message a bien été envoyé ! Nous vous répondrons sous 24h.'
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
    
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de l\'envoi. Veuillez réessayer.'
    });
  }
});

// ============================================
// UTILITAIRES
// ============================================
function getBudgetLabel(budget) {
  const budgets = {
    'vitrine': '50k - 100k FCFA (Site vitrine)',
    'ecommerce': '100k - 200k FCFA (E-commerce)',
    'app': '200k - 400k FCFA (Application web)',
    'custom': 'Plus de 400k FCFA (Sur mesure)'
  };
  return budgets[budget] || budget;
}

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

// ============================================
// DÉMARRAGE DU SERVEUR
// ============================================
app.listen(PORT, () => {
  console.log('╔═══════════════════════════════════════╗');
  console.log('║                                       ║');
  console.log('║    🚀 MADU_TECH Backend API          ║');
  console.log('║                                       ║');
  console.log('╚═══════════════════════════════════════╝');
  console.log('');
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
  console.log(`📧 Email configuré: ${process.env.EMAIL_USER}`);
  console.log(`🌍 Environnement: ${process.env.NODE_ENV}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log('');
  console.log('💡 Routes disponibles:');
  console.log('   GET  / - Page d\'accueil de l\'API');
  console.log('   GET  /health - Vérification de la santé du serveur');
  console.log('   POST /api/contact - Envoi d\'email de contact');
  console.log('');
});

