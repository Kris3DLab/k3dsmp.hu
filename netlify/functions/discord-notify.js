exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
  if (!DISCORD_WEBHOOK_URL) {
    return { statusCode: 500, body: 'Discord webhook nincs beallitva' };
  }

  let purchase;
  try {
    purchase = JSON.parse(event.body || '{}');
  } catch (e) {
    return { statusCode: 400, body: 'Hibas JSON' };
  }

  const embed = {
    username: 'K3D SMP Bolt',
    embeds: [{
      title: 'Új vásárlás!',
      color: 3050327,
      fields: [
        { name: 'Csomag', value: (purchase.plan || 'Ismeretlen') + ' (' + (purchase.price || 0) + ' Ft)', inline: true },
        { name: 'Játékos', value: purchase.user || 'Ismeretlen játékos', inline: true },
        { name: 'Rendelés', value: purchase.orderId || 'n/a', inline: false }
      ],
      timestamp: new Date().toISOString()
    }]
  };

  try {
    const res = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(embed)
    });
    if (!res.ok) {
      return { statusCode: res.status, body: 'Discord hiba' };
    }
    return { statusCode: 200, body: 'OK' };
  } catch (e) {
    return { statusCode: 500, body: 'Hiba: ' + e.message };
  }
};