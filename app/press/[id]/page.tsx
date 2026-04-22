export default async function PressDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <section className="wrap py-20"><h1 className="text-3xl font-bold">Press #{id} (WIP)</h1></section>;
}
