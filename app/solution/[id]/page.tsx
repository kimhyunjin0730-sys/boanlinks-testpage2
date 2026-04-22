export default async function SolutionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <section className="wrap py-20"><h1 className="text-3xl font-bold">Solution: {id} (WIP)</h1></section>;
}
