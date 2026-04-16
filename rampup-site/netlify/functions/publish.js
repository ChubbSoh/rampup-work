exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' }
  }
  try {
    const body = JSON.parse(event.body)
    const { client_slug } = body
    if (!client_slug) {
      return { statusCode: 400, body: JSON.stringify({ error: 'client_slug required' }) }
    }
    console.log('Sending websiteFolderId to n8n')
    await fetch('https://rampupth.app.n8n.cloud/webhook/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ websiteFolderId: '1ZKfuD4rMIezNyps3CeunJJ1lme-wPk75' })
    })
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, message: 'Publish triggered for ' + client_slug })
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    }
  }
}
