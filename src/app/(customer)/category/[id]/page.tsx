interface Props { params: { id: string } }
export default function CategoryPage({ params }: Props) {
  return (
    <main>
      <h1>Category {params.id}</h1>
    </main>
  )
}
