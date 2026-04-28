const { clients } = require('../../data/clients.json')

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ success: false, message: 'Method not allowed' }) }
  }

  let body
  try {
    body = JSON.parse(event.body)
  } catch {
    return { statusCode: 400, body: JSON.stringify({ success: false, message: 'Invalid JSON body' }) }
  }

  const { action, client_slug, client_name, source, requested_at } = body

  if (!client_slug) {
    return { statusCode: 400, body: JSON.stringify({ success: false, message: 'client_slug is required' }) }
  }

  const client = clients.find(c => c.slug === client_slug)
  if (!client) {
    return { statusCode: 400, body: JSON.stringify({ success: false, message: 'Unknown client slug: ' + client_slug }) }
  }
  if (!client.website_folder_id) {
    return { statusCode: 400, body: JSON.stringify({ success: false, message: 'No website_folder_id configured for: ' + client_slug }) }
  }

  const webhookUrl = process.env.N8N_PUBLISH_WEBHOOK_URL
  const token = process.env.N8N_INTERNAL_WEBHOOK_TOKEN
  if (!webhookUrl || !token) {
    console.error('Missing env: N8N_PUBLISH_WEBHOOK_URL or N8N_INTERNAL_WEBHOOK_TOKEN')
    return { statusCode: 500, body: JSON.stringify({ success: false, message: 'Server misconfiguration' }) }
  }

  console.log('Publish requested:', { action, client_slug, client_name, source, requested_at })
  console.log('website_folder_id:', client.website_folder_id)

  let n8nStatus
  try {
    const n8nRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Token': token,
      },
      body: JSON.stringify({
        action: action ?? 'publish_content',
        client_slug,
        client_name: client_name ?? client.name,
        website_folder_id: client.website_folder_id,
        source: source ?? 'control_panel',
        requested_at: requested_at ?? new Date().toISOString(),
      }),
    })
    n8nStatus = n8nRes.status
  } catch (err) {
    console.error('Failed to reach n8n webhook:', err.message)
    return {
      statusCode: 502,
      body: JSON.stringify({ success: false, message: 'Failed to reach publish workflow', error: err.message }),
    }
  }

  if (n8nStatus < 200 || n8nStatus >= 300) {
    console.error('n8n webhook returned non-2xx status:', n8nStatus)
    return {
      statusCode: 502,
      body: JSON.stringify({ success: false, message: 'Publish workflow returned an error', n8n_status: n8nStatus }),
    }
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true, message: 'Publish workflow triggered', n8n_status: n8nStatus }),
  }
}
