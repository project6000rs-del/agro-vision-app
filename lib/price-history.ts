const SUPABASE_URL = "https://zjvlghjtlxoecnjbskln.supabase.co"
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqdmxnaGp0bHhvZWNuamJza2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2ODUzNTEsImV4cCI6MjEwNDI2MTM1MX0.9Gywe5jvuG3EwUosOjJTcJi5nsASr9BB8vhLVrnVXOU"

export type PricePoint = { date: string; price: number }

export async function getAvailableCommodities(): Promise<string[]> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/commodity_price_history?select=commodity_name&order=commodity_name.asc`,
    { headers: { apikey: SUPABASE_ANON_KEY } },
  )
  if (!res.ok) return []
  const data: { commodity_name: string }[] = await res.json()
  return Array.from(new Set(data.map((d) => d.commodity_name))).sort()
}

export async function getPriceHistory(commodity: string, days = 30): Promise<PricePoint[]> {
  const since = new Date()
  since.setDate(since.getDate() - days)
  const sinceStr = since.toISOString().slice(0, 10)

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/commodity_price_history?commodity_name=eq.${encodeURIComponent(
      commodity,
    )}&recorded_date=gte.${sinceStr}&select=recorded_date,price&order=recorded_date.asc`,
    { headers: { apikey: SUPABASE_ANON_KEY } },
  )
  if (!res.ok) return []
  const data: { recorded_date: string; price: number }[] = await res.json()
  return data.map((d) => ({ date: d.recorded_date, price: Number(d.price) }))
}
