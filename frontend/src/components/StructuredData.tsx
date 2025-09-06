type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export default function StructuredData({ json }: { json: Json }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />
  )
}
