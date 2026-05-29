import ListingDetails from '@/features/catalog/view/ListingDetails';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return <ListingDetails id={id} />;
}