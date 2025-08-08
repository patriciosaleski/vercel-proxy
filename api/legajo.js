import fetch from 'node-fetch'

export default async function handler(req, res) {
  const { id } = req.query

  if (!id) {
    return res.status(400).json({ error: "Falta el legajo" })
  }

  const url = `http://proveedores.alsea.com.ar:48080/asignaciones-server/mobile/main/asignaciones/legajos/${id}`

  try {
    const response = await fetch(url)
    const data = await response.json()
    
    // Permitir CORS
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET")

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Error al obtener los datos" })
  }
}
