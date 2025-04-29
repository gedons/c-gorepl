export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' })
    }
  
    try {
      const backendResponse = await fetch('http://repl-go-api-env.eba-kmsvh4jx.us-west-2.elasticbeanstalk.com/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      })
  
      const data = await backendResponse.json()
      res.status(backendResponse.status).json(data)
    } catch (error) {
      res.status(500).json({ error: 'Internal server error', details: error.message })
    }
  }
  