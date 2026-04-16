const { clients } = require('../../data/clients.json')

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

    console.log('__dirname:', __dirname)
    console.log('Resolved clients source loaded successfully')

    const client = clients.find(c => c.slug === client_slug)
    if (!client) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Unknown client slug: ' + client_slug }) }
    }
    if (!client.website_folder_id) {
      return { statusCode: 400, body: JSON.stringify({ error: 'No website_folder_id configured for: ' + client_slug }) }
    }

    console.log('Publish requested for slug:', client_slug)
    console.log('Resolved websiteFolderId:', client.website_folder_id)

    await fetch('https://rampupth.app.n8n.cloud/webhook/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ websiteFolderId: client.website_folder_id })
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
